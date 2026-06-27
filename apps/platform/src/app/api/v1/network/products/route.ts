import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import { listNetworkProducts } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("creator", "admin", "operator", "vendor");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const data = await listNetworkProducts();
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[network/products] failed:", err);
    return NextResponse.json({ error: "Unable to load products." }, { status: 500 });
  }
}
