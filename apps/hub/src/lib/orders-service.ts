import type { Order } from "@fosl/contracts";
import { getOrderById, mockOrders } from "@fosl/mocks";
import { getOrderMapped, listOrdersMapped } from "@fosl/db";

export async function fetchOrdersList(filters: {
  email?: string;
  vendorId?: string;
  operatorId?: string;
}): Promise<{ data: Order[]; source: "database" | "mock" }> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await listOrdersMapped(filters);
      return { data, source: "database" };
    } catch (err) {
      console.error("[orders] database list failed:", err);
    }
  }

  let data = [...mockOrders] as Order[];

  if (filters.vendorId) {
    const vendorName =
      filters.vendorId === "ven_1"
        ? "Acme Audio Co."
        : filters.vendorId === "ven_4"
          ? "Bright Labs"
          : filters.vendorId === "ven_2"
            ? "Creator Academy"
            : undefined;
    if (vendorName) {
      data = data
        .filter((order) => order.lines.some((line) => line.vendorName === vendorName))
        .map((order) => ({
          ...order,
          lines: order.lines.filter((line) => line.vendorName === vendorName),
        }));
    }
  }

  if (filters.operatorId) {
    data = mockOrders as Order[];
  }

  return { data, source: "mock" };
}

export async function fetchOrderById(
  id: string
): Promise<{ data: Order | null; source: "database" | "mock" }> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await getOrderMapped(id);
      if (data) return { data, source: "database" };
    } catch (err) {
      console.error("[orders] database get failed:", err);
    }
  }

  const data = getOrderById(id) as Order | undefined;
  return { data: data ?? null, source: "mock" };
}
