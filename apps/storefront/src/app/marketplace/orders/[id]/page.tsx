import { notFound } from "next/navigation";
import Link from "next/link";
import { getMasterOrderById } from "@fosl/mocks";
import { formatCurrency } from "@fosl/ui";
import { Package, Truck, Download } from "lucide-react";

export default async function MarketplaceOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getMasterOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/marketplace/orders" className="text-sm text-primary-dark hover:underline">
        ← Marketplace orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.number}</h1>
          <p className="text-slate-500">Master order · {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-800">
          {order.status}
        </span>
      </div>

      <p className="mt-4 text-right text-lg font-bold">Total: {formatCurrency(order.totalCents)}</p>

      <div className="mt-8 space-y-4">
        <h2 className="font-semibold">Per-vendor fulfillment</h2>
        {order.fulfillments.map((f, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              {f.status === "shipped" ? (
                <Truck className="h-5 w-5 shrink-0 text-primary-dark" />
              ) : f.items.some((item) => item.includes("Course")) ? (
                <Download className="h-5 w-5 shrink-0 text-purple-600" />
              ) : (
                <Package className="h-5 w-5 shrink-0 text-slate-500" />
              )}
              <div className="flex-1">
                <p className="font-medium">{f.vendorName}</p>
                <p className="text-sm text-slate-500">Fulfilled via {f.operatorName}</p>
                <ul className="mt-2 text-sm">
                  {f.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm capitalize text-slate-600">Status: {f.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
