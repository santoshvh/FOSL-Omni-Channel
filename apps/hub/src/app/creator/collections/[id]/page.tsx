import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { products } from "@fosl/mocks";

export default async function CreatorCollectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collectionName = id === "col_1" ? "Best Audio Gear" : "Courses I Recommend";

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit collection</h1>
          <p className="text-slate-600">{collectionName}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Collection name</label>
          <input
            defaultValue={collectionName}
            className="mt-1 flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
          />
        </div>
        <div>
          <h2 className="font-semibold">Products in collection</h2>
          <ul className="mt-3 space-y-2">
            {products.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-slate-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="cursor-grab text-slate-400">⋮⋮</span>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <ProductTypeBadge type={p.type} />
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3">
          <Button>Save collection</Button>
          <Button variant="outline" asChild>
            <Link href="/creator/collections">Back</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
