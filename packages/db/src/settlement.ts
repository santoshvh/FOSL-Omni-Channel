import { prisma } from "./client";

export type VendorSettlementShare = {
  vendorId: string;
  amountCents: number;
  stripeAccountId: string | null;
};

export async function computeVendorSettlementShares(
  lines: { productId: string; quantity: number }[]
): Promise<VendorSettlementShare[]> {
  if (!process.env.DATABASE_URL || lines.length === 0) return [];

  const productIds = [...new Set(lines.map((line) => line.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
    select: { id: true, vendorId: true, priceCents: true },
  });

  const totals = new Map<string, number>();
  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) continue;
    totals.set(product.vendorId, (totals.get(product.vendorId) ?? 0) + product.priceCents * line.quantity);
  }

  const vendorIds = [...totals.keys()];
  const vendors = await prisma.vendor.findMany({
    where: { id: { in: vendorIds } },
    select: { id: true, stripeAccountId: true },
  });

  return vendorIds.map((vendorId) => ({
    vendorId,
    amountCents: totals.get(vendorId) ?? 0,
    stripeAccountId: vendors.find((v) => v.id === vendorId)?.stripeAccountId ?? null,
  }));
}
