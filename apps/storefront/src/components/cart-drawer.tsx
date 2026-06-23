"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button, formatCurrency } from "@fosl/ui";
import { CartLineItem } from "@/components/cart-line-item";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    subtotalCents,
    cartHref,
    checkoutHref,
    mode,
    setQuantity,
    removeItem,
    saveForLater,
    maxQuantity,
  } = useCart();

  if (!isOpen) return null;

  const productBase = mode === "marketplace" ? "/marketplace/products" : "/products";

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-md p-2 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-slate-100 px-4">
          {lines.length === 0 ? (
            <li className="py-8 text-center text-sm text-slate-500">Your cart is empty.</li>
          ) : (
            lines.map((line) => (
              <CartLineItem
                key={line.productId}
                line={line}
                layout="compact"
                maxQuantity={maxQuantity(line.product)}
                productHref={`${productBase}/${line.productId}`}
                onQuantityChange={(qty) => setQuantity(line.productId, qty)}
                onRemove={() => removeItem(line.productId)}
                onSaveForLater={() => saveForLater(line.productId)}
              />
            ))
          )}
        </ul>

        <div className="border-t border-slate-200 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotalCents)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Shipping and tax at checkout</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild className="w-full" disabled={lines.length === 0} onClick={closeCart}>
              <Link href={checkoutHref}>Checkout</Link>
            </Button>
            <Button variant="outline" asChild className="w-full" onClick={closeCart}>
              <Link href={cartHref}>View full cart</Link>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
