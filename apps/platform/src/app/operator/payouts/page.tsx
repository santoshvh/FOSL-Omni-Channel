import { Suspense } from "react";
import { HubShell } from "@/components/hub-shell";
import { OperatorStripeConnectClient } from "@/components/operator-stripe-connect-client";

export default function OperatorPayoutsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payments & Stripe Connect</h1>
          <p className="text-slate-600">
            Operator-branded merchant of record — platform fee, vendor transfers, creator commissions.
          </p>
        </div>
        <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
          <OperatorStripeConnectClient />
        </Suspense>
      </div>
    </HubShell>
  );
}
