import { HubShell } from "@/components/hub-shell";

export function DeferredFeatureNotice({
  title,
  description = "This feature requires additional database models and will ship in a follow-up release.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <HubShell>
      <div className="mx-auto max-w-lg rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-slate-600">{description}</p>
      </div>
    </HubShell>
  );
}
