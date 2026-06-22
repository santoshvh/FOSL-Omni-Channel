import { HubShell } from "@/components/hub-shell";
import { Button, Card, CardContent, CardHeader, CardTitle, StatCard } from "@fosl/ui";

export default function OperatorSubscriptionPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Subscription <strong>Active</strong> — Professional plan · Checkout enabled · Payouts enabled
        </div>

        <div>
          <h1 className="text-2xl font-bold">Subscription &amp; billing</h1>
          <p className="text-slate-600">Managed via Stripe Billing</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Plan" value="Professional" />
          <StatCard label="Per-transaction fee" value="2.9%" />
          <StatCard label="Storefronts" value="1 / 3" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Unlimited vendor listings</li>
                <li>✓ Creator program</li>
                <li>✓ Custom domain</li>
                <li>✓ Advanced analytics</li>
              </ul>
              <p className="text-2xl font-bold">
                $99<span className="text-base font-normal text-slate-500">/month</span>
              </p>
              <Button variant="outline">Upgrade to Enterprise</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Billing history</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2">Mar 1, 2026</td>
                    <td className="py-2 text-right font-medium">$99.00</td>
                    <td className="py-2 pl-4 text-green-600">Paid</td>
                  </tr>
                  <tr>
                    <td className="py-2">Feb 1, 2026</td>
                    <td className="py-2 text-right font-medium">$99.00</td>
                    <td className="py-2 pl-4 text-green-600">Paid</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubShell>
  );
}
