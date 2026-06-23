import type Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? "";
}

export async function getStripe() {
  const secretKey = getStripeSecretKey();
  if (!secretKey) return null;

  if (!stripeClient) {
    const StripeSdk = (await import("stripe")).default;
    stripeClient = new StripeSdk(secretKey);
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}
