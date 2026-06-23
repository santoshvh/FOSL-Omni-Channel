import type { Metadata } from "next";
import "./globals.css";
import { HubProviders } from "@/components/hub-providers";

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
        <HubProviders>{children}</HubProviders>
      </body>
    </html>
  );
}
