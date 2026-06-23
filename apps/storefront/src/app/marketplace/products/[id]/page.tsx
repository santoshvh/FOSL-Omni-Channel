import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById, getMarketplaceVendorById } from "@fosl/mocks";
import {
  Button,
  ProductTypeBadge,
  formatCurrency,
} from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";
import { MarketplaceProductCard } from "@/components/marketplace-product-card";
import { getProductsByVendorId } from "@fosl/mocks";

export default async function MarketplaceProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const vendor = getMarketplaceVendorById(product.vendorId);
  const moreFromVendor = getProductsByVendorId(product.vendorId)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/marketplace" className="hover:text-[#2E75B6]">
          Marketplace
        </Link>
        {" / "}
        <Link href={`/marketplace/category/electronics`} className="hover:text-[#2E75B6]">
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
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={vendor.logoUrl} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500">Sold by</p>
                <Link
                  href={vendor.storefrontUrl}
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {vendor.name}
                </Link>
                <p className="text-xs text-slate-500">
                  via {vendor.operatorName} · ★ {vendor.rating}
                  {" · "}
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
            <Button asChild size="lg">
              <Link href="/marketplace/cart">Add to marketplace cart</Link>
            </Button>
            <CreatorEarnButton
              productId={product.id}
              productTitle={product.title}
              variant="outline"
              className="h-11 px-8"
            />
          </div>

          <p className="mt-4 text-xs text-slate-500">
            One checkout splits fulfillment across vendors and operators. Shipping calculated per vendor at checkout.
          </p>
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
