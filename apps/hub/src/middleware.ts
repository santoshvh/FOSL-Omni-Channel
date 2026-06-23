import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { isAuthEnabled } from "@/lib/auth-secret";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!isAuthEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isApiAuth =
    pathname.startsWith("/api/auth") || pathname.startsWith("/api/v1/auth");

  if (!req.auth && !isAuthRoute && !isApiAuth) {
    const signIn = new URL("/auth/sign-in", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
