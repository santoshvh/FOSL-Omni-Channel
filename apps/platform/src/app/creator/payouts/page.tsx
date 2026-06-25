import { HubShell } from "@/components/hub-shell";
import { StatCardCurrency, Card, CardContent, CardHeader, CardTitle, Button } from "@fosl/ui";

export default function CreatorPayoutsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-slate-600">Creator commissions via Stripe Connect</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardCurrency label="Pending" cents={1240} />
          <StatCardCurrency label="Cleared" cents={8900} />
          <StatCardCurrency label="Paid (30d)" cents={24100} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payout schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Weekly automatic payouts to your connected bank account.</p>
            <Button variant="outline" className="mt-4">
              Manage in Stripe
            </Button>
          </CardContent>
        </Card>
      </div>
    </HubShell>
  );
}
