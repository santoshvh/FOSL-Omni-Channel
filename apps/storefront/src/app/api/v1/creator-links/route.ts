import { NextResponse } from "next/server";

import { corsHeadersForStorefront, withCors } from "@/lib/cors";

import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";



export async function OPTIONS(request: Request) {

  const { storefront } = await resolveStorefrontFromRequest(request);

  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });

}



export async function POST(request: Request) {

  const { storefront } = await resolveStorefrontFromRequest(request);

  const cors = corsHeadersForStorefront(request, storefront);



  let body: { productId?: string; referralCode?: string; storefrontPath?: string };

  try {

    body = await request.json();

  } catch {

    return withCors(NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }), cors);

  }



  const productId = body.productId?.trim();

  const referralCode = body.referralCode?.trim();



  if (!productId || !referralCode) {

    return withCors(

      NextResponse.json({ error: "productId and referralCode are required." }, { status: 400 }),

      cors

    );

  }



  if (!process.env.DATABASE_URL?.trim()) {

    const origin = request.headers.get("origin") ?? "https://shop.foslone.com";

    const { generateReferralLink } = await import("@/lib/referral");

    const data = generateReferralLink(productId, origin);

    return withCors(NextResponse.json({ data, source: "mock" }), cors);

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

      storefrontPath: (body.storefrontPath?.trim() || storefront?.path) ?? null,

    });



    if (!result) {

      return withCors(

        NextResponse.json(

          { error: "Creator or product not found, or product is not on the network catalog." },

          { status: 404 }

        ),

        cors

      );

    }



    return withCors(

      NextResponse.json({

        data: {

          url: result.url,

          code: result.code,

          productId: result.productId,

          linkId: result.link.id,

        },

        source: "database",

      }),

      cors

    );

  } catch (err) {

    console.error("[creator-links] failed:", err);

    return withCors(

      NextResponse.json({ error: "Unable to create referral link." }, { status: 500 }),

      cors

    );

  }

}


