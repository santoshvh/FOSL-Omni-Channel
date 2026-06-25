import { HubShell } from "@/components/hub-shell";
import { Button, StatCard, StatCardCurrency } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";

const history = [
  { id: "po_1", date: "2026-03-10", amount: 124000, status: "paid" },
  { id: "po_2", date: "2026-03-03", amount: 98200, status: "paid" },
  { id: "po_3", date: "2026-02-24", amount: 110500, status: "paid" },
];

export default function OperatorPayoutsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-slate-600">Operator earnings after platform fees and creator commissions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardCurrency label="Available balance" cents={45200} />
          <StatCardCurrency label="Pending clearance" cents={12800} />
          <StatCard label="Next payout" value="Mar 17" hint="Weekly schedule" />
        </div>

        <div className="flex gap-3">
          <Button>Withdraw to bank</Button>
          <Button variant="outline">Open Stripe Express</Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Transfer ID</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-3">{h.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{h.id}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(h.amount)}</td>
                  <td className="px-4 py-3 capitalize text-green-600">{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
