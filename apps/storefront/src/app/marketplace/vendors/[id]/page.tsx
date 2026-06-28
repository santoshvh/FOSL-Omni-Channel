import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@fosl/ui";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { loadMarketplaceVendor } from "@/lib/catalog-loader";

export default async function MarketplaceVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await loadMarketplaceVendor(id);
  if (!store) notFound();

  const { vendor, products } = store;
  const bannerUrl = "bannerUrl" in vendor ? vendor.bannerUrl : undefined;
  const logoUrl = "logoUrl" in vendor ? vendor.logoUrl : undefined;
  const rating = "rating" in vendor ? vendor.rating : undefined;
  const reviewCount = "reviewCount" in vendor ? vendor.reviewCount : undefined;
  const followers = "followers" in vendor ? vendor.followers : undefined;
  const operatorName = "operatorName" in vendor ? vendor.operatorName : undefined;
  const storefrontUrl = "storefrontUrl" in vendor ? vendor.storefrontUrl : `/${vendor.slug}`;

  return (
    <div>
      {bannerUrl ? (
        <div className="relative h-48 bg-slate-200 sm:h-64">
          <Image src={bannerUrl} alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-slate-200 sm:h-64" />
      )}

      <div className="mx-auto max-w-6xl px-4 pb-14">
        <div className="-mt-12">
          {logoUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
              <Image src={logoUrl} alt="" fill className="object-cover" sizes="96px" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{vendor.name}</h1>
            {vendor.tagline ? (
              <p className="mt-1 max-w-2xl text-base text-slate-600">{vendor.tagline}</p>
            ) : null}
          </div>
          <div className="shrink-0">
            <Button variant="secondary">Follow</Button>
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
          <Link href={storefrontUrl} className="text-slate-400 hover:text-slate-600 hover:underline">
            visit store
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Featured products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <MarketplaceProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
