import { DEFAULT_PLATFORM_FEE_PCT } from "@fosl/db";
import { getStripe } from "@/lib/stripe";

type VendorShare = {
  vendorId: string;
  amountCents: number;
  stripeAccountId: string | null;
  transferCents?: number;
};

async function transferFromOperatorAccount(
  operatorConnectId: string,
  paymentIntentId: string,
  shares: VendorShare[]
) {
  const stripe = await getStripe();
  if (!stripe) return { settled: false, reason: "Stripe not configured." };

  const transfers: string[] = [];
  for (const share of shares) {
    if (!share.stripeAccountId) continue;
    const transferCents =
      share.transferCents ??
      Math.max(0, share.amountCents - Math.round((share.amountCents * DEFAULT_PLATFORM_FEE_PCT) / 100));
    if (transferCents <= 0) continue;

    const transfer = await stripe.transfers.create(
      {
        amount: transferCents,
        currency: "usd",
        destination: share.stripeAccountId,
        transfer_group: paymentIntentId,
        metadata: {
          vendorId: share.vendorId,
          paymentIntentId,
          source: "fosl-operator-vendor-settlement",
        },
      },
      { stripeAccount: operatorConnectId }
    );
    transfers.push(transfer.id);
  }

  return { settled: true, transfers };
}

export async function settleOperatorPayment(paymentIntentId: string) {
  const stripe = await getStripe();
  if (!stripe || !process.env.DATABASE_URL) {
    return { settled: false, reason: "Stripe or database not configured." };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const settlement = paymentIntent.metadata.settlement;
  const operatorConnectId = paymentIntent.metadata.operatorConnectId;

  if (!operatorConnectId) {
    return { settled: false, reason: "Missing operator Connect account." };
  }

  if (settlement === "operator_direct") {
    const vendorStripeAccountId = paymentIntent.metadata.vendorStripeAccountId;
    const vendorId = paymentIntent.metadata.vendorId;
    const transferCents = Number(paymentIntent.metadata.vendorTransferCents ?? 0);
    if (!vendorStripeAccountId || transferCents <= 0) {
      return { settled: false, reason: "No vendor transfer configured." };
    }

    return transferFromOperatorAccount(operatorConnectId, paymentIntentId, [
      {
        vendorId: vendorId ?? "unknown",
        amountCents: transferCents,
        stripeAccountId: vendorStripeAccountId,
        transferCents,
      },
    ]);
  }

  if (settlement === "operator_multi_vendor") {
    const sharesRaw = paymentIntent.metadata.vendorShares;
    if (!sharesRaw) {
      return { settled: false, reason: "Missing vendor share metadata." };
    }
    const shares = JSON.parse(sharesRaw) as VendorShare[];
    return transferFromOperatorAccount(operatorConnectId, paymentIntentId, shares);
  }

  return { settled: false, reason: "Not an operator settlement payment." };
}
