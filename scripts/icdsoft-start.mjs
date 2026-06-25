#!/usr/bin/env node
/**
 * ICDSoft runs one shared start_cmd per release directory. FOSL uses two
 * WebApps (platform + storefront) on /home/foslone/private/FOSL.
 * Route via PORT from `sureapp project list` or FOSL_APP env.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRootEnv } from "./load-root-env.mjs";

loadRootEnv(import.meta.url);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Update if ICDSoft assigns new ports — run `sureapp project list`. */
const PORT_TO_APP = {
  "26104": "platform",
  "1629": "storefront",
};

const FOSL_APP = process.env.FOSL_APP?.trim().toLowerCase();
const port = process.env.PORT?.trim() ?? "";
const legacyApp =
  FOSL_APP === "hub" || FOSL_APP === "admin" ? "platform" : FOSL_APP;
const app = PORT_TO_APP[port] || legacyApp;

if (!app || !["platform", "storefront"].includes(app)) {
  console.error(
    [
      "Cannot determine FOSL app to start.",
      `PORT=${port || "(unset)"}`,
      `FOSL_APP=${FOSL_APP || "(unset)"}`,
      "Fix: sureapp env set FOSL_APP platform|storefront in each WebApp shell,",
      "or update PORT_TO_APP in scripts/icdsoft-start.mjs to match `sureapp project list`.",
    ].join("\n")
  );
  process.exit(1);
}

const workspace = `@fosl/${app}`;
console.log(
  `[icdsoft-start] PORT=${port} → ${workspace} AUTH_SECRET=${process.env.AUTH_SECRET ? "set" : "MISSING"}`
);

const child = spawn("npm", ["run", "start", "-w", workspace], {
  cwd: repoRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
