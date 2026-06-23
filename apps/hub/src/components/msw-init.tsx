"use client";

import { useEffect, useState } from "react";
import { isBrowserApiMockingEnabled } from "@fosl/mocks/api-mocking";

export function MswInit() {
  const [ready, setReady] = useState(!isBrowserApiMockingEnabled());

  useEffect(() => {
    if (!isBrowserApiMockingEnabled()) return;
    import("@fosl/mocks/msw/browser")
      .then(({ startMswBrowser }) => startMswBrowser())
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  if (!ready) return null;
  return null;
}
