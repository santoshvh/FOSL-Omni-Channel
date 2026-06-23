import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { ProductTypeBadge } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { mockOrders } from "@fosl/mocks";

export default function VendorOrdersPage() {
  const vendorLines = mockOrders.flatMap((o) =>
    o.lines
      .filter((l) => l.vendorName === "Acme Audio Co.")
      .map((l) => ({ order: o, line: l }))
  );

  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-slate-600">Your line items only — no cross-vendor customer PII</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Line total</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">External ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendorLines.map(({ order, line }, i) => (
                <tr key={`${order.id}-${i}`}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/vendor/orders/${order.id}`}
                      className="font-mono text-xs text-primary-dark hover:underline"
                    >
                      {order.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{line.title}</td>
                  <td className="px-4 py-3">
                    <ProductTypeBadge type={line.type} />
                  </td>
                  <td className="px-4 py-3 text-right">{line.qty}</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(line.priceCents * line.qty)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">#SHP-88291</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
