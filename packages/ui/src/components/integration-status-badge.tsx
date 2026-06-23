import type { IntegrationStatus } from "@fosl/contracts";
import { cn } from "../lib/utils";

const statusStyles: Record<IntegrationStatus, string> = {
  connected: "bg-green-100 text-green-800",
  syncing: "bg-primary-muted text-ink",
  error: "bg-red-100 text-red-800",
  disconnected: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<IntegrationStatus, string> = {
  connected: "Connected",
  syncing: "Syncing…",
  error: "Sync error",
  disconnected: "Disconnected",
};

export function IntegrationStatusBadge({
  status,
  className,
}: {
  status: IntegrationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
