import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrderSchema } from "@fosl/contracts";
import { prisma, createCommissionsForOrder, clearCommissionsForOrder, pushOrderToExternalStores } from "@fosl/db";
import type { ProductType as DbProductType } from "@prisma/client";
import {
  ATTRIBUTION_COOKIE,
  isAttributionValid,
  parseAttributionCookieValue,
} from "@/lib/attribution";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { fetchOrdersList } from "@/lib/orders-service";

function orderNumber() {
  return `FOSL-${Date.now().toString(36).toUpperCase()}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase() || undefined;
  const vendorId = searchParams.get("vendorId")?.trim() || undefined;
  const operatorId = searchParams.get("operatorId")?.trim() || undefined;

  if (!email && !vendorId && !operatorId) {
    return NextResponse.json(
      { error: "Provide email, vendorId, or operatorId to list orders." },
      { status: 400 }
    );
  }

  try {
    const { data, source } = await fetchOrdersList({ email, vendorId, operatorId });
    return NextResponse.json({ data, source });
  } catch (err) {
    console.error("[orders] list failed:", err);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid order payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, lines, shippingCents, taxCents, shipping, storefrontPath, stripePaymentIntentId } =
    parsed.data;

  if (!process.env.DATABASE_URL) {
    const id = `order_mock_${Date.now()}`;
    return NextResponse.json(
      {
        data: {
          id,
          orderNumber: id,
          status: "processing",
          totalCents: 0,
          source: "mock",
        },
      },
      { status: 201 }
    );
  }

  try {
    const productIds = [...new Set(lines.map((line) => line.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }

    const productById = new Map(products.map((product) => [product.id, product]));

    const storefront = storefrontPath
      ? await prisma.storefront.findUnique({ where: { path: storefrontPath } })
      : await prisma.storefront.findFirst({ where: { isDefault: true } });

    if (storefront?.operatorId) {
      const { areVendorsApprovedForOperator } = await import("@fosl/db");
      const vendorIds = products.map((p) => p.vendorId);
      const approved = await areVendorsApprovedForOperator(storefront.operatorId, vendorIds);
      if (!approved) {
        return NextResponse.json(
          { error: "One or more products are not available from approved network vendors." },
          { status: 400 }
        );
      }
    }

    for (const line of lines) {
      const product = productById.get(line.productId)!;
      if (product.type === "LEAD_GEN" && line.quantity > 1) {
        return NextResponse.json({ error: "Lead-gen items are limited to quantity 1." }, { status: 400 });
      }
      if (product.type !== "DIGITAL" && product.inventory < line.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product.title}.` },
          { status: 400 }
        );
      }
    }

    let subtotalCents = 0;
    const lineCreates = lines.map((line) => {
      const product = productById.get(line.productId)!;
      subtotalCents += product.priceCents * line.quantity;
      return {
        productId: product.id,
        vendorId: product.vendorId,
        title: product.title,
        type: product.type as DbProductType,
        quantity: line.quantity,
        unitPriceCents: product.priceCents,
        shippingMethodId: line.shippingMethodId ?? null,
      };
    });

    const totalCents = subtotalCents + shippingCents + taxCents;

    const cookieStore = await cookies();
    const attributionRaw = cookieStore.get(ATTRIBUTION_COOKIE)?.value;
    const attribution = attributionRaw ? parseAttributionCookieValue(attributionRaw) : null;

    let creatorLink = null;
    if (attribution) {
      creatorLink = await prisma.creatorLink.findFirst({
        where: {
          slug: attribution.slug,
          active: true,
          ...(storefront?.operatorId
            ? {
                OR: [{ operatorId: storefront.operatorId }, { operatorId: null }],
              }
            : {}),
        },
        include: { creator: { select: { id: true, userId: true } } },
      });

      if (creatorLink && !isAttributionValid(attribution, creatorLink.cookieDays)) {
        creatorLink = null;
      }
    }

    let commissionCount = 0;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: orderNumber(),
          customerEmail: email,
          storefrontId: storefront?.id,
          operatorId: storefront?.operatorId,
          attributedCreatorLinkId: creatorLink?.id ?? null,
          status: "PROCESSING",
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          stripePaymentIntentId: stripePaymentIntentId ?? null,
          shippingName: shipping?.fullName,
          shippingLine1: shipping?.line1,
          shippingLine2: shipping?.line2,
          shippingCity: shipping?.city,
          shippingState: shipping?.state,
          shippingPostal: shipping?.postalCode,
          shippingCountry: shipping?.country,
          lines: { create: lineCreates },
        },
        include: { lines: true },
      });

      for (const line of lines) {
        const product = productById.get(line.productId)!;
        if (product.type === "DIGITAL") continue;
        await tx.product.update({
          where: { id: product.id },
          data: { inventory: { decrement: line.quantity } },
        });
      }

      if (creatorLink) {
        const commissions = await createCommissionsForOrder(tx, created, creatorLink, email);
        commissionCount = commissions.length;
        if (commissionCount > 0) {
          await clearCommissionsForOrder(created.id, tx);
        }
      }

      return created;
    });

    void sendOrderConfirmationEmail({
      to: email,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalCents: order.totalCents,
      attributed: Boolean(creatorLink),
      commissionCount,
    }).catch((err) => {
      console.error("[orders] confirmation email failed:", err);
    });

    void pushOrderToExternalStores(order.id).catch((err) => {
      console.error("[orders] external order push failed:", err);
    });

    return NextResponse.json(
      {
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status.toLowerCase(),
          totalCents: order.totalCents,
          source: "database",
          attributed: Boolean(creatorLink),
          commissionCount,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[orders] create failed:", err);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
