import type { OrderStatus } from "@fosl/contracts";
import type { IntegrationPlatform } from "./types";

const STATUS_RANK: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  lead_received: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -2,
  refunded: -2,
};

export function shouldAdvanceOrderStatus(current: OrderStatus, incoming: OrderStatus): boolean {
  if (incoming === "cancelled" || incoming === "refunded") return true;
  return (STATUS_RANK[incoming] ?? 0) > (STATUS_RANK[current] ?? 0);
}

export function mapShopifyOrderStatus(input: {
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  cancelledAt?: string | null;
}): OrderStatus {
  if (input.cancelledAt) return "cancelled";
  const financial = (input.financialStatus ?? "").toLowerCase();
  if (financial === "refunded" || financial === "voided") return "refunded";
  if (financial === "pending" || financial === "authorized") return "pending";

  const fulfillment = (input.fulfillmentStatus ?? "").toLowerCase();
  if (fulfillment === "fulfilled") return "shipped";
  if (fulfillment === "partial") return "shipped";
  return "processing";
}

export function mapWooCommerceOrderStatus(status: string): OrderStatus {
  switch (status.toLowerCase()) {
    case "pending":
    case "on-hold":
      return "pending";
    case "processing":
      return "processing";
    case "completed":
      return "delivered";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "failed":
      return "refunded";
    default:
      return "processing";
  }
}

export function mapExternalOrderStatus(
  platform: IntegrationPlatform,
  external: { status: string; fulfillmentStatus?: string; cancelledAt?: string | null }
): OrderStatus {
  if (platform === "shopify") {
    return mapShopifyOrderStatus({
      financialStatus: external.status,
      fulfillmentStatus: external.fulfillmentStatus,
      cancelledAt: external.cancelledAt,
    });
  }
  return mapWooCommerceOrderStatus(external.status);
}
