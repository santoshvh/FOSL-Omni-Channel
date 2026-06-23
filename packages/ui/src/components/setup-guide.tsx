import { cn } from "../lib/utils";

export type SetupGuideStep = {
  title: string;
  body: string;
};

export type SetupGuideTerm = {
  term: string;
  definition: string;
};

export function SetupGuide({
  title = "How to set this up",
  steps,
  terms,
  note,
  className,
}: {
  title?: string;
  steps: SetupGuideStep[];
  terms?: SetupGuideTerm[];
  note?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700",
        className
      )}
    >
      <h2 className="font-semibold text-ink">{title}</h2>

      <ol className="mt-4 list-none space-y-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <div>
              <p className="font-medium text-ink">{step.title}</p>
              <p className="mt-1 text-slate-600">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {terms && terms.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="font-medium text-ink">Terminology</p>
          <dl className="mt-2 space-y-2">
            {terms.map((item) => (
              <div key={item.term}>
                <dt className="font-medium text-slate-800">{item.term}</dt>
                <dd className="text-slate-600">{item.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {note && (
        <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500">{note}</p>
      )}
    </aside>
  );
}
