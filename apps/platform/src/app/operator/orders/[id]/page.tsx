import { HubShell } from "@/components/hub-shell";
import { OperatorOrderDetailClient } from "@/components/operator-order-detail-client";

export default async function OperatorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <HubShell>
      <OperatorOrderDetailClient orderId={id} />
    </HubShell>
  );
}
