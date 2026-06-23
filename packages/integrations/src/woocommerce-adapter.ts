import type { CatalogAdapter, IntegrationCredentials, NormalizedCatalogProduct, NormalizedShippingMethod } from "./types";

type WooProduct = {
  id: number;
  name: string;
  sku: string;
  description: string;
  short_description?: string;
  price: string;
  regular_price?: string;
  stock_quantity: number | null;
  virtual?: boolean;
  downloadable?: boolean;
  categories?: Array<{ name: string }>;
  images?: Array<{ src: string }>;
  tags?: Array<{ name: string }>;
};

type WooShippingZone = {
  id: number;
  name: string;
};

type WooShippingMethod = {
  instance_id: number;
  title: string;
  method_id: string;
  settings?: { cost?: { value?: string } };
};

function parsePriceCents(value: string | undefined): number {
  if (!value) return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function inferProductType(product: WooProduct): NormalizedCatalogProduct["type"] {
  if (product.virtual || product.downloadable) return "digital";
  const tags = product.tags?.map((t) => t.name.toLowerCase()).join(" ") ?? "";
  if (tags.includes("lead")) return "lead_gen";
  return "physical";
}

export function createWooCommerceAdapter(
  storeUrl: string,
  credentials: IntegrationCredentials
): CatalogAdapter {
  const key = credentials.woocommerce?.consumerKey?.trim();
  const secret = credentials.woocommerce?.consumerSecret?.trim();
  if (!key || !secret) {
    throw new Error("WooCommerce consumer key and secret are required.");
  }

  const host = storeUrl.replace(/\/$/, "");
  const baseUrl = host.startsWith("http") ? host : `https://${host}`;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  async function wooFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}/wp-json/wc/v3${path}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WooCommerce API error (${response.status}): ${body}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    platform: "woocommerce",
    async fetchProducts() {
      const products = await wooFetch<WooProduct[]>("/products?per_page=100");
      return products.map((product) => ({
        externalId: String(product.id),
        sku: product.sku || `woo-${product.id}`,
        title: product.name,
        description:
          product.short_description?.replace(/<[^>]+>/g, "") ||
          product.description?.replace(/<[^>]+>/g, "").slice(0, 500) ||
          product.name,
        type: inferProductType(product),
        priceCents: parsePriceCents(product.price || product.regular_price),
        currency: "USD",
        inventory: product.stock_quantity ?? 0,
        imageUrl: product.images?.[0]?.src || "",
        category: product.categories?.[0]?.name || "General",
        catalogSource: "woocommerce",
      }));
    },
    async fetchShippingMethods() {
      const zones = await wooFetch<WooShippingZone[]>("/shipping/zones");
      const methods: NormalizedShippingMethod[] = [];

      for (const zone of zones) {
        const zoneMethods = await wooFetch<WooShippingMethod[]>(
          `/shipping/zones/${zone.id}/methods`
        );
        for (const method of zoneMethods) {
          const cost = method.settings?.cost?.value;
          methods.push({
            externalId: `woo-${zone.id}-${method.instance_id}`,
            name: method.title || method.method_id,
            priceCents: parsePriceCents(cost),
            estimatedDays: method.method_id === "free_shipping" ? "5–7 days" : "3–5 days",
            zone: zone.name,
          });
        }
      }

      return methods;
    },
  };
}
