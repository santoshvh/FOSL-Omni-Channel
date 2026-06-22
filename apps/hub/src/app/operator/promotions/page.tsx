import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { operatorPromotions } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function OperatorPromotionsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bundles & promotions</h1>
            <p className="text-slate-600">Multi-vendor bundles and buy-X-get-Y campaigns</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New promotion
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Vendors</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ends</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {operatorPromotions.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 capitalize">{p.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-slate-600">{p.vendors}</td>
                  <td className="px-4 py-3 capitalize">{p.status}</td>
                  <td className="px-4 py-3">{p.endsAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
