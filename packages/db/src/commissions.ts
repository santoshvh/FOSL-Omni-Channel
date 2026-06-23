import type { CreatorLink, Order, OrderLine, Prisma } from "@prisma/client";

type TransactionClient = Prisma.TransactionClient;

type CreatorLinkWithCreator = CreatorLink & {
  creator: { id: string; userId: string };
};

type OrderLineWithVendor = OrderLine & {
  vendorId: string;
  productId: string;
  unitPriceCents: number;
  quantity: number;
};

function lineQualifiesForLink(line: OrderLineWithVendor, link: CreatorLink): boolean {
  if (!link.productId) return true;
  return link.productId === line.productId;
}

export async function createCommissionsForOrder(
  tx: TransactionClient,
  order: Order & { lines: OrderLineWithVendor[] },
  creatorLink: CreatorLinkWithCreator,
  customerEmail: string
) {
  if (!order.operatorId) return [];

  const creatorUser = await tx.user.findUnique({
    where: { id: creatorLink.creator.userId },
    select: { email: true },
  });

  if (creatorUser?.email.toLowerCase() === customerEmail.toLowerCase()) {
    return [];
  }

  const commissions = [];

  for (const line of order.lines) {
    if (!lineQualifiesForLink(line, creatorLink)) continue;

    const operatorVendor = await tx.operatorVendor.findUnique({
      where: {
        operatorId_vendorId: {
          operatorId: order.operatorId,
          vendorId: line.vendorId,
        },
      },
    });

    if (!operatorVendor || operatorVendor.status !== "APPROVED") continue;

    const ratePct = Number(
      operatorVendor.defaultCommissionPct ?? operatorVendor.minCommissionPct
    );
    const lineTotalCents = line.unitPriceCents * line.quantity;
    const amountCents = Math.round((lineTotalCents * ratePct) / 100);

    if (amountCents <= 0) continue;

    const commission = await tx.commission.create({
      data: {
        orderId: order.id,
        orderLineId: line.id,
        creatorId: creatorLink.creator.id,
        operatorId: order.operatorId,
        vendorId: line.vendorId,
        productId: line.productId,
        creatorLinkId: creatorLink.id,
        amountCents,
        ratePct,
        state: "PENDING",
      },
    });

    commissions.push(commission);
  }

  return commissions;
}
