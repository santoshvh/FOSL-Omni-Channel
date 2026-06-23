import type { Order } from "@fosl/contracts";
import Link from "next/link";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { Download, MessageSquare, Package, Truck } from "lucide-react";

const statusColors: Record<string, string> = {
  processing: "bg-primary-muted text-ink",
  delivered: "bg-green-100 text-green-800",
  lead_received: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
  shipped: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-slate-100 text-slate-600",
};

export function OrderDetailView({
  order,
  backHref = "/orders",
}: {
  order: Order;
  backHref?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={backHref} className="text-sm text-primary-dark hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.number}</h1>
          <p className="text-slate-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
            statusColors[order.status] ?? "bg-slate-100"
          }`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 p-6">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-4 divide-y">
          {order.lines.map((line, i) => (
            <li key={i} className="flex justify-between py-3">
              <div>
                <p className="font-medium">{line.title}</p>
                <p className="text-sm text-slate-500">{line.vendorName}</p>
                <ProductTypeBadge type={line.type} className="mt-1" />
              </div>
              <p className="font-medium">{formatCurrency(line.priceCents * line.qty)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t pt-4 text-right text-lg font-bold">
          Total: {formatCurrency(order.totalCents)}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="font-semibold">Fulfillment</h2>

        {order.trackingNumber && (
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
            <Truck className="h-5 w-5 shrink-0 text-primary-dark" />
            <div>
              <p className="font-medium">Shipment tracking</p>
              <p className="mt-1 font-mono text-sm">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        {order.downloadUrl && (
          <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <Download className="h-5 w-5 shrink-0 text-purple-700" />
            <div>
              <p className="font-medium text-purple-900">Digital download ready</p>
              <a href={order.downloadUrl} download className="mt-2 inline-block text-sm font-medium text-purple-800 underline">
                Download files
              </a>
            </div>
          </div>
        )}

        {order.leadStatus && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <MessageSquare className="h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-medium text-amber-900">Lead request</p>
              <p className="mt-1 text-sm text-amber-800">{order.leadStatus}</p>
            </div>
          </div>
        )}

        {order.status === "processing" && !order.trackingNumber && (
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
            <Package className="h-5 w-5 shrink-0 text-slate-500" />
            <p className="text-sm text-slate-600">Preparing your order for shipment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderListView({
  orders,
  typeFilter,
  onTypeFilterChange,
  orderHrefBase = "/orders",
}: {
  orders: Order[];
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  orderHrefBase?: string;
}) {
  const filtered =
    typeFilter === "all"
      ? orders
      : orders.filter((o) => o.lines.some((l) => l.type === typeFilter));

  return (
    <>
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
            onClick={() => onTypeFilterChange(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              typeFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No orders found.</p>
        ) : (
          filtered.map((order) => (
            <Link
              key={order.id}
              href={`${orderHrefBase}/${order.id}`}
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
          ))
        )}
      </div>
    </>
  );
}
