import Link from "next/link";
import { notFound } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { getProductById } from "@fosl/mocks";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";

export default async function OperatorProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/operator/catalog" className="text-sm text-[#2E75B6] hover:underline">
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
            <Button>Save</Button>
            <Button variant="outline">Unlist from storefront</Button>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
