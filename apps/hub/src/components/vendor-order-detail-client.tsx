"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@fosl/contracts";
import { Button, Input, Label, ProductTypeBadge, formatCurrency } from "@fosl/ui";

export function VendorOrderDetailClient({
  orderId,
  vendorName = "Acme Audio Co.",
}: {
  orderId: string;
  vendorName?: string;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`);
      const json = (await res.json()) as { data?: Order };
      const data = json.data ?? null;
      setOrder(data);
      if (data?.trackingNumber) setTracking(data.trackingNumber);
    }
    void load();
  }, [orderId]);

  async function updateOrder(payload: {
    status?: OrderStatus;
    lineUpdates?: { orderLineId: string; trackingNumber?: string }[];
  }) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { data?: Order; error?: string };
      if (!res.ok) {
        setMessage(json.error ?? "Update failed.");
        return;
      }
      setOrder(json.data ?? null);
      setMessage("Order updated.");
    } finally {
      setSaving(false);
    }
  }

  if (!order) {
    return <p className="text-sm text-slate-500">Loading order…</p>;
  }

  const vendorLines = order.lines.filter((l) => l.vendorName === vendorName);
  if (vendorLines.length === 0) {
    return <p className="text-sm text-red-600">No line items for this vendor.</p>;
  }

  const physicalLine = vendorLines.find((line) => line.type === "physical");

  return (
    <div className="space-y-6">
      <Link href="/vendor/orders" className="text-sm text-primary-dark hover:underline">
        ← Orders
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{order.number}</h1>
        <p className="text-slate-500">Your line items only</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Your items</h2>
        <ul className="mt-4 divide-y">
          {vendorLines.map((line, i) => (
            <li key={line.id ?? i} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{line.title}</p>
                <ProductTypeBadge type={line.type} className="mt-1" />
                {line.trackingNumber && (
                  <p className="mt-1 font-mono text-xs text-slate-500">{line.trackingNumber}</p>
                )}
              </div>
              <p>{formatCurrency(line.priceCents * line.qty)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Fulfillment</h2>
        <p className="mt-2 text-sm text-slate-600 capitalize">Status: {order.status.replace("_", " ")}</p>
        {physicalLine && (
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="tracking">Tracking number</Label>
              <Input
                id="tracking"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="1Z999AA10123456784"
                className="mt-1"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={saving || !tracking.trim() || !physicalLine.id}
                onClick={() =>
                  void updateOrder({
                    status: "shipped",
                    lineUpdates: physicalLine.id
                      ? [{ orderLineId: physicalLine.id, trackingNumber: tracking.trim() }]
                      : undefined,
                  })
                }
              >
                Mark shipped
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saving || order.status !== "shipped"}
                onClick={() => void updateOrder({ status: "delivered" })}
              >
                Mark delivered
              </Button>
            </div>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
