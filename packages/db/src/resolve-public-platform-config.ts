import type { PublicPlatformConfig } from "@fosl/contracts";
import { getPublicPlatformConfigFromDb } from "./platform-settings";

function overlayRuntimeAppUrls(config: PublicPlatformConfig): PublicPlatformConfig {
  const hub = process.env.NEXT_PUBLIC_HUB_URL?.trim();
  const storefront = process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim();
  const admin = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  if (!hub && !storefront && !admin) return config;

  return {
    ...config,
    appUrls: {
      hub: hub || config.appUrls.hub,
      storefront: storefront || config.appUrls.storefront,
      admin: admin || config.appUrls.admin,
    },
  };
}

export async function resolvePublicPlatformConfig(
  fallback: () => PublicPlatformConfig
): Promise<{ data: PublicPlatformConfig; source: "database" | "mock" }> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await getPublicPlatformConfigFromDb();
      if (data) {
        return { data: overlayRuntimeAppUrls(data), source: "database" };
      }
    } catch (err) {
      console.error("[platform-config] db read failed:", err);
    }
  }
  return { data: overlayRuntimeAppUrls(fallback()), source: "mock" };
}
