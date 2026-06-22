import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";
import { demoSession } from "@fosl/mocks";

export default function AccountEditPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit profile</h1>
          <p className="text-slate-600">Update your public and contact information</p>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="name">Display name</Label>
            <Input id="name" defaultValue={demoSession.name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={demoSession.email} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Short bio for creator public page" className="mt-1" />
          </div>
          <div>
            <Label>Avatar</Label>
            <Input type="file" accept="image/*" className="mt-1" />
          </div>
          <div className="flex gap-3">
            <Button>Save changes</Button>
            <Button variant="outline" asChild>
              <Link href="/account">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
