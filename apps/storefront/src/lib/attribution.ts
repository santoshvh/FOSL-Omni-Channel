export const ATTRIBUTION_COOKIE = "fosl_creator_ref";
export const ATTRIBUTION_CONSENT_KEY = "fosl_cookie_consent";
export const ATTRIBUTION_CONSENT_UPDATED_EVENT = "fosl:cookie-consent-updated";
export const PENDING_ATTRIBUTION_KEY = "fosl_ref_pending";
export const DEFAULT_ATTRIBUTION_DAYS = 30;

export type AttributionPayload = {
  slug: string;
  productId?: string;
  ts: number;
};

export function parseAttributionCookieValue(value: string): AttributionPayload | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as AttributionPayload;
    if (typeof parsed.slug !== "string" || typeof parsed.ts !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function serializeAttributionCookie(payload: AttributionPayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}

export function isAttributionValid(payload: AttributionPayload, cookieDays: number): boolean {
  const maxAgeMs = cookieDays * 24 * 60 * 60 * 1000;
  return Date.now() - payload.ts <= maxAgeMs;
}

export function setAttributionCookie(payload: AttributionPayload, cookieDays = DEFAULT_ATTRIBUTION_DAYS) {
  if (typeof document === "undefined") return;
  const value = serializeAttributionCookie(payload);
  const maxAge = cookieDays * 24 * 60 * 60;
  document.cookie = `${ATTRIBUTION_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function storePendingAttribution(payload: AttributionPayload) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PENDING_ATTRIBUTION_KEY, serializeAttributionCookie(payload));
}

export function readPendingAttribution(): AttributionPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_ATTRIBUTION_KEY);
  if (!raw) return null;
  return parseAttributionCookieValue(raw);
}

export function clearPendingAttribution() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_ATTRIBUTION_KEY);
}

/** Set attribution cookie when marketing consent is granted; otherwise queue for later. */
export function applyAttributionIfConsented(payload: AttributionPayload) {
  if (!hasMarketingConsent()) {
    storePendingAttribution(payload);
    return;
  }
  setAttributionCookie(payload);
  clearPendingAttribution();
}

export function flushPendingAttribution() {
  if (!hasMarketingConsent()) return;
  const pending = readPendingAttribution();
  if (!pending) return;
  setAttributionCookie(pending);
  clearPendingAttribution();
}

export function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ATTRIBUTION_CONSENT_KEY);
    if (!raw) return false;
    const prefs = JSON.parse(raw) as { marketing?: boolean };
    return prefs.marketing === true;
  } catch {
    return false;
  }
}
