"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@fosl/mocks";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { EmptyState } from "@fosl/ui";
import { Button } from "@fosl/ui";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";

const vendors = [...new Set(products.map((p) => p.vendorName))];

export function ProductsListing() {
  const searchParams = useSearchParams();
  const vendorFromUrl = searchParams.get("vendor");
  const vendorNameFromUrl = vendorFromUrl
    ? products.find((p) => p.vendorId === vendorFromUrl)?.vendorName
    : null;

  const [typeFilter, setTypeFilter] = useState<string[]>(["physical", "digital", "lead_gen"]);
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    if (vendorNameFromUrl) setVendorFilter(vendorNameFromUrl);
  }, [vendorNameFromUrl]);

  let filtered = products.filter((p) => typeFilter.includes(p.type));
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
                <label key={t} className="mt-2 flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={typeFilter.includes(t)}
                    onChange={() => toggleType(t)}
                  />
                  {t.replace("_", " ")}
                </label>
              ))}
            </div>
            <div>
              <p className="font-medium text-slate-700">Vendor</p>
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1.5"
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
              />
              In stock only
            </label>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">All products</h1>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm"
              >
                <option value="featured">Sort: Featured</option>
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

          {filtered.length === 0 ? (
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
