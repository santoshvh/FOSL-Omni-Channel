import Link from "next/link";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { loadMarketplaceSearch } from "@/lib/catalog-loader";

export default async function MarketplaceSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await loadMarketplaceSearch(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {q ? `Results for “${q}”` : "Search marketplace"}
      </h1>
      <p className="text-slate-600">{results.length} products found</p>

      <div className="mt-8">
        {results.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 p-12 text-center text-slate-500">
            No products match your search.{" "}
            <Link href="/marketplace" className="text-primary-dark hover:underline">
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
  );
}
