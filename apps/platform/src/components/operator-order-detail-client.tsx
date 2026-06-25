"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@fosl/contracts";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";

export function OperatorOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`);
      const json = (await res.json()) as { data?: Order };
      setOrder(json.data ?? null);
    }
    void load();
  }, [orderId]);

  if (!order) {
    return <p className="text-sm text-slate-500">Loading order…</p>;
  }

  return (
    <div className="space-y-6">
      <Link href="/operator/orders" className="text-sm text-primary-dark hover:underline">
        ← Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.number}</h1>
          <p className="text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize">
          {order.status.replace("_", " ")}
        </span>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Line items</h2>
        <ul className="mt-4 divide-y">
          {order.lines.map((line, i) => (
            <li key={i} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{line.title}</p>
                <p className="text-slate-500">{line.vendorName}</p>
                <ProductTypeBadge type={line.type} className="mt-1" />
              </div>
              <p>{formatCurrency(line.priceCents * line.qty)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t pt-4 text-right font-bold">
          Total {formatCurrency(order.totalCents)} · Commission{" "}
          {formatCurrency(Math.round(order.totalCents * 0.15))}
        </p>
      </div>
    </div>
  );
}
