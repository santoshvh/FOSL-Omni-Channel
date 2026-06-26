import type { PlatformUrls } from "@/lib/platform-urls";
import { resolvePlatformUrls } from "@/lib/platform-urls";

export type ShopAuthIntent = "creator" | "operator" | "vendor" | "admin" | "account";

const AUTH_SIGNED_IN_KEY = "fosl_shop_auth";
const CREATOR_REFERRAL_CODE_KEY = "fosl_creator_referral_code";

export function buildShopReturnUrl(intent: ShopAuthIntent): string {
  if (typeof window === "undefined") return "/";
  const url = new URL(window.location.href);
  url.searchParams.set("fosl_auth", "1");
  url.searchParams.set("role", intent);
  return url.toString();
}

export function hubSignInUrl(intent: ShopAuthIntent, urls?: PlatformUrls): string {
  const { hubLoginUrl, hubUrl, platformUrl } = urls ?? resolvePlatformUrls();
  const hub = hubUrl ?? platformUrl;

  if (intent === "operator") {
    const callback = encodeURIComponent(`${hub}/operator`);
    return `${hubLoginUrl}?callbackUrl=${callback}&intent=operator`;
  }
  if (intent === "vendor") {
    const callback = encodeURIComponent(`${hub}/vendor`);
    return `${hubLoginUrl}?callbackUrl=${callback}&intent=vendor`;
  }
  if (intent === "admin") {
    const callback = encodeURIComponent(`${hub}/admin`);
    return `${hubLoginUrl}?callbackUrl=${callback}&intent=admin`;
  }

  const callback = encodeURIComponent(buildShopReturnUrl(intent));
  return `${hubLoginUrl}?callbackUrl=${callback}&intent=${intent}`;
}

export function hubRegisterUrlForCreator(urls?: PlatformUrls) {
  const { hubRegisterUrl } = urls ?? resolvePlatformUrls();
  const callback = encodeURIComponent(buildShopReturnUrl("creator"));
  return `${hubRegisterUrl}?callbackUrl=${callback}&intent=creator`;
}

export function isShopAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_SIGNED_IN_KEY) === "1";
}

export function getShopAuthRole(): ShopAuthIntent | null {
  if (typeof window === "undefined") return null;
  const role = sessionStorage.getItem("fosl_shop_auth_role");
  if (role === "creator" || role === "operator" || role === "vendor" || role === "admin" || role === "account") {
    return role;
  }
  return null;
}

export function markShopAuthenticated(role: ShopAuthIntent, referralCode = "ALEX2026"): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_SIGNED_IN_KEY, "1");
  sessionStorage.setItem("fosl_shop_auth_role", role);
  if (role === "creator") {
    sessionStorage.setItem(CREATOR_REFERRAL_CODE_KEY, referralCode);
  }
}

export function isCreatorSignedIn(): boolean {
  return getShopAuthRole() === "creator" && isShopAuthenticated();
}

export function getCreatorReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CREATOR_REFERRAL_CODE_KEY);
}

/** @deprecated use hubSignInUrl('creator') */
export function hubSignInUrlForCreator(urls?: PlatformUrls) {
  return hubSignInUrl("creator", urls);
}

/** @deprecated use buildShopReturnUrl('creator') */
export function buildCreatorReturnUrl() {
  return buildShopReturnUrl("creator");
}

/** @deprecated use markShopAuthenticated('creator') */
export function markCreatorSignedIn(referralCode = "ALEX2026") {
  markShopAuthenticated("creator", referralCode);
}
