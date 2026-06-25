import type { UserRole } from "@fosl/contracts";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      roles: UserRole[];
      activeRole: UserRole;
    };
  }

  interface User {
    roles: UserRole[];
    activeRole: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: UserRole[];
    activeRole?: UserRole;
  }
}
