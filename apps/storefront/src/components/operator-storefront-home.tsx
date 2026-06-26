"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { ProductCatalogSkeleton } from "@/components/product-catalog-skeleton";
import { ProductCardActions } from "@/components/product-card-actions";
import { useCart } from "@/lib/cart-context";

type OperatorStorefrontHomeProps = {
  storefrontPath: string;
  name: string;
  operatorName: string;
};

export function OperatorStorefrontHome({
  storefrontPath,
  name,
  operatorName,
}: OperatorStorefrontHomeProps) {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-dark to-ink px-4 py-14 text-primary-foreground">
        <div className="ecom-container">
          <p className="text-sm font-medium text-primary-foreground/80">{operatorName}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">
            Curated products from approved network vendors — shared catalog, independent storefront.
          </p>
        </div>
      </section>

      <section className="ecom-container py-10">
        <OperatorScopedListing storefrontPath={storefrontPath} />
      </section>
    </div>
  );
}

function OperatorScopedListing({ storefrontPath }: { storefrontPath: string }) {
  const { registerCatalogProducts } = useCart();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/products?scope=operator&storefrontPath=${encodeURIComponent(storefrontPath)}`)
      .then((res) => res.json())
      .then((json: { data: Product[] }) => {
        if (!cancelled) {
          const items = Array.isArray(json.data) ? json.data : [];
          setCatalog(items);
          registerCatalogProducts(items);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storefrontPath, registerCatalogProducts]);

  if (loading) {
    return <ProductCatalogSkeleton layout="grid" />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Shop all products</h2>
      <p className="mt-1 text-sm text-slate-600">{catalog.length} products from shared vendors</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.map((p) => (
          <OperatorProductCard key={p.id} product={p} storefrontPath={storefrontPath} />
        ))}
      </div>
    </div>
  );
}

function OperatorProductCard({
  product,
  storefrontPath,
}: {
  product: Product;
  storefrontPath: string;
}) {
  const productHref = `/${storefrontPath}/products/${product.id}`;

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
