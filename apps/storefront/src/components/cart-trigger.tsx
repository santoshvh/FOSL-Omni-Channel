"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartTrigger() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative rounded-xl p-2.5 text-ink transition hover:bg-primary-muted"
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </button>
  );
}
