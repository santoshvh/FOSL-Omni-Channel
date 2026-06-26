import type { NextConfig } from "next";

const shopInternal =
  process.env.STOREFRONT_INTERNAL_ORIGIN?.trim() ?? "http://127.0.0.1:1629";

const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/commerce-api", "@fosl/db", "@fosl/contracts", "@fosl/mocks"],
  async rewrites() {
    return [
      { source: "/api/v1/products", destination: `${shopInternal}/api/v1/products` },
      { source: "/api/v1/products/:path*", destination: `${shopInternal}/api/v1/products/:path*` },
      { source: "/api/v1/storefront/:path*", destination: `${shopInternal}/api/v1/storefront/:path*` },
      { source: "/api/v1/storefronts/:path*", destination: `${shopInternal}/api/v1/storefronts/:path*` },
      { source: "/api/v1/checkout/:path*", destination: `${shopInternal}/api/v1/checkout/:path*` },
      { source: "/api/v1/orders/:path*", destination: `${shopInternal}/api/v1/orders/:path*` },
      { source: "/api/v1/creator-links", destination: `${shopInternal}/api/v1/creator-links` },
      { source: "/api/v1/referral/:path*", destination: `${shopInternal}/api/v1/referral/:path*` },
      { source: "/api/v1/platform-config", destination: `${shopInternal}/api/v1/platform-config` },
      { source: "/api/webhooks/:path*", destination: `${shopInternal}/api/webhooks/:path*` },
    ];
  },
};

export default nextConfig;
