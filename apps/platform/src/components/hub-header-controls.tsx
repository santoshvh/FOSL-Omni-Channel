"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole, UserSession } from "@fosl/contracts";
import { cn, roleLabels } from "@fosl/ui";
import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Settings,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useClickOutside } from "@/lib/use-click-outside";

type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

const hubRoles: UserRole[] = ["vendor", "creator", "operator"];

function formatWhen(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString();
}

function roleProfileHref(role: UserRole) {
  if (role === "creator") return "/creator/profile";
  if (role === "operator") return "/operator/storefront";
  return "/vendor";
}

export function HubUserMenu({
  session,
  onRoleChange,
  onSignOut,
}: {
  session: UserSession;
  onRoleChange: (role: UserRole) => void;
  onSignOut: () => void;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const available = hubRoles.filter((r) => session.roles.includes(r));
  const initials = session.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(menuRef, close, open);

  function switchRole(role: UserRole) {
    onRoleChange(role);
    close();
    router.push(`/${role}`);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-left shadow-sm transition",
          "hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30",
          open && "border-primary/40 ring-2 ring-primary/20"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initials || "U"}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-semibold text-ink leading-tight">
            {session.name}
          </span>
          <span className="block text-xs text-slate-500">{roleLabels[session.activeRole]}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-slate-400 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="border-b border-slate-100 bg-surface/80 px-4 py-3">
            <p className="font-semibold text-ink">{session.name}</p>
            <p className="truncate text-xs text-slate-500">{session.email}</p>
          </div>

          <div className="border-b border-slate-100 p-2">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <div className="space-y-0.5">
              {available.map((role) => {
                const active = session.activeRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    role="menuitem"
                    onClick={() => switchRole(role)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                      active
                        ? "bg-primary/15 font-medium text-ink"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {roleLabels[role]}
                    {active ? <Check className="h-4 w-4 text-primary-dark" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/account"
              role="menuitem"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <User className="h-4 w-4 text-slate-400" />
              Account
            </Link>
            <Link
              href="/account/edit"
              role="menuitem"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <UserCircle className="h-4 w-4 text-slate-400" />
              Edit profile
            </Link>
            <Link
              href={roleProfileHref(session.activeRole)}
              role="menuitem"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <User className="h-4 w-4 text-slate-400" />
              {session.activeRole === "creator" ? "Public profile" : "Workspace home"}
            </Link>
            <Link
              href="/notifications"
              role="menuitem"
              onClick={close}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                onSignOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HubNotifications() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(panelRef, close, open);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/notifications");
      if (!res.ok) return;
      const json = (await res.json()) as {
        data?: NotificationItem[];
        unreadCount?: number;
      };
      setItems(Array.isArray(json.data) ? json.data : []);
      setUnreadCount(json.unreadCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function markRead(id: string) {
    const res = await fetch(`/api/v1/notifications/${id}`, { method: "PATCH" });
    if (res.ok) await load();
  }

  async function clearOne(id: string) {
    const res = await fetch(`/api/v1/notifications/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function markAllRead() {
    const res = await fetch("/api/v1/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read_all" }),
    });
    if (res.ok) await load();
  }

  async function clearAll() {
    const res = await fetch("/api/v1/notifications", { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative rounded-xl p-2.5 text-slate-500 transition hover:bg-surface hover:text-ink",
          open && "bg-surface text-ink"
        )}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="font-semibold text-ink">Notifications</p>
            <button
              type="button"
              onClick={close}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  const unread = !item.readAt;
                  const content = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-snug",
                            unread ? "font-semibold text-ink" : "text-slate-700"
                          )}
                        >
                          {item.title}
                        </p>
                        {unread ? (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        ) : null}
                      </div>
                      {item.body ? (
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
                      ) : null}
                      <p className="mt-2 text-[10px] text-slate-400">{formatWhen(item.createdAt)}</p>
                    </>
                  );

                  return (
                    <li
                      key={item.id}
                      className={cn("px-4 py-3", unread && "bg-primary/5")}
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (unread) void markRead(item.id);
                            close();
                          }}
                          className="block hover:opacity-90"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div>{content}</div>
                      )}
                      <div className="mt-2 flex gap-2">
                        {unread ? (
                          <button
                            type="button"
                            onClick={() => markRead(item.id)}
                            className="text-xs font-medium text-primary-dark hover:underline"
                          >
                            Mark read
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => clearOne(item.id)}
                          className="text-xs text-slate-500 hover:text-red-600 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 ? (
            <div className="flex border-t border-slate-100">
              <button
                type="button"
                onClick={markAllRead}
                className="flex-1 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 border-l border-slate-100 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
