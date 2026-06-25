"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Scale,
  FileText,
  CreditCard,
  Activity,
  Settings,
  Bell,
  Search,
  TrendingUp,
} from "lucide-react";
import { FoslLogo, cn } from "@fosl/ui";
import { MswInit } from "@/components/msw-init";
import { usePlatformConfig } from "@/lib/use-platform-config";

const ADMIN = "/admin";

const nav = [
  { href: ADMIN, label: "Dashboard", icon: LayoutDashboard },
  { href: `${ADMIN}/operators`, label: "Operators", icon: Users },
  { href: `${ADMIN}/disputes`, label: "Disputes", icon: Scale },
  { href: `${ADMIN}/payments`, label: "Payments", icon: CreditCard },
  { href: `${ADMIN}/subscription-plans`, label: "Plans", icon: TrendingUp },
  { href: `${ADMIN}/audit`, label: "Audit logs", icon: FileText },
  { href: `${ADMIN}/health`, label: "System health", icon: Activity },
  { href: `${ADMIN}/settings`, label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { config, loading } = usePlatformConfig();

  return (
    <div className="flex min-h-screen bg-surface">
      <MswInit apiMockingEnabled={loading ? null : config?.apiMocking.enabled} />
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white shadow-xl">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link href={ADMIN} className="rounded-lg bg-white px-2 py-1.5">
            <FoslLogo height={28} />
          </Link>
        </div>
        <p className="px-5 pt-4 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Platform admin
        </p>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === ADMIN
                ? pathname === ADMIN
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-white/50">
          FOSL Omni-Channel · Phase B
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search operators, disputes…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-surface pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-surface hover:text-ink"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">Platform Admin</p>
              <p className="text-xs text-slate-500">admin@fosl.io</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
