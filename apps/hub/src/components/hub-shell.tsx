"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@fosl/contracts";
import { demoSession } from "@fosl/mocks";
import { RoleSwitcher } from "@fosl/ui";
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
import { cn } from "@fosl/ui";

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
  const [session, setSession] = useState(demoSession);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = navByRole[session.activeRole] ?? vendorNav;

  function handleRoleChange(role: UserRole) {
    setSession((s) => ({ ...s, activeRole: role }));
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
        <div className="flex h-14 items-center border-b border-slate-200 px-4">
          <Link href="/" className="text-lg font-bold text-[#2E75B6]">
            FOSL Hub
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
                    ? "bg-blue-50 text-[#2E75B6]"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 text-xs text-slate-500">
          <Link href="/account" className="block font-medium text-slate-700 hover:text-[#2E75B6]">
            {session.name}
          </Link>
          <p>{session.email}</p>
          <Link href="/auth/sign-in" className="mt-2 block text-[#2E75B6] hover:underline">
            Sign out
          </Link>
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
