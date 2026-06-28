"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { StorefrontHeader } from "./storefront-header";
import { MarketplaceHeader } from "./marketplace-header";
import { CookieConsent } from "./cookie-consent";
import { ReferralAttribution } from "./referral-attribution";
import { ReferralCartBootstrap } from "./referral-cart-bootstrap";
import { ShopAuthReturn } from "./shop-auth-return";
import { FosloneFooter } from "./foslone-footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "./cart-drawer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SubscriptionBanner } from "./subscription-banner";
import { ChunkRecovery } from "./chunk-recovery";
import { MswInit } from "./msw-init";
import { PlatformUrlsProvider } from "@/lib/platform-urls-context";
import { StorefrontPathProvider } from "@/lib/storefront-path-context";
import { usePlatformConfig } from "@/lib/use-platform-config";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/marketplace");
  const { config, loading } = usePlatformConfig();

  const subscriptionState =
    config?.storefront.subscriptionState ??
    (process.env.NEXT_PUBLIC_STOREFRONT_SUBSCRIPTION_STATE as
      | "active"
      | "grace_period"
      | "suspended"
      | undefined);

  return (
    <PlatformUrlsProvider config={config}>
      <CartProvider mode={isMarketplace ? "marketplace" : "storefront"}>
      <StorefrontPathProvider>
      <ChunkRecovery />
      <MswInit apiMockingEnabled={loading ? null : config?.apiMocking.enabled} />
      <div className="flex min-h-screen flex-col pb-16 md:pb-0">
        <SubscriptionBanner state={subscriptionState} />
        {isMarketplace ? <MarketplaceHeader /> : <StorefrontHeader />}
        <main className="flex-1">{children}</main>
        <FosloneFooter />
        <MobileBottomNav />
        <CartDrawer />
        <CookieConsent />
        <Suspense fallback={null}>
          <ReferralAttribution />
          <ReferralCartBootstrap />
          <ShopAuthReturn />
        </Suspense>
      </div>
      </StorefrontPathProvider>
    </CartProvider>
    </PlatformUrlsProvider>
  );
}
