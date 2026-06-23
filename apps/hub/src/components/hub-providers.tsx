"use client";

import { SessionProvider } from "next-auth/react";
import { HubRoleProvider } from "@/components/hub-role-context";

export function HubProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HubRoleProvider>{children}</HubRoleProvider>
    </SessionProvider>
  );
}
