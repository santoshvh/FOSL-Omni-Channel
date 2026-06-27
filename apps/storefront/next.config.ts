import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

const deploymentId = process.env.NEXT_DEPLOYMENT_ID?.trim();

const nextConfig: NextConfig = {
  ...(deploymentId ? { deploymentId } : {}),
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
