"use client";

import { useEffect } from "react";
import type { Product } from "@fosl/contracts";
import { useCart } from "@/lib/cart-context";

/** Registers products in the client cart catalog so Add to cart works on PDPs. */
export function CatalogProductRegistrar({ products }: { products: Product[] }) {
  const { registerCatalogProducts } = useCart();

  useEffect(() => {
    if (products.length > 0) registerCatalogProducts(products);
  }, [products, registerCatalogProducts]);

  return null;
}
