import type { PublicPlatformConfig } from "@fosl/contracts";

const DEV_PLATFORM = "http://localhost:3000";
const DEV_STOREFRONT = "http://localhost:3001";
const PROD_PLATFORM = "https://hub.foslone.com";
const PROD_STOREFRONT = "https://shop.foslone.com";

function trimUrl(url: string) {
  return url.replace(/\/$/, "");
}

function defaultPlatformUrl() {
  return trimUrl(
    process.env.NEXT_PUBLIC_PLATFORM_URL?.trim() ||
      process.env.NEXT_PUBLIC_HUB_URL?.trim() ||
      (process.env.NODE_ENV === "production" ? PROD_PLATFORM : DEV_PLATFORM)
  );
}

function defaultStorefrontUrl() {
  return trimUrl(
    process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim() ||
      (process.env.NODE_ENV === "production" ? PROD_STOREFRONT : DEV_STOREFRONT)
  );
}

/** Resolve cross-app URLs from Admin settings, runtime env, or production defaults. */
export function resolvePlatformUrls(config?: PublicPlatformConfig | null) {
  const platformUrl = trimUrl(config?.appUrls?.hub?.trim() || defaultPlatformUrl());
  const storefrontUrl = trimUrl(
    config?.appUrls?.storefront?.trim() || defaultStorefrontUrl()
  );
  const adminUrl = trimUrl(
    config?.appUrls?.admin?.trim() || `${platformUrl}/admin`
  );

  return {
    platformUrl,
    hubUrl: platformUrl,
    storefrontUrl,
    adminUrl,
    hubLoginUrl: `${platformUrl}/auth/sign-in`,
    hubRegisterUrl: `${platformUrl}/auth/register`,
    hubVendorUrl: `${platformUrl}/vendor`,
    hubCreatorUrl: `${platformUrl}/creator`,
    platformAdminUrl: adminUrl,
  };
}

export type PlatformUrls = ReturnType<typeof resolvePlatformUrls>;
