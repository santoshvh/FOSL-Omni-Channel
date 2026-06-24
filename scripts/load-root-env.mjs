import path from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

/** Load monorepo root `.env` and Admin-managed `.fosl-runtime.json`. */
export function loadRootEnv(importMetaUrl) {
  const fileDir = path.dirname(fileURLToPath(importMetaUrl));
  const repoRoot = fileDir.endsWith(`${path.sep}scripts`)
    ? path.resolve(fileDir, "..")
    : path.resolve(fileDir, "../..");
  loadEnvConfig(repoRoot);

  const runtimePath = path.join(repoRoot, ".fosl-runtime.json");
  if (!existsSync(runtimePath)) return;

  try {
    const runtime = JSON.parse(readFileSync(runtimePath, "utf8"));
    for (const [key, value] of Object.entries(runtime)) {
      if (value) {
        process.env[key] = String(value);
      }
    }
  } catch {
    // ignore invalid runtime file
  }
}
