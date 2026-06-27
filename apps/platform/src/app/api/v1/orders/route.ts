import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { fetchOrdersList } from "@/lib/orders-service";
import { resolveOperatorIdForApi, resolveVendorIdForApi } from "@/lib/tenant-session";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase() || undefined;
  let vendorId = searchParams.get("vendorId")?.trim() || undefined;
  let operatorId = searchParams.get("operatorId")?.trim() || undefined;

  if (!vendorId) {
    vendorId = (await resolveVendorIdForApi(auth.session)) ?? undefined;
  }
  if (!operatorId && !vendorId) {
    operatorId = (await resolveOperatorIdForApi(auth.session)) ?? undefined;
  }

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
