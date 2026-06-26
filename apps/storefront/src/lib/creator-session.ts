import type { PlatformUrls } from "@/lib/platform-urls";
import { resolvePlatformUrls } from "@/lib/platform-urls";

const CREATOR_SIGNED_IN_KEY = "fosl_creator_signed_in";
const CREATOR_REFERRAL_CODE_KEY = "fosl_creator_referral_code";

export function isCreatorSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CREATOR_SIGNED_IN_KEY) === "1";
}

export function getCreatorReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CREATOR_REFERRAL_CODE_KEY);
}

/** Demo default after hub return — production uses creator profile referral code from hub session. */
export function markCreatorSignedIn(referralCode = "ALEX2026"): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CREATOR_SIGNED_IN_KEY, "1");
  sessionStorage.setItem(CREATOR_REFERRAL_CODE_KEY, referralCode);
}

export function buildCreatorReturnUrl(): string {
  if (typeof window === "undefined") return "/";
  const url = new URL(window.location.href);
  url.searchParams.set("creator", "1");
  return url.toString();
}

export function hubSignInUrlForCreator(urls?: PlatformUrls): string {
  const { hubLoginUrl } = urls ?? resolvePlatformUrls();
  const callback = encodeURIComponent(buildCreatorReturnUrl());
  return `${hubLoginUrl}?callbackUrl=${callback}`;
}

export function hubRegisterUrlForCreator(urls?: PlatformUrls): string {
  const { hubRegisterUrl } = urls ?? resolvePlatformUrls();
  const callback = encodeURIComponent(buildCreatorReturnUrl());
  return `${hubRegisterUrl}?callbackUrl=${callback}`;
}
