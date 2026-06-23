import { notFound } from "next/navigation";
import Link from "next/link";
import { getDisputeById } from "@fosl/mocks";
import { Button } from "@fosl/ui";

export default async function AdminDisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispute = getDisputeById(id);
  if (!dispute) notFound();

  return (
    <div className="space-y-6">
      <Link href="/disputes" className="text-sm text-primary-dark hover:underline">
        ← Disputes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{dispute.id}</h1>
          <p className="text-slate-500">
            Order {dispute.orderNumber} · {dispute.parties}
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium capitalize text-amber-800">
          {dispute.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-3 text-sm text-slate-600">{dispute.description}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Filed</dt>
              <dd>{new Date(dispute.filedAt).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Assignee</dt>
              <dd>{dispute.assignee ?? "Unassigned"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Timeline</h2>
          <ol className="mt-4 space-y-3 border-l-2 border-slate-200 pl-4">
            {dispute.timeline.map((e, i) => (
              <li key={i} className="text-sm">
                <p className="text-xs text-slate-500">{new Date(e.at).toLocaleString()}</p>
                <p className="mt-0.5">{e.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Assign to me</Button>
        <Button variant="outline">Request evidence</Button>
        <Button variant="outline">Resolve — refund customer</Button>
        <Button variant="outline">Resolve — favor vendor</Button>
      </div>
    </div>
  );
}
