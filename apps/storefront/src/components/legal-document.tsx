import Link from "next/link";
import type { LegalPageSlug } from "@/lib/legal";
import { LEGAL_LAST_UPDATED, legalPages } from "@/lib/legal";
import { legalContent, type LegalSection } from "@/lib/legal-content";

function LegalSectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-lg font-bold text-ink">{section.title}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-slate-600">
          {paragraph}
        </p>
      ))}
      {section.list && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
          {section.list.map((item) => (
            <li key={item.slice(0, 48)} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LegalDocument({
  slug,
  title,
  description,
}: {
  slug: LegalPageSlug;
  title: string;
  description: string;
}) {
  const content = legalContent[slug];
  const otherPages = legalPages.filter((p) => p.slug !== slug);

  return (
    <div className="ecom-container max-w-3xl py-12">
      <nav className="text-sm text-slate-500">
        <Link href="/legal" className="hover:text-ink">
          Legal
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <h1 className="ecom-section-title mt-6">{title}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LEGAL_LAST_UPDATED}</p>

      {content.intro && (
        <div className="mt-8 space-y-3 border-b border-slate-100 pb-8">
          {content.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="leading-relaxed text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      <article className="mt-8 space-y-10">
        {content.sections.map((section) => (
          <LegalSectionBlock key={section.id} section={section} />
        ))}
      </article>

      <aside className="mt-12 rounded-2xl border border-slate-100 bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Other policies
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {otherPages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/legal/${page.slug}`}
                className="text-sm font-medium text-ink hover:text-primary-dark"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          These policies are provided for transparency and operational guidance. They do not
          constitute legal advice. Consult qualified counsel for jurisdiction-specific
          requirements before production launch.
        </p>
      </aside>
    </div>
  );
}
