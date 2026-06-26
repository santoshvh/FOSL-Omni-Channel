import {
  parsePublishableKeyFromAuthHeader,
  resolveStorefront,
  type ResolvedStorefront,
} from "@fosl/db";

export type StorefrontRequestContext = {
  storefront: ResolvedStorefront | null;
  publishableKey: string | null;
};

export async function resolveStorefrontFromRequest(
  request: Request,
  searchParams?: URLSearchParams
): Promise<StorefrontRequestContext> {
  const params = searchParams ?? new URL(request.url).searchParams;
  const publishableKey =
    parsePublishableKeyFromAuthHeader(request.headers.get("authorization")) ??
    params.get("publishableKey")?.trim() ??
    null;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const storefrontPath = params.get("storefrontPath")?.trim() ?? null;

  const storefront = await resolveStorefront({
    publishableKey,
    host,
    storefrontPath,
  });

  return { storefront, publishableKey };
}

export function operatorIdFromContext(ctx: StorefrontRequestContext) {
  return ctx.storefront?.operatorId ?? null;
}
