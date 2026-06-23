import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";

export const metadata: Metadata = {
  title: "FOSLOne — Social eCommerce",
  description:
    "FOSLOne supports communities with social eCommerce — incubated by AIOne. Marketplace, Creators, and seller tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
