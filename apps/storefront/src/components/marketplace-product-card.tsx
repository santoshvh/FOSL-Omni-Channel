import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";

export function MarketplaceProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/marketplace/products/${product.id}`}
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
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
  );
}
