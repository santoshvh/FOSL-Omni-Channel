import { cn, formatCurrency } from "../lib/utils";

export function StatCard({
  label,
  value,
  hint,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-600"
        : "text-slate-500";

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", trendColor)}>{hint}</p>}
    </div>
  );
}

export function StatCardCurrency({
  label,
  cents,
  hint,
  trend,
  className,
}: {
  label: string;
  cents: number;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <StatCard
      label={label}
      value={formatCurrency(cents)}
      hint={hint}
      trend={trend}
      className={className}
    />
  );
}
