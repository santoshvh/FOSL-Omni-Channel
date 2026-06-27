import { HubShell } from "@/components/hub-shell";
import { auth } from "@/auth";
import { listCreatorLinksForUser } from "@fosl/db";

export default async function ReferralTreePage() {
  const session = await auth();
  const profile =
    process.env.DATABASE_URL && session?.user?.id
      ? await listCreatorLinksForUser(session.user.id)
      : null;

  const links = profile?.links ?? [];

  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Referral links</h1>
          <p className="text-slate-600">
            Active attribution links for{" "}
            {profile?.displayName ?? profile?.referralCode ?? "your creator account"}
          </p>
        </div>

        {links.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            No referral links yet. Multi-level tree visualization requires a parent-child schema; use{" "}
            <a href="/creator/links" className="text-primary-dark hover:underline">
              Referral links
            </a>{" "}
            to manage flat links today.
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white">
            <ul className="divide-y">
              {links.map((link) => (
                <li key={link.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{link.product?.title ?? link.label ?? link.slug}</p>
                    <p className="font-mono text-xs text-slate-500">ref={link.slug}</p>
                  </div>
                  <span className="text-slate-600">{link.clickCount} clicks</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </HubShell>
  );
}
