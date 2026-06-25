import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

/** Do not put AUTH_SECRET in `env` — it inlines at build time and breaks prod if missing during build. */
const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
};

export default nextConfig;
