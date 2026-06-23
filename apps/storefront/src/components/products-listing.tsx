"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@fosl/contracts";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { ProductCatalogSkeleton } from "@/components/product-catalog-skeleton";
import { EmptyState } from "@fosl/ui";
import { Button } from "@fosl/ui";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";

export function ProductsListing() {
  const searchParams = useSearchParams();
  const vendorFromUrl = searchParams.get("vendor");
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const vendorNameFromUrl = vendorFromUrl
    ? catalog.find((p) => p.vendorId === vendorFromUrl)?.vendorName
    : null;

  const [typeFilter, setTypeFilter] = useState<string[]>(["physical", "digital", "lead_gen"]);
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch("/api/v1/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products.");
        return res.json() as Promise<{ data: Product[] }>;
      })
      .then((json) => {
        if (!cancelled) setCatalog(json.data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (vendorNameFromUrl) setVendorFilter(vendorNameFromUrl);
  }, [vendorNameFromUrl]);

  const vendors = [...new Set(catalog.map((p) => p.vendorName))];

  let filtered = catalog.filter((p) => typeFilter.includes(p.type));
  if (vendorFilter !== "all") filtered = filtered.filter((p) => p.vendorName === vendorFilter);
  if (inStockOnly) filtered = filtered.filter((p) => p.inventory > 0 || p.type !== "physical");

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.priceCents - b.priceCents);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.priceCents - a.priceCents);

  function toggleType(t: string) {
    setTypeFilter((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="font-semibold">Filters</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium text-slate-700">Product type</p>
              {(["physical", "digital", "lead_gen"] as const).map((t) => (
                <label key={t} className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={typeFilter.includes(t)}
                    onChange={() => toggleType(t)}
                    disabled={loading}
                  />
                  {t === "lead_gen" ? "Lead gen" : t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
            <div>
              <p className="font-medium text-slate-700">Vendor</p>
              <select
                className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1.5"
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                disabled={loading}
              >
                <option value="all">All vendors</option>
                {vendors.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                disabled={loading}
              />
              In stock only
            </label>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              {loading ? "Loading products…" : `${filtered.length} products`}
            </p>
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                disabled={loading}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded p-2 ${view === "grid" ? "bg-primary-muted text-ink" : "text-slate-400"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded p-2 ${view === "list" ? "bg-primary-muted text-ink" : "text-slate-400"}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <ProductCatalogSkeleton layout={view} />
          ) : loadError ? (
            <EmptyState
              className="mt-6"
              title="Could not load products"
              description={loadError}
              action={
                <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              className="mt-6"
              title="No products match your filters"
              description="Try clearing filters or browse the marketplace."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/marketplace">Browse marketplace</Link>
                </Button>
              }
            />
          ) : (
            <div
              className={`mt-6 gap-6 ${
                view === "grid" ? "grid sm:grid-cols-2" : "flex flex-col"
              }`}
            >
              {filtered.map((p) => (
                <ProductCatalogCard key={p.id} product={p} layout={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
