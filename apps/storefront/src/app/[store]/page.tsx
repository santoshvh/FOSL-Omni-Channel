import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductCatalogCard } from "@/components/product-catalog-card";
import { OperatorStorefrontHome } from "@/components/operator-storefront-home";
import { loadVendorStore } from "@/lib/catalog-loader";

async function loadOperatorStorefront(path: string) {
  if (!process.env.DATABASE_URL?.trim()) return null;
  try {
    const { getStorefrontByPath } = await import("@fosl/db");
    return getStorefrontByPath(path);
  } catch {
    return null;
  }
}

export default async function StorePathPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;

  const operatorStore = await loadOperatorStorefront(store);
  if (operatorStore) {
    return (
      <OperatorStorefrontHome
        storefrontPath={operatorStore.path}
        name={operatorStore.name}
        operatorName={operatorStore.operator.name}
      />
    );
  }

  const vendorStore = await loadVendorStore(store);
  if (!vendorStore) notFound();

  const { vendor, products } = vendorStore;
  const bannerUrl = "bannerUrl" in vendor ? vendor.bannerUrl : undefined;
  const logoUrl = "logoUrl" in vendor ? vendor.logoUrl : undefined;
  const rating = "rating" in vendor ? vendor.rating : undefined;
  const reviewCount = "reviewCount" in vendor ? vendor.reviewCount : undefined;
  const followers = "followers" in vendor ? vendor.followers : undefined;
  const operatorName = "operatorName" in vendor ? vendor.operatorName : undefined;

  return (
    <div>
      {bannerUrl ? (
        <div className="relative h-48 bg-slate-200 sm:h-64">
          <Image src={bannerUrl} alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-slate-200 sm:h-64" />
      )}

      <div className="mx-auto max-w-6xl px-4 pb-14">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          {logoUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
              <Image src={logoUrl} alt="" fill className="object-cover" sizes="96px" />
            </div>
          ) : null}
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{vendor.name}</h1>
            {vendor.tagline ? <p className="text-white/90 drop-shadow">{vendor.tagline}</p> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
          {rating != null ? (
            <span>
              ★ {rating} ({reviewCount ?? 0} reviews)
            </span>
          ) : null}
          <span>{products.length} products</span>
          {followers != null ? <span>{followers.toLocaleString()} followers</span> : null}
          {operatorName ? <span>Listed on {operatorName}</span> : null}
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
