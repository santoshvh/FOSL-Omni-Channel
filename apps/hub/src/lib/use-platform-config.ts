"use client";

import { useEffect, useState } from "react";
import type { PublicPlatformConfig } from "@fosl/contracts";

type PlatformConfigResponse = {
  data?: PublicPlatformConfig;
  source?: string;
};

export function usePlatformConfig() {
  const [config, setConfig] = useState<PublicPlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/v1/platform-config");
        const json = (await res.json()) as PlatformConfigResponse;
        if (!cancelled && json.data) setConfig(json.data);
      } catch {
        // keep null — components fall back to env defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading };
}
