import { NextResponse } from "next/server";
import { settleMultiVendorPayment } from "@/lib/vendor-settlement";

export async function POST(request: Request) {
  const secret = process.env.PAYOUT_JOB_SECRET?.trim();
  if (secret) {
    const header = request.headers.get("authorization");
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { paymentIntentId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.paymentIntentId) {
    return NextResponse.json({ error: "paymentIntentId is required." }, { status: 400 });
  }

  try {
    const result = await settleMultiVendorPayment(body.paymentIntentId);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[vendor-settlement] failed:", err);
    return NextResponse.json({ error: "Vendor settlement failed." }, { status: 500 });
  }
}
