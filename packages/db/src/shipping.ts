import { prisma } from "./client";

export async function listShippingMethodsForVendor(vendorId: string) {
  const rows = await prisma.shippingMethod.findMany({
    where: { vendorId },
    orderBy: { priceCents: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    vendorId: row.vendorId,
    name: row.name,
    priceCents: row.priceCents,
    estimatedDays: row.estimatedDays,
    zone: row.zone,
  }));
}

export async function createShippingMethod(
  vendorId: string,
  input: { name: string; priceCents: number; estimatedDays: string; zone: string }
) {
  return prisma.shippingMethod.create({
    data: { vendorId, ...input },
  });
}

export async function updateShippingMethod(
  vendorId: string,
  id: string,
  input: Partial<{ name: string; priceCents: number; estimatedDays: string; zone: string }>
) {
  const existing = await prisma.shippingMethod.findFirst({ where: { id, vendorId } });
  if (!existing) return null;
  return prisma.shippingMethod.update({ where: { id }, data: input });
}

export async function deleteShippingMethod(vendorId: string, id: string) {
  const existing = await prisma.shippingMethod.findFirst({ where: { id, vendorId } });
  if (!existing) return false;
  await prisma.shippingMethod.delete({ where: { id } });
  return true;
}
