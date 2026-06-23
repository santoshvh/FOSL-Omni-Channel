import { OrderDetailPageClient } from "@/components/order-detail-page-client";

type PageProps = { params: Promise<{ id: string }> };

export default async function MarketplaceOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPageClient orderId={id} backHref="/marketplace/orders" />;
}
