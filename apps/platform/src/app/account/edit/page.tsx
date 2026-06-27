import Link from "next/link";
import { redirect } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";
import { auth } from "@/auth";

export default async function AccountEditPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account/edit");
  }

  const name = session.user.name ?? "";
  const email = session.user.email ?? "";

  return (
    <HubShell>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit profile</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/account">Cancel</Link>
          </Button>
        </div>
        <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="name">Display name</Label>
            <Input id="name" name="name" defaultValue={name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={email} className="mt-1" readOnly />
          </div>
          <Button type="submit" disabled>
            Save changes
          </Button>
          <p className="text-xs text-slate-500">Profile updates will be available in a future release.</p>
        </form>
      </div>
    </HubShell>
  );
}
