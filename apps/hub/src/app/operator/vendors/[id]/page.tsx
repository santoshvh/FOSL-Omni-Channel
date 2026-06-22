import { notFound } from "next/navigation";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, formatCurrency } from "@fosl/ui";
import { getOperatorVendorById } from "@fosl/mocks";

export default async function OperatorVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = getOperatorVendorById(id);
  if (!vendor) notFound();

  return (
    <HubShell>
      <div className="space-y-6">
        <Link href="/operator/vendors" className="text-sm text-[#2E75B6] hover:underline">
          ← Vendors
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <p className="text-slate-500">{vendor.integration} · {vendor.commissionPct}% operator margin</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-800">
            {vendor.status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Products listed</p>
            <p className="text-2xl font-bold">{vendor.productsListed}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Revenue (30d)</p>
            <p className="text-2xl font-bold">{formatCurrency(vendor.revenueCents)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Relationship</p>
            <p className="text-2xl font-bold">Approved</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Relationship history</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Feb 1, 2026 — Catalog-wide listing approved</li>
            <li>Jan 15, 2026 — Vendor application received</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/operator/catalog/import">Curate products</Link>
          </Button>
          <Button variant="outline">Adjust commission</Button>
        </div>
      </div>
    </HubShell>
  );
}
