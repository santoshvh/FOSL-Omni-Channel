import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { auth } from "@/auth";
import { resolveOperatorIdForApi } from "@/lib/tenant-session";
import { listOperatorProducts } from "@fosl/db";

export default async function OperatorCatalogImportPage() {
  const session = await auth();
  const operatorId = await resolveOperatorIdForApi(session);
  const products =
    process.env.DATABASE_URL && operatorId ? await listOperatorProducts(operatorId) : [];

  return (
    <HubShell>
      <div className="space-y-6">
        <Link href="/operator/catalog" className="text-sm text-primary-dark hover:underline">
          ← Storefront catalog
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Import from vendor catalog</h1>
          <p className="text-slate-600">Products currently listed on your operator storefront</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            No products on your storefront catalog yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Vendor</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">On storefront</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-slate-500">{p.vendorName}</td>
                    <td className="px-4 py-3">
                      <ProductTypeBadge type={p.type} />
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(p.priceCents)}</td>
                    <td className="px-4 py-3 text-green-600">Listed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button variant="outline" disabled>
          Bulk import (coming soon)
        </Button>
      </div>
    </HubShell>
  );
}
