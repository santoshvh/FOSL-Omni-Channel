import { cn } from "../lib/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const variants = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

export function AlertBanner({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = icons[variant];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 text-sm", variants[variant], className)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <div className={title ? "mt-1 opacity-90" : ""}>{children}</div>
      </div>
    </div>
  );
}
