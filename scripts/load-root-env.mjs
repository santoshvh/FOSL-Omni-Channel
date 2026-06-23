import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";

/** Load monorepo root `.env` from an app's next.config (apps/*). */
export function loadRootEnv(importMetaUrl) {
  const appDir = path.dirname(fileURLToPath(importMetaUrl));
  const repoRoot = path.resolve(appDir, "../..");
  loadEnvConfig(repoRoot);
}
