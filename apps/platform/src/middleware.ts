import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@fosl/contracts";
import { getAuthSecret, isAuthEnabled, isHostedProductionHub } from "@/lib/auth-secret";

const WORKSPACE_ROUTES: { prefix: string; role: UserRole }[] = [
  { prefix: "/vendor", role: "vendor" },
  { prefix: "/creator", role: "creator" },
  { prefix: "/operator", role: "operator" },
];

function requestHostname(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = req.headers.get("host")?.split(":")[0]?.trim();
  return forwarded || host || req.nextUrl.hostname;
}

function hasAuthSessionCookie(req: NextRequest) {
  return (
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Host-authjs.session-token")
  );
}

function redirectToSignIn(req: NextRequest, pathname: string) {
  const signIn = new URL("/auth/sign-in", req.nextUrl.origin);
  signIn.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signIn);
}

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

function isProductionHost(req: NextRequest, hostname: string) {
  const hostHeader = req.headers.get("host") ?? "";
  return hostHeader.includes("foslone.com") || isHostedProductionHub(hostname);
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = requestHostname(req);

  if (hostname === "admin.foslone.com") {
    const platformBase =
      process.env.NEXT_PUBLIC_HUB_URL ?? "https://hub.foslone.com";
    const dest = new URL(platformBase);
    dest.pathname = pathname.startsWith("/admin")
      ? pathname
      : `/admin${pathname === "/" ? "" : pathname}`;
    dest.search = req.nextUrl.search;
    return NextResponse.redirect(dest);
  }

  const productionHost = isProductionHost(req, hostname);
  const authActive = productionHost || isAuthEnabled(hostname);

  if (authActive && !isPublicPath(pathname) && !hasAuthSessionCookie(req)) {
    if (pathname.startsWith("/api/")) return unauthorizedApi();
    return redirectToSignIn(req, pathname);
  }

  if (!authActive) return NextResponse.next();

  const token = await getToken({
    req,
    secret: getAuthSecret(),
  });

  if (token) {
    const roles = token.roles as UserRole[] | undefined;

    if (isAdminPath(pathname) && !hasRole(roles, "admin")) {
      if (pathname.startsWith("/api/")) return forbiddenApi();
      return NextResponse.redirect(new URL(roleHomePath(roles), req.nextUrl.origin));
    }

    const workspaceRole = workspaceRoleForPath(pathname);
    if (workspaceRole && !hasRole(roles, workspaceRole)) {
      if (pathname.startsWith("/api/")) return forbiddenApi();
      return NextResponse.redirect(new URL(roleHomePath(roles), req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
