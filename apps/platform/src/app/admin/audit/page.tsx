import { auditLogs } from "@fosl/mocks";
import { Button } from "@fosl/ui";

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit logs</h1>
          <p className="text-slate-600">Append-only · 7-year financial retention</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>
      <div className="flex gap-2">
        <input
          type="date"
          className="h-9 rounded-md border border-slate-200 px-3 text-sm"
          aria-label="From date"
        />
        <input
          type="date"
          className="h-9 rounded-md border border-slate-200 px-3 text-sm"
          aria-label="To date"
        />
        <select className="h-9 rounded-md border border-slate-200 px-3 text-sm">
          <option>All actions</option>
          <option>Financial</option>
          <option>Admin</option>
        </select>
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
