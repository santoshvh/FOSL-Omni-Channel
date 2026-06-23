"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import type { UserRole, UserSession } from "@fosl/contracts";
import { demoSession } from "@fosl/mocks";
import { RoleSwitcher, FoslLogo, cn } from "@fosl/ui";
import { useHubRole } from "@/components/hub-role-context";
import {
  LayoutDashboard,
  Package,
  Link2,
  Store,
  Settings,
  Menu,
  X,
  Bell,
  Plug,
  Truck,
  Users,
  BarChart3,
  Wallet,
} from "lucide-react";

const vendorNav = [
  { href: "/vendor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/catalog", label: "Catalog", icon: Package },
  { href: "/vendor/integrations", label: "Integrations", icon: Plug },
  { href: "/vendor/shipping", label: "Shipping", icon: Truck },
  { href: "/vendor/relationships", label: "Operators", icon: Users },
  { href: "/vendor/orders", label: "Orders", icon: Package },
  { href: "/vendor/coupons", label: "Coupons", icon: Package },
  { href: "/vendor/campaigns", label: "Campaigns", icon: BarChart3 },
  { href: "/vendor/payouts", label: "Payouts", icon: Wallet },
  { href: "/vendor/analytics", label: "Analytics", icon: BarChart3 },
];

const creatorNav = [
  { href: "/creator", label: "Dashboard", icon: LayoutDashboard },
  { href: "/creator/links", label: "Referral links", icon: Link2 },
  { href: "/creator/collections", label: "Collections", icon: Package },
  { href: "/creator/coupons", label: "Coupons", icon: Package },
  { href: "/creator/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/creator/referral-tree", label: "Referral tree", icon: Users },
  { href: "/creator/profile", label: "Public profile", icon: Store },
  { href: "/creator/payouts", label: "Earnings", icon: Wallet },
];

const operatorNav = [
  { href: "/operator", label: "Dashboard", icon: LayoutDashboard },
  { href: "/operator/catalog", label: "Catalog", icon: Package },
  { href: "/operator/vendors", label: "Vendors", icon: Users },
  { href: "/operator/creators", label: "Creators", icon: Link2 },
  { href: "/operator/orders", label: "Orders", icon: Package },
  { href: "/operator/coupons", label: "Coupons", icon: Package },
  { href: "/operator/commissions", label: "Commissions", icon: BarChart3 },
  { href: "/operator/promotions", label: "Promotions", icon: Package },
  { href: "/operator/lead-gen", label: "Lead gen", icon: Users },
  { href: "/operator/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/operator/payouts", label: "Payouts", icon: Wallet },
  { href: "/operator/storefront", label: "Storefront", icon: Store },
  { href: "/operator/subscription", label: "Subscription", icon: Settings },
];

const navByRole: Record<string, typeof vendorNav> = {
  vendor: vendorNav,
  creator: creatorNav,
  operator: operatorNav,
};

export function HubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: authSession, status } = useSession();
  const { activeRole, setActiveRole, roles } = useHubRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const session: UserSession = useMemo(() => {
    if (authSession?.user?.email) {
      return {
        userId: authSession.user.id,
        email: authSession.user.email,
        name: authSession.user.name ?? authSession.user.email,
        roles,
        activeRole,
      };
    }
    return { ...demoSession, roles, activeRole };
  }, [authSession, activeRole, roles]);

  const nav = navByRole[session.activeRole] ?? vendorNav;

  function handleRoleChange(role: UserRole) {
    if (!session.roles.includes(role)) return;
    setActiveRole(role);
    router.push(`/${role}`);
  }

  async function handleSignOut() {
    if (authSession) {
      await signOut({ callbackUrl: "/auth/sign-in" });
      return;
    }
    window.location.href = "/auth/sign-in";
  }

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-100 px-4">
          <Link href="/" className="shrink-0">
            <FoslLogo height={30} />
          </Link>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== `/${session.activeRole}` &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-600 hover:bg-primary-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 text-xs text-slate-500">
          <Link href="/account" className="block font-medium text-ink hover:text-primary-dark">
            {session.name}
          </Link>
          <p>{session.email}</p>
          {status === "loading" ? (
            <p className="mt-2 text-slate-400">Loading session…</p>
          ) : (
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 block font-medium text-primary-dark hover:underline"
            >
              Sign out
            </button>
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <a
            href={process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3001"}
            className="hidden text-sm font-medium text-slate-600 hover:text-ink sm:inline"
          >
            Storefront
          </a>
          <RoleSwitcher
            roles={session.roles}
            activeRole={session.activeRole}
            onRoleChange={handleRoleChange}
          />
          <button className="rounded-md p-2 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5 text-slate-500" />
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
