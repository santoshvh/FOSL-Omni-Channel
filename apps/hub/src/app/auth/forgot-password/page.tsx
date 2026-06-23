import Link from "next/link";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset password</CardTitle>
          <p className="text-sm text-slate-500">We&apos;ll email you a reset link</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <Button className="w-full">Send reset link</Button>
          <p className="text-center text-sm">
            <Link href="/auth/sign-in" className="text-primary-dark hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
