"use client";

import { useEffect, useState } from "react";
import type { Order } from "@fosl/contracts";
import { OrderDetailView } from "@/components/order-views";

export function OrderDetailPageClient({
  orderId,
  backHref = "/orders",
}: {
  orderId: string;
  backHref?: string;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`);
        const json = (await res.json()) as { data?: Order; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Order not found.");
        setOrder(json.data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Order not found.");
      }
    }
    void load();
  }, [orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-500">Loading order…</p>
      </div>
    );
  }

  return <OrderDetailView order={order} backHref={backHref} />;
}
