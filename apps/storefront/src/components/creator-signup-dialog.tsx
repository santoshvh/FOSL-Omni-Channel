"use client";

import Link from "next/link";
import { Button } from "@fosl/ui";
import { hubRegisterUrlForCreator, hubSignInUrlForCreator } from "@/lib/creator-session";
import { usePlatformUrls } from "@/lib/platform-urls-context";
import { DollarSign, Link2, Sparkles, TrendingUp, X } from "lucide-react";

type CreatorSignupDialogProps = {
  productTitle: string;
  onClose: () => void;
};

export function CreatorSignupDialog({ productTitle, onClose }: CreatorSignupDialogProps) {
  const urls = usePlatformUrls();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-signup-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="creator-signup-title" className="text-lg font-semibold">
              Sign up to promote and earn
            </h2>
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{productTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Create a free FOSL Creator account to get your own referral link for this product. When
          someone buys through your link, you earn commission — tracked automatically.
        </p>

        <ul className="mt-5 space-y-3 text-sm text-slate-700">
          <li className="flex gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span>
              <strong>Your unique link</strong> — every Creator gets their own code per product, so
              your referrals are always attributed to you.
            </span>
          </li>
          <li className="flex gap-3">
            <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span>
              <strong>Share anywhere</strong> — social, email, or your site. We track clicks and
              sales in your Creator dashboard.
            </span>
          </li>
          <li className="flex gap-3">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span>
              <strong>30-day attribution</strong> — if someone clicks your link and buys within 30
              days, you get credit (last click wins).
            </span>
          </li>
          <li className="flex gap-3">
            <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span>
              <strong>Paid commissions</strong> — earn a percentage on each qualifying sale; payouts
              go to your connected account via Stripe.
            </span>
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" asChild>
            <Link href={hubRegisterUrlForCreator(urls)}>Create free account</Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href={hubSignInUrlForCreator(urls)}>Sign in</Link>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already shopping? Sign up takes less than a minute — then come back and tap Promote and
          earn again to copy your link.
        </p>
      </div>
    </div>
  );
}
