import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncAllExternalOrderStatuses } from "@fosl/db";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(repoRoot);

const integrationId = process.argv[2];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required. Configure MySQL in Admin Settings first.");
    process.exit(1);
  }

  const result = await syncAllExternalOrderStatuses(integrationId);
  console.log(
    JSON.stringify(
      {
        updated: result.updated,
        errors: result.errors,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
