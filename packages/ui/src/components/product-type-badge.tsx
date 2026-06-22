import type { ProductType } from "@fosl/contracts";
import { productTypeColors, productTypeLabels } from "../tokens";
import { cn } from "../lib/utils";

export function ProductTypeBadge({
  type,
  className,
}: {
  type: ProductType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        productTypeColors[type],
        className
      )}
    >
      {productTypeLabels[type]}
    </span>
  );
}
