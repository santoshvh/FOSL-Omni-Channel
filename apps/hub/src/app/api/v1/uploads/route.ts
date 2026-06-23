import { NextResponse } from "next/server";
import { uploadPlatformFile } from "@fosl/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const hubBaseUrl = process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3000";
    const result = await uploadPlatformFile(
      {
        buffer,
        contentType: file.type,
        originalName: file.name,
      },
      hubBaseUrl
    );

    return NextResponse.json(
      { data: { url: result.url, filename: result.filename, provider: result.provider } },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
