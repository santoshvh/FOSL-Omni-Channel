import { notFound } from "next/navigation";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { AlertBanner } from "@fosl/ui";
import { fetchSyncJobDetail } from "@/lib/integrations-service";

export default async function SyncJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: job } = await fetchSyncJobDetail(id);
  if (!job) notFound();

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/vendor/integrations/history" className="text-sm text-primary-dark hover:underline">
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
      </div>
    </HubShell>
  );
}
