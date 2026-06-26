import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "FOSL Admin",
  description: "Platform administration console",
};

export const dynamic = "force-dynamic";

function isAdminAuthOptional() {
  const hubUrl =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_HUB_URL?.trim() ||
    "";
  if (hubUrl.includes("foslone.com")) return false;

  return (
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_ENABLED?.trim().toLowerCase() === "false"
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthOptional()) {
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
