import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@fosl/mocks";
import { ProductTypeBadge, Button, formatCurrency } from "@fosl/ui";
import { Package, Download, MessageSquare, Truck } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/orders" className="text-sm text-[#2E75B6] hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.number}</h1>
          <p className="text-slate-500">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-800">
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
              <p className="font-medium">
                {formatCurrency(line.priceCents * line.qty)}
              </p>
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
            <Truck className="h-5 w-5 shrink-0 text-[#2E75B6]" />
            <div>
              <p className="font-medium">Shipment tracking</p>
              <p className="mt-1 font-mono text-sm">{order.trackingNumber}</p>
              <p className="mt-1 text-sm text-slate-500">Carrier: UPS · In transit</p>
            </div>
          </div>
        )}

        {order.downloadUrl && (
          <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <Download className="h-5 w-5 shrink-0 text-purple-700" />
            <div>
              <p className="font-medium text-purple-900">Digital download ready</p>
              <Button asChild size="sm" className="mt-2">
                <a href={order.downloadUrl} download>
                  Download files
                </a>
              </Button>
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
