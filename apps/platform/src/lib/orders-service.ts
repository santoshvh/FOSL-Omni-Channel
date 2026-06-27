import type { Order } from "@fosl/contracts";
import { getOrderMapped, listOrdersMapped } from "@fosl/db";

export async function fetchOrdersList(filters: {
  email?: string;
  vendorId?: string;
  operatorId?: string;
}): Promise<{ data: Order[]; source: "database" | "unconfigured" }> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { data: [], source: "unconfigured" };
  }

  const data = await listOrdersMapped(filters);
  return { data, source: "database" };
}

export async function fetchOrderById(
  id: string
): Promise<{ data: Order | null; source: "database" | "unconfigured" }> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { data: null, source: "unconfigured" };
  }

  const data = await getOrderMapped(id);
  return { data, source: "database" };
}
