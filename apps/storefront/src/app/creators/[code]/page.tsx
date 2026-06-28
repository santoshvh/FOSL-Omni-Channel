import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductTypeBadge, formatCurrency, Button } from "@fosl/ui";
import { getPublicCreatorByReferralCode, buildReferralProductUrl } from "@fosl/db";

function mapProductType(type: string) {
  if (type === "LEAD_GEN") return "lead_gen" as const;
  if (type === "DIGITAL") return "digital" as const;
  return "physical" as const;
}

export default async function PublicCreatorPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!process.env.DATABASE_URL?.trim()) notFound();

  const profile = await getPublicCreatorByReferralCode(code);
  if (!profile) notFound();

  const storefrontBase =
    process.env.NEXT_PUBLIC_STOREFRONT_URL?.replace(/\/$/, "") ?? "https://shop.foslone.com";

  const initials =
    profile.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? code.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.displayName ?? "Creator"}</h1>
            <p className="mt-1 text-slate-600">
              Curated picks from{" "}
              <span className="font-mono text-primary-dark">{profile.referralCode}</span>
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Featured products</h2>
        {profile.products.length === 0 ? (
          <p className="mt-4 text-slate-500">No promoted products yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.products.map(({ link, product }) => {
              const href = buildReferralProductUrl({
                baseUrl: storefrontBase,
                productId: product.id,
                refSlug: link.slug,
                addToCart: true,
              });
              return (
                <article
                  key={link.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <Link href={href} className="relative block h-40 bg-slate-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-4">
                    <ProductTypeBadge type={mapProductType(product.type)} />
                    <p className="mt-2 font-semibold">{product.title}</p>
                    <p className="text-sm text-slate-500">{product.vendor?.name ?? ""}</p>
                    <p className="mt-2 font-bold">
                      {product.priceCents > 0
                        ? formatCurrency(product.priceCents)
                        : "Free consultation"}
                    </p>
                    <Button asChild className="mt-4 w-full">
                      <Link href={href}>Shop with {profile.displayName?.split(" ")[0] ?? "creator"}</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
