import Link from "next/link";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Set new password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" className="mt-1" />
          </div>
          <Button className="w-full" asChild>
            <Link href="/auth/sign-in">Update password</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
