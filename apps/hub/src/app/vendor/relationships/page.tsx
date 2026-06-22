import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { vendorRelationships } from "@fosl/mocks";

export default function VendorRelationshipsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Operator relationships</h1>
          <p className="text-slate-600">Approve operators who want to list your products</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Operator</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Storefront</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Scope</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Min commission</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendorRelationships.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium">{r.operatorName}</td>
                  <td className="px-4 py-3 text-slate-500">{r.storefront}</td>
                  <td className="px-4 py-3 capitalize">{r.scope.replace("_", " ")}</td>
                  <td className="px-4 py-3">{r.minCommissionPct}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.status === "approved"
                          ? "text-green-600"
                          : r.status === "pending"
                            ? "text-amber-600"
                            : "text-red-600"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    )}
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
