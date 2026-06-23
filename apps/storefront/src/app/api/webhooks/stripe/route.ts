import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma, clearCommissionsForOrder, reverseCommissionsForOrder, pushOrderToExternalStores } from "@fosl/db";
import { settleMultiVendorPayment } from "@/lib/vendor-settlement";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

async function restoreInventoryForOrder(orderId: string) {
  const lines = await prisma.orderLine.findMany({
    where: { orderId },
    include: { product: { select: { id: true, type: true } } },
  });

  for (const line of lines) {
    if (line.product.type === "DIGITAL") continue;
    await prisma.product.update({
      where: { id: line.product.id },
      data: { inventory: { increment: line.quantity } },
    });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  if (!process.env.DATABASE_URL) return;

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!order) return;

  if (order.status === "PENDING") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PROCESSING" },
    });
  }

  await clearCommissionsForOrder(order.id);

  if (paymentIntent.metadata.settlement === "multi_vendor") {
    try {
      await settleMultiVendorPayment(paymentIntent.id);
    } catch (err) {
      console.error("[stripe-webhook] multi-vendor settlement failed:", err);
    }
  }

  try {
    await pushOrderToExternalStores(order.id);
  } catch (err) {
    console.error("[stripe-webhook] order push to external stores failed:", err);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  if (!process.env.DATABASE_URL) return;

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!order || order.status === "CANCELLED" || order.status === "REFUNDED") return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
    const lines = await tx.orderLine.findMany({
      where: { orderId: order.id },
      include: { product: { select: { id: true, type: true } } },
    });
    for (const line of lines) {
      if (line.product.type === "DIGITAL") continue;
      await tx.product.update({
        where: { id: line.product.id },
        data: { inventory: { increment: line.quantity } },
      });
    }
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  if (!process.env.DATABASE_URL) return;

  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!order || order.status === "REFUNDED") return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "REFUNDED" },
  });
  await restoreInventoryForOrder(order.id);
  await reverseCommissionsForOrder(order.id);
}

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  const stripe = await getStripe();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhooks are not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] handler failed for ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
