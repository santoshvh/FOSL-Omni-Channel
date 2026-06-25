import { AlertBanner } from "@fosl/ui";
import Link from "next/link";

/** Shown when the signed-in user holds vendor + operator (or creator) roles. */
export function VendorConflictBanner() {
  return (
    <AlertBanner variant="warning" title="Conflict of interest notice">
      Your account is linked to both vendor and operator roles. Commission changes, self-referrals,
      and operator approvals involving your own catalog require platform review.{" "}
      <Link href="/account" className="font-medium underline">
        View account roles
      </Link>
    </AlertBanner>
  );
}
