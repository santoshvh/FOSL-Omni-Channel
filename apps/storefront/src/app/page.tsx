import Link from "next/link";
import Image from "next/image";
import { products } from "@fosl/mocks";
import { ProductTypeBadge, formatCurrency, Button } from "@fosl/ui";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-white px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discover products from trusted vendors
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Physical goods, digital downloads, and expert consultations — all in one storefront.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/products">Browse all products</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Featured products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-4">
                <ProductTypeBadge type={p.type} />
                <h3 className="mt-2 font-medium line-clamp-2">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.vendorName}</p>
                <p className="mt-2 font-semibold">
                  {p.priceCents > 0 ? formatCurrency(p.priceCents) : "Free consultation"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
