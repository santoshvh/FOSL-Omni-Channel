import { NextResponse } from "next/server";
import { fetchOrdersList } from "@/lib/orders-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase() || undefined;
  const vendorId = searchParams.get("vendorId")?.trim() || undefined;
  const operatorId = searchParams.get("operatorId")?.trim() || "op_1";

  if (!email && !vendorId && !operatorId) {
    return NextResponse.json(
      { error: "Provide email, vendorId, or operatorId to list orders." },
      { status: 400 }
    );
  }

  try {
    const { data, source } = await fetchOrdersList({
      email,
      vendorId,
      operatorId: vendorId ? undefined : operatorId,
    });
    return NextResponse.json({ data, source });
  } catch (err) {
    console.error("[orders] list failed:", err);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}
