import Image from "next/image";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { Link2, ExternalLink } from "lucide-react";
import { auth } from "@/auth";
import { getCreatorProfileDetail } from "@fosl/db";

function mapProductType(type: string) {
  if (type === "LEAD_GEN") return "lead_gen" as const;
  if (type === "DIGITAL") return "digital" as const;
  return "physical" as const;
}

export default async function CreatorPublicProfilePage() {
  const session = await auth();
  const profile =
    process.env.DATABASE_URL && session?.user?.id
      ? await getCreatorProfileDetail(session.user.id)
      : null;

  const storefrontBase =
    process.env.NEXT_PUBLIC_STOREFRONT_URL?.replace(/\/$/, "") ?? "https://shop.foslone.com";
  const publicProfileUrl = profile?.referralCode
    ? `${storefrontBase}/creators/${profile.referralCode}`
    : null;

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "CR";

  const productLinks = (profile?.links ?? []).filter((l) => l.product);
  const featuredLinks = productLinks.filter((l) => l.featured);
  const featured = (featuredLinks.length > 0 ? featuredLinks : productLinks)
    .map((l) => ({ link: l, product: l.product! }))
    .slice(0, 6);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium uppercase text-slate-500">Public profile preview</p>
          <div className="mt-4 flex flex-wrap items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">{profile?.displayName ?? "Creator"}</h1>
              <p className="mt-1 text-slate-600">
                Referral code{" "}
                <span className="font-mono text-primary-dark">{profile?.referralCode ?? "—"}</span>
              </p>
              {publicProfileUrl ? (
                <p className="mt-2 text-sm">
                  <a
                    href={publicProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary-dark hover:underline"
                  >
                    {publicProfileUrl}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Featured products</h2>
            <p className="text-sm text-slate-500">
              Pin products from{" "}
              <Link href="/creator/links" className="text-primary-dark hover:underline">
                Referral links
              </Link>
            </p>
          </div>
          {featured.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Create referral links and pin them as featured to show on your public profile.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(({ link, product: p }) => (
                <div key={p.id} className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="relative h-32 bg-slate-100">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <ProductTypeBadge type={mapProductType(p.type)} />
                      {link.featured ? (
                        <span className="text-xs font-medium text-primary-dark">Featured</span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-medium">{p.title}</p>
                    <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                      <Link href="/creator/links">
                        <Link2 className="mr-1.5 h-4 w-4" />
                        Manage link
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HubShell>
  );
}
