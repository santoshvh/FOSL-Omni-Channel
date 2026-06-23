import type { Metadata } from "next";
import "./globals.css";
import { MswInit } from "@/components/msw-init";

export const metadata: Metadata = {
  title: "FOSL Hub",
  description: "Vendor, Creator, and Operator workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MswInit />
        {children}
      </body>
    </html>
  );
}
