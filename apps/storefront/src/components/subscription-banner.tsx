import type { SubscriptionState } from "@fosl/contracts";
import { AlertBanner } from "@fosl/ui";
import Link from "next/link";

const messages: Partial<Record<SubscriptionState, { title: string; body: string; variant: "warning" | "error" }>> = {
  past_due: {
    title: "Subscription past due",
    body: "Checkout may be limited until billing is updated.",
    variant: "warning",
  },
  grace_period: {
    title: "Grace period",
    body: "Your operator subscription is in grace period. Resolve billing to avoid suspension.",
    variant: "warning",
  },
  suspended: {
    title: "Storefront suspended",
    body: "Purchases are disabled until the operator subscription is reactivated.",
    variant: "error",
  },
  cancelled: {
    title: "Subscription cancelled",
    body: "This storefront is no longer accepting new orders.",
    variant: "error",
  },
};

export function SubscriptionBanner({ state = "active" }: { state?: SubscriptionState }) {
  const message = messages[state];
  if (!message) return null;

  return (
    <AlertBanner variant={message.variant} title={message.title} className="rounded-none border-x-0 border-t-0">
      {message.body}{" "}
      <Link href="/suspended" className="font-medium underline">
        Learn more
      </Link>
    </AlertBanner>
  );
}
