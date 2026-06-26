import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FOSL Commerce API",
  description: "Headless commerce API for operator storefronts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
