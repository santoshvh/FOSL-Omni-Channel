"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SyncJob } from "@fosl/contracts";
import { HubShell } from "@/components/hub-shell";

export default function SyncHistoryPage() {
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/integrations/sync-jobs");
        const json = (await res.json()) as { data?: SyncJob[] };
        setJobs(json.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sync history</h1>
          <p className="text-slate-600">Products, inventory, and shipping sync runs</p>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading sync history…</p>}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Time</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Entity</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Added</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Updated</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Failed</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/vendor/integrations/history/${job.id}`}
                      className="text-primary-dark hover:underline"
                    >
                      {new Date(job.startedAt).toLocaleString()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{job.entity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        job.status === "success"
                          ? "text-green-600"
                          : job.status === "partial"
                            ? "text-amber-600"
                            : "text-red-600"
                      }
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{job.added}</td>
                  <td className="px-4 py-3 text-right">{job.updated}</td>
                  <td className="px-4 py-3 text-right">{job.failed}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {job.errorMessage ?? "—"}
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
