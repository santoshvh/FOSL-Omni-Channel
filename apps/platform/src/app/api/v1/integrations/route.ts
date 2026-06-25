import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import { connectIntegrationSchema } from "@fosl/contracts";
import { fetchVendorIntegrations, connectIntegration } from "@/lib/integrations-service";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get("vendorId")?.trim() || undefined;

  try {
    const result = await fetchVendorIntegrations(vendorId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[integrations] GET failed:", err);
    return NextResponse.json({ error: "Unable to load integrations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = connectIntegrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await connectIntegration(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to connect integration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
