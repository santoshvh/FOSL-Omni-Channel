import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listVendorIntegrations, runCatalogSync } from "@fosl/db";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(repoRoot);

const vendorId = process.argv[2] ?? "ven_1";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required. Configure MySQL in Admin Settings first.");
    process.exit(1);
  }

  const integrations = await listVendorIntegrations(vendorId);
  const connected = integrations.filter((row) => row.status !== "disconnected");

  if (!connected.length) {
    console.log(`No connected integrations for vendor ${vendorId}.`);
    return;
  }

  for (const integration of connected) {
    console.log(`Syncing ${integration.platform} (${integration.storeUrl})…`);
    const result = await runCatalogSync(integration.id);
    console.log(
      JSON.stringify(
        {
          integrationId: integration.id,
          products: result.productStats,
          shipping: result.shippingStats,
          errors: result.errors,
        },
        null,
        2
      )
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
