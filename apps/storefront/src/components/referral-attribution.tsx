"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ATTRIBUTION_CONSENT_UPDATED_EVENT,
  applyAttributionIfConsented,
  flushPendingAttribution,
} from "@/lib/attribution";

export function ReferralAttribution() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref) return;

    const productId = pathname.match(/\/products\/([^/]+)/)?.[1];

    fetch("/api/v1/referral/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: ref, productId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { data?: { slug?: string } } | null) => {
        const slug = json?.data?.slug ?? ref;
        applyAttributionIfConsented({ slug, productId, ts: Date.now() });
      })
      .catch(() => {
        applyAttributionIfConsented({ slug: ref, productId, ts: Date.now() });
      });
  }, [ref, pathname]);

  useEffect(() => {
    function onConsentUpdated() {
      flushPendingAttribution();
    }
    window.addEventListener(ATTRIBUTION_CONSENT_UPDATED_EVENT, onConsentUpdated);
    return () => window.removeEventListener(ATTRIBUTION_CONSENT_UPDATED_EVENT, onConsentUpdated);
  }, []);

  return null;
}
