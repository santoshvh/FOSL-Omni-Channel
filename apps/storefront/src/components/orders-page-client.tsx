"use client";

import { useEffect, useState } from "react";
import type { Order } from "@fosl/contracts";
import { Input, Label, Button } from "@fosl/ui";
import { OrderListView } from "@/components/order-views";
import { getStoredOrderEmail, setStoredOrderEmail } from "@/lib/order-email";

export function OrdersPageClient({
  title = "Order history",
  subtitle = "Your purchases across this storefront",
  orderHrefBase = "/orders",
}: {
  title?: string;
  subtitle?: string;
  orderHrefBase?: string;
}) {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredOrderEmail();
    if (stored) {
      setEmail(stored);
      void loadOrders(stored);
    }
  }, []);

  async function loadOrders(targetEmail: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/orders?email=${encodeURIComponent(targetEmail)}`);
      const json = (await res.json()) as { data?: Order[]; source?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Unable to load orders.");
      setOrders(json.data ?? []);
      setSource(json.source ?? null);
      setStoredOrderEmail(targetEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-slate-600">{subtitle}</p>

      <form
        className="mt-6 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void loadOrders(email);
        }}
      >
        <div className="min-w-[240px] flex-1">
          <Label htmlFor="order-email">Email used at checkout</Label>
          <Input
            id="order-email"
            type="email"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Loading…" : "Load orders"}
        </Button>
      </form>

      {source && <p className="mt-2 text-xs text-slate-400">Data source: {source}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <OrderListView
        orders={orders}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        orderHrefBase={orderHrefBase}
      />
    </div>
  );
}
