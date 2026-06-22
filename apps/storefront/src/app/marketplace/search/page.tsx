import Link from "next/link";
import { searchMarketplaceProducts } from "@fosl/mocks";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";

export default async function MarketplaceSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchMarketplaceProducts(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {q ? `Results for “${q}”` : "Search marketplace"}
      </h1>
      <p className="text-slate-600">{results.length} products found</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-lg border border-slate-200 p-4">
            <h2 className="font-semibold">Filters</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-slate-700">Product type</p>
                <label className="mt-2 flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> Physical
                </label>
                <label className="mt-1 flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> Digital
                </label>
                <label className="mt-1 flex items-center gap-2">
                  <input type="checkbox" /> Lead gen
                </label>
              </div>
              <div>
                <p className="font-medium text-slate-700">Price</p>
                <label className="mt-2 flex items-center gap-2">
                  <input type="checkbox" /> Under $50
                </label>
                <label className="mt-1 flex items-center gap-2">
                  <input type="checkbox" /> $50 – $150
                </label>
              </div>
              <div>
                <p className="font-medium text-slate-700">Vendor</p>
                <label className="mt-2 flex items-center gap-2">
                  <input type="checkbox" /> Acme Audio Co.
                </label>
                <label className="mt-1 flex items-center gap-2">
                  <input type="checkbox" /> Bright Labs
                </label>
              </div>
              <div>
                <p className="font-medium text-slate-700">Rating</p>
                <label className="mt-2 flex items-center gap-2">
                  <input type="checkbox" /> 4★ & up
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option>Relevance</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Newest</option>
            </select>
          </div>
          {results.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 p-12 text-center text-slate-500">
              No products match your search.{" "}
              <Link href="/marketplace" className="text-[#2E75B6] hover:underline">
                Browse home
              </Link>
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <MarketplaceProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
