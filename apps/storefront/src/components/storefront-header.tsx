import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@fosl/ui";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="text-lg font-bold text-[#2E75B6]">
          Demo Store
        </Link>
        <div className="hidden flex-1 sm:block">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search products…" className="pl-9" />
          </div>
        </div>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/marketplace" className="text-slate-600 hover:text-slate-900">
            Marketplace
          </Link>
          <Link href="/products" className="text-slate-600 hover:text-slate-900">
            Shop
          </Link>
          <Link href="/orders" className="text-slate-600 hover:text-slate-900">
            Orders
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-slate-50 rounded-md">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E75B6] text-[10px] text-white">
              2
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
