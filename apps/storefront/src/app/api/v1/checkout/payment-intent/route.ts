import { NextResponse } from "next/server";

type PaymentIntentBody = {
  amountCents?: number;
  email?: string;
};

export async function POST(request: Request) {
  let body: PaymentIntentBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const amountCents = body.amountCents;
  const email = body.email?.trim();

  if (!amountCents || amountCents < 50) {
    return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    const paymentIntentId = `pi_mock_${Date.now()}`;
    return NextResponse.json({
      data: {
        mode: "mock" as const,
        paymentIntentId,
      },
    });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: { source: "fosl-storefront" },
    });

    return NextResponse.json({
      data: {
        mode: "stripe" as const,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (err) {
    console.error("[payment-intent] Stripe error:", err);
    return NextResponse.json({ error: "Unable to start payment." }, { status: 500 });
  }
}
