import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";

export function MarketplaceProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/marketplace/products/${product.id}`} className="group block">
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
          <p className="text-sm text-slate-500">Sold by {product.vendorName}</p>
          <p className="mt-2 font-semibold">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Free consultation"}
          </p>
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
