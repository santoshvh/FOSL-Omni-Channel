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
    setAttributionCookie(
      { slug: ref, productId, ts: Date.now() },
      DEFAULT_ATTRIBUTION_DAYS
    );

    fetch("/api/v1/referral/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: ref, productId }),
    }).catch(() => undefined);
  }, [ref, pathname]);

  return null;
}
