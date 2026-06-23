import { Skeleton } from "@fosl/ui";

export function CheckoutStepSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 p-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
