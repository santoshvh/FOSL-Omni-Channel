import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlatformOperatorById } from "@fosl/mocks";
import { Button, formatCurrency } from "@fosl/ui";

export default async function AdminOperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const op = getPlatformOperatorById(id);
  if (!op) notFound();

  return (
    <div className="space-y-6">
      <Link href="/operators" className="text-sm text-primary-dark hover:underline">
        ← Operators
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{op.name}</h1>
          <p className="text-slate-500">{op.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/operators/${id}/edit`}>Edit</Link>
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
              <dd className="font-medium">{op.plan}</dd>
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
              <dd>{formatCurrency(op.gmvCents)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Domains</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span>/ (operator storefront)</span>
              <span className="text-green-600">Active</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span>/acme-audio, /bright-labs, …</span>
              <span className="text-green-600">Vendor paths</span>
            </li>
            <li className="flex justify-between">
              <span>shop.{op.name.split(" ")[0].toLowerCase()}.com</span>
              <span className="text-amber-600">DNS pending</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>Mar 15 — Checkout enabled after grace period payment</li>
          <li>Mar 10 — Added custom domain</li>
          <li>Mar 1 — Upgraded to {op.plan} plan</li>
        </ul>
      </div>
    </div>
  );
}
