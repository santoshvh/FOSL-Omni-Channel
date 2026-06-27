import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@fosl/db";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";

const leadCaptureSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(1000).optional(),
});

function orderNumber() {
  return `LEAD-${Date.now().toString(36).toUpperCase()}`;
}

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function POST(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, storefront);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withCors(NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }), cors);
  }

  const parsed = leadCaptureSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid lead payload.";
    return withCors(NextResponse.json({ error: message }, { status: 400 }), cors);
  }

  const { productId, name, email, phone, message } = parsed.data;

  if (!process.env.DATABASE_URL) {
    return withCors(
      NextResponse.json({
        data: { id: `lead_mock_${Date.now()}`, source: "mock" },
      }),
      cors
    );
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.type !== "LEAD_GEN") {
      return withCors(
        NextResponse.json({ error: "Product is not a lead-generation offer." }, { status: 400 }),
        cors
      );
    }

    const resolvedStorefront =
      storefront ??
      (await prisma.storefront.findFirst({ where: { isDefault: true } }));

    const leadStatus = [
      `Contact: ${name} <${email}>`,
      phone ? `Phone: ${phone}` : null,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber(),
        customerEmail: email,
        storefrontId: resolvedStorefront?.id,
        operatorId: resolvedStorefront?.operatorId,
        status: "LEAD_RECEIVED",
        subtotalCents: 0,
        totalCents: 0,
        lines: {
          create: {
            productId: product.id,
            vendorId: product.vendorId,
            title: product.title,
            type: "LEAD_GEN",
            quantity: 1,
            unitPriceCents: 0,
            leadStatus,
          },
        },
      },
    });

    return withCors(
      NextResponse.json(
        {
          data: {
            id: order.id,
            orderNumber: order.orderNumber,
            status: "lead_received",
            source: "database",
          },
        },
        { status: 201 }
      ),
      cors
    );
  } catch (err) {
    console.error("[leads] create failed:", err);
    return withCors(NextResponse.json({ error: "Unable to submit lead." }, { status: 500 }), cors);
  }
}
