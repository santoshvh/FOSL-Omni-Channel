import type { Product } from "@fosl/contracts";
import { products } from "./fixtures";

const fullDescriptions: Record<string, string> = {
  prod_1: `<p>Experience studio-quality sound wherever you go. These wireless over-ear headphones feature <strong>hybrid active noise cancellation</strong>, multipoint Bluetooth 5.3, and a foldable design that travels easily.</p>
<h3>What's in the box</h3>
<ul>
<li>Wireless Bluetooth Headphones</li>
<li>USB-C charging cable</li>
<li>3.5mm audio cable</li>
<li>Carrying pouch</li>
</ul>
<h3>Key features</h3>
<ul>
<li>30-hour battery life (ANC off)</li>
<li>Memory foam ear cushions</li>
<li>Built-in microphone for calls</li>
<li>Compatible with iOS and Android</li>
</ul>
<p>Synced from <em>acme-audio.myshopify.com</em>. Inventory and shipping rates update every 15 minutes.</p>`,

  prod_2: `<p>The complete playbook for launching and scaling a social commerce storefront. Includes lifetime access to all modules and future updates.</p>
<h3>Course modules</h3>
<ol>
<li>Storefront setup and branding</li>
<li>Vendor onboarding and catalog curation</li>
<li>Creator referral programs</li>
<li>Commission structures and coupons</li>
<li>Analytics and optimization</li>
</ol>
<p>Delivered as instant digital download after purchase. Includes PDF worksheets and Notion templates.</p>`,

  prod_3: `<p>Speak directly with a growth strategist about your multi-vendor storefront, creator program, or catalog sync setup.</p>
<p>During your 30-minute session we will review:</p>
<ul>
<li>Current conversion funnel</li>
<li>Creator attribution and commission rules</li>
<li>Quick wins for the next 30 days</li>
</ul>
<p>No obligation. Ideal for operators and vendors new to social commerce.</p>`,

  prod_4: `<p>Keep your coffee hot for hours with this double-wall ceramic travel mug. Leak-resistant lid and comfortable grip.</p>
<h3>Specifications</h3>
<ul>
<li>Capacity: 16 oz / 473 ml</li>
<li>Material: Ceramic with silicone lid</li>
<li>Dishwasher safe (top rack)</li>
<li>Not microwave safe</li>
</ul>
<p>Fulfilled from WooCommerce warehouse. Flat-rate shipping applies at checkout.</p>`,

  prod_5: `<p>Braided nylon USB-C cable rated for fast charging and data sync. 2m length for desk or bedside use.</p>
<p>Pair with our Wireless Bluetooth Headphones for a complete travel kit.</p>`,

  prod_6: `<p>Non-slip desk mat with stitched edges. Protects your surface and defines your workspace.</p>
<ul>
<li>Size: 90 × 40 cm</li>
<li>Water-resistant surface</li>
<li>Machine washable</li>
</ul>`,

  prod_7: `<p>50+ editable templates for product listings, creator briefs, and email campaigns. Figma and Canva formats included.</p>`,
};

export function enrichProduct(product: Product): Product {
  return {
    ...product,
    fullDescription:
      product.fullDescription ?? fullDescriptions[product.id] ?? `<p>${product.description}</p>`,
    galleryUrls: product.galleryUrls ?? defaultGallery(product),
    tags: product.tags ?? defaultTags(product),
    attributes: product.attributes ?? defaultAttributes(product),
    rating: product.rating ?? 4.5,
    reviewCount: product.reviewCount ?? 12,
  };
}

function defaultGallery(p: Product): string[] {
  // Use main image for all thumbnails in prototype (avoids broken variant URLs)
  return [p.imageUrl];
}

function defaultTags(p: Product): string[] {
  const tags = [p.category.toLowerCase()];
  if (p.type === "physical") tags.push("shipped");
  if (p.catalogSource === "woocommerce") tags.push("woocommerce");
  if (p.catalogSource === "shopify") tags.push("shopify");
  return tags;
}

function defaultAttributes(p: Product): { name: string; value: string }[] {
  const attrs: { name: string; value: string }[] = [
    { name: "SKU", value: p.sku },
    { name: "Vendor", value: p.vendorName },
    { name: "Product type", value: p.type.replace("_", " ") },
    { name: "Catalog source", value: p.catalogSource },
  ];
  if (p.type === "physical") {
    attrs.push({ name: "Weight", value: "0.45 kg" });
  }
  return attrs;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
    .map(enrichProduct);
}

export function getProductsByVendor(
  vendorId: string,
  excludeId: string,
  limit = 4
): Product[] {
  return products
    .filter((p) => p.vendorId === vendorId && p.id !== excludeId)
    .slice(0, limit)
    .map(enrichProduct);
}

export function getProductByIdEnriched(id: string): Product | undefined {
  const p = products.find((x) => x.id === id);
  return p ? enrichProduct(p) : undefined;
}
