import { HubShell } from "@/components/hub-shell";
import { stripeConnectGuide } from "@/lib/integration-guides";
import { Button, StatCard, StatCardCurrency, Card, CardContent, CardHeader, CardTitle, SetupGuide } from "@fosl/ui";

export default function VendorPayoutsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-slate-600">Stripe Connect — earnings and transfers</p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Stripe Connect <strong>Active</strong> — Express account · Payouts weekly
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardCurrency label="Pending" cents={12400} hint="Awaiting clearance" />
          <StatCardCurrency label="Cleared" cents={45200} hint="Available to transfer" />
          <StatCardCurrency label="Paid (30d)" cents={128900} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Connect onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <SetupGuide
              title={stripeConnectGuide.title}
              steps={stripeConnectGuide.steps}
              terms={stripeConnectGuide.terms}
            />
            <p>Your account is verified. Update bank details or tax info in Stripe Express dashboard.</p>
            <Button variant="outline">Open Stripe Express</Button>
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <h2 className="border-b px-4 py-3 font-semibold">Payout history</h2>
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Mar 10, 2026</td>
                <td className="px-4 py-3 text-right font-medium">$1,284.00</td>
                <td className="px-4 py-3 text-green-600">Paid</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Mar 3, 2026</td>
                <td className="px-4 py-3 text-right font-medium">$892.50</td>
                <td className="px-4 py-3 text-green-600">Paid</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
