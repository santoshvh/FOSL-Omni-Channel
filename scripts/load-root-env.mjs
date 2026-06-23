import path from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";

/** Load monorepo root `.env` and Admin-managed `.fosl-runtime.json`. */
export function loadRootEnv(importMetaUrl) {
  const appDir = path.dirname(fileURLToPath(importMetaUrl));
  const repoRoot = path.resolve(appDir, "../..");
  loadEnvConfig(repoRoot);

  const runtimePath = path.join(repoRoot, ".fosl-runtime.json");
  if (!existsSync(runtimePath)) return;

  try {
    const runtime = JSON.parse(readFileSync(runtimePath, "utf8"));
    for (const [key, value] of Object.entries(runtime)) {
      if (value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore invalid runtime file
  }
}
