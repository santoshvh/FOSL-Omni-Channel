import { prisma } from "./client";
import { mapDbOrder, orderListInclude, type DbOrderWithLines } from "./order-mappers";

export type OrderListFilters = {
  email?: string;
  vendorId?: string;
  operatorId?: string;
  limit?: number;
};

export async function listOrdersFromDb(filters: OrderListFilters): Promise<DbOrderWithLines[]> {
  const where: Record<string, unknown> = {};

  if (filters.email) {
    where.customerEmail = filters.email.toLowerCase();
  }

  if (filters.operatorId) {
    where.operatorId = filters.operatorId;
  }

  if (filters.vendorId) {
    where.lines = { some: { vendorId: filters.vendorId } };
  }

  return prisma.order.findMany({
    where,
    include: orderListInclude,
    orderBy: { createdAt: "desc" },
    take: filters.limit ?? 50,
  });
}

export async function getOrderFromDb(id: string): Promise<DbOrderWithLines | null> {
  return prisma.order.findUnique({
    where: { id },
    include: orderListInclude,
  });
}

export async function listOrdersMapped(filters: OrderListFilters) {
  const rows = await listOrdersFromDb(filters);
  return rows.map(mapDbOrder);
}

export async function getOrderMapped(id: string) {
  const row = await getOrderFromDb(id);
  return row ? mapDbOrder(row) : null;
}

export async function updateOrderStatus(
  id: string,
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "LEAD_RECEIVED"
) {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: orderListInclude,
  });
}

export async function updateOrderLineFulfillment(
  orderLineId: string,
  data: { trackingNumber?: string; downloadUrl?: string; leadStatus?: string }
) {
  return prisma.orderLine.update({
    where: { id: orderLineId },
    data,
  });
}
