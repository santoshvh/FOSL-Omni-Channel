import Link from "next/link";
import Image from "next/image";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";

export function ProductMiniCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative aspect-square bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
        <div className="p-3">
          <ProductTypeBadge type={product.type} />
          <h3 className="mt-1 line-clamp-2 text-sm font-medium group-hover:text-[#2E75B6]">
            {product.title}
          </h3>
          <p className="mt-1 text-sm font-semibold">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Free"}
          </p>
        </div>
      </Link>
      <div className="border-t border-slate-100 p-2">
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

export function ProductGridSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductMiniCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
