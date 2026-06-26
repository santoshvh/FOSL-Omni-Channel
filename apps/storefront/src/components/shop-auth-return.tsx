"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { markShopAuthenticated, type ShopAuthIntent } from "@/lib/shop-auth";

/** After Hub sign-in, `?fosl_auth=1&role=…` marks shop session (creator flows on storefront). */
export function ShopAuthReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("fosl_auth") !== "1") return;

    const role = (searchParams.get("role") ?? "creator") as ShopAuthIntent;
    const referralCode = searchParams.get("referralCode") ?? "ALEX2026";
    markShopAuthenticated(role, referralCode);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("fosl_auth");
    next.delete("role");
    next.delete("referralCode");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
