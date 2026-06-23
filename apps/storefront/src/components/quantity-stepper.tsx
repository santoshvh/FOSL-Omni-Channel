"use client";

import type { Product } from "@fosl/contracts";
import { cn } from "@fosl/ui";

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
  className,
  disabled,
}: QuantityStepperProps) {
  const atMin = value <= 1;
  const atMax = value >= max;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-slate-200 bg-white",
        size === "sm" ? "text-sm" : "text-base",
        disabled && "opacity-50",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40",
          size === "sm" ? "px-2 py-1" : "px-3 py-2"
        )}
        onClick={() => onChange(value - 1)}
        disabled={disabled || atMin}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const parsed = parseInt(e.target.value, 10);
          if (Number.isNaN(parsed)) return;
          onChange(Math.min(max, Math.max(1, parsed)));
        }}
        className={cn(
          "border-x border-slate-200 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          size === "sm" ? "w-10 py-1 text-xs" : "w-12 py-2 text-sm"
        )}
        aria-label="Quantity"
      />
      <button
        type="button"
        className={cn(
          "hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40",
          size === "sm" ? "px-2 py-1" : "px-3 py-2"
        )}
        onClick={() => onChange(value + 1)}
        disabled={disabled || atMax}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export function quantityMaxFor(product: Product): number {
  if (product.type === "lead_gen") return 1;
  return Math.max(1, product.inventory);
}
