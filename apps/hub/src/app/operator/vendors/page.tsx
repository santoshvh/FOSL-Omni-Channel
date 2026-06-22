import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { operatorVendors } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function OperatorVendorsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendors</h1>
            <p className="text-slate-600">Approve relationships and set commission rates</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite vendor
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Vendor</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Products listed</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Commission</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {operatorVendors.map((v) => (
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
      </div>
    </HubShell>
  );
}
