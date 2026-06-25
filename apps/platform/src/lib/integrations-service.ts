import type { VendorIntegration, SyncJob } from "@fosl/contracts";
import {
  connectVendorIntegration,
  getSyncJobById,
  listSyncJobs,
  listVendorIntegrations,
  runCatalogSync,
} from "@fosl/db";
import { integrations, syncJobs, getSyncJobById as getMockSyncJobById } from "@fosl/mocks";

const DEFAULT_VENDOR_ID = "ven_1";

export async function fetchVendorIntegrations(vendorId = DEFAULT_VENDOR_ID): Promise<{
  data: VendorIntegration[];
  source: "database" | "mock";
}> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await listVendorIntegrations(vendorId);
      return { data, source: "database" };
    } catch (err) {
      console.error("[integrations] list failed:", err);
    }
  }
  return { data: integrations, source: "mock" };
}

export async function connectIntegration(input: {
  vendorId?: string;
  platform: "shopify" | "woocommerce";
  storeUrl: string;
  syncShipping: boolean;
  accessToken?: string;
  consumerKey?: string;
  consumerSecret?: string;
}) {
  const vendorId = input.vendorId ?? DEFAULT_VENDOR_ID;

  if (process.env.DATABASE_URL) {
    try {
      const data = await connectVendorIntegration({
        vendorId,
        platform: input.platform,
        storeUrl: input.storeUrl,
        syncShipping: input.syncShipping,
        accessToken: input.accessToken,
        consumerKey: input.consumerKey,
        consumerSecret: input.consumerSecret,
      });
      await runCatalogSync(data.id);
      const refreshed = await listVendorIntegrations(vendorId);
      return {
        data: refreshed.find((row) => row.id === data.id) ?? data,
        source: "database" as const,
      };
    } catch (err) {
      console.error("[integrations] connect failed:", err);
      throw err;
    }
  }

  return {
    data: integrations[0],
    source: "mock" as const,
  };
}

export async function triggerIntegrationSync(integrationId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const result = await runCatalogSync(integrationId);
      return { data: result, source: "database" as const };
    } catch (err) {
      console.error("[integrations] sync failed:", err);
      throw err;
    }
  }

  return {
    data: {
      integration: integrations.find((row) => row.id === integrationId) ?? integrations[0],
      productStats: { added: 1, updated: 2, failed: 0 },
      shippingStats: { added: 0, updated: 1, failed: 0 },
      errors: [] as string[],
    },
    source: "mock" as const,
  };
}

export async function fetchSyncJobs(integrationId?: string): Promise<{
  data: SyncJob[];
  source: "database" | "mock";
}> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await listSyncJobs(integrationId);
      return { data, source: "database" };
    } catch (err) {
      console.error("[integrations] sync jobs failed:", err);
    }
  }
  const data = integrationId
    ? syncJobs.filter((job) => job.integrationId === integrationId)
    : syncJobs;
  return { data, source: "mock" };
}

export async function fetchSyncJobDetail(id: string): Promise<{
  data: SyncJob | null;
  source: "database" | "mock";
}> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await getSyncJobById(id);
      return { data, source: "database" };
    } catch (err) {
      console.error("[integrations] sync job detail failed:", err);
    }
  }
  return { data: getMockSyncJobById(id) ?? null, source: "mock" };
}
