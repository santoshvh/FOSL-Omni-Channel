import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import type { UserRole } from "@fosl/contracts";
import { authConfig } from "@/auth.config";
import { isAuthEnabled } from "@/lib/auth-secret";

const { auth } = NextAuth(authConfig);

function requestHostname(req: { headers: Headers; nextUrl: URL }) {
  const forwarded = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = req.headers.get("host")?.split(":")[0]?.trim();
  return forwarded || host || req.nextUrl.hostname;
}

const WORKSPACE_ROUTES: { prefix: string; role: UserRole }[] = [
  { prefix: "/vendor", role: "vendor" },
  { prefix: "/creator", role: "creator" },
  { prefix: "/operator", role: "operator" },
];

function hasRole(roles: UserRole[] | undefined, role: UserRole) {
  return roles?.includes(role) ?? false;
}

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/v1/auth") ||
    pathname.startsWith("/api/webhooks") ||
    pathname === "/api/v1/platform-config"
  );
}

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/v1/settings");
}

function workspaceRoleForPath(pathname: string): UserRole | null {
  for (const { prefix, role } of WORKSPACE_ROUTES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return role;
  }
  return null;
}

function roleHomePath(roles: UserRole[] | undefined) {
  if (hasRole(roles, "admin")) return "/admin";
  if (hasRole(roles, "vendor")) return "/vendor";
  if (hasRole(roles, "operator")) return "/operator";
  if (hasRole(roles, "creator")) return "/creator";
  return "/";
}

function unauthorizedApi() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function forbiddenApi() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Legacy admin subdomain → platform /admin (same WebApp on ICDSoft)
  if (req.nextUrl.hostname === "admin.foslone.com") {
    const platformBase =
      process.env.NEXT_PUBLIC_HUB_URL ?? "https://hub.foslone.com";
    const dest = new URL(platformBase);
    dest.pathname = pathname.startsWith("/admin")
      ? pathname
      : `/admin${pathname === "/" ? "" : pathname}`;
    dest.search = req.nextUrl.search;
    return NextResponse.redirect(dest);
  }

  if (!isAuthEnabled(requestHostname(req))) return NextResponse.next();

  const isApi = pathname.startsWith("/api/");
  const isPublic = isPublicPath(pathname);

  if (!req.auth?.user && !isPublic) {
    if (isApi) return unauthorizedApi();
    const signIn = new URL("/auth/sign-in", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }

  if (req.auth?.user) {
    const roles = req.auth.user?.roles;

    if (isAdminPath(pathname) && !hasRole(roles, "admin")) {
      if (isApi) return forbiddenApi();
      return NextResponse.redirect(new URL(roleHomePath(roles), req.nextUrl.origin));
    }

    const workspaceRole = workspaceRoleForPath(pathname);
    if (workspaceRole && !hasRole(roles, workspaceRole)) {
      if (isApi) return forbiddenApi();
      return NextResponse.redirect(new URL(roleHomePath(roles), req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
