"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@fosl/ui";
import { legalPageHref } from "@/lib/legal";
import { ATTRIBUTION_CONSENT_KEY, ATTRIBUTION_CONSENT_UPDATED_EVENT } from "@/lib/attribution";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(ATTRIBUTION_CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function save(prefs: { analytics: boolean; marketing: boolean }) {
    localStorage.setItem(ATTRIBUTION_CONSENT_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event(ATTRIBUTION_CONSENT_UPDATED_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] border-t border-slate-200 bg-white p-4 shadow-lg sm:p-6"
      role="dialog"
      aria-labelledby="cookie-title"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="cookie-title" className="font-semibold">
            Cookie preferences
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            We use necessary cookies for checkout and security. Analytics and marketing are
            optional (domain-scoped, GDPR-compliant).{" "}
            <Link href={legalPageHref("cookies")} className="font-medium text-ink underline">
              Cookie Policy
            </Link>
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2 text-slate-500">
              <input type="checkbox" checked disabled />
              Necessary (required)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              Analytics
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              Marketing
            </label>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => save({ analytics: false, marketing: false })}>
            Necessary only
          </Button>
          <Button size="sm" onClick={() => save({ analytics, marketing })}>
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
