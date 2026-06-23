"use client";

import { useEffect, useState } from "react";

export function MswInit() {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    import("@fosl/mocks/msw/browser")
      .then(({ startMswBrowser }) => startMswBrowser())
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  if (!ready) return null;
  return null;
}
