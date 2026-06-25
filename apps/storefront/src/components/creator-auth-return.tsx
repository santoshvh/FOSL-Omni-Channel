"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { markCreatorSignedIn } from "@/lib/creator-session";

/** After Hub sign-in, `?creator=1` marks the user as signed in for referral flows. */
export function CreatorAuthReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("creator") !== "1") return;

    markCreatorSignedIn();

    const next = new URLSearchParams(searchParams.toString());
    next.delete("creator");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
