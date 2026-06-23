import { prisma } from "@fosl/db";

type CartLine = {
  productId: string;
  quantity: number;
};

export type ConnectSettlement = "destination" | "platform";

export type PaymentIntentConnectParams = {
  settlement: ConnectSettlement;
  transferData?: { destination: string };
  applicationFeeAmount?: number;
  metadata: Record<string, string>;
};

const DEFAULT_PLATFORM_FEE_PCT = 10;

export async function buildPaymentIntentConnectParams(
  lines: CartLine[],
  amountCents: number
): Promise<PaymentIntentConnectParams> {
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

  const vendorIds = [...new Set(products.map((product) => product.vendorId))];
  const vendors = await prisma.vendor.findMany({
    where: { id: { in: vendorIds } },
    select: { id: true, stripeAccountId: true },
  });

  const connectedVendors = vendors.filter((vendor) => vendor.stripeAccountId);

  if (vendorIds.length === 1 && connectedVendors.length === 1) {
    const applicationFeeAmount = Math.round((amountCents * DEFAULT_PLATFORM_FEE_PCT) / 100);
    return {
      settlement: "destination",
      transferData: { destination: connectedVendors[0].stripeAccountId! },
      applicationFeeAmount,
      metadata: {
        settlement: "destination",
        vendorId: vendorIds[0],
        platformFeePct: String(DEFAULT_PLATFORM_FEE_PCT),
      },
    };
  }

  return {
    settlement: "platform",
    metadata: {
      settlement: "platform",
      vendorCount: String(vendorIds.length),
      connectedVendorCount: String(connectedVendors.length),
    },
  };
}
