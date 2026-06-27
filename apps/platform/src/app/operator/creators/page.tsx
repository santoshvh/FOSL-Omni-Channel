import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, formatCurrency } from "@fosl/ui";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { resolveOperatorIdForApi } from "@/lib/tenant-session";
import { listCreatorsForOperator } from "@fosl/db";

export default async function OperatorCreatorsPage() {
  const session = await auth();
  const operatorId = await resolveOperatorIdForApi(session);
  const creators =
    process.env.DATABASE_URL && operatorId ? await listCreatorsForOperator(operatorId) : [];

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Creators</h1>
            <p className="text-slate-600">Creators with referral links on your operator storefront</p>
          </div>
          <Button asChild>
            <Link href="/operator/creators/invite">
              <Plus className="mr-2 h-4 w-4" />
              Invite creator
            </Link>
          </Button>
        </div>

        {creators.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            {process.env.DATABASE_URL
              ? "No creators linked to your operator yet."
              : "Connect a database to list creators."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Creator</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Referral code</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Link clicks</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Commission (30d)</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {creators.map((creator) => (
                  <tr key={creator.id}>
                    <td className="px-4 py-3 font-medium">{creator.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{creator.referralCode}</td>
                    <td className="px-4 py-3 text-right">{creator.clicks30d.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(creator.revenueCents30d)}
                    </td>
                    <td className="px-4 py-3 text-green-600 capitalize">{creator.status}</td>
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
