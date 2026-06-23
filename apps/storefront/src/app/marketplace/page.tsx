import Link from "next/link";
import Image from "next/image";
import {
  products,
  marketplaceCategories,
  marketplaceVendors,
} from "@fosl/mocks";
import { Button } from "@fosl/ui";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { Search } from "lucide-react";
import { Input } from "@fosl/ui";

export default function MarketplaceHomePage() {
  const bestSellers = products.slice(0, 4);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-dark to-ink px-4 py-16 text-primary-foreground">
        <div className="ecom-container text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shop the FOSL network
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            One search across every operator storefront — physical, digital, and lead-gen products
          </p>
          <form action="/marketplace/search" className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="q"
                placeholder="Search headphones, courses, mugs…"
                className="border-0 pl-9 text-slate-900"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Browse categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketplaceCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200"
            >
              <div className="relative h-32">
                <Image src={cat.imageUrl} alt="" fill className="object-cover" sizes="300px" />
                <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-white/80">{cat.productCount} products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold">Featured vendors</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {marketplaceVendors.map((v) => (
              <Link
                key={v.id}
                href={v.storefrontUrl}
                className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative h-20 overflow-hidden rounded-md">
                  <Image src={v.bannerUrl} alt="" fill className="object-cover" sizes="400px" />
                </div>
                <h3 className="mt-3 font-semibold">{v.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{v.tagline}</p>
                <p className="mt-2 text-sm text-slate-600">
                  ★ {v.rating} · {v.productCount} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Best sellers</h2>
          <Link href="/marketplace/search" className="text-sm text-primary-dark hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <MarketplaceProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
