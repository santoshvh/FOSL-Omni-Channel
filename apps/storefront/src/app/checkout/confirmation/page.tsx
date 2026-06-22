import Link from "next/link";
import { Button } from "@fosl/ui";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-4 text-2xl font-bold">Order confirmed</h1>
      <p className="mt-2 text-slate-600">Order #ORD-1043</p>

      <div className="mt-8 space-y-4 rounded-lg border border-slate-200 p-6 text-left text-sm">
        <div>
          <p className="font-medium">Acme Audio Co.</p>
          <p className="text-slate-500">Wireless Bluetooth Headphones · Ships in 5–7 days</p>
        </div>
        <div>
          <p className="font-medium">Bright Labs</p>
          <p className="text-slate-500">Ceramic Travel Mug · Standard shipping</p>
        </div>
      </div>

      <Button asChild className="mt-8">
        <Link href="/orders">View order history</Link>
      </Button>
    </div>
  );
}
