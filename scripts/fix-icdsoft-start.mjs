#!/usr/bin/env node
/**
 * Patch package.json start scripts for ICDSoft WebApps (PORT from sureapp).
 * Safe alternative to sed — preserves valid JSON.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const startCmd = "node ../../scripts/next-start.mjs";

function patchJson(relativePath, mutator) {
  const file = path.join(repoRoot, relativePath);
  const data = JSON.parse(readFileSync(file, "utf8"));
  mutator(data);
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`patched ${relativePath}`);
}

for (const app of ["platform", "storefront"]) {
  patchJson(`apps/${app}/package.json`, (j) => {
    j.scripts.start = startCmd;
  });
}

patchJson("package.json", (j) => {
  j.scripts["start:platform"] = "npm run start -w @fosl/platform";
  j.scripts["start:storefront"] = "npm run start -w @fosl/storefront";
});

console.log("Done. Verify: grep '\"start\"' apps/*/package.json");
