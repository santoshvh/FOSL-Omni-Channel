import { HubShell } from "@/components/hub-shell";
import { VendorOrdersClient } from "@/components/vendor-orders-client";

export default function VendorOrdersPage() {
  return (
    <HubShell>
      <VendorOrdersClient vendorId="ven_1" />
    </HubShell>
  );
}
