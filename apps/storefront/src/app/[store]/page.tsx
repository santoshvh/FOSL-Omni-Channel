import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMarketplaceVendorBySlug, getProductsByVendorId } from "@fosl/mocks";
import { ProductCatalogCard } from "@/components/product-catalog-card";

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;
  const vendor = getMarketplaceVendorBySlug(store);
  if (!vendor) notFound();

  const products = getProductsByVendorId(vendor.id);

  return (
    <div>
      <div className="relative h-48 bg-slate-200 sm:h-64">
        <Image src={vendor.bannerUrl} alt="" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-14">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
            <Image src={vendor.logoUrl} alt="" fill className="object-cover" sizes="96px" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{vendor.name}</h1>
            <p className="text-white/90 drop-shadow">{vendor.tagline}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
          <span>
            ★ {vendor.rating} ({vendor.reviewCount} reviews)
          </span>
          <span>{products.length} products</span>
          <span>{vendor.followers.toLocaleString()} followers</span>
          <span>Listed on {vendor.operatorName}</span>
          <Link
            href={`/marketplace/vendors/${vendor.id}`}
            className="text-slate-400 hover:text-slate-600 hover:underline"
          >
            marketplace profile
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Products</h2>
          {products.length === 0 ? (
            <p className="mt-4 text-slate-600">No products listed yet.</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCatalogCard key={p.id} product={p} layout="grid" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
