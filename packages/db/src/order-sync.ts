import type { OrderExternalPush as OrderExternalPushDto, OrderStatus } from "@fosl/contracts";
import {
  createOrderAdapter,
  mapExternalOrderStatus,
  shouldAdvanceOrderStatus,
  type OrderPushPayload,
} from "@fosl/integrations";
import type {
  CatalogSource,
  ExternalPushStatus,
  IntegrationPlatform,
  Order,
  OrderLine,
  Product,
  VendorIntegration,
} from "@prisma/client";
import { decodeCredentials, isDemoIntegration } from "./catalog-sync";
import { prisma } from "./client";
import { updateOrderLineFulfillment, updateOrderStatus } from "./orders";

type OrderWithLines = Order & {
  lines: Array<OrderLine & { product: Product }>;
};

function mapPlatform(platform: IntegrationPlatform): "shopify" | "woocommerce" {
  return platform.toLowerCase() as "shopify" | "woocommerce";
}

function catalogSourceToPlatform(source: CatalogSource): IntegrationPlatform | null {
  if (source === "SHOPIFY") return "SHOPIFY";
  if (source === "WOOCOMMERCE") return "WOOCOMMERCE";
  return null;
}

function toFoslOrderStatus(status: OrderStatus): Parameters<typeof updateOrderStatus>[1] {
  return status.toUpperCase() as Parameters<typeof updateOrderStatus>[1];
}

function buildPushPayload(order: OrderWithLines, lines: OrderWithLines["lines"]): OrderPushPayload {
  return {
    orderNumber: order.orderNumber,
    customerEmail: order.customerEmail,
    currency: order.currency,
    note: `FOSL marketplace order ${order.orderNumber}`,
    shipping: {
      name: order.shippingName ?? undefined,
      line1: order.shippingLine1 ?? undefined,
      line2: order.shippingLine2 ?? undefined,
      city: order.shippingCity ?? undefined,
      state: order.shippingState ?? undefined,
      postal: order.shippingPostal ?? undefined,
      country: order.shippingCountry ?? undefined,
    },
    lines: lines
      .filter((line) => line.product.externalId)
      .map((line) => ({
        externalProductId: line.product.externalId!,
        title: line.title,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
      })),
  };
}

function mapDbExternalPush(
  row: {
    platform: IntegrationPlatform;
    externalOrderId: string | null;
    pushStatus: ExternalPushStatus;
    pushError: string | null;
    externalStatus: string | null;
    trackingNumber: string | null;
    pushedAt: Date | null;
    lastStatusSyncAt: Date | null;
    integration: Pick<VendorIntegration, "storeUrl">;
  }
): OrderExternalPushDto {
  return {
    platform: mapPlatform(row.platform),
    externalOrderId: row.externalOrderId ?? undefined,
    pushStatus: row.pushStatus.toLowerCase() as OrderExternalPushDto["pushStatus"],
    pushError: row.pushError ?? undefined,
    externalStatus: row.externalStatus ?? undefined,
    trackingNumber: row.trackingNumber ?? undefined,
    storeUrl: row.integration.storeUrl,
    pushedAt: row.pushedAt?.toISOString(),
    lastStatusSyncAt: row.lastStatusSyncAt?.toISOString(),
  };
}

async function applyStatusToFoslOrder(
  orderId: string,
  platform: "shopify" | "woocommerce",
  external: { status: string; fulfillmentStatus?: string; cancelledAt?: string | null },
  trackingNumber?: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const incoming = mapExternalOrderStatus(platform, external);
  const current = order.status.toLowerCase() as OrderStatus;

  if (shouldAdvanceOrderStatus(current, incoming)) {
    await updateOrderStatus(orderId, toFoslOrderStatus(incoming));
  }

  if (trackingNumber) {
    const physicalLine = await prisma.orderLine.findFirst({
      where: { orderId, type: "PHYSICAL" },
    });
    if (physicalLine && !physicalLine.trackingNumber) {
      await updateOrderLineFulfillment(physicalLine.id, { trackingNumber });
    }
  }
}

export async function pushOrderToExternalStores(orderId: string) {
  if (!process.env.DATABASE_URL) return { pushed: 0, errors: [] as string[] };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      lines: { include: { product: true } },
    },
  });

  if (!order) return { pushed: 0, errors: ["Order not found."] };

  const linesByVendor = new Map<string, OrderWithLines["lines"]>();
  for (const line of order.lines) {
    const platform = catalogSourceToPlatform(line.product.catalogSource);
    if (!platform || !line.product.externalId) continue;
    const existing = linesByVendor.get(line.vendorId) ?? [];
    existing.push(line);
    linesByVendor.set(line.vendorId, existing);
  }

  let pushed = 0;
  const errors: string[] = [];

  for (const [vendorId, vendorLines] of linesByVendor) {
    const catalogSource = vendorLines[0]!.product.catalogSource;
    const platform = catalogSourceToPlatform(catalogSource);
    if (!platform) continue;

    const integration = await prisma.vendorIntegration.findUnique({
      where: { vendorId_platform: { vendorId, platform } },
    });
    if (!integration || integration.status === "DISCONNECTED") {
      errors.push(`No connected ${platform.toLowerCase()} integration for vendor ${vendorId}.`);
      continue;
    }

    const existingPush = await prisma.orderExternalPush.findUnique({
      where: {
        orderId_integrationId: { orderId, integrationId: integration.id },
      },
    });
    if (existingPush?.pushStatus === "PUSHED") {
      pushed += 1;
      continue;
    }

    const pushRow =
      existingPush ??
      (await prisma.orderExternalPush.create({
        data: {
          orderId,
          integrationId: integration.id,
          vendorId,
          platform,
          pushStatus: "PENDING",
        },
      }));

    const syncJob = await prisma.syncJob.create({
      data: {
        integrationId: integration.id,
        entity: "orders",
        status: "success",
        startedAt: new Date(),
      },
    });

    const credentials = decodeCredentials(integration.credentialsEncrypted);
    const useDemo = isDemoIntegration(integration.storeUrl, credentials);
    const payload = buildPushPayload(order, vendorLines);

    if (payload.lines.length === 0) {
      const message = "No mappable external product IDs for order push.";
      await prisma.orderExternalPush.update({
        where: { id: pushRow.id },
        data: { pushStatus: "FAILED", pushError: message },
      });
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: { status: "failed", failed: 1, errorMessage: message, completedAt: new Date() },
      });
      errors.push(message);
      continue;
    }

    try {
      let result: { externalOrderId: string; externalStatus: string };
      if (useDemo) {
        result = {
          externalOrderId: `demo-${platform.toLowerCase()}-${Date.now()}`,
          externalStatus: "processing",
        };
      } else {
        const adapter = createOrderAdapter(
          mapPlatform(platform),
          integration.storeUrl,
          credentials
        );
        result = await adapter.pushOrder(payload);
      }

      await prisma.orderExternalPush.update({
        where: { id: pushRow.id },
        data: {
          pushStatus: "PUSHED",
          externalOrderId: result.externalOrderId,
          externalStatus: result.externalStatus,
          pushedAt: new Date(),
          pushError: null,
        },
      });

      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          added: 1,
          status: "success",
          completedAt: new Date(),
        },
      });

      pushed += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Order push failed.";
      errors.push(message);
      await prisma.orderExternalPush.update({
        where: { id: pushRow.id },
        data: { pushStatus: "FAILED", pushError: message },
      });
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: { status: "failed", failed: 1, errorMessage: message, completedAt: new Date() },
      });
    }
  }

  return { pushed, errors };
}

export async function syncExternalOrderStatusForPush(pushId: string) {
  const push = await prisma.orderExternalPush.findUnique({
    where: { id: pushId },
    include: { integration: true, order: true },
  });
  if (!push?.externalOrderId || push.pushStatus !== "PUSHED") return null;

  const credentials = decodeCredentials(push.integration.credentialsEncrypted);
  const platform = mapPlatform(push.platform);
  const useDemo = isDemoIntegration(push.integration.storeUrl, credentials);

  let externalStatus: {
    status: string;
    fulfillmentStatus?: string;
    trackingNumber?: string;
    cancelledAt?: string | null;
  };

  if (useDemo) {
    externalStatus = { status: push.externalStatus ?? "processing" };
  } else {
    const adapter = createOrderAdapter(platform, push.integration.storeUrl, credentials);
    const fetched = await adapter.fetchOrderStatus(push.externalOrderId);
    externalStatus = {
      status: fetched.status,
      fulfillmentStatus: fetched.fulfillmentStatus,
      trackingNumber: fetched.trackingNumber,
      cancelledAt: (fetched as { cancelledAt?: string | null }).cancelledAt,
    };
  }

  await prisma.orderExternalPush.update({
    where: { id: push.id },
    data: {
      externalStatus: externalStatus.status,
      trackingNumber: externalStatus.trackingNumber ?? push.trackingNumber,
      lastStatusSyncAt: new Date(),
    },
  });

  await applyStatusToFoslOrder(
    push.orderId,
    platform,
    externalStatus,
    externalStatus.trackingNumber
  );

  return externalStatus;
}

export async function syncAllExternalOrderStatuses(integrationId?: string) {
  const pushes = await prisma.orderExternalPush.findMany({
    where: {
      pushStatus: "PUSHED",
      externalOrderId: { not: null },
      ...(integrationId ? { integrationId } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  let updated = 0;
  const errors: string[] = [];

  for (const push of pushes) {
    try {
      await syncExternalOrderStatusForPush(push.id);
      updated += 1;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Status sync failed.");
    }
  }

  return { updated, errors };
}

export async function handleExternalOrderWebhook(
  platform: "shopify" | "woocommerce",
  externalOrderId: string
) {
  const push = await prisma.orderExternalPush.findFirst({
    where: {
      platform: platform.toUpperCase() as IntegrationPlatform,
      externalOrderId,
      pushStatus: "PUSHED",
    },
  });

  if (!push) return { matched: false };

  await syncExternalOrderStatusForPush(push.id);
  return { matched: true, orderId: push.orderId };
}

export async function listOrderExternalPushes(orderId: string): Promise<OrderExternalPushDto[]> {
  const rows = await prisma.orderExternalPush.findMany({
    where: { orderId },
    include: { integration: { select: { storeUrl: true } } },
  });
  return rows.map(mapDbExternalPush);
}
