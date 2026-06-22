import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform dashboard</h1>
        <p className="text-slate-600">Multi-operator social commerce — admin overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardCurrency label="GMV (30d)" cents={45230000} hint="+15% vs last month" trend="up" />
        <StatCard label="Active operators" value="47" />
        <StatCard label="Transactions" value="12,840" />
        <StatCard label="Uptime" value="99.94%" hint="Checkout path" trend="up" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Integration health</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Shopify sync success rate</dt>
              <dd className="font-medium text-green-600">98.2%</dd>
            </div>
            <div className="flex justify-between">
              <dt>WooCommerce sync success rate</dt>
              <dd className="font-medium text-green-600">96.8%</dd>
            </div>
            <div className="flex justify-between">
              <dt>Failed syncs (24h)</dt>
              <dd className="font-medium text-amber-600">12</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Alerts</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-md bg-amber-50 px-3 py-2 text-amber-800">
              3 operators in grace period — checkout disabled
            </li>
            <li className="rounded-md bg-red-50 px-3 py-2 text-red-800">
              2 disputes awaiting assignment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
