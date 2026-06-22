import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { Plus } from "lucide-react";

export default function OperatorCreatorsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Creators</h1>
            <p className="text-slate-600">Manage creators promoting your storefront</p>
          </div>
          <Button asChild>
            <Link href="/operator/creators/invite">
              <Plus className="mr-2 h-4 w-4" />
              Invite creator
            </Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Creator</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Clicks (30d)</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Revenue driven</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Rate</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-medium">Alex Rivera</td>
                <td className="px-4 py-3 text-right">4,820</td>
                <td className="px-4 py-3 text-right">$12,400</td>
                <td className="px-4 py-3">10% creator</td>
                <td className="px-4 py-3 text-green-600">Active</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Jordan Lee</td>
                <td className="px-4 py-3 text-right">2,140</td>
                <td className="px-4 py-3 text-right">$5,890</td>
                <td className="px-4 py-3">10% creator</td>
                <td className="px-4 py-3 text-green-600">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
