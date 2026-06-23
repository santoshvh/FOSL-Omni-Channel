import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubShell } from "@/components/hub-shell";

const pages: Record<string, { title: string; body: string }> = {
  terms: {
    title: "Terms of Service",
    body: "By using the FOSL Hub you agree to platform terms governing vendor listings, creator programs, and operator storefronts. Production deployments should replace this placeholder with counsel-reviewed terms.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "We process account, catalog, and order data to operate multi-vendor commerce. Production deployments should replace this placeholder with a full privacy policy covering cookies, payment processors, and data retention.",
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return { title: "Legal — FOSL Hub" };
  return { title: `${page.title} — FOSL Hub` };
}

export default async function HubLegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <HubShell>
      <article className="prose prose-slate mx-auto max-w-3xl">
        <h1>{page.title}</h1>
        <p>{page.body}</p>
      </article>
    </HubShell>
  );
}
