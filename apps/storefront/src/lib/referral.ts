/**
 * Generates a unique referral/affiliate link for a product.
 * Production: persisted via POST /api/v1/referral-links
 */
export function generateReferralLink(productId: string, baseUrl?: string) {
  const origin =
    baseUrl ??
    (typeof window !== "undefined" ? window.location.origin : "https://demo.fosl.store");
  const code = `REF_${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const url = `${origin}/products/${productId}?ref=${code}`;
  return { url, code, productId };
}

export type ReferralLink = ReturnType<typeof generateReferralLink>;
