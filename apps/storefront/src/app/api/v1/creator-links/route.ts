import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { productId?: string; referralCode?: string; storefrontPath?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const productId = body.productId?.trim();
  const referralCode = body.referralCode?.trim();

  if (!productId || !referralCode) {
    return NextResponse.json({ error: "productId and referralCode are required." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    const origin = request.headers.get("origin") ?? "https://shop.foslone.com";
    const { generateReferralLink } = await import("@/lib/referral");
    const data = generateReferralLink(productId, origin);
    return NextResponse.json({ data, source: "mock" });
  }

  try {
    const { createCreatorLinkForProduct } = await import("@fosl/db");
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_STOREFRONT_URL ??
      "https://shop.foslone.com";

    const result = await createCreatorLinkForProduct({
      referralCode,
      productId,
      storefrontBaseUrl: origin,
      storefrontPath: body.storefrontPath?.trim() || null,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Creator or product not found, or product is not on the network catalog." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        url: result.url,
        code: result.code,
        productId: result.productId,
        linkId: result.link.id,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[creator-links] failed:", err);
    return NextResponse.json({ error: "Unable to create referral link." }, { status: 500 });
  }
}
