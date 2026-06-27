"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShippingMethod } from "@fosl/contracts";

async function fetchShipping(vendorId: string): Promise<ShippingMethod[]> {
  const res = await fetch(`/api/v1/shipping?vendorId=${encodeURIComponent(vendorId)}`);
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: ShippingMethod[] };
  return Array.isArray(json.data) ? json.data : [];
}

export function useVendorShipping(vendorId: string | undefined): ShippingMethod[] {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);

  useEffect(() => {
    if (!vendorId) {
      setMethods([]);
      return;
    }
    let cancelled = false;
    fetchShipping(vendorId).then((data) => {
      if (!cancelled) setMethods(data);
    });
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  return methods;
}

export function useVendorsShipping(vendorIds: string[]): Record<string, ShippingMethod[]> {
  const key = useMemo(() => [...new Set(vendorIds)].sort().join(","), [vendorIds]);
  const [byVendor, setByVendor] = useState<Record<string, ShippingMethod[]>>({});

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (ids.length === 0) {
      setByVendor({});
      return;
    }
    let cancelled = false;
    Promise.all(
      ids.map(async (vendorId) => [vendorId, await fetchShipping(vendorId)] as const)
    ).then((entries) => {
      if (!cancelled) setByVendor(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return byVendor;
}
