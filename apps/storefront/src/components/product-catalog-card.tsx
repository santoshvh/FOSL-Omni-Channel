"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";

export function ProductCatalogCard({
  product,
  layout = "list",
}: {
  product: Product;
  layout?: "grid" | "list";
}) {
  if (layout === "grid") {
    return (
      <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <Link href={`/products/${product.id}`} className="group block">
          <div className="relative aspect-square bg-slate-100">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="p-4">
            <ProductTypeBadge type={product.type} />
            <h3 className="mt-2 font-medium line-clamp-2">{product.title}</h3>
            <p className="text-sm text-slate-500">{product.vendorName}</p>
            <p className="mt-2 font-semibold">
              {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Request info"}
            </p>
            {product.type === "physical" && (
              <p className="mt-1 text-xs text-slate-400">
                {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
              </p>
            )}
          </div>
        </Link>
        <div className="mt-auto border-t border-slate-100 p-3">
          <CreatorEarnButton
            productId={product.id}
            productTitle={product.title}
            variant="outline"
            className="w-full"
          />
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:gap-4">
      <Link href={`/products/${product.id}`} className="flex min-w-0 flex-1 gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <ProductTypeBadge type={product.type} />
          <h3 className="mt-1 font-medium">{product.title}</h3>
          <p className="text-sm text-slate-500">{product.vendorName}</p>
          <p className="mt-1 font-semibold">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Request info"}
          </p>
        </div>
      </Link>
      <div className="mt-3 flex shrink-0 items-end sm:mt-0 sm:flex-col sm:justify-end">
        <CreatorEarnButton
          productId={product.id}
          productTitle={product.title}
          variant="outline"
          className="w-full sm:w-auto"
        />
      </div>
    </article>
  );
}
