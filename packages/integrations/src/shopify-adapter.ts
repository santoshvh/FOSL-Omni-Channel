import type { CatalogAdapter, IntegrationCredentials, NormalizedCatalogProduct, NormalizedShippingMethod } from "./types";

type ShopifyProduct = {
  id: number;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  variants?: Array<{
    id: number;
    sku: string;
    price: string;
    inventory_quantity?: number;
  }>;
  image?: { src?: string };
};

type ShopifyShippingZone = {
  id: number;
  name: string;
  countries?: Array<{ name: string }>;
  weight_based_shipping_rates?: Array<{ id: number; name: string; price: string }>;
  price_based_shipping_rates?: Array<{ id: number; name: string; price: string }>;
};

function parsePriceCents(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function inferProductType(tags: string | undefined, productType: string | undefined): NormalizedCatalogProduct["type"] {
  const haystack = `${tags ?? ""} ${productType ?? ""}`.toLowerCase();
  if (haystack.includes("digital") || haystack.includes("download")) return "digital";
  if (haystack.includes("lead")) return "lead_gen";
  return "physical";
}

export function createShopifyAdapter(
  storeUrl: string,
  credentials: IntegrationCredentials
): CatalogAdapter {
  const host = storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const accessToken = credentials.shopify?.accessToken?.trim();

  if (!accessToken) {
    throw new Error("Shopify access token is required.");
  }

  const shopifyToken: string = accessToken;
  const baseUrl = `https://${host}/admin/api/2024-01`;

  async function shopifyFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${body}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    platform: "shopify",
    async fetchProducts() {
      const json = await shopifyFetch<{ products: ShopifyProduct[] }>("/products.json?limit=250");
      return json.products.flatMap((product) => {
        const variant = product.variants?.[0];
        if (!variant) return [];
        return [
          {
            externalId: String(variant.id),
            sku: variant.sku || `shopify-${product.id}`,
            title: product.title,
            description: product.body_html?.replace(/<[^>]+>/g, "").slice(0, 500) || product.title,
            type: inferProductType(undefined, product.product_type),
            priceCents: parsePriceCents(variant.price),
            currency: "USD",
            inventory: variant.inventory_quantity ?? 0,
            imageUrl: product.image?.src || "",
            category: product.product_type || "General",
            catalogSource: "shopify",
          } satisfies NormalizedCatalogProduct,
        ];
      });
    },
    async fetchShippingMethods() {
      const json = await shopifyFetch<{ shipping_zones: ShopifyShippingZone[] }>(
        "/shipping_zones.json"
      );
      const methods: NormalizedShippingMethod[] = [];
      for (const zone of json.shipping_zones) {
        const zoneName = zone.name || zone.countries?.[0]?.name || "Default";
        const rates = [
          ...(zone.weight_based_shipping_rates ?? []),
          ...(zone.price_based_shipping_rates ?? []),
        ];
        for (const rate of rates) {
          methods.push({
            externalId: `shopify-${zone.id}-${rate.id}`,
            name: rate.name,
            priceCents: parsePriceCents(rate.price),
            estimatedDays: "5–7 business days",
            zone: zoneName,
          });
        }
      }
      return methods;
    },
  };
}
