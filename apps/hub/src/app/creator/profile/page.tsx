import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { products } from "@fosl/mocks";
import Image from "next/image";

export default function CreatorPublicProfilePage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium uppercase text-slate-500">Public profile preview</p>
          <div className="mt-4 flex flex-wrap items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2E75B6] text-2xl font-bold text-white">
              AR
            </div>
            <div>
              <h1 className="text-2xl font-bold">Alex Rivera</h1>
              <p className="mt-1 text-slate-600">
                Audio enthusiast &amp; course creator. Curated picks for your setup.
              </p>
              <p className="mt-2 text-sm text-[#2E75B6]">demo.fosl.store/creator/alex</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Featured products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="relative h-32 bg-slate-100">
                  <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="200px" />
                </div>
                <div className="p-3">
                  <ProductTypeBadge type={p.type} />
                  <p className="mt-1 font-medium">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline">Edit public profile</Button>
      </div>
    </HubShell>
  );
}
