import { OrdersPageClient } from "@/components/orders-page-client";

export default function MarketplaceOrdersPage() {
  return (
    <OrdersPageClient
      title="Marketplace orders"
      subtitle="Your purchases across all operator storefronts"
      orderHrefBase="/marketplace/orders"
    />
  );
}
