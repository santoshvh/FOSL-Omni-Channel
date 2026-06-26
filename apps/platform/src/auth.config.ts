import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@fosl/contracts";
import { isAuthEnabled } from "@/lib/auth-secret";

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/v1/auth") ||
    pathname.startsWith("/api/webhooks") ||
    pathname === "/api/v1/platform-config"
  );
}

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (isPublicPath(pathname)) return true;

      const hostname =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().split(":")[0] ||
        request.headers.get("host")?.split(":")[0]?.trim() ||
        request.nextUrl.hostname;

      if (!isAuthEnabled(hostname)) return true;
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.activeRole = user.activeRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.roles = (token.roles as UserRole[]) ?? [];
        session.user.activeRole = (token.activeRole as UserRole) ?? "vendor";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
