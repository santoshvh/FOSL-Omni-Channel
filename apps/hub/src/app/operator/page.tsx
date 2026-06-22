import { HubShell } from "@/components/hub-shell";
import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function OperatorDashboardPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Subscription <strong>Active</strong> — Professional plan · Checkout enabled · Payouts enabled
        </div>

        <div>
          <h1 className="text-2xl font-bold">Operator dashboard</h1>
          <p className="text-slate-600">Demo Storefront · demo.fosl.store</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency label="Revenue (30d)" cents={892400} hint="+8% vs last month" trend="up" />
          <StatCard label="Orders" value="214" />
          <StatCard label="Active creators" value="28" />
          <StatCard label="Listed vendors" value="12" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Recent orders</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between border-b border-slate-100 pb-2">
                <span>#ORD-1042 · 2 vendors</span>
                <span className="font-medium">$134.98</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-2">
                <span>#ORD-1041 · Digital only</span>
                <span className="font-medium">$149.00</span>
              </li>
              <li className="flex justify-between">
                <span>#ORD-1040 · Lead gen</span>
                <span className="font-medium">$0.00</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Top creators</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Alex Rivera</span>
                <span className="text-slate-500">$1,240 revenue driven</span>
              </li>
              <li className="flex justify-between">
                <span>Jordan Lee</span>
                <span className="text-slate-500">$890 revenue driven</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
