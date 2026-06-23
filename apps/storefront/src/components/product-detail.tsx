"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@fosl/contracts";
import {
  Button,
  ProductTypeBadge,
  formatCurrency,
  Input,
  Label,
  Textarea,
} from "@fosl/ui";
import {
  getShippingForVendor,
  getRelatedProducts,
  getProductsByVendor,
  enrichProduct,
} from "@fosl/mocks";
import { Truck, Zap, MessageSquare, Star, ChevronRight } from "lucide-react";
import { CreatorEarnButton } from "@/components/creator-earn-button";
import { ProductGridSection } from "@/components/product-grid-section";

type TabId = "description" | "additional" | "reviews";

function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-[#2E75B6]">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link href="/products" className="hover:text-[#2E75B6]">
            Shop
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link href={`/products?category=${product.category}`} className="hover:text-[#2E75B6]">
            {product.category}
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li className="font-medium text-slate-900 line-clamp-1">{product.title}</li>
      </ol>
    </nav>
  );
}

function ProductGallery({ product }: { product: Product }) {
  const images = product.galleryUrls ?? [product.imageUrl];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={images[active] ?? product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                active === i ? "border-[#2E75B6]" : "border-slate-200"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-current" : "fill-none"}`}
          />
        ))}
      </div>
      <span className="text-sm text-slate-500">
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<TabId>("description");
  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "additional", label: "Additional information" },
    { id: "reviews", label: `Reviews (${product.reviewCount ?? 0})` },
  ];

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-[#2E75B6] text-[#2E75B6]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tab === "description" && (
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.fullDescription ?? product.description }}
          />
        )}
        {tab === "additional" && (
          <table className="w-full max-w-lg text-sm">
            <tbody>
              {product.attributes?.map((attr) => (
                <tr key={attr.name} className="border-b border-slate-100">
                  <th className="py-3 pr-6 text-left font-medium text-slate-700">{attr.name}</th>
                  <td className="py-3 text-slate-600 capitalize">{attr.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "reviews" && (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
              <span className="text-3xl font-bold">{product.rating?.toFixed(1)}</span>
              <div>
                <StarRating rating={product.rating ?? 0} count={product.reviewCount ?? 0} />
                <p className="mt-1 text-slate-500">Based on verified purchases</p>
              </div>
            </div>
            <p className="italic text-slate-400">Reviews synced from vendor catalog (prototype).</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PurchaseSummary({
  product,
  postcode,
  setPostcode,
  shipping,
}: {
  product: Product;
  postcode: string;
  setPostcode: (v: string) => void;
  shipping: ReturnType<typeof getShippingForVendor>;
}) {
  const [qty, setQty] = useState(1);
  const inStock = product.inventory > 0;

  return (
    <div className="lg:sticky lg:top-20">
      <ProductTypeBadge type={product.type} />
      <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>

      {product.rating != null && (
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount ?? 0} />
        </div>
      )}

      <p className="mt-4 text-3xl font-semibold text-[#2E75B6]">
        {product.priceCents > 0 ? formatCurrency(product.priceCents) : "Free"}
      </p>

      <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

      <dl className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-500">SKU:</dt>
          <dd className="font-mono">{product.sku}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500">Category:</dt>
          <dd>{product.category}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500">Sold by:</dt>
          <dd>
            <Link href={`/products?vendor=${product.vendorId}`} className="text-[#2E75B6] hover:underline">
              {product.vendorName}
            </Link>
          </dd>
        </div>
        {product.catalogSource !== "native" && (
          <div className="flex gap-2">
            <dt className="text-slate-500">Synced from:</dt>
            <dd className="capitalize">{product.catalogSource}</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="text-slate-500">Availability:</dt>
          <dd className={inStock ? "text-green-700" : "text-red-600"}>
            {inStock ? `In stock (${product.inventory} available)` : "Out of stock"}
          </dd>
        </div>
      </dl>

      {product.tags && product.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <CreatorEarnButton productId={product.id} productTitle={product.title} />
      </div>

      {product.type === "digital" && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-purple-50 px-3 py-2 text-sm text-purple-800">
          <Zap className="h-4 w-4 shrink-0" />
          Instant digital delivery after purchase
        </div>
      )}

      {product.type === "physical" && (
        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Truck className="h-4 w-4 text-[#2E75B6]" />
            Shipping estimate
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Postal code"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="max-w-[140px]"
            />
            <Button variant="outline" size="sm" type="button">
              Calculate
            </Button>
          </div>
          {postcode && shipping.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {shipping.map((s) => (
                <li key={s.id}>
                  {s.name}: {formatCurrency(s.priceCents)} · {s.estimatedDays}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {product.type !== "lead_gen" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-md border border-slate-200">
            <button
              type="button"
              className="px-3 py-2 text-lg hover:bg-slate-50"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-12 border-x border-slate-200 py-2 text-center text-sm"
              aria-label="Quantity"
            />
            <button
              type="button"
              className="px-3 py-2 text-lg hover:bg-slate-50"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <Button asChild size="lg" className="flex-1 min-w-[140px]" disabled={!inStock}>
            <Link href="/cart">Add to cart</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProductDetail({ product: rawProduct }: { product: Product }) {
  const product = enrichProduct(rawProduct);
  const [postcode, setPostcode] = useState("");
  const shipping = product.type === "physical" ? getShippingForVendor(product.vendorId) : [];
  const related = getRelatedProducts(product);
  const byVendor = getProductsByVendor(product.vendorId, product.id);

  if (product.type === "lead_gen") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs product={product} />
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />
          <div>
            <ProductTypeBadge type="lead_gen" />
            <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
            <p className="mt-4 text-slate-600">{product.description}</p>
            <p className="mt-2 text-sm text-slate-500">
              by{" "}
              <Link href={`/products?vendor=${product.vendorId}`} className="text-[#2E75B6] hover:underline">
                {product.vendorName}
              </Link>
            </p>
            <div className="mt-4">
              <CreatorEarnButton productId={product.id} productTitle={product.title} />
            </div>
            <form className="mt-8 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <MessageSquare className="h-5 w-5 text-[#2E75B6]" />
                Request information
              </h2>
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" placeholder="Jane Smith" className="mt-1 bg-white" required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="jane@example.com" className="mt-1 bg-white" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 555 0100" className="mt-1 bg-white" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={3} className="mt-1 bg-white" placeholder="Tell us about your goals…" />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" required className="mt-1" />
                I agree to be contacted about this request *
              </label>
              <Button type="submit" className="w-full">
                Submit request
              </Button>
            </form>
          </div>
        </div>
        <ProductTabs product={product} />
        <ProductGridSection title="Related products" products={related} />
        {byVendor.length > 0 && (
          <ProductGridSection
            title={`More from ${product.vendorName}`}
            subtitle="Other products by this vendor"
            products={byVendor}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs product={product} />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />
        <PurchaseSummary
          product={product}
          postcode={postcode}
          setPostcode={setPostcode}
          shipping={shipping}
        />
      </div>

      <ProductTabs product={product} />

      <ProductGridSection
        title="Related products"
        subtitle={`More in ${product.category}`}
        products={related}
      />

      {byVendor.length > 0 && (
        <ProductGridSection
          title={`More from ${product.vendorName}`}
          subtitle="Products by the same vendor"
          products={byVendor}
        />
      )}
    </div>
  );
}
