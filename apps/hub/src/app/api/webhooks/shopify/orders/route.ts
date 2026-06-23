import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { handleExternalOrderWebhook } from "@fosl/db";

export const runtime = "nodejs";

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  if (!secret) return true;
  if (!hmacHeader) return false;

  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const hmac = request.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyHmac(rawBody, hmac)) {
    return NextResponse.json({ error: "Invalid Shopify webhook signature." }, { status: 401 });
  }

  let payload: { id?: number | string };
  try {
    payload = JSON.parse(rawBody) as { id?: number | string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const externalOrderId = payload.id ? String(payload.id) : null;
  if (!externalOrderId) {
    return NextResponse.json({ received: true, matched: false });
  }

  try {
    const result = await handleExternalOrderWebhook("shopify", externalOrderId);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    console.error("[shopify-order-webhook] failed:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
