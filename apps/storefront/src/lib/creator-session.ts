import type { PlatformUrls } from "@/lib/platform-urls";
import { resolvePlatformUrls } from "@/lib/platform-urls";

const CREATOR_SIGNED_IN_KEY = "fosl_creator_signed_in";

export function isCreatorSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CREATOR_SIGNED_IN_KEY) === "1";
}

export function markCreatorSignedIn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CREATOR_SIGNED_IN_KEY, "1");
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
