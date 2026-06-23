"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Label, Textarea, AlertBanner } from "@fosl/ui";

type ContactRole = "creator" | "seller" | "buyer" | "partner";

type FormState = {
  name: string;
  email: string;
  role: ContactRole;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  role: "creator",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError(null);
  }

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Submission failed.");
      setSubmitted(true);
      setForm(initial);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <AlertBanner variant="success">
          Thank you — your message was received. We&apos;ll respond at the email you provided.
        </AlertBanner>
        <Button type="button" className="mt-4" variant="outline" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      {serverError && <AlertBanner variant="error">{serverError}</AlertBanner>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          className="mt-1"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          required
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="mt-1"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="role">I am a…</Label>
        <select
          id="role"
          name="role"
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={form.role}
          onChange={(e) => update("role", e.target.value as ContactRole)}
        >
          <option value="creator">Creator</option>
          <option value="seller">Seller / Vendor</option>
          <option value="buyer">Buyer</option>
          <option value="partner">Partner / Incubation</option>
        </select>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          className="mt-1"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          required
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Submit"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        See our{" "}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        for how we handle your information.
      </p>
    </form>
  );
}
