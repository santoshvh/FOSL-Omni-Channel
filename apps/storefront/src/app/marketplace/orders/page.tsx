import Link from "next/link";
import { masterOrders } from "@fosl/mocks";
import { formatCurrency } from "@fosl/ui";

export default function MarketplaceOrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Marketplace orders</h1>
      <p className="text-slate-600">Master orders across all operator storefronts</p>

      <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Order</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Vendors</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Total</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {masterOrders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/marketplace/orders/${o.id}`}
                    className="font-mono text-primary-dark hover:underline"
                  >
                    {o.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {o.fulfillments.map((f) => f.vendorName).join(", ")}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(o.totalCents)}
                </td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
