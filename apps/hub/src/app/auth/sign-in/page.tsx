import Link from "next/link";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-xl font-bold text-[#2E75B6]">
            FOSL Hub
          </Link>
          <CardTitle className="mt-4">Sign in</CardTitle>
          <p className="text-sm text-slate-500">One account for Vendor, Creator, and Operator roles</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="mt-1" />
          </div>
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-[#2E75B6] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button className="w-full" asChild>
            <Link href="/vendor">Sign in</Link>
          </Button>
          <p className="text-center text-sm text-slate-500">
            No account?{" "}
            <Link href="/auth/register" className="text-[#2E75B6] hover:underline">
              Register
            </Link>
          </p>
          <div className="rounded-md bg-slate-100 p-3 text-xs text-slate-600">
            <p className="font-medium">Demo accounts</p>
            <p className="mt-1">vendor@demo.fosl · creator@demo.fosl · operator@demo.fosl</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
