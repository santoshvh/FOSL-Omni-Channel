import { NextResponse } from "next/server";
import { products } from "@fosl/mocks";

export async function GET() {
  return NextResponse.json({ data: products });
}
