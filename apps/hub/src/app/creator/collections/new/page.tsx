import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function CreatorCollectionNewPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/creator/collections" className="text-sm text-primary-dark hover:underline">
          ← Collections
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New collection</h1>
          <p className="text-slate-600">Curate products for your public creator page</p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="name">Collection name *</Label>
            <Input id="name" placeholder="Summer picks" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Short description for your page" className="mt-1" />
          </div>
          <div>
            <Label>Cover image</Label>
            <Input type="file" accept="image/*" className="mt-1" />
          </div>
          <Button asChild>
            <Link href="/creator/collections/col_1">Create & add products</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
