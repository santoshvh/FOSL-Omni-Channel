"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  DEFAULT_ATTRIBUTION_DAYS,
  hasMarketingConsent,
  setAttributionCookie,
} from "@/lib/attribution";

export function ReferralAttribution() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref || !hasMarketingConsent()) return;

    const productId = pathname.match(/\/products\/([^/]+)/)?.[1];

    fetch("/api/v1/referral/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: ref, productId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { data?: { slug?: string } } | null) => {
        const slug = json?.data?.slug ?? ref;
        setAttributionCookie(
          { slug, productId, ts: Date.now() },
          DEFAULT_ATTRIBUTION_DAYS
        );
      })
      .catch(() => {
        setAttributionCookie(
          { slug: ref, productId, ts: Date.now() },
          DEFAULT_ATTRIBUTION_DAYS
        );
      });
  }, [ref, pathname]);

  return null;
}
