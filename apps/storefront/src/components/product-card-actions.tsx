"use client";

import Link from "next/link";
import type { Product } from "@fosl/contracts";
import { Button } from "@fosl/ui";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CreatorEarnButton } from "@/components/creator-earn-button";

export function ProductCardActions({
  product,
  productHref,
}: {
  product: Product;
  productHref: string;
}) {
  const soldOut = product.inventory === 0 && product.type === "physical";

  return (
    <div className="mt-auto space-y-2 border-t border-slate-100 p-3">
      <div className="grid grid-cols-2 gap-2">
        <AddToCartButton
          productId={product.id}
          size="sm"
          className="w-full"
          disabled={soldOut}
        >
          {soldOut ? "Sold out" : "Buy now"}
        </AddToCartButton>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={productHref}>View product</Link>
        </Button>
      </div>
      <CreatorEarnButton
        productId={product.id}
        productTitle={product.title}
        variant="outline"
        className="w-full"
      />
    </div>
  );
}
