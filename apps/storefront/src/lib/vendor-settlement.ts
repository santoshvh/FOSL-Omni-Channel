import { getStripe } from "@/lib/stripe";

const PLATFORM_FEE_PCT = 10;

export async function settleMultiVendorPayment(paymentIntentId: string) {
  const stripe = await getStripe();
  if (!stripe || !process.env.DATABASE_URL) {
    return { settled: false, reason: "Stripe or database not configured." };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.metadata.settlement !== "multi_vendor") {
    return { settled: false, reason: "Not a multi-vendor payment." };
  }

  const sharesRaw = paymentIntent.metadata.vendorShares;
  if (!sharesRaw) {
    return { settled: false, reason: "Missing vendor share metadata." };
  }

  const shares = JSON.parse(sharesRaw) as {
    vendorId: string;
    amountCents: number;
    stripeAccountId: string | null;
  }[];

  const transfers = [];
  for (const share of shares) {
    if (!share.stripeAccountId || share.amountCents <= 0) continue;
    const fee = Math.round((share.amountCents * PLATFORM_FEE_PCT) / 100);
    const transferAmount = share.amountCents - fee;
    if (transferAmount <= 0) continue;

    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: "usd",
      destination: share.stripeAccountId,
      transfer_group: paymentIntentId,
      metadata: {
        vendorId: share.vendorId,
        paymentIntentId,
        source: "fosl-multi-vendor-settlement",
      },
    });
    transfers.push(transfer.id);
  }

  return { settled: true, transfers };
}
