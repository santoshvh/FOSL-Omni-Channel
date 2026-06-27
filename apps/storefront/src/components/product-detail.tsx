"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ShippingMethod } from "@fosl/contracts";
import {
  Button,
  ProductTypeBadge,
  formatCurrency,
  Input,
  Label,
  Textarea,
} from "@fosl/ui";
import { Truck, Zap, MessageSquare, Star, ChevronRight } from "lucide-react";
import { CreatorEarnButton } from "@/components/creator-earn-button";
import { ProductGridSection } from "@/components/product-grid-section";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuantityStepper, quantityMaxFor } from "@/components/quantity-stepper";
import { useVendorShipping } from "@/lib/use-vendor-shipping";

type TabId = "description" | "additional" | "reviews";

function withGallery(product: Product): Product {
  if (product.galleryUrls?.length) return product;
  return { ...product, galleryUrls: [product.imageUrl] };
}

function Breadcrumbs({
  product,
  homeHref = "/",
  catalogBasePath = "/products",
}: {
  product: Product;
  homeHref?: string;
  catalogBasePath?: string;
}) {
  return (
    <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href={homeHref} className="hover:text-primary-dark">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link href={catalogBasePath} className="hover:text-primary-dark">
            Shop
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5" />
        <li>
          <Link
            href={`${catalogBasePath}?category=${product.category}`}
            className="hover:text-primary-dark"
          >
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
                active === i ? "border-primary" : "border-slate-200"
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
                ? "border-primary text-primary-dark"
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

function PhysicalPurchaseSummary({
  product,
  postcode,
  setPostcode,
  shipping,
}: {
  product: Product;
  postcode: string;
  setPostcode: (v: string) => void;
  shipping: ShippingMethod[];
}) {
  const [qty, setQty] = useState(1);
  const inStock = product.inventory > 0;
  const weight = product.attributes?.find((a) => a.name === "Weight")?.value;

  return (
    <div className="lg:sticky lg:top-20">
      <ProductTypeBadge type="physical" />
      <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
      {product.rating != null && (
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount ?? 0} />
        </div>
      )}
      <p className="mt-4 text-3xl font-semibold text-primary-dark">{formatCurrency(product.priceCents)}</p>
      <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>
      <dl className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-500">SKU:</dt>
          <dd className="font-mono">{product.sku}</dd>
        </div>
        {weight && (
          <div className="flex gap-2">
            <dt className="text-slate-500">Weight:</dt>
            <dd>{weight}</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="text-slate-500">Sold by:</dt>
          <dd>
            <Link href={`/products?vendor=${product.vendorId}`} className="text-primary-dark hover:underline">
              {product.vendorName}
            </Link>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500">Availability:</dt>
          <dd className={inStock ? "text-green-700" : "text-red-600"}>
            {inStock ? `In stock (${product.inventory} available)` : "Out of stock"}
          </dd>
        </div>
      </dl>
      <div className="mt-4">
        <CreatorEarnButton productId={product.id} productTitle={product.title} />
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Truck className="h-4 w-4 text-primary-dark" />
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
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={qty}
          max={quantityMaxFor(product)}
          onChange={setQty}
          disabled={!inStock}
        />
        <AddToCartButton
          productId={product.id}
          quantity={qty}
          className="flex-1 min-w-[140px]"
          disabled={!inStock}
        />
      </div>
    </div>
  );
}

function DigitalPurchaseSummary({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [licenseAccepted, setLicenseAccepted] = useState(false);

  return (
    <div className="lg:sticky lg:top-20">
      <ProductTypeBadge type="digital" />
      <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
      {product.rating != null && (
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount ?? 0} />
        </div>
      )}
      <p className="mt-4 text-3xl font-semibold text-primary-dark">{formatCurrency(product.priceCents)}</p>
      <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>
      <div className="mt-4 flex items-center gap-2 rounded-md bg-purple-50 px-3 py-2 text-sm text-purple-800">
        <Zap className="h-4 w-4 shrink-0" />
        Instant digital delivery — download link emailed after purchase
      </div>
      <dl className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-500">Format:</dt>
          <dd>PDF / ZIP (varies by product)</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500">Downloads:</dt>
          <dd>Up to 3 per purchase</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500">Sold by:</dt>
          <dd>
            <Link href={`/products?vendor=${product.vendorId}`} className="text-primary-dark hover:underline">
              {product.vendorName}
            </Link>
          </dd>
        </div>
      </dl>
      <div className="mt-4">
        <CreatorEarnButton productId={product.id} productTitle={product.title} />
      </div>
      <label className="mt-6 flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" className="mt-1" checked={licenseAccepted} onChange={(e) => setLicenseAccepted(e.target.checked)} />
        <span>
          I agree to the{" "}
          <Link href="/legal/terms#digital" className="font-medium text-ink underline">
            digital license terms
          </Link>{" "}
          (personal use, no redistribution) *
        </span>
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={qty}
          max={quantityMaxFor(product)}
          onChange={setQty}
        />
        <AddToCartButton
          productId={product.id}
          quantity={qty}
          className="flex-1 min-w-[140px]"
          disabled={!licenseAccepted}
        >
          Buy now
        </AddToCartButton>
      </div>
      <p className="mt-2 text-xs text-slate-500">No shipping step at checkout for digital items.</p>
    </div>
  );
}

function LeadGenPurchaseSummary({ product }: { product: Product }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
        }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ProductTypeBadge type="lead_gen" />
      <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
      <p className="mt-4 text-slate-600">{product.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        by{" "}
        <Link href={`/products?vendor=${product.vendorId}`} className="text-primary-dark hover:underline">
          {product.vendorName}
        </Link>
      </p>
      <p className="mt-2 text-lg font-semibold text-primary-dark">Free consultation</p>
      <div className="mt-4">
        <CreatorEarnButton productId={product.id} productTitle={product.title} />
      </div>
      {submitted ? (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-900">
          <p className="font-semibold">Request received</p>
          <p className="mt-1">The vendor will contact you within 1 business day.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-5 w-5 text-primary-dark" />
            Request information
          </h2>
          <div>
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" name="name" placeholder="Jane Smith" className="mt-1 bg-white" required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" placeholder="jane@example.com" className="mt-1 bg-white" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 555 0100" className="mt-1 bg-white" />
          </div>
          <div>
            <Label htmlFor="message">What are you looking to achieve?</Label>
            <Textarea id="message" name="message" rows={3} className="mt-1 bg-white" placeholder="Tell us about your goals…" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            I agree to be contacted about this request *
          </label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit request"}
          </Button>
        </form>
      )}
    </div>
  );
}

export function ProductDetail({
  product: rawProduct,
  homeHref,
  catalogBasePath,
  relatedProducts = [],
  moreFromVendor = [],
}: {
  product: Product;
  homeHref?: string;
  catalogBasePath?: string;
  relatedProducts?: Product[];
  moreFromVendor?: Product[];
}) {
  const product = withGallery(rawProduct);
  const shopBase = catalogBasePath ?? "/products";
  const home = homeHref ?? "/";
  const [postcode, setPostcode] = useState("");
  const shipping = useVendorShipping(product.type === "physical" ? product.vendorId : undefined);
  const related = relatedProducts;
  const byVendor = moreFromVendor;

  if (product.type === "lead_gen") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs product={product} homeHref={home} catalogBasePath={shopBase} />
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />
          <LeadGenPurchaseSummary product={product} />
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
      <Breadcrumbs product={product} homeHref={home} catalogBasePath={shopBase} />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />
        {product.type === "digital" ? (
          <DigitalPurchaseSummary product={product} />
        ) : (
          <PhysicalPurchaseSummary
            product={product}
            postcode={postcode}
            setPostcode={setPostcode}
            shipping={shipping}
          />
        )}
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
