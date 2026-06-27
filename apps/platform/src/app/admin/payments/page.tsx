import { StatCard, StatCardCurrency, formatCurrency } from "@fosl/ui";
import { getAdminPaymentMetrics } from "@fosl/db";

export const dynamic = "force-dynamic";

async function loadPayments() {
  if (!process.env.DATABASE_URL) return null;
  return getAdminPaymentMetrics();
}

export default async function AdminPaymentsPage() {
  const metrics = await loadPayments();

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payments &amp; reconciliation</h1>
          <p className="text-slate-600">Connect a database to view commission ledger data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments &amp; reconciliation</h1>
        <p className="text-slate-600">Commission ledger from seeded and live orders</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardCurrency label="Commissions paid (30d)" cents={metrics.commissionPaidCents30d} />
        <StatCardCurrency label="Pending / cleared (30d)" cents={metrics.commissionPendingCents30d} />
        <StatCard label="Recent ledger rows" value={String(metrics.recentPayouts.length)} />
        <StatCard
          label="Stripe"
          value={process.env.STRIPE_SECRET_KEY ? "Live" : "Mock / test"}
        />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Recent commission entries</h2>
        {metrics.recentPayouts.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No commission rows yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">Party</th>
                <th className="pb-2">Type</th>
                <th className="pb-2 text-right">Amount</th>
                <th className="pb-2">State</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.recentPayouts.map((row) => (
                <tr key={row.id}>
                  <td className="py-2">{row.party}</td>
                  <td className="py-2">{row.type}</td>
                  <td className="py-2 text-right">{formatCurrency(row.amountCents)}</td>
                  <td className="py-2 capitalize">{row.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
