"use client";

import { useEffect, useState } from "react";
import type { Product } from "@fosl/contracts";
import { marketplaceCategories, getProductsByCategorySlug } from "@fosl/mocks";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { ProductCatalogSkeleton } from "@/components/product-catalog-skeleton";
import { Button, EmptyState } from "@fosl/ui";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";

type MarketplaceProductListingProps = {
  title?: string;
  description?: string;
  /** When set, only show products in this category slug */
  categorySlug?: string;
};

export function MarketplaceProductListing({
  title = "All products",
  description,
  categorySlug,
}: MarketplaceProductListingProps) {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string[]>(["physical", "digital", "lead_gen"]);
  const [vendorFilter, setVendorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(categorySlug ?? "all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    if (categorySlug) setCategoryFilter(categorySlug);
  }, [categorySlug]);

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

  const vendors = [...new Set(catalog.map((p) => p.vendorName))].sort();

  let filtered = catalog.filter((p) => typeFilter.includes(p.type));
  if (vendorFilter !== "all") filtered = filtered.filter((p) => p.vendorName === vendorFilter);
  if (categoryFilter !== "all") {
    const categoryIds = new Set(getProductsByCategorySlug(categoryFilter).map((p) => p.id));
    filtered = filtered.filter((p) => categoryIds.has(p.id));
  }
  if (inStockOnly) filtered = filtered.filter((p) => p.inventory > 0 || p.type !== "physical");
  if (minRating !== null) {
    filtered = filtered.filter((p) => (p.rating ?? 0) >= minRating);
  }

  const minCents = priceMin ? Math.round(parseFloat(priceMin) * 100) : null;
  const maxCents = priceMax ? Math.round(parseFloat(priceMax) * 100) : null;
  if (minCents !== null && !Number.isNaN(minCents)) {
    filtered = filtered.filter((p) => p.priceCents >= minCents);
  }
  if (maxCents !== null && !Number.isNaN(maxCents)) {
    filtered = filtered.filter((p) => p.priceCents <= maxCents);
  }

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.priceCents - b.priceCents);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.priceCents - a.priceCents);
  if (sort === "rating") {
    filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  function toggleType(t: string) {
    setTypeFilter((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-slate-600">{description}</p>}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <h3 className="font-semibold">Filters</h3>
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

            {!categorySlug && (
              <div>
                <p className="font-medium text-slate-700">Category</p>
                <select
                  className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1.5"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All categories</option>
                  {marketplaceCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            <div>
              <p className="font-medium text-slate-700">Price (USD)</p>
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            <div>
              <p className="font-medium text-slate-700">Rating</p>
              <label className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={minRating === 4}
                  onChange={(e) => setMinRating(e.target.checked ? 4 : null)}
                  disabled={loading}
                />
                4★ &amp; up
              </label>
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
                <option value="rating">Top rated</option>
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
              description="Try clearing filters or browse categories above."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/marketplace">Reset filters</Link>
                </Button>
              }
            />
          ) : (
            <div
              className={`mt-6 gap-6 ${
                view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
              }`}
            >
              {filtered.map((p) => (
                <MarketplaceProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
