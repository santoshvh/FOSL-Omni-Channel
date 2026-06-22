import type { Metadata } from "next";
import "./globals.css";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "FOSL Admin",
  description: "Platform administration console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
