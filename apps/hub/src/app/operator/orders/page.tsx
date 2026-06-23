import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { formatCurrency } from "@fosl/ui";
import { mockOrders } from "@fosl/mocks";

export default function OperatorOrdersPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-slate-600">All orders on your storefront</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Vendors</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Total</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Commission</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/operator/orders/${o.id}`}
                      className="font-mono text-xs text-primary-dark hover:underline"
                    >
                      {o.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {[...new Set(o.lines.map((l) => l.vendorName))].join(", ")}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(o.totalCents)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {formatCurrency(Math.round(o.totalCents * 0.15))}
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
