import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { UserRole } from "@fosl/contracts";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth-secret";

type AuthResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse | null };

function userRoles(session: Session): UserRole[] {
  return session.user?.roles ?? [];
}

/** When auth is disabled (local mock), skip API guards. */
export async function requireSession(): Promise<AuthResult> {
  if (!isAuthEnabled()) {
    return { session: null, error: null };
  }

  const session = await auth();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { session, error: null };
}

export async function requireRoles(...roles: UserRole[]): Promise<AuthResult> {
  if (!isAuthEnabled()) {
    return { session: null, error: null };
  }

  const result = await requireSession();
  if (result.error || !result.session) return result;

  const allowed = roles.some((role) => userRoles(result.session).includes(role));
  if (!allowed) {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}

export async function requireAdmin(): Promise<AuthResult> {
  return requireRoles("admin");
}
