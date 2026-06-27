import Link from "next/link";
import { redirect } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const name = session.user.name ?? session.user.email ?? "User";
  const roles = session.user.roles ?? [];

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-slate-600">Profile and connected services</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/account/edit">Edit profile</Link>
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              {name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-slate-500">{session.user.email}</p>
              <p className="mt-1 text-sm text-slate-500">Roles: {roles.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Stripe Connect</h2>
          <p className="mt-2 text-sm text-green-600">Active — payouts enabled</p>
          <Button variant="outline" size="sm" className="mt-3">
            Open Stripe Express
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Preferences</h2>
          <p className="mt-2 text-sm text-slate-600">Email and in-app notification settings</p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link href="/notifications">Notification preferences</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
