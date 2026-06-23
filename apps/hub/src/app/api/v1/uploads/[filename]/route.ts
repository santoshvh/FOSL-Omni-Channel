import { NextResponse } from "next/server";
import { getFileStorageProvider, readLocalPlatformFile } from "@fosl/db";

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

  try {
    const provider = await getFileStorageProvider();
    if (provider === "s3") {
      return NextResponse.json(
        { error: "Files are served from S3 when S3 storage is enabled." },
        { status: 404 }
      );
    }

    const buffer = await readLocalPlatformFile(filename);
    if (!buffer) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    return new NextResponse(new Uint8Array(buffer), {
      headers: { "Content-Type": mimeByExt[ext] ?? "application/octet-stream" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
