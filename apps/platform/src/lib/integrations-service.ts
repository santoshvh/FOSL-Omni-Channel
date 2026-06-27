import type { VendorIntegration, SyncJob } from "@fosl/contracts";
import {
  connectVendorIntegration,
  getSyncJobById,
  listSyncJobs,
  listVendorIntegrations,
  runCatalogSync,
} from "@fosl/db";

function requireDatabase() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("Database not configured.");
  }
}

export async function fetchVendorIntegrations(vendorId: string): Promise<{
  data: VendorIntegration[];
  source: "database" | "unconfigured";
}> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { data: [], source: "unconfigured" };
  }

  const data = await listVendorIntegrations(vendorId);
  return { data, source: "database" };
}

export async function connectIntegration(input: {
  vendorId: string;
  platform: "shopify" | "woocommerce";
  storeUrl: string;
  syncShipping: boolean;
  accessToken?: string;
  consumerKey?: string;
  consumerSecret?: string;
}) {
  requireDatabase();

  try {
    const data = await connectVendorIntegration({
      vendorId: input.vendorId,
      platform: input.platform,
      storeUrl: input.storeUrl,
      syncShipping: input.syncShipping,
      accessToken: input.accessToken,
      consumerKey: input.consumerKey,
      consumerSecret: input.consumerSecret,
    });
    await runCatalogSync(data.id);
    const refreshed = await listVendorIntegrations(input.vendorId);
    return {
      data: refreshed.find((row) => row.id === data.id) ?? data,
      source: "database" as const,
    };
  } catch (err) {
    console.error("[integrations] connect failed:", err);
    throw err;
  }
}

export async function triggerIntegrationSync(integrationId: string) {
  requireDatabase();

  try {
    const result = await runCatalogSync(integrationId);
    return { data: result, source: "database" as const };
  } catch (err) {
    console.error("[integrations] sync failed:", err);
    throw err;
  }
}

export async function fetchSyncJobs(integrationId?: string): Promise<{
  data: SyncJob[];
  source: "database" | "unconfigured";
}> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { data: [], source: "unconfigured" };
  }

  try {
    const data = await listSyncJobs(integrationId);
    return { data, source: "database" };
  } catch (err) {
    console.error("[integrations] sync jobs failed:", err);
    throw err;
  }
}

export async function fetchSyncJobDetail(id: string): Promise<{
  data: SyncJob | null;
  source: "database" | "unconfigured";
}> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { data: null, source: "unconfigured" };
  }

  try {
    const data = await getSyncJobById(id);
    return { data, source: "database" };
  } catch (err) {
    console.error("[integrations] sync job detail failed:", err);
    throw err;
  }
}
