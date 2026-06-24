#!/usr/bin/env node
/**
 * ICDSoft runs one shared start_cmd per release directory. All three FOSL
 * WebApps use /home/foslone/private/FOSL, so start_cmd must be identical.
 * Route to the correct app via FOSL_APP (sureapp env set) or PORT from
 * `sureapp project list`.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRootEnv } from "./load-root-env.mjs";

loadRootEnv(import.meta.url);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Update if ICDSoft assigns new ports — run `sureapp project list`. */
const PORT_TO_APP = {
  "26104": "hub",
  "1629": "storefront",
  "31035": "admin",
};

const FOSL_APP = process.env.FOSL_APP?.trim().toLowerCase();
const port = process.env.PORT?.trim() ?? "";
const app = FOSL_APP || PORT_TO_APP[port];

if (!app || !["hub", "storefront", "admin"].includes(app)) {
  console.error(
    [
      "Cannot determine FOSL app to start.",
      `PORT=${port || "(unset)"}`,
      `FOSL_APP=${FOSL_APP || "(unset)"}`,
      "Fix: sureapp env set FOSL_APP hub|storefront|admin in each WebApp shell,",
      "or update PORT_TO_APP in scripts/icdsoft-start.mjs to match `sureapp project list`.",
    ].join("\n")
  );
  process.exit(1);
}

const workspace = `@fosl/${app}`;
console.log(`[icdsoft-start] PORT=${port} → ${workspace} AUTH_SECRET=${process.env.AUTH_SECRET ? "set" : "MISSING"}`);

const child = spawn("npm", ["run", "start", "-w", workspace], {
  cwd: repoRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
