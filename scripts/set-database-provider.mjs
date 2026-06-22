#!/usr/bin/env node
/**
 * Sync prisma/schema.prisma provider from DATABASE_PROVIDER env (postgresql | mysql).
 * Pattern from YooSupport — run before prisma generate / db push.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const provider = (process.env.DATABASE_PROVIDER || "postgresql").toLowerCase();

if (!["postgresql", "mysql"].includes(provider)) {
  console.error("DATABASE_PROVIDER must be postgresql or mysql");
  process.exit(1);
}

const schemaPath = join(__dirname, "../packages/db/prisma/schema.prisma");
try {
  let schema = readFileSync(schemaPath, "utf8");
  schema = schema.replace(
    /provider\s*=\s*"(postgresql|mysql)"/,
    `provider = "${provider}"`
  );
  writeFileSync(schemaPath, schema);
  console.log(`Set Prisma provider to ${provider}`);
} catch {
  console.log("packages/db not yet scaffolded — skip set-database-provider");
}
