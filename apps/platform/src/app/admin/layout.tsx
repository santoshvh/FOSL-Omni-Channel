import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { auth } from "@/auth";
import { isHostedProductionHub } from "@/lib/auth-secret";

export const metadata: Metadata = {
  title: "FOSL Admin",
  description: "Platform administration console",
};

export const dynamic = "force-dynamic";

function isAdminAuthOptional(hostname: string | null) {
  if (isHostedProductionHub(hostname ?? undefined)) return false;

  return (
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_ENABLED?.trim().toLowerCase() === "false"
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hostname = (await headers()).get("host")?.split(":")[0] ?? null;

  if (!isAdminAuthOptional(hostname)) {
    const session = await auth();
    if (!session?.user) {
      redirect("/auth/sign-in?callbackUrl=/admin");
    }
    if (!session.user.roles?.includes("admin")) {
      redirect("/");
    }
  }

  return <AdminShell>{children}</AdminShell>;
}
