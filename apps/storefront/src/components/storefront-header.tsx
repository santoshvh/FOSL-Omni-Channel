import Link from "next/link";
import { FoslLogo } from "@fosl/ui";
import { FosloneNavLinks } from "./foslone-nav";
import { CartTrigger } from "./cart-trigger";
import { ProductSearch } from "./product-search";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white">
        <span className="text-primary">Free shipping</span> on orders over $75 · FOSLOne social eCommerce
      </div>
      <div className="ecom-container flex flex-wrap items-center gap-4 py-4">
        <Link href="/" className="shrink-0">
          <FoslLogo height={34} />
        </Link>
        <div className="hidden min-w-[12rem] flex-1 md:block">
          <ProductSearch action="/products" className="max-w-lg" />
        </div>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <FosloneNavLinks className="hidden lg:flex" />
          <Link
            href="/products"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-muted hover:text-ink lg:hidden"
          >
            Shop
          </Link>
          <Link
            href="/marketplace"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-muted hover:text-ink sm:inline"
          >
            Marketplace
          </Link>
          <CartTrigger />
        </nav>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <ProductSearch action="/products" />
      </div>
      <div className="hidden border-t border-slate-100 lg:block lg:hidden">
        <div className="ecom-container py-2">
          <FosloneNavLinks />
        </div>
      </div>
    </header>
  );
}
