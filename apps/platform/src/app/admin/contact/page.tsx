import Link from "next/link";
import { listContactSubmissions } from "@fosl/db";

export const dynamic = "force-dynamic";

async function loadSubmissions() {
  if (!process.env.DATABASE_URL) return [];
  return listContactSubmissions();
}

export default async function AdminContactInboxPage() {
  const submissions = await loadSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact inbox</h1>
        <p className="text-slate-600">Messages from the storefront contact form</p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
          {process.env.DATABASE_URL
            ? "No contact submissions yet."
            : "Connect a database to view contact submissions."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Received</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {row.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-primary-dark hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.role}</td>
                  <td className="max-w-md px-4 py-3 text-slate-600">
                    <p className="line-clamp-2">{row.message}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Submissions are stored when shoppers use{" "}
        <Link href="https://shop.foslone.com/contact" className="text-primary-dark hover:underline">
          shop contact form
        </Link>
        .
      </p>
    </div>
  );
}
