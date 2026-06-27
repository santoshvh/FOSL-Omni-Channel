import Link from "next/link";
import { notFound } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";
import { auth } from "@/auth";
import { resolveOperatorIdForApi } from "@/lib/tenant-session";
import { getOperatorProduct } from "@fosl/db";

export default async function OperatorProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const operatorId = await resolveOperatorIdForApi(session);

  if (!process.env.DATABASE_URL || !operatorId) notFound();

  const product = await getOperatorProduct(operatorId, id);
  if (!product) notFound();

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/operator/catalog" className="text-sm text-primary-dark hover:underline">
          ← Catalog
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit listing</h1>
          <p className="text-slate-600">
            {product.sku} · <ProductTypeBadge type={product.type} />
          </p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label>Title</Label>
            <Input defaultValue={product.title} className="mt-1" />
          </div>
          <div>
            <Label>Operator margin override (%)</Label>
            <Input type="number" defaultValue={15} className="mt-1" />
          </div>
          <div>
            <Label>Featured on homepage</Label>
            <input type="checkbox" defaultChecked className="ml-2" />
          </div>
          <div className="flex gap-3">
            <Button disabled>Save</Button>
            <Button variant="outline" disabled>
              Unlist from storefront
            </Button>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
