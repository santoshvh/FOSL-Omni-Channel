"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";

export function VendorOrdersClient({ vendorId = "ven_1" }: { vendorId?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/v1/orders?vendorId=${encodeURIComponent(vendorId)}`);
      const json = (await res.json()) as { data?: Order[] };
      setOrders(json.data ?? []);
      setLoading(false);
    }
    void load();
  }, [vendorId]);

  const vendorLines = orders.flatMap((order) =>
    order.lines.map((line) => ({ order, line }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-slate-600">Your line items only — no cross-vendor customer PII</p>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading orders…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Order</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Line total</th>
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
                  <td className="px-4 py-3 capitalize">{order.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
