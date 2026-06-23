"use client";

import { useState, useCallback } from "react";
import { Button, Input } from "@fosl/ui";
import { generateReferralLink, type ReferralLink } from "@/lib/referral";
import { Link2, Copy, Check, X } from "lucide-react";

export function CreatorEarnButton({
  productId,
  productTitle,
  variant = "default",
  className,
  onGenerated,
}: {
  productId: string;
  productTitle: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  onGenerated?: (link: ReferralLink) => void;
}) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<ReferralLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true);
      window.setTimeout(() => {
        const generated = generateReferralLink(productId);
        setLink(generated);
        setOpen(true);
        setLoading(false);
        onGenerated?.(generated);
      }, 400);
    },
    [productId, onGenerated]
  );

  const copyLink = useCallback(() => {
    if (!link) return;
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [link]);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        className={className}
        onClick={handleClick}
        disabled={loading}
      >
        <Link2 className="mr-1.5 h-4 w-4" />
        {loading ? "Generating…" : "Promote and earn"}
      </Button>

      {open && link && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="creator-dialog-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="creator-dialog-title" className="text-lg font-semibold">
                  Your referral link
                </h2>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{productTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              Share this link to earn commission as a Creator when someone purchases. Attribution
              window: 30 days (last click).
            </p>

            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500">Referral code</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-primary-dark">{link.code}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Input readOnly value={link.url} className="font-mono text-xs" aria-label="Referral URL" />
              <Button type="button" variant="outline" onClick={copyLink} aria-label="Copy link">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="mt-6 flex gap-2">
              <Button type="button" className="flex-1" onClick={copyLink}>
                Copy link
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
