import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import {
  buildReferralProductUrl,
  ensureCreatorProductLink,
  listCreatorLinksForUser,
} from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("creator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const userId = auth.session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Session required." }, { status: 401 });
    }

    const profile = await listCreatorLinksForUser(userId);
    if (!profile) {
      return NextResponse.json({ data: [], source: "database" });
    }

    return NextResponse.json({
      data: profile.links,
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        referralCode: profile.referralCode,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[creator/links] failed:", err);
    return NextResponse.json({ error: "Unable to load links." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRoles("creator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: { productId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const productId = body.productId?.trim();
  if (!productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  const userId = auth.session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Session required." }, { status: 401 });
  }

  try {
    const link = await ensureCreatorProductLink(userId, productId);
    if (!link) {
      return NextResponse.json({ error: "Creator or product not found." }, { status: 404 });
    }

    const storefrontBase =
      process.env.NEXT_PUBLIC_STOREFRONT_URL?.replace(/\/$/, "") ?? "https://shop.foslone.com";

    const url = buildReferralProductUrl({
      baseUrl: storefrontBase,
      productId,
      refSlug: link.slug,
      addToCart: true,
    });

    return NextResponse.json({
      data: { link, url },
      source: "database",
    });
  } catch (err) {
    console.error("[creator/links] create failed:", err);
    return NextResponse.json({ error: "Unable to create referral link." }, { status: 500 });
  }
}
