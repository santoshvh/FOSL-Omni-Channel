import { NextResponse } from "next/server";
import {
  getOperatorStripeConnect,
  setOperatorStripeConnectId,
} from "@fosl/db";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/operator-session";
import { getStripe } from "@/lib/stripe";

function hubBaseUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_HUB_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    new URL(request.url).origin
  );
}

export async function GET(request: Request) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const operatorId = await resolveOperatorIdForApi(auth.session);
  if (!operatorId) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  const operator = await getOperatorStripeConnect(operatorId);
  if (!operator) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      operatorId: operator.id,
      name: operator.name,
      stripeConnectId: operator.stripeConnectId,
      onboarded: Boolean(operator.stripeConnectOnboardedAt),
      paymentsModel: operator.stripeConnectId ? "operator_connect" : "platform",
    },
    source: "database",
  });
}

export async function POST(request: Request) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const operatorId = await resolveOperatorIdForApi(auth.session);
  if (!operatorId) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  const stripe = await getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured on the platform." }, { status: 503 });
  }

  const operator = await getOperatorStripeConnect(operatorId);
  if (!operator) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  const hub = hubBaseUrl(request).replace(/\/$/, "");
  let accountId = operator.stripeConnectId;

  try {
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "company",
        metadata: { foslOperatorId: operatorId },
      });
      accountId = account.id;
      await setOperatorStripeConnectId(operatorId, accountId);
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${hub}/operator/payouts?stripe=refresh`,
      return_url: `${hub}/operator/payouts?stripe=connected`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      data: {
        url: accountLink.url,
        stripeConnectId: accountId,
      },
      source: "stripe",
    });
  } catch (err) {
    console.error("[operator/stripe-connect] onboarding failed:", err);
    return NextResponse.json({ error: "Unable to start Stripe Connect onboarding." }, { status: 500 });
  }
}
