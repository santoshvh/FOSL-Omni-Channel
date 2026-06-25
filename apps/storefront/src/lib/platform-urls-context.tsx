"use client";

import { createContext, useContext, useMemo } from "react";
import type { PublicPlatformConfig } from "@fosl/contracts";
import { resolvePlatformUrls, type PlatformUrls } from "@/lib/platform-urls";

const PlatformUrlsContext = createContext<PlatformUrls | null>(null);

export function PlatformUrlsProvider({
  config,
  children,
}: {
  config?: PublicPlatformConfig | null;
  children: React.ReactNode;
}) {
  const urls = useMemo(() => resolvePlatformUrls(config), [config]);
  return (
    <PlatformUrlsContext.Provider value={urls}>{children}</PlatformUrlsContext.Provider>
  );
}

/** Runtime platform URLs — never hardcode localhost in production UI. */
export function usePlatformUrls() {
  const ctx = useContext(PlatformUrlsContext);
  return ctx ?? resolvePlatformUrls();
}
