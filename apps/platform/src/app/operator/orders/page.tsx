import { redirect } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { OperatorOrdersClient } from "@/components/operator-orders-client";
import { auth } from "@/auth";
import { resolveOperatorIdForApi } from "@/lib/tenant-session";

export default async function OperatorOrdersPage() {
  const session = await auth();
  const operatorId = await resolveOperatorIdForApi(session);
  if (!operatorId) {
    redirect("/auth/sign-in?callbackUrl=/operator/orders");
  }

  return (
    <HubShell>
      <OperatorOrdersClient operatorId={operatorId} />
    </HubShell>
  );
}
