import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { getLegalPage, legalPages, type LegalPageSlug } from "@/lib/legal";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: "Legal — FOSLOne" };
  return {
    title: `${page.title} — FOSLOne`,
    description: page.description,
  };
}

export default async function LegalSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <LegalDocument
      slug={page.slug as LegalPageSlug}
      title={page.title}
      description={page.description}
    />
  );
}
