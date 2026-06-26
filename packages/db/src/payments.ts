import { prisma } from "./client";
import { computeVendorSettlementShares, type VendorSettlementShare } from "./settlement";

export const DEFAULT_PLATFORM_FEE_PCT = 10;

export type ConnectSettlement =
  | "operator_direct"
  | "operator_multi_vendor"
  | "destination"
  | "multi_vendor"
  | "platform";

export type PaymentSettlementParams = {
  settlement: ConnectSettlement;
  /** Connected account that receives the direct charge (operator MoR). */
  stripeAccount?: string;
  transferData?: { destination: string };
  applicationFeeAmount?: number;
  metadata: Record<string, string>;
  vendorShares?: VendorSettlementShare[];
  operatorId?: string;
};

type CartLine = {
  productId: string;
  quantity: number;
};

async function getOperatorConnectId(operatorId: string | null | undefined) {
  if (!operatorId?.trim()) return null;
  const operator = await prisma.operator.findUnique({
    where: { id: operatorId },
    select: { stripeConnectId: true },
  });
  return operator?.stripeConnectId ?? null;
}

function platformFee(amountCents: number) {
  return Math.round((amountCents * DEFAULT_PLATFORM_FEE_PCT) / 100);
}

/**
 * Stripe settlement plan — operator Connect (Model 1) when operator has Connect,
 * otherwise legacy platform merchant-of-record routing.
 */
export async function buildPaymentSettlementParams(
  lines: CartLine[],
  amountCents: number,
  operatorId?: string | null
): Promise<PaymentSettlementParams> {
  if (!process.env.DATABASE_URL || lines.length === 0) {
    return { settlement: "platform", metadata: { settlement: "platform" } };
  }

  const productIds = [...new Set(lines.map((line) => line.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
    select: { id: true, vendorId: true },
  });

  if (products.length !== productIds.length) {
    return { settlement: "platform", metadata: { settlement: "platform" } };
  }

  const vendorShares = await computeVendorSettlementShares(lines);
  const vendorIds = [...new Set(products.map((product) => product.vendorId))];
  const vendors = await prisma.vendor.findMany({
    where: { id: { in: vendorIds } },
    select: { id: true, stripeAccountId: true },
  });
  const connectedVendors = vendors.filter((vendor) => vendor.stripeAccountId);

  const operatorConnectId = await getOperatorConnectId(operatorId);

  if (operatorConnectId) {
    const fee = platformFee(amountCents);
    const baseMeta = {
      operatorId: operatorId!,
      operatorConnectId,
      platformFeePct: String(DEFAULT_PLATFORM_FEE_PCT),
    };

    if (vendorIds.length === 1 && connectedVendors.length === 1) {
      const vendorShare = vendorShares[0];
      const vendorTransfer = vendorShare
        ? Math.max(0, vendorShare.amountCents - platformFee(vendorShare.amountCents))
        : 0;

      return {
        settlement: "operator_direct",
        stripeAccount: operatorConnectId,
        applicationFeeAmount: fee,
        operatorId: operatorId!,
        vendorShares,
        metadata: {
          settlement: "operator_direct",
          vendorId: vendorIds[0]!,
          vendorTransferCents: String(vendorTransfer),
          vendorStripeAccountId: connectedVendors[0]!.stripeAccountId!,
          ...baseMeta,
        },
      };
    }

    return {
      settlement: "operator_multi_vendor",
      stripeAccount: operatorConnectId,
      applicationFeeAmount: fee,
      operatorId: operatorId!,
      vendorShares,
      metadata: {
        settlement: "operator_multi_vendor",
        vendorCount: String(vendorIds.length),
        vendorShares: JSON.stringify(
          vendorShares.map((share) => ({
            vendorId: share.vendorId,
            amountCents: share.amountCents,
            stripeAccountId: share.stripeAccountId,
            transferCents: Math.max(0, share.amountCents - platformFee(share.amountCents)),
          }))
        ),
        ...baseMeta,
      },
    };
  }

  // Legacy platform MoR (marketplace / operator without Connect)
  if (vendorIds.length === 1 && connectedVendors.length === 1) {
    return {
      settlement: "destination",
      transferData: { destination: connectedVendors[0]!.stripeAccountId! },
      applicationFeeAmount: platformFee(amountCents),
      vendorShares,
      metadata: {
        settlement: "destination",
        vendorId: vendorIds[0]!,
        platformFeePct: String(DEFAULT_PLATFORM_FEE_PCT),
        ...(operatorId ? { operatorId } : {}),
      },
    };
  }

  if (vendorIds.length > 1) {
    return {
      settlement: "multi_vendor",
      vendorShares,
      metadata: {
        settlement: "multi_vendor",
        vendorCount: String(vendorIds.length),
        vendorShares: JSON.stringify(
          vendorShares.map((share) => ({
            vendorId: share.vendorId,
            amountCents: share.amountCents,
            stripeAccountId: share.stripeAccountId,
          }))
        ),
        ...(operatorId ? { operatorId } : {}),
      },
    };
  }

  return {
    settlement: "platform",
    vendorShares,
    metadata: {
      settlement: "platform",
      vendorCount: String(vendorIds.length),
      connectedVendorCount: String(connectedVendors.length),
      ...(operatorId ? { operatorId } : {}),
    },
  };
}

export async function getOperatorStripeConnect(operatorId: string) {
  return prisma.operator.findUnique({
    where: { id: operatorId },
    select: {
      id: true,
      name: true,
      stripeConnectId: true,
      stripeConnectOnboardedAt: true,
    },
  });
}

export async function setOperatorStripeConnectId(operatorId: string, stripeConnectId: string) {
  return prisma.operator.update({
    where: { id: operatorId },
    data: {
      stripeConnectId,
      stripeConnectOnboardedAt: new Date(),
    },
  });
}
