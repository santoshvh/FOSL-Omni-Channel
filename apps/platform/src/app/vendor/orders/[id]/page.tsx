import { HubShell } from "@/components/hub-shell";
import { VendorOrderDetailClient } from "@/components/vendor-order-detail-client";

export default async function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <HubShell>
      <VendorOrderDetailClient orderId={id} />
    </HubShell>
  );
}
