"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, AlertBanner } from "@fosl/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { data?: { message?: string }; error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Unable to send reset link.");
      }

      setMessage(json.data?.message ?? "Check your email for reset instructions.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Reset password</CardTitle>
        <p className="text-sm text-slate-500">We&apos;ll email you a reset link</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error && (
            <AlertBanner variant="error" title="Request failed">
              {error}
            </AlertBanner>
          )}
          {message && (
            <AlertBanner variant="success" title="Check your email">
              {message}
            </AlertBanner>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm">
            <Link href="/auth/sign-in" className="text-primary-dark hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
