export type {
  IntegrationPlatform,
  IntegrationCredentials,
  NormalizedCatalogProduct,
  NormalizedShippingMethod,
  CatalogSyncResult,
  CatalogAdapter,
  OrderPushLine,
  OrderPushPayload,
  OrderPushResult,
  ExternalOrderStatus,
  OrderAdapter,
} from "./types";

export {
  mapExternalOrderStatus,
  mapShopifyOrderStatus,
  mapWooCommerceOrderStatus,
  shouldAdvanceOrderStatus,
} from "./status-mapping";

export { createShopifyAdapter } from "./shopify-adapter";
export { createWooCommerceAdapter } from "./woocommerce-adapter";
export { createShopifyOrderAdapter } from "./shopify-order-adapter";
export { createWooCommerceOrderAdapter } from "./woocommerce-order-adapter";

import type { IntegrationCredentials, IntegrationPlatform } from "./types";
import { createShopifyAdapter } from "./shopify-adapter";
import { createWooCommerceAdapter } from "./woocommerce-adapter";
import { createShopifyOrderAdapter } from "./shopify-order-adapter";
import { createWooCommerceOrderAdapter } from "./woocommerce-order-adapter";

export function createCatalogAdapter(
  platform: IntegrationPlatform,
  storeUrl: string,
  credentials: IntegrationCredentials
) {
  if (platform === "shopify") return createShopifyAdapter(storeUrl, credentials);
  return createWooCommerceAdapter(storeUrl, credentials);
}

export function createOrderAdapter(
  platform: IntegrationPlatform,
  storeUrl: string,
  credentials: IntegrationCredentials
) {
  if (platform === "shopify") return createShopifyOrderAdapter(storeUrl, credentials);
  return createWooCommerceOrderAdapter(storeUrl, credentials);
}
