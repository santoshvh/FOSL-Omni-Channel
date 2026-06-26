"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import type { Product } from "@fosl/contracts";
import { ProductDetail } from "@/components/product-detail";
import { useCart } from "@/lib/cart-context";

export default function OperatorStoreProductPage({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const [storefrontPath, setStorefrontPath] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const { registerCatalogProducts } = useCart();

  useEffect(() => {
    void params.then((p) => {
      setStorefrontPath(p.store);
      setProductId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!storefrontPath || !productId) return;

    let cancelled = false;
    fetch(
      `/api/v1/products/${productId}?scope=operator&storefrontPath=${encodeURIComponent(storefrontPath)}`
    )
      .then((res) => {
        if (res.status === 404) {
          setMissing(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load product");
        return res.json() as Promise<{ data: Product }>;
      })
      .then((json) => {
        if (cancelled || !json) return;
        setProduct(json.data);
        registerCatalogProducts([json.data]);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [storefrontPath, productId, registerCatalogProducts]);

  if (missing) notFound();

  if (loading || !product || !storefrontPath) {
    return <div className="ecom-container py-12 text-slate-500">Loading product…</div>;
  }

  return (
    <ProductDetail
      product={product}
      catalogBasePath={`/${storefrontPath}/products`}
      homeHref={`/${storefrontPath}`}
    />
  );
}
