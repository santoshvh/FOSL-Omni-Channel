import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadDir } from "@/lib/uploads";

const mimeByExt: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename." }, { status: 400 });
  }

  try {
    const buffer = await readFile(path.join(getUploadDir(), filename));
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    return new NextResponse(buffer, {
      headers: { "Content-Type": mimeByExt[ext] ?? "application/octet-stream" },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
