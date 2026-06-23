import type { Order, OrderLine, OrderStatus, ProductType } from "@fosl/contracts";
import type {
  Order as DbOrder,
  OrderLine as DbOrderLine,
  OrderStatus as DbOrderStatus,
  ProductType as DbProductType,
  Vendor,
} from "@prisma/client";

function toProductType(type: DbProductType): ProductType {
  if (type === "DIGITAL") return "digital";
  if (type === "LEAD_GEN") return "lead_gen";
  return "physical";
}

function toOrderStatus(status: DbOrderStatus): OrderStatus {
  return status.toLowerCase() as OrderStatus;
}

type DbOrderLineWithVendor = DbOrderLine & {
  vendor: Pick<Vendor, "id" | "name">;
};

export type DbOrderWithLines = DbOrder & {
  lines: DbOrderLineWithVendor[];
};

function mapOrderLine(line: DbOrderLineWithVendor): OrderLine {
  return {
    id: line.id,
    productId: line.productId,
    title: line.title,
    type: toProductType(line.type),
    qty: line.quantity,
    priceCents: line.unitPriceCents,
    vendorName: line.vendor.name,
    vendorId: line.vendorId,
    trackingNumber: line.trackingNumber ?? undefined,
    downloadUrl: line.downloadUrl ?? undefined,
    leadStatus: line.leadStatus ?? undefined,
  };
}

export function mapDbOrder(
  order: DbOrderWithLines & {
    externalPushes?: Array<{
      platform: import("@prisma/client").IntegrationPlatform;
      externalOrderId: string | null;
      pushStatus: import("@prisma/client").ExternalPushStatus;
      pushError: string | null;
      externalStatus: string | null;
      trackingNumber: string | null;
      pushedAt: Date | null;
      lastStatusSyncAt: Date | null;
      integration: { storeUrl: string };
    }>;
  }
): Order {
  const lines = order.lines.map(mapOrderLine);
  const trackingLine = lines.find((line) => line.trackingNumber);
  const downloadLine = lines.find((line) => line.downloadUrl);
  const leadLine = lines.find((line) => line.leadStatus);

  return {
    id: order.id,
    number: order.orderNumber,
    status: toOrderStatus(order.status),
    createdAt: order.createdAt.toISOString(),
    totalCents: order.totalCents,
    customerEmail: order.customerEmail,
    lines,
    trackingNumber: trackingLine?.trackingNumber,
    downloadUrl: downloadLine?.downloadUrl,
    leadStatus: leadLine?.leadStatus,
    externalPushes: order.externalPushes?.map((push) => ({
      platform: push.platform.toLowerCase() as "shopify" | "woocommerce",
      externalOrderId: push.externalOrderId ?? undefined,
      pushStatus: push.pushStatus.toLowerCase() as "pending" | "pushed" | "failed",
      pushError: push.pushError ?? undefined,
      externalStatus: push.externalStatus ?? undefined,
      trackingNumber: push.trackingNumber ?? undefined,
      storeUrl: push.integration.storeUrl,
      pushedAt: push.pushedAt?.toISOString(),
      lastStatusSyncAt: push.lastStatusSyncAt?.toISOString(),
    })),
  };
}

export const orderListInclude = {
  lines: {
    include: {
      vendor: { select: { id: true, name: true } },
    },
  },
  externalPushes: {
    include: {
      integration: { select: { storeUrl: true } },
    },
  },
} as const;
