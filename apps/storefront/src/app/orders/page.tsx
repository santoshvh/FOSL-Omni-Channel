"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockOrders } from "@fosl/mocks";
import { ProductTypeBadge } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";

const statusColors: Record<string, string> = {
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  lead_received: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
  shipped: "bg-purple-100 text-purple-800",
};

export default function OrdersPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered =
    typeFilter === "all"
      ? mockOrders
      : mockOrders.filter((o) => o.lines.some((l) => l.type === typeFilter));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Order history</h1>
      <p className="mt-1 text-slate-600">Your purchases across this storefront</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "physical", label: "Physical" },
          { value: "digital", label: "Digital" },
          { value: "lead_gen", label: "Lead gen" },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              typeFilter === f.value
                ? "bg-[#2E75B6] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono font-medium">{order.number}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.lines.length} item
                  {order.lines.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusColors[order.status] ?? "bg-slate-100"
                  }`}
                >
                  {order.status.replace("_", " ")}
                </span>
                <span className="font-semibold">{formatCurrency(order.totalCents)}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.lines.map((l, i) => (
                <ProductTypeBadge key={i} type={l.type} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
