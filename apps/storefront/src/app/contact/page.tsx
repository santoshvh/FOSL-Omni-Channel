import Link from "next/link";
import { Button, Input, Label, Textarea } from "@fosl/ui";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold">Get in touch</h1>
      <p className="mt-2 text-slate-600">
        Connect with the FOSLOne team — Creators, Sellers, and partners welcome
      </p>

      <form className="mt-8 space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="role">I am a…</Label>
          <select
            id="role"
            name="role"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            defaultValue="creator"
          >
            <option value="creator">Creator</option>
            <option value="seller">Seller / Vendor</option>
            <option value="buyer">Buyer</option>
            <option value="partner">Partner / Incubation</option>
          </select>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} className="mt-1" required />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
        <p className="text-center text-xs text-slate-500">
          Prototype form — submissions are not sent in wireframe mode. See our{" "}
          <Link href="/legal/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
