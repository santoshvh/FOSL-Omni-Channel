import { NextResponse } from "next/server";
import { referralClickSchema } from "@fosl/contracts";
import { trackCreatorLinkClick } from "@fosl/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = referralClickSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid referral payload." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: { tracked: false, source: "mock" } });
  }

  const { slug, productId } = parsed.data;

  try {
    const { link, tracked } = await trackCreatorLinkClick(slug, productId);

    if (!tracked || !link) {
      return NextResponse.json({ data: { tracked: false } });
    }

    return NextResponse.json({
      data: { tracked: true, slug: link.slug, source: "database" },
    });
  } catch (err) {
    console.error("[referral/click] failed:", err);
    return NextResponse.json({ error: "Unable to track referral click." }, { status: 500 });
  }
}
