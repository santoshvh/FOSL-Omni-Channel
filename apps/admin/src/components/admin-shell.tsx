"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Scale, FileText, CreditCard, Activity } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/operators", label: "Operators", icon: Users },
  { href: "/disputes", label: "Disputes", icon: Scale },
  { href: "/audit", label: "Audit logs", icon: FileText },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/subscription-plans", label: "Plans", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: FileText },
  { href: "/health", label: "System health", icon: Activity },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-slate-200 bg-white">
        <div className="flex h-14 items-center border-b px-4 font-bold text-[#2E75B6]">
          FOSL Admin
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
