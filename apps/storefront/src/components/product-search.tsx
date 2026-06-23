"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input, formatCurrency } from "@fosl/ui";
import { products, searchMarketplaceProducts } from "@fosl/mocks";

export function ProductSearch({
  action,
  name = "q",
  className = "",
}: {
  action: string;
  name?: string;
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isMarketplace = action.includes("marketplace");

  const results =
    query.length >= 2
      ? (isMarketplace ? searchMarketplaceProducts(query) : products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(query.toLowerCase())
        )).slice(0, 5)
      : [];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function goSearch(q: string) {
    const params = new URLSearchParams();
    params.set(name, q);
    router.push(`${action}?${params.toString()}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        action={action}
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) goSearch(query.trim());
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={isMarketplace ? "Search products, vendors…" : "Search products…"}
          className="pl-9"
          autoComplete="off"
        />
      </form>
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => goSearch(p.title)}
              >
                <span className="font-medium line-clamp-1">{p.title}</span>
                <span className="text-xs text-slate-500">
                  {p.vendorName} · {p.priceCents > 0 ? formatCurrency(p.priceCents) : "Request info"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
