#!/usr/bin/env node
/**
 * Production start wrapper — loads repo `.env` + `.fosl-runtime.json`, then next start.
 * Use from each app package.json start script so AUTH_SECRET is available at runtime.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRootEnv } from "./load-root-env.mjs";

loadRootEnv(import.meta.url);

const port = process.env.PORT?.trim() || "3000";
const appCwd = process.cwd();
const appName = path.basename(appCwd);

if (appName === "hub" && !process.env.AUTH_SECRET?.trim()) {
  console.error(
    "[next-start] AUTH_SECRET is missing. Set via .env, .fosl-runtime.json, or: sureapp env set AUTH_SECRET '...'"
  );
  process.exit(1);
}

console.log(`[next-start] app=${appName} port=${port} AUTH_SECRET=${process.env.AUTH_SECRET ? "set" : "MISSING"}`);

const child = spawn("npx", ["next", "start", "-H", "0.0.0.0", "-p", port], {
  cwd: appCwd,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
