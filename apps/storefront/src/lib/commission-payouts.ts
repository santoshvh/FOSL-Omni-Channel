import { listClearedCommissionBatches, markCommissionsPaid } from "@fosl/db";
import { getStripe } from "@/lib/stripe";

const MIN_PAYOUT_CENTS = 100;

export type CommissionPayoutResult = {
  creatorId: string;
  amountCents: number;
  commissionCount: number;
  status: "paid" | "skipped" | "failed";
  transferId?: string;
  reason?: string;
};

export async function processCreatorCommissionPayouts(options?: {
  creatorId?: string;
}): Promise<CommissionPayoutResult[]> {
  const batches = await listClearedCommissionBatches(options?.creatorId);
  const stripe = await getStripe();
  const results: CommissionPayoutResult[] = [];

  for (const batch of batches) {
    const base = {
      creatorId: batch.creatorId,
      amountCents: batch.amountCents,
      commissionCount: batch.commissionIds.length,
    };

    if (batch.amountCents < MIN_PAYOUT_CENTS) {
      results.push({
        ...base,
        status: "skipped",
        reason: `Below minimum payout (${MIN_PAYOUT_CENTS} cents).`,
      });
      continue;
    }

    if (!batch.stripeConnectId) {
      results.push({
        ...base,
        status: "skipped",
        reason: "Creator has no Stripe Connect account.",
      });
      continue;
    }

    try {
      if (!stripe) {
        const transferId = `tr_mock_${Date.now()}_${batch.creatorId}`;
        await markCommissionsPaid(batch.commissionIds, transferId);
        results.push({ ...base, status: "paid", transferId });
        continue;
      }

      const transfer = await stripe.transfers.create({
        amount: batch.amountCents,
        currency: "usd",
        destination: batch.stripeConnectId,
        metadata: {
          creatorId: batch.creatorId,
          commissionCount: String(batch.commissionIds.length),
          source: "fosl-commission-payout",
        },
      });

      await markCommissionsPaid(batch.commissionIds, transfer.id);
      results.push({ ...base, status: "paid", transferId: transfer.id });
    } catch (err) {
      console.error("[commission-payout] failed:", batch.creatorId, err);
      results.push({
        ...base,
        status: "failed",
        reason: err instanceof Error ? err.message : "Transfer failed.",
      });
    }
  }

  return results;
}

function isAuthorized(request: Request) {
  const secret = process.env.PAYOUT_JOB_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export function assertPayoutJobAuthorized(request: Request) {
  if (!isAuthorized(request)) {
    throw new Error("Unauthorized payout job.");
  }
}
