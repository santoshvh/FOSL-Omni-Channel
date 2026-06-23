import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { UserRole } from "@fosl/contracts";
import type { UserRole as DbUserRole } from "@prisma/client";
import { authConfig } from "./auth.config";

const DEMO_PASSWORD = "demo123";

const demoUsers: Record<
  string,
  { password: string; name: string; roles: UserRole[]; activeRole: UserRole }
> = {
  "alex@acmecatalog.com": {
    password: DEMO_PASSWORD,
    name: "Alex Rivera",
    roles: ["vendor", "creator", "operator"],
    activeRole: "vendor",
  },
  "vendor@demo.fosl": {
    password: DEMO_PASSWORD,
    name: "Demo Vendor",
    roles: ["vendor"],
    activeRole: "vendor",
  },
  "creator@demo.fosl": {
    password: DEMO_PASSWORD,
    name: "Demo Creator",
    roles: ["creator"],
    activeRole: "creator",
  },
  "operator@demo.fosl": {
    password: DEMO_PASSWORD,
    name: "Demo Operator",
    roles: ["operator"],
    activeRole: "operator",
  },
  "admin@foslone.com": {
    password: DEMO_PASSWORD,
    name: "Platform Admin",
    roles: ["admin"],
    activeRole: "admin",
  },
};

function mapDbRole(role: DbUserRole): UserRole {
  return role.toLowerCase() as UserRole;
}

async function authorizeWithDatabase(email: string, password: string) {
  const { prisma } = await import("@fosl/db");
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roleAssignments: true },
  });
  if (!user?.passwordHash) return null;

  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  const roles = user.roleAssignments.map((r) => mapDbRole(r.role));
  const activeRole = roles.includes("vendor")
    ? "vendor"
    : roles.includes("operator")
      ? "operator"
      : roles.includes("creator")
        ? "creator"
        : roles[0];

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? email,
    roles,
    activeRole,
  };
}

function authorizeDemo(email: string, password: string) {
  const demo = demoUsers[email.toLowerCase()];
  if (!demo || demo.password !== password) return null;
  return {
    id: `demo_${email}`,
    email,
    name: demo.name,
    roles: demo.roles,
    activeRole: demo.activeRole,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";
        if (!email || !password) return null;

        if (process.env.DATABASE_URL) {
          try {
            const user = await authorizeWithDatabase(email, password);
            if (user) return user;
          } catch (err) {
            console.error("[auth] database authorize failed:", err);
          }
        }

        return authorizeDemo(email, password);
      },
    }),
  ],
});
