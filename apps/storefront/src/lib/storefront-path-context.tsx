"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

/** Top-level routes that are not operator storefront paths. */
const RESERVED_STOREFRONT_SEGMENTS = new Set([
  "marketplace",
  "products",
  "cart",
  "checkout",
  "orders",
  "legal",
  "contact",
  "incubations",
  "creator-support",
  "coseller-support",
  "suspended",
  "api",
  "_next",
]);

export function resolveStorefrontPathFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first || RESERVED_STOREFRONT_SEGMENTS.has(first)) return null;
  return first;
}

type StorefrontPathContextValue = {
  /** Operator storefront path from URL (e.g. `demo`), or null on marketplace/default routes. */
  storefrontPath: string | null;
  /** Product PDP base path including storefront when scoped. */
  productBasePath: string;
};

const StorefrontPathContext = createContext<StorefrontPathContextValue>({
  storefrontPath: null,
  productBasePath: "/products",
});

export function StorefrontPathProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const storefrontPath = useMemo(() => resolveStorefrontPathFromPathname(pathname), [pathname]);

  const value = useMemo(
    () => ({
      storefrontPath,
      productBasePath: storefrontPath ? `/${storefrontPath}/products` : "/products",
    }),
    [storefrontPath]
  );

  return (
    <StorefrontPathContext.Provider value={value}>{children}</StorefrontPathContext.Provider>
  );
}

export function useStorefrontPath() {
  return useContext(StorefrontPathContext);
}

export function productHref(productId: string, basePath: string) {
  return `${basePath}/${productId}`;
}
