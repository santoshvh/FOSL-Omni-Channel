"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/vendor";

  const [email, setEmail] = useState("alex@acmecatalog.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="text-xl font-bold text-primary-dark">
          FOSL Hub
        </Link>
        <CardTitle className="mt-4">Sign in</CardTitle>
        <p className="text-sm text-slate-500">One account for Vendor, Creator, and Operator roles</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-primary-dark hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            No account?{" "}
            <Link href="/auth/register" className="text-primary-dark hover:underline">
              Register
            </Link>
          </p>
          <div className="rounded-md bg-slate-100 p-3 text-xs text-slate-600">
            <p className="font-medium">Demo accounts (password: demo123)</p>
            <p className="mt-1">alex@acmecatalog.com · vendor@demo.fosl · creator@demo.fosl · operator@demo.fosl</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
