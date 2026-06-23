import type { Metadata } from "next";
import "./globals.css";
import { AdminShell } from "@/components/admin-shell";
import { MswInit } from "@/components/msw-init";

export const metadata: Metadata = {
  title: "FOSL Admin",
  description: "Platform administration console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MswInit />
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
