import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fosl/ui", "@fosl/contracts", "@fosl/mocks"],
};

export default nextConfig;
