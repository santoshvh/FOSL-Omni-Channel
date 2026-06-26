import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Storefront not found." }, { status: 404 });
  }

  try {
    const { getStorefrontByPath } = await import("@fosl/db");
    const storefront = await getStorefrontByPath(path);

    if (!storefront) {
      return NextResponse.json({ error: "Storefront not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        path: storefront.path,
        name: storefront.name,
        isDefault: storefront.isDefault,
        operator: storefront.operator,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[storefronts/:path] failed:", err);
    return NextResponse.json({ error: "Unable to load storefront." }, { status: 500 });
  }
}
