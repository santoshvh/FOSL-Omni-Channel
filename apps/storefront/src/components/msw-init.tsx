"use client";

import { useEffect, useState } from "react";
import { isBrowserApiMockingEnabled } from "@fosl/mocks/api-mocking";

type MswInitProps = {
  /** `null` while platform config is loading — MSW waits before starting. */
  apiMockingEnabled?: boolean | null;
};

function resolveApiMockingEnabled(apiMockingEnabled?: boolean | null) {
  if (process.env.NODE_ENV === "production") return false;
  if (apiMockingEnabled === null || apiMockingEnabled === undefined) {
    if (apiMockingEnabled === null) return null;
    return isBrowserApiMockingEnabled();
  }
  return apiMockingEnabled;
}

export function MswInit({ apiMockingEnabled }: MswInitProps) {
  const mockingEnabled = resolveApiMockingEnabled(apiMockingEnabled);
  const [ready, setReady] = useState(mockingEnabled !== true);

  useEffect(() => {
    if (mockingEnabled === null) return;
    if (!mockingEnabled) {
      setReady(true);
      return;
    }
    import("@fosl/mocks/msw/browser")
      .then(({ startMswBrowser }) => startMswBrowser())
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, [mockingEnabled]);

  if (!ready) return null;
  return null;
}
