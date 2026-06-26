import type { Session } from "next-auth";
import { getDefaultOperatorId, getOperatorForUserId } from "@fosl/db";
import { isAuthEnabled } from "@/lib/auth-secret";

/** Operator context for hub APIs — seeded demo operator when auth is off. */
export async function resolveOperatorIdForApi(
  session: Session | null
): Promise<string | null> {
  if (session?.user?.id) {
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
