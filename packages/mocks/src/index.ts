export { isBrowserApiMockingEnabled } from "./api-mocking";

export {
  demoSession,
  products,
  shippingMethods,
  integrations,
  syncJobs,
  getProductById,
  getSyncJobById,
  getShippingForVendor,
} from "./fixtures";

export {
  enrichProduct,
  getRelatedProducts,
  getProductsByVendor,
  getProductByIdEnriched,
} from "./product-details";

export {
  marketplaceCategories,
  marketplaceVendors,
  getMarketplaceVendorById,
  getMarketplaceVendorBySlug,
  vendorStorePath,
  getMarketplaceCategoryBySlug,
  getProductsByCategorySlug,
  searchMarketplaceProducts,
  getProductsByVendorId,
  getMarketplaceCartProducts,
  masterOrders,
  getMasterOrderById,
} from "./marketplace";
export type { MarketplaceCategory, MarketplaceVendor, MasterOrder } from "./marketplace";

export {
  mockOrders,
  getOrderById,
  vendorRelationships,
  vendorCoupons,
  creatorCoupons,
  creatorCollections,
  referralTree,
  platformOperators,
  getPlatformOperatorById,
  disputes,
  getDisputeById,
  auditLogs,
  operatorVendors,
  getOperatorVendorById,
  operatorPromotions,
  vendorCampaigns,
} from "./hub-data";

export {
  defaultPlatformSettings,
  getMockPlatformSettings,
  getMockPlatformSecrets,
  getMockPublicPlatformConfig,
  updateMockPlatformSettings,
  triggerMockDeploy,
} from "./platform-settings";
export type {
  MockOrder,
  MockCollection,
  PlatformOperator,
  MockDispute,
  DisputeDetail,
  AuditEntry,
  ReferralNode,
  OperatorVendor,
  Promotion,
  VendorCampaign,
} from "./hub-data";
