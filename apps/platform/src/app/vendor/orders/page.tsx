import { redirect } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { VendorOrdersClient } from "@/components/vendor-orders-client";
import { auth } from "@/auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";

export default async function VendorOrdersPage() {
  const session = await auth();
  const vendorId = await resolveVendorIdForApi(session);
  if (!vendorId) {
    redirect("/auth/sign-in?callbackUrl=/vendor/orders");
  }

  return (
    <HubShell>
      <VendorOrdersClient vendorId={vendorId} />
    </HubShell>
  );
}
