import { notFound } from "next/navigation";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { getSyncJobById } from "@fosl/mocks";
import { AlertBanner } from "@fosl/ui";

export default async function SyncJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getSyncJobById(id);
  if (!job) notFound();

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/vendor/integrations/history" className="text-sm text-[#2E75B6] hover:underline">
          ← Sync history
        </Link>

        <div>
          <h1 className="text-2xl font-bold capitalize">Sync — {job.entity}</h1>
          <p className="text-slate-500">{new Date(job.startedAt).toLocaleString()}</p>
        </div>

        {job.status !== "success" && job.errorMessage && (
          <AlertBanner variant="warning" title="Sync issues detected">
            {job.errorMessage}
          </AlertBanner>
        )}

        <dl className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium capitalize">{job.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Added</dt>
            <dd>{job.added}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Updated</dt>
            <dd>{job.updated}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Failed</dt>
            <dd className={job.failed > 0 ? "font-medium text-red-600" : ""}>{job.failed}</dd>
          </div>
        </dl>

        {job.failed > 0 && (
          <div className="rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold">Failed SKUs</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>MUG-202 — missing weight for shipping rate sync</li>
              <li>WBH-002 — variant mapping conflict with Shopify</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Fix in your connected store or native catalog, then trigger a manual sync.
            </p>
          </div>
        )}
      </div>
    </HubShell>
  );
}
