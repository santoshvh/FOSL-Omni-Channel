import { HubShell } from "@/components/hub-shell";
import { VendorConflictBanner } from "@/components/vendor-conflict-banner";
import { auth } from "@/auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { listVendorOperatorLinks } from "@fosl/db";

export default async function VendorRelationshipsPage() {
  const session = await auth();
  const vendorId = await resolveVendorIdForApi(session);
  const relationships =
    process.env.DATABASE_URL && vendorId ? await listVendorOperatorLinks(vendorId) : [];

  return (
    <HubShell>
      <div className="space-y-6">
        <VendorConflictBanner />

        <div>
          <h1 className="text-2xl font-bold">Operator relationships</h1>
          <p className="text-slate-600">Approve operators who want to list your products</p>
        </div>

        {relationships.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            {process.env.DATABASE_URL
              ? "No operator relationships yet."
              : "Connect a database to manage operator relationships."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Operator</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Storefront</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Scope</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Min commission</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {relationships.map((r) => {
                  const status = r.status.toLowerCase();
                  const storefront = r.operator.storefronts[0]?.path ?? "—";
                  return (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-medium">{r.operator.name}</td>
                      <td className="px-4 py-3 text-slate-500">/{storefront}</td>
                      <td className="px-4 py-3 capitalize">{r.scope.toLowerCase().replace("_", " ")}</td>
                      <td className="px-4 py-3">{Number(r.minCommissionPct)}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            status === "approved"
                              ? "text-green-600"
                              : status === "pending"
                                ? "text-amber-600"
                                : "text-red-600"
                          }
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HubShell>
  );
}
