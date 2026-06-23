import type { CatalogSource, ProductType } from "@fosl/contracts";

export type IntegrationPlatform = "shopify" | "woocommerce";

export type IntegrationCredentials = {
  shopify?: { accessToken: string };
  woocommerce?: { consumerKey: string; consumerSecret: string };
};

export type NormalizedCatalogProduct = {
  externalId: string;
  sku: string;
  title: string;
  description: string;
  type: ProductType;
  priceCents: number;
  currency: string;
  inventory: number;
  imageUrl: string;
  category: string;
  catalogSource: CatalogSource;
};

export type NormalizedShippingMethod = {
  externalId: string;
  name: string;
  priceCents: number;
  estimatedDays: string;
  zone: string;
};

export type CatalogSyncResult = {
  products: { added: number; updated: number; failed: number };
  shipping: { added: number; updated: number; failed: number };
  errors: string[];
};

export type OrderPushLine = {
  externalProductId: string;
  title: string;
  quantity: number;
  unitPriceCents: number;
};

export type OrderPushPayload = {
  orderNumber: string;
  customerEmail: string;
  currency: string;
  note?: string;
  shipping?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal?: string;
    country?: string;
  };
  lines: OrderPushLine[];
};

export type OrderPushResult = {
  externalOrderId: string;
  externalStatus: string;
};

export type ExternalOrderStatus = {
  externalOrderId: string;
  status: string;
  fulfillmentStatus?: string;
  trackingNumber?: string;
};

export interface CatalogAdapter {
  platform: IntegrationPlatform;
  fetchProducts(): Promise<NormalizedCatalogProduct[]>;
  fetchShippingMethods(): Promise<NormalizedShippingMethod[]>;
}

export interface OrderAdapter {
  platform: IntegrationPlatform;
  pushOrder(payload: OrderPushPayload): Promise<OrderPushResult>;
  fetchOrderStatus(externalOrderId: string): Promise<ExternalOrderStatus>;
}
