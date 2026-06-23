"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { ProductCardActions } from "@/components/product-card-actions";

export function ProductCatalogCard({
  product,
  layout = "list",
}: {
  product: Product;
  layout?: "grid" | "list";
}) {
  const productHref = `/products/${product.id}`;

  if (layout === "grid") {
    return (
      <article className="ecom-card group flex flex-col">
        <Link href={productHref} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {product.inventory === 0 && product.type === "physical" && (
              <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
                Sold out
              </span>
            )}
          </div>
          <div className="p-4">
            <ProductTypeBadge type={product.type} />
            <h3 className="mt-2 font-semibold leading-snug text-ink line-clamp-2 group-hover:underline">
              {product.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{product.vendorName}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-lg font-bold text-ink">
                {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Request info"}
              </p>
              {product.rating != null && (
                <span className="text-xs text-amber-500">★ {product.rating}</span>
              )}
            </div>
          </div>
        </Link>
        <ProductCardActions product={product} productHref={productHref} />
      </article>
    );
  }

  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:shadow-soft sm:flex-row sm:gap-4">
      <Link href={productHref} className="flex min-w-0 flex-1 gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-50">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <ProductTypeBadge type={product.type} />
          <h3 className="mt-1 font-semibold text-ink">{product.title}</h3>
          <p className="text-sm text-slate-500">{product.vendorName}</p>
          <p className="mt-2 text-lg font-bold text-ink">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Request info"}
          </p>
        </div>
      </Link>
      <div className="mt-3 w-full shrink-0 sm:mt-0 sm:w-52">
        <ProductCardActions product={product} productHref={productHref} />
      </div>
    </article>
  );
}
