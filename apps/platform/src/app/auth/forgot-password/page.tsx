import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
