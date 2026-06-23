"use client";

import { SessionProvider } from "next-auth/react";
import { HubRoleProvider } from "@/components/hub-role-context";
import { MswInit } from "@/components/msw-init";
import { usePlatformConfig } from "@/lib/use-platform-config";

function HubMswGate({ children }: { children: React.ReactNode }) {
  const { config, loading } = usePlatformConfig();

  return (
    <>
      <MswInit apiMockingEnabled={loading ? null : config?.apiMocking.enabled} />
      {children}
    </>
  );
}

export function HubProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HubRoleProvider>
        <HubMswGate>{children}</HubMswGate>
      </HubRoleProvider>
    </SessionProvider>
  );
}
