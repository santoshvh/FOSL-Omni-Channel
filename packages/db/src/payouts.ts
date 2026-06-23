import type { Prisma } from "@prisma/client";
import { prisma } from "./client";

type TransactionClient = Prisma.TransactionClient;

export async function clearCommissionsForOrder(
  orderId: string,
  tx: TransactionClient = prisma
) {
  await tx.commission.updateMany({
    where: { orderId, state: "PENDING" },
    data: { state: "CLEARED" },
  });
}

export async function reverseCommissionsForOrder(
  orderId: string,
  tx: TransactionClient = prisma
) {
  await tx.commission.updateMany({
    where: {
      orderId,
      state: { in: ["PENDING", "CLEARED", "PAID"] },
    },
    data: { state: "REVERSED" },
  });
}

export type PayoutBatch = {
  creatorId: string;
  amountCents: number;
  commissionIds: string[];
  stripeConnectId: string | null;
  payoutEmail: string | null;
  displayName: string | null;
};

export async function listClearedCommissionBatches(creatorId?: string): Promise<PayoutBatch[]> {
  const where = {
    state: "CLEARED" as const,
    ...(creatorId ? { creatorId } : {}),
  };

  const groups = await prisma.commission.groupBy({
    by: ["creatorId"],
    where,
    _sum: { amountCents: true },
  });

  const batches: PayoutBatch[] = [];

  for (const group of groups) {
    const commissions = await prisma.commission.findMany({
      where: { creatorId: group.creatorId, state: "CLEARED" },
      select: { id: true },
    });

    const creator = await prisma.creatorProfile.findUnique({
      where: { id: group.creatorId },
      select: {
        stripeConnectId: true,
        payoutEmail: true,
        displayName: true,
      },
    });

    batches.push({
      creatorId: group.creatorId,
      amountCents: group._sum.amountCents ?? 0,
      commissionIds: commissions.map((commission) => commission.id),
      stripeConnectId: creator?.stripeConnectId ?? null,
      payoutEmail: creator?.payoutEmail ?? null,
      displayName: creator?.displayName ?? null,
    });
  }

  return batches;
}

export async function markCommissionsPaid(commissionIds: string[], stripeTransferId: string) {
  await prisma.commission.updateMany({
    where: { id: { in: commissionIds }, state: "CLEARED" },
    data: {
      state: "PAID",
      stripeTransferId,
      paidAt: new Date(),
    },
  });
}
