import Link from "next/link";
import Image from "next/image";
import { HubShell } from "@/components/hub-shell";
import { Button, formatCurrency } from "@fosl/ui";
import { creatorCollections } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function CreatorCollectionsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Collections</h1>
            <p className="text-slate-600">Curate products for your public creator page</p>
          </div>
          <Button asChild>
            <Link href="/creator/collections/new">
              <Plus className="mr-2 h-4 w-4" />
              New collection
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creatorCollections.map((c) => (
            <Link
              key={c.id}
              href={`/creator/collections/${c.id}`}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-32 bg-slate-100">
                <Image src={c.imageUrl} alt="" fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{c.productCount} products</p>
                <p className="mt-2 text-sm font-medium text-[#2E75B6]">
                  {formatCurrency(c.earningsCents)} earned
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </HubShell>
  );
}
