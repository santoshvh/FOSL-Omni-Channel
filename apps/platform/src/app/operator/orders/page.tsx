import { HubShell } from "@/components/hub-shell";
import { OperatorOrdersClient } from "@/components/operator-orders-client";

export default function OperatorOrdersPage() {
  return (
    <HubShell>
      <OperatorOrdersClient operatorId="op_1" />
    </HubShell>
  );
}
