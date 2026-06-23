import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { ProductCardActions } from "@/components/product-card-actions";

export function MarketplaceProductCard({ product }: { product: Product }) {
  const productHref = `/marketplace/products/${product.id}`;

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
        </div>
        <div className="p-4">
          <ProductTypeBadge type={product.type} />
          <h3 className="mt-2 font-semibold leading-snug text-ink line-clamp-2 group-hover:underline">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500">Sold by {product.vendorName}</p>
          <p className="mt-2 text-lg font-bold text-ink">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Free consultation"}
          </p>
        </div>
      </Link>
      <ProductCardActions product={product} productHref={productHref} />
    </article>
  );
}
