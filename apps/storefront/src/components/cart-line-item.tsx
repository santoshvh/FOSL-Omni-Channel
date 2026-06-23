"use client";

import Link from "next/link";
import type { CartLine } from "@/lib/cart-context";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";
import { QuantityStepper } from "@/components/quantity-stepper";

type CartLineItemProps = {
  line: CartLine;
  layout?: "compact" | "full";
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onSaveForLater?: () => void;
  onMoveToCart?: () => void;
  maxQuantity: number;
  productHref?: string;
};

export function CartLineItem({
  line,
  layout = "full",
  onQuantityChange,
  onRemove,
  onSaveForLater,
  onMoveToCart,
  maxQuantity,
  productHref,
}: CartLineItemProps) {
  const { product, quantity } = line;
  const lineTotal = product.priceCents * quantity;
  const title = productHref ? (
    <Link href={productHref} className="font-medium hover:text-primary-dark hover:underline">
      {product.title}
    </Link>
  ) : (
    <p className="font-medium line-clamp-2">{product.title}</p>
  );

  return (
    <li className={layout === "compact" ? "flex gap-3 py-4" : "flex flex-wrap items-start justify-between gap-3 py-3"}>
      <div className="min-w-0 flex-1">
        <ProductTypeBadge type={product.type} />
        <div className="mt-1">{title}</div>
        <p className="text-xs text-slate-500">{product.vendorName}</p>
        {layout === "full" && product.type === "digital" && (
          <p className="mt-1 text-xs text-purple-600">Instant delivery — no shipping</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={quantity}
            max={maxQuantity}
            onChange={onQuantityChange}
            size={layout === "compact" ? "sm" : "md"}
          />
          <span className="text-sm text-slate-500">
            {formatCurrency(product.priceCents)} each
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {onSaveForLater && (
            <button
              type="button"
              onClick={onSaveForLater}
              className="text-primary-dark hover:underline"
            >
              Save for later
            </button>
          )}
          {onMoveToCart && (
            <button
              type="button"
              onClick={onMoveToCart}
              className="text-primary-dark hover:underline"
            >
              Move to cart
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-500 hover:text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="font-semibold">{formatCurrency(lineTotal)}</p>
        <CreatorEarnButton
          productId={product.id}
          productTitle={product.title}
          variant={layout === "compact" ? "ghost" : "outline"}
          className={layout === "compact" ? "self-start" : undefined}
        />
      </div>
    </li>
  );
}
