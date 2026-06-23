import { NextResponse } from "next/server";
import { createOrderSchema } from "@fosl/contracts";
import { prisma } from "@fosl/db";
import type { ProductType as DbProductType } from "@prisma/client";

function orderNumber() {
  return `FOSL-${Date.now().toString(36).toUpperCase()}`;
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

    const storefront = storefrontPath
      ? await prisma.storefront.findUnique({ where: { path: storefrontPath } })
      : await prisma.storefront.findFirst({ where: { isDefault: true } });

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: orderNumber(),
          customerEmail: email,
          storefrontId: storefront?.id,
          operatorId: storefront?.operatorId,
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

      return created;
    });

    return NextResponse.json(
      {
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status.toLowerCase(),
          totalCents: order.totalCents,
          source: "database",
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[orders] create failed:", err);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
