import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
};

export default nextConfig;
