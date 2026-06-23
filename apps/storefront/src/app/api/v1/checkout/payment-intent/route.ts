import { NextResponse } from "next/server";
import { paymentIntentBodySchema } from "@fosl/contracts";
import { getStripe } from "@/lib/stripe";
import { buildPaymentIntentConnectParams } from "@/lib/stripe-connect";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = paymentIntentBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid payment payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { amountCents, email, lines } = parsed.data;

  const stripe = await getStripe();
  if (!stripe) {
    const paymentIntentId = `pi_mock_${Date.now()}`;
    return NextResponse.json({
      data: {
        mode: "mock" as const,
        paymentIntentId,
        settlement: "platform" as const,
      },
    });
  }

  try {
    const connect = await buildPaymentIntentConnectParams(lines ?? [], amountCents);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: { source: "fosl-storefront", ...connect.metadata },
      ...(connect.transferData
        ? {
            transfer_data: connect.transferData,
            application_fee_amount: connect.applicationFeeAmount,
          }
        : {}),
    });

    return NextResponse.json({
      data: {
        mode: "stripe" as const,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        settlement: connect.settlement,
      },
    });
  } catch (err) {
    console.error("[payment-intent] Stripe error:", err);
    return NextResponse.json({ error: "Unable to start payment." }, { status: 500 });
  }
}
