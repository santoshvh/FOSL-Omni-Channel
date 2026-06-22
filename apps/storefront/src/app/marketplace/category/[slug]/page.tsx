import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getMarketplaceCategoryBySlug,
  getProductsByCategorySlug,
  marketplaceCategories,
} from "@fosl/mocks";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getMarketplaceCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategorySlug(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/marketplace" className="hover:text-[#2E75B6]">
          Marketplace
        </Link>
        {" / "}
        <span className="text-slate-900">{category.name}</span>
      </nav>

      <div className="relative mb-8 h-40 overflow-hidden rounded-lg">
        <Image src={category.imageUrl} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-white/80">{products.length} products available</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <h2 className="font-semibold">Categories</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {marketplaceCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/marketplace/category/${c.slug}`}
                  className={
                    c.slug === slug
                      ? "font-medium text-[#2E75B6]"
                      : "text-slate-600 hover:text-slate-900"
                  }
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <p className="text-slate-500">No products in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <MarketplaceProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
