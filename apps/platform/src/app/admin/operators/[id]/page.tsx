import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminOperatorById } from "@fosl/db";
import { Button, formatCurrency } from "@fosl/ui";

export default async function AdminOperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();

  const op = await getAdminOperatorById(id);
  if (!op) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/operators" className="text-sm text-primary-dark hover:underline">
        ← Operators
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{op.name}</h1>
          <p className="text-slate-500">{op.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/operators/${id}/edit`}>Edit</Link>
          </Button>
          <Button variant="outline">Suspend</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Subscription</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Plan</dt>
              <dd className="font-medium">{op.plan ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium capitalize">{op.status.replace("_", " ")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Storefronts</dt>
              <dd>{op.storefronts}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">GMV (30d)</dt>
              <dd>{formatCurrency(op.gmvCentsLast30Days)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Vendors linked</dt>
              <dd>{op.vendorCount}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Storefronts</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {op.storefrontList.length === 0 ? (
              <li className="text-slate-500">No storefronts configured.</li>
            ) : (
              op.storefrontList.map((sf) => (
                <li key={sf.id} className="flex justify-between border-b border-slate-100 pb-2">
                  <span>
                    {sf.name} · /{sf.path}
                  </span>
                  <span className="text-green-600">Active</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
