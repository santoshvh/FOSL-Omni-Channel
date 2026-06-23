import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(repoRoot);

const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3001";
const secret = process.env.PAYOUT_JOB_SECRET?.trim();
const creatorId = process.argv[2];

const headers = {
  "Content-Type": "application/json",
  ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
};

const response = await fetch(`${storefrontUrl}/api/v1/payouts/commissions`, {
  method: "POST",
  headers,
  body: JSON.stringify(creatorId ? { creatorId } : {}),
});

const json = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error("Commission payout job failed:", response.status, json);
  process.exit(1);
}

console.log(JSON.stringify(json, null, 2));
