import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
