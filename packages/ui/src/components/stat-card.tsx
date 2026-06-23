import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  accent = "primary",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  accent?: "primary" | "green" | "blue" | "amber";
  className?: string;
}) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-600"
        : "text-slate-500";

  const accentStyles = {
    primary: "bg-primary-muted text-primary-foreground",
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-800",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:shadow-soft",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              accentStyles[accent]
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <p className={cn("mt-2 text-xs font-medium", trendColor)}>{hint}</p>}
    </div>
  );
}

export function StatCardCurrency({
  label,
  cents,
  hint,
  trend,
  icon,
  accent,
  className,
}: {
  label: string;
  cents: number;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  accent?: "primary" | "green" | "blue" | "amber";
  className?: string;
}) {
  return (
    <StatCard
      label={label}
      value={formatCurrency(cents)}
      hint={hint}
      trend={trend}
      icon={icon}
      accent={accent}
      className={className}
    />
  );
}
