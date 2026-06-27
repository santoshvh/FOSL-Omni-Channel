import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { listVendorProducts } from "@fosl/db";
import type { Product } from "@fosl/contracts";

async function loadVendorProducts(vendorId: string | null): Promise<Product[]> {
  if (!process.env.DATABASE_URL || !vendorId) return [];
  return listVendorProducts(vendorId);
}

export default async function VendorCatalogPage() {
  const session = await auth();
  const vendorId = await resolveVendorIdForApi(session);
  const products = await loadVendorProducts(vendorId);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product catalog</h1>
            <p className="text-slate-600">Native products and synced items from connected stores</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/vendor/catalog/source">Catalog source</Link>
            </Button>
            <Button asChild>
              <Link href="/vendor/catalog/new">
                <Plus className="mr-2 h-4 w-4" />
                Add product
              </Link>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Source</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Price</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Stock</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.vendorName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ProductTypeBadge type={p.type} />
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{p.catalogSource}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(p.priceCents)}</td>
                  <td className="px-4 py-3 text-right">{p.inventory}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/vendor/catalog/${p.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
