import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import type { UserRole } from "@fosl/contracts";
import { authConfig } from "@/auth.config";
import { isAuthEnabled } from "@/lib/auth-secret";

const { auth } = NextAuth(authConfig);

function hasAdminRole(roles: UserRole[] | undefined) {
  return roles?.includes("admin") ?? false;
}

export default auth((req) => {
  if (!isAuthEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isApiAuth =
    pathname.startsWith("/api/auth") || pathname.startsWith("/api/v1/auth");
  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/api/v1/settings");

  if (!req.auth && !isAuthRoute && !isApiAuth) {
    const signIn = new URL("/auth/sign-in", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }

  if (isAdminArea && req.auth && !hasAdminRole(req.auth.user?.roles)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
