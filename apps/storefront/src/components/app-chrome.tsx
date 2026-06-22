"use client";

import { usePathname } from "next/navigation";
import { StorefrontHeader } from "./storefront-header";
import { MarketplaceHeader } from "./marketplace-header";
import { CookieConsent } from "./cookie-consent";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/marketplace");

  return (
    <>
      {isMarketplace ? <MarketplaceHeader /> : <StorefrontHeader />}
      <main>{children}</main>
      <CookieConsent />
    </>
  );
}
