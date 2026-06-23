import type { UserRole } from "@fosl/contracts";
import { ChevronDown, Users } from "lucide-react";
import { roleLabels } from "../tokens";
import { cn } from "../lib/utils";

const hubRoles: UserRole[] = ["vendor", "creator", "operator"];

export function RoleSwitcher({
  roles,
  activeRole,
  onRoleChange,
  className,
}: {
  roles: UserRole[];
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}) {
  const available = hubRoles.filter((r) => roles.includes(r));

  return (
    <div className={cn("relative inline-block", className)}>
      <label className="sr-only">Active role</label>
      <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
        <Users className="h-4 w-4 text-primary-dark" aria-hidden />
        <select
          value={activeRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className="cursor-pointer appearance-none bg-transparent pr-6 font-medium text-slate-900 focus:outline-none"
          aria-label="Switch role"
        >
          {available.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}
