import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments &amp; reconciliation</h1>
        <p className="text-slate-600">Stripe vs ledger · daily reconciliation job</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardCurrency label="Platform fees (30d)" cents={224500} />
        <StatCard label="Payout success rate" value="99.2%" trend="up" />
        <StatCard label="Failed webhooks (24h)" value="0" />
        <StatCard label="Ledger discrepancies" value="0" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Recent payouts</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2">Party</th>
              <th className="pb-2">Type</th>
              <th className="pb-2 text-right">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2">Acme Audio Co.</td>
              <td className="py-2">Vendor</td>
              <td className="py-2 text-right">$1,284.00</td>
              <td className="py-2 text-green-600">Paid</td>
            </tr>
            <tr>
              <td className="py-2">Alex Rivera</td>
              <td className="py-2">Creator</td>
              <td className="py-2 text-right">$241.00</td>
              <td className="py-2 text-green-600">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
