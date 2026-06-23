import Link from "next/link";
import { Button } from "@fosl/ui";
import { externalLinks, hubLoginUrl } from "@/lib/foslone";

const linkClass =
  "whitespace-nowrap font-medium text-slate-600 transition-colors hover:text-ink";

export function FosloneNavLinks({ className = "" }: { className?: string }) {
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
      <Button variant="outline" size="sm" asChild className="shrink-0">
        <a href={hubLoginUrl}>Login</a>
      </Button>
    </nav>
  );
}
