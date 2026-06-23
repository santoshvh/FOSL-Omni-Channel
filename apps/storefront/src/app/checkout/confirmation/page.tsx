import Link from "next/link";
import { Button } from "@fosl/ui";
import { CheckCircle, Download, MessageSquare } from "lucide-react";

type ConfirmType = "physical" | "digital" | "lead_gen" | "mixed";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; orderId?: string }>;
}) {
  const { type: rawType, orderId } = await searchParams;
  const type: ConfirmType =
    rawType === "digital" || rawType === "lead_gen" || rawType === "physical"
      ? rawType
      : "mixed";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-4 text-2xl font-bold">Order confirmed</h1>
      <p className="mt-2 text-slate-600">
        Order {orderId ? `#${orderId}` : "#ORD-1043"}
      </p>

      <div className="mt-8 space-y-4 rounded-lg border border-slate-200 p-6 text-left text-sm">
        {(type === "mixed" || type === "physical") && (
          <>
            <div>
              <p className="font-medium">Acme Audio Co.</p>
              <p className="text-slate-500">Wireless Bluetooth Headphones · Ships in 5–7 days</p>
            </div>
            <div>
              <p className="font-medium">Bright Labs</p>
              <p className="text-slate-500">Ceramic Travel Mug · Standard shipping</p>
            </div>
          </>
        )}

        {(type === "digital" || type === "mixed") && (
          <div className="flex items-start gap-3 rounded-md border border-purple-100 bg-purple-50 p-3">
            <Download className="h-5 w-5 shrink-0 text-purple-700" />
            <div>
              <p className="font-medium text-purple-900">Digital delivery</p>
              <p className="text-purple-800">
                E-Commerce Mastery Course — download link sent to your email
              </p>
            </div>
          </div>
        )}

        {(type === "lead_gen" || type === "mixed") && (
          <div className="flex items-start gap-3 rounded-md border border-amber-100 bg-amber-50 p-3">
            <MessageSquare className="h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-medium text-amber-900">Lead request received</p>
              <p className="text-amber-800">
                30-Minute Strategy Consultation — vendor will contact you within 1 business day
              </p>
            </div>
          </div>
        )}
      </div>

      <Button asChild className="mt-8">
        <Link href="/orders">View order history</Link>
      </Button>
    </div>
  );
}
