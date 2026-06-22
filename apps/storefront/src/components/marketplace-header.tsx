import Link from "next/link";
import { ShoppingCart, Search, Store } from "lucide-react";
import { Input } from "@fosl/ui";

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="border-b border-blue-100 bg-blue-50 px-4 py-1.5 text-center text-xs text-blue-800">
        FOSL Marketplace — discover products across all operator storefronts ·{" "}
        <Link href="/" className="font-medium underline">
          Visit Demo Store
        </Link>
      </div>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/marketplace" className="flex items-center gap-2 text-lg font-bold text-[#2E75B6]">
          <Store className="h-5 w-5" />
          FOSL Marketplace
        </Link>
        <form action="/marketplace/search" className="hidden flex-1 sm:block">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input name="q" placeholder="Search products, vendors, categories…" className="pl-9" />
          </div>
        </form>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/marketplace/category/electronics" className="hidden text-slate-600 hover:text-slate-900 md:inline">
            Categories
          </Link>
          <Link href="/marketplace/orders" className="text-slate-600 hover:text-slate-900">
            Orders
          </Link>
          <Link href="/marketplace/cart" className="relative rounded-md p-2 hover:bg-slate-50">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E75B6] text-[10px] text-white">
              3
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
