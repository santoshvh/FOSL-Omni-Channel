import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@fosl/ui";
import { FosloneNavLinks } from "./foslone-nav";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="border-b border-blue-100 bg-blue-50 px-4 py-1 text-center text-xs text-blue-900">
        FOSLOne — Incubated by AIOne · Social eCommerce for communities
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-bold text-[#2E75B6]">
          FOSLOne
        </Link>
        <div className="hidden min-w-[12rem] flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search products…" className="pl-9" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <FosloneNavLinks className="hidden lg:flex" />
          <Link href="/products" className="text-sm text-slate-600 hover:text-slate-900 lg:hidden">
            Shop
          </Link>
          <Link href="/cart" className="relative rounded-md p-2 hover:bg-slate-50">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E75B6] text-[10px] text-white">
              2
            </span>
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 lg:hidden">
        <FosloneNavLinks />
      </div>
    </header>
  );
}
