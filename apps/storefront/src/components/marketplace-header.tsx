import Link from "next/link";
import { Store } from "lucide-react";
import { FoslLogo } from "@fosl/ui";
import { FosloneNavLinks } from "./foslone-nav";
import { CartTrigger } from "./cart-trigger";
import { ProductSearch } from "./product-search";

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">
        <Store className="mr-1 inline h-3.5 w-3.5" />
        FOSLOne Marketplace — shop across operator storefronts ·{" "}
        <Link href="/" className="underline underline-offset-2">
          Home
        </Link>
      </div>
      <div className="ecom-container flex flex-wrap items-center gap-4 py-4">
        <Link href="/marketplace" className="flex shrink-0 items-center gap-3">
          <FoslLogo height={32} />
          <span className="hidden font-display text-sm font-bold text-ink sm:inline">Marketplace</span>
        </Link>
        <div className="hidden min-w-[12rem] flex-1 md:block">
          <ProductSearch action="/marketplace/search" name="q" className="max-w-xl" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <FosloneNavLinks className="hidden lg:flex" />
          <CartTrigger />
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <ProductSearch action="/marketplace/search" name="q" />
      </div>
      <div className="hidden border-t border-slate-100 lg:block lg:hidden">
        <div className="ecom-container py-2">
          <FosloneNavLinks />
        </div>
      </div>
    </header>
  );
}
