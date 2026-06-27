import Link from "next/link";
import { notFound } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";
import { auth } from "@/auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { getVendorProduct } from "@fosl/db";

export default async function VendorProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const vendorId = await resolveVendorIdForApi(session);

  if (!process.env.DATABASE_URL || !vendorId) notFound();

  const product = await getVendorProduct(vendorId, id);
  if (!product) notFound();

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit product</h1>
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
            <Label>Price (USD)</Label>
            <Input
              type="number"
              defaultValue={(product.priceCents / 100).toFixed(2)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Inventory</Label>
            <Input type="number" defaultValue={product.inventory} className="mt-1" />
          </div>
          <div>
            <Label>Short description</Label>
            <textarea
              defaultValue={product.description}
              rows={3}
              className="mt-1 flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button disabled>Save changes</Button>
          <Button variant="outline" asChild>
            <Link href="/vendor/catalog">Back to catalog</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
