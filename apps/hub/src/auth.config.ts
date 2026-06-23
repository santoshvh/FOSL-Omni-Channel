import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@fosl/contracts";
import { getAuthSecret } from "@/lib/auth-secret";

export const authConfig = {
  trustHost: true,
  secret: getAuthSecret(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [],
  callbacks: {
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
