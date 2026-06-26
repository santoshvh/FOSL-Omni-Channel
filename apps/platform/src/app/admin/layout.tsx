import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth-secret";

export const metadata: Metadata = {
  title: "FOSL Admin",
  description: "Platform administration console",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isAuthEnabled()) {
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
