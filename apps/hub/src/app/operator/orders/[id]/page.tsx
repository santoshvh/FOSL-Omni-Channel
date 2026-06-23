import { notFound } from "next/navigation";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { getOrderById } from "@fosl/mocks";

export default async function OperatorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  return (
    <HubShell>
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

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Commission snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">
            Immutable at checkout — operator 15%, creator 8%, vendor remainder
          </p>
        </div>
      </div>
    </HubShell>
  );
}
