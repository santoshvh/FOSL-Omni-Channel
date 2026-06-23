import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

const authSecret =
  process.env.AUTH_SECRET?.trim() ||
  (process.env.NODE_ENV === "development"
    ? "fosl-dev-auth-secret-change-before-production"
    : undefined);

const nextConfig: NextConfig = {
  env: {
    AUTH_SECRET: authSecret,
    AUTH_URL: process.env.AUTH_URL ?? "http://localhost:3000",
  },
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
};

export default nextConfig;
