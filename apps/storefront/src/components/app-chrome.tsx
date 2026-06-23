"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { StorefrontHeader } from "./storefront-header";
import { MarketplaceHeader } from "./marketplace-header";
import { CookieConsent } from "./cookie-consent";
import { ReferralAttribution } from "./referral-attribution";
import { FosloneFooter } from "./foslone-footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "./cart-drawer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MswInit } from "./msw-init";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/marketplace");

  return (
    <CartProvider mode={isMarketplace ? "marketplace" : "storefront"}>
      <MswInit />
      <div className="flex min-h-screen flex-col pb-16 md:pb-0">
        {isMarketplace ? <MarketplaceHeader /> : <StorefrontHeader />}
        <main className="flex-1">{children}</main>
        <FosloneFooter />
        <MobileBottomNav />
        <CartDrawer />
        <CookieConsent />
        <Suspense fallback={null}>
          <ReferralAttribution />
        </Suspense>
      </div>
    </CartProvider>
  );
}
