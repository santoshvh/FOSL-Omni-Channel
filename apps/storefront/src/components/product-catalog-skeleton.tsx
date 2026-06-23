import { Skeleton } from "@fosl/ui";

export function ProductCatalogSkeleton({
  layout = "grid",
  count = 6,
}: {
  layout?: "grid" | "list";
  count?: number;
}) {
  if (layout === "list") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
          >
            <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-3/4 max-w-xs" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ecom-card overflow-hidden">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2 border-t border-slate-100 p-3">
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
