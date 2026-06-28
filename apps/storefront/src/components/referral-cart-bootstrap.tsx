"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const BOOTSTRAP_KEY = "fosl-ref-cart-bootstrap";

/** When landing with ?add=1, register the PDP product and add it to the marketplace cart. */
export function ReferralCartBootstrap() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { addItem, registerCatalogProducts, isHydrated } = useCart();

  useEffect(() => {
    if (!isHydrated || searchParams.get("add") !== "1") return;

    const productId = pathname.match(/\/products\/([^/]+)/)?.[1];
    if (!productId) return;

    const dedupeKey = `${BOOTSTRAP_KEY}:${productId}:${searchParams.get("ref") ?? ""}`;
    if (sessionStorage.getItem(dedupeKey)) return;

    let cancelled = false;
    fetch(`/api/v1/products/${productId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { data?: Parameters<typeof registerCatalogProducts>[0][number] } | null) => {
        if (cancelled || !json?.data) return;
        registerCatalogProducts([json.data]);
        addItem(productId, 1);
        sessionStorage.setItem(dedupeKey, "1");
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isHydrated, pathname, searchParams, addItem, registerCatalogProducts]);

  return null;
}
