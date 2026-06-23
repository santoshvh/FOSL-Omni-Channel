import { Skeleton } from "@fosl/ui";

export function CartDrawerSkeleton() {
  return (
    <ul className="flex-1 divide-y divide-slate-100 px-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="flex gap-3 py-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </li>
      ))}
    </ul>
  );
}
