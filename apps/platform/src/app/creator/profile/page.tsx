import Image from "next/image";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { Link2 } from "lucide-react";
import { auth } from "@/auth";
import { getCreatorProfileDetail } from "@fosl/db";

export default async function CreatorPublicProfilePage() {
  const session = await auth();
  const profile =
    process.env.DATABASE_URL && session?.user?.id
      ? await getCreatorProfileDetail(session.user.id)
      : null;

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "CR";

  const featured = (profile?.links ?? [])
    .map((link) => link.product)
    .filter((p): p is NonNullable<typeof p> => p != null)
    .slice(0, 3);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium uppercase text-slate-500">Public profile preview</p>
          <div className="mt-4 flex flex-wrap items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.displayName ?? "Creator"}</h1>
              <p className="mt-1 text-slate-600">
                Referral code{" "}
                <span className="font-mono text-primary-dark">{profile?.referralCode ?? "—"}</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Featured products</h2>
          {featured.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Create referral links to feature products on your public profile.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="relative h-32 bg-slate-100">
                    <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="200px" />
                  </div>
                  <div className="p-3">
                    <ProductTypeBadge
                      type={
                        p.type === "LEAD_GEN"
                          ? "lead_gen"
                          : (p.type.toLowerCase() as "physical" | "digital")
                      }
                    />
                    <p className="mt-1 font-medium">{p.title}</p>
                    <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                      <Link href="/creator/links">
                        <Link2 className="mr-1.5 h-4 w-4" />
                        Promote and earn
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
