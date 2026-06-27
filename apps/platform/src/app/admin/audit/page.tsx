import { Button } from "@fosl/ui";
import { listAuditLogs } from "@fosl/db";

async function loadAuditLogs() {
  if (!process.env.DATABASE_URL) return [];
  const rows = await listAuditLogs();
  return rows.map((row) => ({
    id: row.id,
    timestamp: row.createdAt.toISOString(),
    actor: row.actorEmail ?? row.actorId ?? "system",
    action: row.action,
    resource: row.resource,
  }));
}

export default async function AdminAuditPage() {
  const auditLogs = await loadAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit logs</h1>
          <p className="text-slate-600">Append-only · 7-year financial retention</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Actor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Resource</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-xs">
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3">{log.actor}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.resource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
