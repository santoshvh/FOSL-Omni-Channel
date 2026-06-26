import { NextResponse } from "next/server";
import { paymentIntentBodySchema } from "@fosl/contracts";
import { getStripe } from "@/lib/stripe";
import { buildPaymentIntentConnectParams } from "@/lib/stripe-connect";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import {
  operatorIdFromContext,
  resolveStorefrontFromRequest,
} from "@/lib/resolve-storefront-request";

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

  const parsed = paymentIntentBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid payment payload.";
    return withCors(NextResponse.json({ error: message }, { status: 400 }), cors);
  }

  const { amountCents, email, lines, storefrontPath } = parsed.data;
  const operatorId =
    storefront?.operatorId ??
    operatorIdFromContext({ storefront, publishableKey: null }) ??
    (storefrontPath
      ? await (async () => {
          const { resolveOperatorId } = await import("@fosl/db");
          return resolveOperatorId({ storefrontPath });
        })()
      : null);

  const stripe = await getStripe();
  if (!stripe) {
    const paymentIntentId = `pi_mock_${Date.now()}`;
    return withCors(
      NextResponse.json({
        data: {
          mode: "mock" as const,
          paymentIntentId,
          settlement: "platform" as const,
        },
      }),
      cors
    );
  }

  try {
    const connect = await buildPaymentIntentConnectParams(lines ?? [], amountCents, operatorId);

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        receipt_email: email || undefined,
        metadata: {
          source: "fosl-storefront",
          ...(storefront?.id ? { storefrontId: storefront.id } : {}),
          ...(operatorId ? { operatorId } : {}),
          ...connect.metadata,
        },
        ...(connect.applicationFeeAmount
          ? { application_fee_amount: connect.applicationFeeAmount }
          : {}),
        ...(connect.transferData ? { transfer_data: connect.transferData } : {}),
      },
      connect.stripeAccount ? { stripeAccount: connect.stripeAccount } : undefined
    );

    return withCors(
      NextResponse.json({
        data: {
          mode: "stripe" as const,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          settlement: connect.settlement,
          operatorId: operatorId ?? undefined,
        },
      }),
      cors
    );
  } catch (err) {
    console.error("[payment-intent] Stripe error:", err);
    return withCors(
      NextResponse.json({ error: "Unable to start payment." }, { status: 500 }),
      cors
    );
  }
}
