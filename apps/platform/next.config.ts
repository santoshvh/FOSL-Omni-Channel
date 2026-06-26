import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

/** Do not put AUTH_SECRET in `env` — it inlines at build time and breaks prod if missing during build. */
const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
      },
      {
        source: "/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
