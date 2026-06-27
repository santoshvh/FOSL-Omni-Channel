import type { Session } from "next-auth";
import {
  getCreatorProfileForUserId,
  getDefaultOperatorId,
  getDefaultVendorId,
  getOperatorForUserId,
  getVendorForUserId,
} from "@fosl/db";
import { isAuthEnabled } from "@/lib/auth-secret";

function isDbUserId(userId: string | undefined): userId is string {
  return Boolean(userId && !userId.startsWith("demo_"));
}

/** Operator context for hub APIs — seeded default when auth is off. */
export async function resolveOperatorIdForApi(
  session: Session | null
): Promise<string | null> {
  if (isDbUserId(session?.user?.id)) {
    const operator = await getOperatorForUserId(session.user.id);
    if (operator) return operator.id;
  }

  if (!isAuthEnabled()) {
    if (process.env.DATABASE_URL) {
      return getDefaultOperatorId();
    }
    return "op_1";
  }

  return null;
}

/** Vendor context for hub APIs — membership or dev default. */
export async function resolveVendorIdForApi(
  session: Session | null
): Promise<string | null> {
  if (isDbUserId(session?.user?.id)) {
    const vendor = await getVendorForUserId(session.user.id);
    if (vendor) return vendor.id;
  }

  if (!isAuthEnabled()) {
    if (process.env.DATABASE_URL) {
      return getDefaultVendorId();
    }
    return "ven_1";
  }

  return null;
}

/** Creator profile id for hub APIs. */
export async function resolveCreatorProfileIdForApi(
  session: Session | null
): Promise<string | null> {
  if (isDbUserId(session?.user?.id)) {
    const profile = await getCreatorProfileForUserId(session.user.id);
    if (profile) return profile.id;
  }

  return null;
}
