"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@fosl/ui";
import { externalLinks } from "@/lib/foslone";

const linkClass =
  "whitespace-nowrap font-medium text-slate-600 transition-colors hover:text-ink";

type CustomerSession = { email: string; name: string };

export function FosloneNavLinks({ className = "" }: { className?: string }) {
  const [session, setSession] = useState<CustomerSession | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/customer-login")
      .then((r) => r.json())
      .then((json: { data?: CustomerSession | null }) => setSession(json.data ?? null))
      .catch(() => setSession(null));
  }, []);

  async function signOut() {
    await fetch("/api/v1/auth/customer-login", { method: "DELETE" });
    setSession(null);
    window.location.href = "/";
  }

  return (
    <nav className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${className}`}>
      <Link href="/marketplace" className={linkClass}>
        Marketplace
      </Link>
      <Link href="/incubations" className={linkClass}>
        Incubations
      </Link>
      <a
        href={externalLinks.socomOtt}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        SoComOTT
      </a>
      <Link href="/creator-support" className={linkClass}>
        Creator Support
      </Link>
      <Link href="/contact" className={linkClass}>
        Contact Us
      </Link>
      {session ? (
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[8rem] truncate text-slate-600 sm:inline" title={session.email}>
            {session.name}
          </span>
          <Button variant="outline" size="sm" type="button" onClick={signOut} className="shrink-0">
            Sign out
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </nav>
  );
}
