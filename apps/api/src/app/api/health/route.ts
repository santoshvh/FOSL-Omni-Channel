import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "fosl-commerce-api",
    version: "v1",
    docs: "https://github.com/santoshvh/FOSL-Omni-Channel/blob/refactor/two-app-platform/docs/API-REFERENCE.md",
  });
}
