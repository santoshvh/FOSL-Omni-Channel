import { OrderDetailPageClient } from "@/components/order-detail-page-client";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailPageClient orderId={id} />;
}
