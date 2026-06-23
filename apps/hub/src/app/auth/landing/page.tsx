import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fosl/ui";
import { Package, Link2, Store, Shield, ShoppingBag, Globe } from "lucide-react";

const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3001";
const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002";

const roles = [
  {
    href: "/vendor",
    icon: Package,
    title: "Vendor / Seller",
    description: "Catalog, integrations, shipping, payouts",
  },
  {
    href: "/creator",
    icon: Link2,
    title: "Creator",
    description: "Referral links, collections, earnings",
  },
  {
    href: "/operator",
    icon: Store,
    title: "Operator",
    description: "Storefront curation, commissions, subscription",
  },
  {
    href: storefrontUrl,
    external: true,
    icon: ShoppingBag,
    title: "Customer / Buyer",
    description: "Shop on operator storefronts",
  },
  {
    href: `${storefrontUrl}/marketplace`,
    external: true,
    icon: Globe,
    title: "Marketplace",
    description: "FOSLOne network-wide discovery",
  },
  {
    href: adminUrl,
    external: true,
    icon: Shield,
    title: "Platform Admin",
    description: "Operators, disputes, system health",
  },
];

export default function AuthLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-dark">
            FOSLOne Hub
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Choose your workspace</h1>
          <p className="mt-2 text-slate-600">
            Incubated by AIOne — social eCommerce for vendors, Creators, and operators
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const inner = (
              <Card className="h-full transition hover:border-primary hover:shadow-md">
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary-dark" />
                  <CardTitle className="mt-2 text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary-dark">Open →</span>
                </CardContent>
              </Card>
            );
            return role.external ? (
              <a key={role.title} href={role.href} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <Link key={role.title} href={role.href}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
