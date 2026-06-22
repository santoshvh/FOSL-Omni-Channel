import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlatformOperatorById } from "@fosl/mocks";
import { Button, Input, Label } from "@fosl/ui";

export default async function AdminOperatorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const op = getPlatformOperatorById(id);
  if (!op) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href={`/operators/${id}`} className="text-sm text-[#2E75B6] hover:underline">
        ← {op.name}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Edit operator</h1>
        <p className="text-slate-600">Plan, limits, and feature flags</p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <Label htmlFor="plan">Subscription plan</Label>
          <select id="plan" defaultValue={op.plan} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option>Starter</option>
            <option>Professional</option>
            <option>Enterprise</option>
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" defaultValue={op.status} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="grace_period">Grace period</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div>
          <Label htmlFor="maxStorefronts">Max storefronts</Label>
          <Input id="maxStorefronts" type="number" defaultValue={op.storefronts} className="mt-1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked />
          Enable marketplace catalog import
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked />
          Allow lead-gen products
        </label>
        <div className="flex gap-3">
          <Button>Save changes</Button>
          <Button variant="outline" asChild>
            <Link href={`/operators/${id}`}>Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
