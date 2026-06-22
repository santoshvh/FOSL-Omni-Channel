"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CosellEarnButton } from "@/components/cosell-earn-button";

export function ProductCatalogCard({ product }: { product: Product }) {
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
        <CosellEarnButton
          productId={product.id}
          productTitle={product.title}
          variant="outline"
          className="w-full sm:w-auto"
        />
      </div>
    </article>
  );
}
