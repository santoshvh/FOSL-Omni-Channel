import { NextResponse } from "next/server";

export async function GET() {
  const payload: Record<string, string> = {
    service: "fosl-commerce-api",
    version: "v1",
    status: "ok",
  };

  const docs = process.env.FOSL_API_DOCS_URL?.trim();
  if (docs) payload.docs = docs;

  return NextResponse.json(payload);
}
