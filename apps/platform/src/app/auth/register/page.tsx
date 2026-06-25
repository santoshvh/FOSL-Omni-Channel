import Link from "next/link";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const signInHref = callbackUrl
    ? `/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/sign-in";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-xl font-bold text-primary-dark">
            FOSL Hub
          </Link>
          <CardTitle className="mt-4">Create account</CardTitle>
          <p className="text-sm text-slate-500">
            Join as a Creator, Vendor, or Operator — one account for the FOSL network
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first">First name</Label>
              <Input id="first" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="last">Last name</Label>
              <Input id="last" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="mt-1" />
            <p className="mt-1 text-xs text-slate-500">Min 8 characters, one number</p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>
          <Button className="w-full" asChild>
            <Link href={signInHref}>Create account</Link>
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href={signInHref} className="text-primary-dark hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
