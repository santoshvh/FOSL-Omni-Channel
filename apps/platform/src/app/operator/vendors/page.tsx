"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { Plus } from "lucide-react";

type OperatorVendorRow = {
  id: string;
  name: string;
  productsListed: number;
  commissionPct: number;
  status: string;
};

export default function OperatorVendorsPage() {
  const [vendors, setVendors] = useState<OperatorVendorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/operator-vendors")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load vendors.");
        return res.json() as Promise<{ data: OperatorVendorRow[] }>;
      })
      .then((json) => setVendors(json.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load vendors."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendors</h1>
            <p className="text-slate-600">
              Shared network vendors linked to your operator — products inherit from each vendor
            </p>
          </div>
          <Button asChild>
            <Link href="/operator/vendors/invite">
              <Plus className="mr-2 h-4 w-4" />
              Invite vendor
            </Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading vendor relationships…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Vendor</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Products</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Commission</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-3 font-medium">{v.name}</td>
                    <td className="px-4 py-3">{v.productsListed}</td>
                    <td className="px-4 py-3">{v.commissionPct}% operator margin</td>
                    <td className="px-4 py-3 capitalize text-green-600">{v.status}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/operator/vendors/${v.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HubShell>
  );
}
