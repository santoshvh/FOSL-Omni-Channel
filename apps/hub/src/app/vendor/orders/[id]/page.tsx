import { notFound } from "next/navigation";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { getOrderById } from "@fosl/mocks";

export default async function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  const vendorLines = order.lines.filter((l) => l.vendorName === "Acme Audio Co.");
  if (vendorLines.length === 0) notFound();

  return (
    <HubShell>
      <div className="space-y-6">
        <Link href="/vendor/orders" className="text-sm text-[#2E75B6] hover:underline">
          ← Orders
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{order.number}</h1>
          <p className="text-slate-500">Your line items only · External ID #SHP-88291</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Your items</h2>
          <ul className="mt-4 divide-y">
            {vendorLines.map((line, i) => (
              <li key={i} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{line.title}</p>
                  <ProductTypeBadge type={line.type} className="mt-1" />
                </div>
                <p>{formatCurrency(line.priceCents * line.qty)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Fulfillment</h2>
          <p className="mt-2 text-sm text-slate-600 capitalize">Status: {order.status}</p>
          {order.trackingNumber && (
            <p className="mt-2 font-mono text-sm">Tracking: {order.trackingNumber}</p>
          )}
          <p className="mt-4 text-sm text-slate-500">
            Pushed to Shopify order #48291 — inventory decremented on sync
          </p>
        </div>
      </div>
    </HubShell>
  );
}
