"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ShoppingBag, Store, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@fosl/ui";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { mode, itemCount, openCart } = useCart();
  const isMarketplace = mode === "marketplace";
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/customer-login")
      .then((r) => r.json())
      .then((json: { data?: { email: string } | null }) => setSignedIn(Boolean(json.data?.email)))
      .catch(() => setSignedIn(false));
  }, [pathname]);

  const links = [
    { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    {
      href: isMarketplace ? "/marketplace" : "/products",
      label: isMarketplace ? "Market" : "Shop",
      icon: isMarketplace ? Store : ShoppingBag,
      match: (p: string) =>
        isMarketplace ? p.startsWith("/marketplace") && p !== "/marketplace/cart" : p.startsWith("/products"),
    },
    {
      href: isMarketplace ? "/marketplace/search" : "/marketplace",
      label: isMarketplace ? "Search" : "Market",
      icon: Store,
      match: (p: string) =>
        isMarketplace ? p.startsWith("/marketplace/search") : p.startsWith("/marketplace"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around">
        {links.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium",
                active ? "bg-primary-muted text-ink" : "text-slate-500"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium text-slate-500"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </span>
          Cart
        </button>
        <Link
          href="/login"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium",
            pathname === "/login" ? "bg-primary-muted text-ink" : "text-slate-500"
          )}
        >
          <User className="h-5 w-5" />
          {signedIn ? "Account" : "Login"}
        </Link>
      </div>
    </nav>
  );
}
