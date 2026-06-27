import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { loadProductById, loadVendorStore } from "@/lib/catalog-loader";
import { categorySlugFromName } from "@fosl/db";

export default async function MarketplaceProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await loadProductById(id, "network");
  if (!product) notFound();

  const store = await loadVendorStore(product.vendorId);
  const moreFromVendor = (store?.products ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 3);
  const vendor = store?.vendor;
  const categorySlug = categorySlugFromName(product.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/marketplace" className="hover:text-primary-dark">
          Marketplace
        </Link>
        {" / "}
        <Link href={`/marketplace/category/${categorySlug}`} className="hover:text-primary-dark">
          {product.category}
        </Link>
        {" / "}
        <span className="text-slate-900">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" sizes="50vw" />
        </div>

        <div>
          <ProductTypeBadge type={product.type} />
          <h1 className="mt-3 text-3xl font-bold">{product.title}</h1>

          {vendor && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              {vendor.logoUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={vendor.logoUrl} alt="" fill className="object-cover" sizes="40px" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-500">Sold by</p>
                <Link
                  href={`/${vendor.slug}`}
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {vendor.name}
                </Link>
                <p className="text-xs text-slate-500">
                  <Link
                    href={`/marketplace/vendors/${vendor.id}`}
                    className="text-slate-400 hover:text-slate-600 hover:underline"
                  >
                    marketplace profile
                  </Link>
                </p>
              </div>
            </div>
          )}

          <p className="mt-6 text-3xl font-bold">
            {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Free consultation"}
          </p>
          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id}>Add to marketplace cart</AddToCartButton>
            <CreatorEarnButton
              productId={product.id}
              productTitle={product.title}
              variant="outline"
              className="h-11 px-8"
            />
          </div>
        </div>
      </div>

      {moreFromVendor.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">More from {product.vendorName}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {moreFromVendor.map((p) => (
              <MarketplaceProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
