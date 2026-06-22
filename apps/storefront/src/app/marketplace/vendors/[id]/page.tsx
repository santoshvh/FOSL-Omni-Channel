import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMarketplaceVendorById, getProductsByVendorId } from "@fosl/mocks";
import { Button } from "@fosl/ui";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { ExternalLink } from "lucide-react";

export default async function MarketplaceVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = getMarketplaceVendorById(id);
  if (!vendor) notFound();

  const products = getProductsByVendorId(id);

  return (
    <div>
      <div className="relative h-48 bg-slate-200 sm:h-64">
        <Image src={vendor.bannerUrl} alt="" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
            <Image src={vendor.logoUrl} alt="" fill className="object-cover" sizes="96px" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{vendor.name}</h1>
            <p className="text-white/90 drop-shadow">{vendor.tagline}</p>
          </div>
          <div className="flex gap-2 pb-2">
            <Button variant="secondary">Follow</Button>
            <Button variant="secondary" asChild>
              <a href={vendor.storefrontUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit store
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
          <span>★ {vendor.rating} ({vendor.reviewCount} reviews)</span>
          <span>{vendor.productCount} products</span>
          <span>{vendor.followers.toLocaleString()} followers</span>
          <span>Listed on {vendor.operatorName}</span>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Featured products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <MarketplaceProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-slate-500">
          Purchases can be made here on the marketplace or directly on{" "}
          <a href={vendor.storefrontUrl} className="text-[#2E75B6] hover:underline">
            {vendor.storefrontUrl.replace("https://", "")}
          </a>
        </p>
      </div>
    </div>
  );
}
