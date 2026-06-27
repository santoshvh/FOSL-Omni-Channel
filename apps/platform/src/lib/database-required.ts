import { NextResponse } from "next/server";

export function databaseRequiredResponse() {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured.", data: [] }, { status: 503 });
  }
  return null;
}

export function emptyListResponse() {
  return NextResponse.json({ data: [], source: "unconfigured" });
}
