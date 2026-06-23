import type { VendorIntegration as VendorIntegrationDto, SyncJob as SyncJobDto } from "@fosl/contracts";
import {
  createCatalogAdapter,
  type IntegrationCredentials,
  type NormalizedCatalogProduct,
  type NormalizedShippingMethod,
} from "@fosl/integrations";
import { products as mockProducts, getShippingForVendor } from "@fosl/mocks";
import type { ProductType } from "@fosl/contracts";
import type {
  IntegrationPlatform,
  IntegrationStatus,
  VendorIntegration,
  SyncJob,
} from "@prisma/client";
import { prisma } from "./client";

export type ConnectIntegrationInput = {
  vendorId: string;
  platform: "shopify" | "woocommerce";
  storeUrl: string;
  syncShipping: boolean;
  accessToken?: string;
  consumerKey?: string;
  consumerSecret?: string;
};

function encodeCredentials(credentials: IntegrationCredentials): string {
  return Buffer.from(JSON.stringify(credentials), "utf8").toString("base64");
}

export function decodeCredentials(encoded: string | null | undefined): IntegrationCredentials {
  if (!encoded) return {};
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as IntegrationCredentials;
  } catch {
    return {};
  }
}

function mapIntegrationStatus(status: IntegrationStatus): VendorIntegrationDto["status"] {
  return status.toLowerCase() as VendorIntegrationDto["status"];
}

function mapPlatform(platform: IntegrationPlatform): VendorIntegrationDto["platform"] {
  return platform.toLowerCase() as VendorIntegrationDto["platform"];
}

function mapDbIntegration(row: VendorIntegration): VendorIntegrationDto {
  return {
    id: row.id,
    platform: mapPlatform(row.platform),
    storeUrl: row.storeUrl,
    status: mapIntegrationStatus(row.status),
    lastSyncAt: row.lastSyncAt?.toISOString() ?? new Date(0).toISOString(),
    syncShipping: row.syncShipping,
    productsSynced: row.productsSynced,
    shippingZonesSynced: row.shippingZonesSynced,
  };
}

function mapDbSyncJob(row: SyncJob): SyncJobDto {
  return {
    id: row.id,
    integrationId: row.integrationId,
    entity: row.entity as SyncJobDto["entity"],
    status: row.status as SyncJobDto["status"],
    added: row.added,
    updated: row.updated,
    failed: row.failed,
    startedAt: row.startedAt.toISOString(),
    errorMessage: row.errorMessage ?? undefined,
  };
}

function toPrismaProductType(type: ProductType): "PHYSICAL" | "DIGITAL" | "LEAD_GEN" {
  if (type === "digital") return "DIGITAL";
  if (type === "lead_gen") return "LEAD_GEN";
  return "PHYSICAL";
}

function toPrismaCatalogSource(
  source: NormalizedCatalogProduct["catalogSource"]
): "NATIVE" | "SHOPIFY" | "WOOCOMMERCE" {
  if (source === "shopify") return "SHOPIFY";
  if (source === "woocommerce") return "WOOCOMMERCE";
  return "NATIVE";
}

export function isDemoIntegration(storeUrl: string, credentials: IntegrationCredentials): boolean {
  if (storeUrl.includes("demo.fosl") || storeUrl.includes("localhost")) return true;
  if (credentials.shopify?.accessToken === "demo") return true;
  if (credentials.woocommerce?.consumerKey === "demo") return true;
  return false;
}

function demoProducts(
  platform: "shopify" | "woocommerce",
  vendorId: string
): NormalizedCatalogProduct[] {
  const source = platform === "shopify" ? "shopify" : "woocommerce";
  return mockProducts
    .filter((p) => p.catalogSource === source || p.vendorId === vendorId)
    .map((p) => ({
      externalId: p.id,
      sku: p.sku,
      title: p.title,
      description: p.description,
      type: p.type,
      priceCents: p.priceCents,
      currency: p.currency,
      inventory: p.inventory,
      imageUrl: p.imageUrl,
      category: p.category,
      catalogSource: source,
    }));
}

function demoShipping(vendorId: string): NormalizedShippingMethod[] {
  return getShippingForVendor(vendorId).map((method) => ({
    externalId: method.id,
    name: method.name,
    priceCents: method.priceCents,
    estimatedDays: method.estimatedDays,
    zone: method.zone,
  }));
}

export async function listVendorIntegrations(vendorId: string): Promise<VendorIntegrationDto[]> {
  const rows = await prisma.vendorIntegration.findMany({
    where: { vendorId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapDbIntegration);
}

export async function listSyncJobs(integrationId?: string): Promise<SyncJobDto[]> {
  const rows = await prisma.syncJob.findMany({
    where: integrationId ? { integrationId } : undefined,
    orderBy: { startedAt: "desc" },
    take: 50,
  });
  return rows.map(mapDbSyncJob);
}

export async function getSyncJobById(id: string): Promise<SyncJobDto | null> {
  const row = await prisma.syncJob.findUnique({ where: { id } });
  return row ? mapDbSyncJob(row) : null;
}

export async function connectVendorIntegration(input: ConnectIntegrationInput) {
  const credentials: IntegrationCredentials =
    input.platform === "shopify"
      ? { shopify: { accessToken: input.accessToken?.trim() || "demo" } }
      : {
          woocommerce: {
            consumerKey: input.consumerKey?.trim() || "demo",
            consumerSecret: input.consumerSecret?.trim() || "demo",
          },
        };

  const platform = input.platform.toUpperCase() as IntegrationPlatform;

  const row = await prisma.vendorIntegration.upsert({
    where: {
      vendorId_platform: {
        vendorId: input.vendorId,
        platform,
      },
    },
    create: {
      vendorId: input.vendorId,
      platform,
      storeUrl: input.storeUrl.trim(),
      status: "CONNECTED",
      syncShipping: input.syncShipping,
      credentialsEncrypted: encodeCredentials(credentials),
    },
    update: {
      storeUrl: input.storeUrl.trim(),
      syncShipping: input.syncShipping,
      status: "CONNECTED",
      credentialsEncrypted: encodeCredentials(credentials),
    },
  });

  return mapDbIntegration(row);
}

async function upsertProducts(
  vendorId: string,
  items: NormalizedCatalogProduct[]
): Promise<{ added: number; updated: number; failed: number }> {
  let added = 0;
  let updated = 0;
  let failed = 0;

  for (const item of items) {
    try {
      const data = {
        vendorId,
        sku: item.sku,
        title: item.title,
        description: item.description,
        type: toPrismaProductType(item.type),
        priceCents: item.priceCents,
        currency: item.currency,
        inventory: item.inventory,
        imageUrl: item.imageUrl || "/stock/hero-online-shopping.jpg",
        category: item.category,
        catalogSource: toPrismaCatalogSource(item.catalogSource),
        externalId: item.externalId,
        published: true,
      };

      const before = await prisma.product.findUnique({
        where: { vendorId_sku: { vendorId, sku: item.sku } },
      });
      await prisma.product.upsert({
        where: { vendorId_sku: { vendorId, sku: item.sku } },
        create: data,
        update: data,
      });
      if (before) updated += 1;
      else added += 1;
    } catch (err) {
      failed += 1;
      console.error("[catalog-sync] product upsert failed:", err);
    }
  }

  return { added, updated, failed };
}

async function upsertShipping(
  vendorId: string,
  methods: NormalizedShippingMethod[]
): Promise<{ added: number; updated: number; failed: number }> {
  let added = 0;
  let updated = 0;
  let failed = 0;

  for (const method of methods) {
    try {
      const existing = await prisma.shippingMethod.findFirst({
        where: { vendorId, name: method.name, zone: method.zone },
      });

      const data = {
        vendorId,
        name: method.name,
        priceCents: method.priceCents,
        estimatedDays: method.estimatedDays,
        zone: method.zone,
      };

      if (existing) {
        await prisma.shippingMethod.update({ where: { id: existing.id }, data });
        updated += 1;
      } else {
        await prisma.shippingMethod.create({ data });
        added += 1;
      }
    } catch (err) {
      failed += 1;
      console.error("[catalog-sync] shipping upsert failed:", err);
    }
  }

  return { added, updated, failed };
}

export async function runCatalogSync(integrationId: string) {
  const integration = await prisma.vendorIntegration.findUnique({ where: { id: integrationId } });
  if (!integration) throw new Error("Integration not found.");

  const platform = mapPlatform(integration.platform);
  const credentials = decodeCredentials(integration.credentialsEncrypted);
  const useDemo = isDemoIntegration(integration.storeUrl, credentials);

  await prisma.vendorIntegration.update({
    where: { id: integrationId },
    data: { status: "SYNCING" },
  });

  const errors: string[] = [];
  let productStats = { added: 0, updated: 0, failed: 0 };
  let shippingStats = { added: 0, updated: 0, failed: 0 };

  const productJob = await prisma.syncJob.create({
    data: {
      integrationId,
      entity: "products",
      status: "success",
      startedAt: new Date(),
    },
  });

  try {
    let catalogProducts: NormalizedCatalogProduct[];
    if (useDemo) {
      catalogProducts = demoProducts(platform, integration.vendorId);
    } else {
      const adapter = createCatalogAdapter(platform, integration.storeUrl, credentials);
      catalogProducts = await adapter.fetchProducts();
    }
    productStats = await upsertProducts(integration.vendorId, catalogProducts);
    await prisma.syncJob.update({
      where: { id: productJob.id },
      data: {
        added: productStats.added,
        updated: productStats.updated,
        failed: productStats.failed,
        status: productStats.failed > 0 ? "partial" : "success",
        completedAt: new Date(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Product sync failed.";
    errors.push(message);
    await prisma.syncJob.update({
      where: { id: productJob.id },
      data: {
        status: "failed",
        errorMessage: message,
        completedAt: new Date(),
      },
    });
  }

  if (integration.syncShipping) {
    const shippingJob = await prisma.syncJob.create({
      data: {
        integrationId,
        entity: "shipping",
        status: "success",
        startedAt: new Date(),
      },
    });

    try {
      let shippingMethods: NormalizedShippingMethod[];
      if (useDemo) {
        shippingMethods = demoShipping(integration.vendorId);
      } else {
        const adapter = createCatalogAdapter(platform, integration.storeUrl, credentials);
        shippingMethods = await adapter.fetchShippingMethods();
      }
      shippingStats = await upsertShipping(integration.vendorId, shippingMethods);
      await prisma.syncJob.update({
        where: { id: shippingJob.id },
        data: {
          added: shippingStats.added,
          updated: shippingStats.updated,
          failed: shippingStats.failed,
          status: shippingStats.failed > 0 ? "partial" : "success",
          completedAt: new Date(),
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Shipping sync failed.";
      errors.push(message);
      await prisma.syncJob.update({
        where: { id: shippingJob.id },
        data: {
          status: "failed",
          errorMessage: message,
          completedAt: new Date(),
        },
      });
    }
  }

  const productCount = await prisma.product.count({
    where: {
      vendorId: integration.vendorId,
      catalogSource: integration.platform,
    },
  });
  const zoneCount = await prisma.shippingMethod.findMany({
    where: { vendorId: integration.vendorId },
    distinct: ["zone"],
    select: { zone: true },
  });

  const updated = await prisma.vendorIntegration.update({
    where: { id: integrationId },
    data: {
      status: errors.length ? "ERROR" : "CONNECTED",
      lastSyncAt: new Date(),
      productsSynced: productCount,
      shippingZonesSynced: zoneCount.length,
    },
  });

  return {
    integration: mapDbIntegration(updated),
    productStats,
    shippingStats,
    errors,
  };
}
