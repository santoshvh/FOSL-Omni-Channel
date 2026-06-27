"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserRole } from "@fosl/contracts";
import { isAuthEnabled } from "@/lib/auth-secret";

type HubRoleContextValue = {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  roles: UserRole[];
};

const HubRoleContext = createContext<HubRoleContextValue | null>(null);

function roleFromPathname(pathname: string): UserRole | null {
  const match = pathname.match(/^\/(vendor|creator|operator)(\/|$)/);
  return (match?.[1] as UserRole) ?? null;
}

export function HubRoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: authSession } = useSession();

  const roles = useMemo(() => {
    if (authSession?.user?.roles?.length) return authSession.user.roles;
    if (!isAuthEnabled()) return ["vendor", "creator", "operator"] as UserRole[];
    return [];
  }, [authSession]);

  const pathRole = roleFromPathname(pathname);
  const sessionDefault = authSession?.user?.activeRole ?? roles[0] ?? "vendor";

  const [activeRole, setActiveRoleState] = useState<UserRole>(sessionDefault);

  useEffect(() => {
    if (pathRole && roles.includes(pathRole)) {
      setActiveRoleState(pathRole);
    }
  }, [pathRole, roles]);

  function setActiveRole(role: UserRole) {
    if (!roles.includes(role)) return;
    setActiveRoleState(role);
  }

  return (
    <HubRoleContext.Provider value={{ activeRole, setActiveRole, roles }}>
      {children}
    </HubRoleContext.Provider>
  );
}

export function useHubRole() {
  const context = useContext(HubRoleContext);
  if (!context) {
    throw new Error("useHubRole must be used within HubRoleProvider");
  }
  return context;
}
