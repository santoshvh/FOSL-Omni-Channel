import type { NextConfig } from "next";

const shopInternal =
  process.env.STOREFRONT_INTERNAL_ORIGIN?.trim() ?? "http://127.0.0.1:1629";

const deploymentId = process.env.NEXT_DEPLOYMENT_ID?.trim();

const nextConfig: NextConfig = {
  ...(deploymentId ? { deploymentId } : {}),
  transpilePackages: ["@fosl/commerce-api", "@fosl/db", "@fosl/contracts", "@fosl/mocks"],
  async rewrites() {
    return [
      { source: "/api/v1/products", destination: `${shopInternal}/api/v1/products` },
      { source: "/api/v1/products/:path*", destination: `${shopInternal}/api/v1/products/:path*` },
      { source: "/api/v1/shipping", destination: `${shopInternal}/api/v1/shipping` },
      { source: "/api/v1/leads", destination: `${shopInternal}/api/v1/leads` },
      { source: "/api/v1/contact", destination: `${shopInternal}/api/v1/contact` },
      { source: "/api/v1/storefront/:path*", destination: `${shopInternal}/api/v1/storefront/:path*` },
      { source: "/api/v1/storefronts/:path*", destination: `${shopInternal}/api/v1/storefronts/:path*` },
      { source: "/api/v1/checkout/:path*", destination: `${shopInternal}/api/v1/checkout/:path*` },
      { source: "/api/v1/orders", destination: `${shopInternal}/api/v1/orders` },
      { source: "/api/v1/orders/:path*", destination: `${shopInternal}/api/v1/orders/:path*` },
      { source: "/api/v1/payouts/:path*", destination: `${shopInternal}/api/v1/payouts/:path*` },
      { source: "/api/v1/creator-links", destination: `${shopInternal}/api/v1/creator-links` },
      { source: "/api/v1/creator-links/:path*", destination: `${shopInternal}/api/v1/creator-links/:path*` },
      { source: "/api/v1/referral/:path*", destination: `${shopInternal}/api/v1/referral/:path*` },
      { source: "/api/v1/platform-config", destination: `${shopInternal}/api/v1/platform-config` },
      { source: "/api/webhooks/:path*", destination: `${shopInternal}/api/webhooks/:path*` },
    ];
  },
};

export default nextConfig;
