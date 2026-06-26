import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

const authSecret = process.env.AUTH_SECRET?.trim();
const authUrl = process.env.AUTH_URL?.trim();
const hubUrl = process.env.NEXT_PUBLIC_HUB_URL?.trim();

/** Inline deploy env at build time so Edge middleware can read host/auth config. */
const edgeEnv: Record<string, string> = {};
if (authSecret && authSecret !== "generate-with-openssl-rand-base64-32") {
  edgeEnv.AUTH_SECRET = authSecret;
}
if (authUrl) edgeEnv.AUTH_URL = authUrl;
if (hubUrl) edgeEnv.NEXT_PUBLIC_HUB_URL = hubUrl;
if (process.env.AUTH_ENABLED?.trim()) edgeEnv.AUTH_ENABLED = process.env.AUTH_ENABLED.trim();

/** Do not put AUTH_SECRET in `env` — it inlines at build time and breaks prod if missing during build. */
const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
  ...(Object.keys(edgeEnv).length > 0 ? { env: edgeEnv } : {}),
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
