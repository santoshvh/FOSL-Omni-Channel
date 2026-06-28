/**
 * Client-side referral link helpers.
 * Production links are persisted via POST /api/v1/creator-links.
 */
export function generateReferralLink(productId: string, baseUrl?: string) {
  const origin =
    baseUrl ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001");
  const code = `REF_${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const url = `${origin}/marketplace/products/${productId}?ref=${code}&add=1`;
  return { url, code, productId };
}

export type ReferralLink = {
  url: string;
  code: string;
  productId: string;
  linkId?: string;
};

export async function createReferralLink(
  productId: string,
  referralCode: string,
  storefrontPath?: string | null
): Promise<ReferralLink> {
  const res = await fetch("/api/v1/creator-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      referralCode,
      ...(storefrontPath ? { storefrontPath } : {}),
    }),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error ?? "Failed to create referral link.");
  }

  const json = (await res.json()) as {
    data: { url: string; code: string; productId: string; linkId?: string };
  };
  return json.data;
}
