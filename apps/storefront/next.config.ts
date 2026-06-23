import type { NextConfig } from "next";
import { loadRootEnv } from "../../scripts/load-root-env.mjs";

loadRootEnv(import.meta.url);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks", "@fosl/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
