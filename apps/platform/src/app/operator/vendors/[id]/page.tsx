"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, formatCurrency } from "@fosl/ui";

type VendorDetail = {
  id: string;
  name: string;
  status: string;
  commissionPct: number;
  productsListed: number;
  revenueCents: number;
  integration: string;
};

export default function OperatorVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    void params.then((p) => setVendorId(p.id));
  }, [params]);

  useEffect(() => {
    if (!vendorId) return;

    fetch(`/api/v1/operator-vendors/${vendorId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFoundState(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load vendor.");
        return res.json() as Promise<{ data: VendorDetail }>;
      })
      .then((json) => {
        if (json) setVendor(json.data);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  async function updateStatus(status: string) {
    if (!vendorId) return;
    const res = await fetch(`/api/v1/operator-vendors/${vendorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const json = (await res.json()) as { data: VendorDetail };
      setVendor((prev) => (prev ? { ...prev, status: json.data.status } : prev));
    }
  }

  if (notFoundState) {
    return (
      <HubShell>
        <p className="text-slate-600">Vendor relationship not found.</p>
        <Link href="/operator/vendors" className="text-sm text-primary-dark hover:underline">
          ← Back to vendors
        </Link>
      </HubShell>
    );
  }

  return (
    <HubShell>
      <div className="space-y-6">
        <Link href="/operator/vendors" className="text-sm text-primary-dark hover:underline">
          ← Vendors
        </Link>

        {loading || !vendor ? (
          <p className="text-slate-500">Loading vendor relationship…</p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                <p className="text-slate-500">
                  {vendor.integration} · {vendor.commissionPct}% operator margin · shared catalog
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-800">
                {vendor.status}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Products (inherited)</p>
                <p className="text-2xl font-bold">{vendor.productsListed}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Revenue (30d)</p>
                <p className="text-2xl font-bold">{formatCurrency(vendor.revenueCents)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Catalog scope</p>
                <p className="text-2xl font-bold">Network-wide</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">Relationship</h2>
              <p className="mt-2 text-sm text-slate-600">
                Products from this vendor are shared on the FOSL network. Approving the link lists
                their full published catalog on your operator storefront.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/operator/catalog">View catalog</Link>
              </Button>
              {vendor.status !== "approved" && (
                <Button type="button" onClick={() => updateStatus("approved")}>
                  Approve vendor
                </Button>
              )}
              {vendor.status === "approved" && (
                <Button type="button" variant="outline" onClick={() => updateStatus("suspended")}>
                  Suspend
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </HubShell>
  );
}
