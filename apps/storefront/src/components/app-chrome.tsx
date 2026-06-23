"use client";

import { usePathname } from "next/navigation";
import { StorefrontHeader } from "./storefront-header";
import { MarketplaceHeader } from "./marketplace-header";
import { CookieConsent } from "./cookie-consent";
import { FosloneFooter } from "./foslone-footer";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/marketplace");

  return (
    <div className="flex min-h-screen flex-col">
      {isMarketplace ? <MarketplaceHeader /> : <StorefrontHeader />}
      <main className="flex-1">{children}</main>
      <FosloneFooter />
      <CookieConsent />
    </div>
  );
}
