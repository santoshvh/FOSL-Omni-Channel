import type {
  ExternalOrderStatus,
  IntegrationCredentials,
  OrderAdapter,
  OrderPushPayload,
  OrderPushResult,
} from "./types";

type ShopifyOrderResponse = {
  order: {
    id: number;
    financial_status: string;
    fulfillment_status: string | null;
    cancelled_at: string | null;
    fulfillments?: Array<{ tracking_number?: string | null }>;
  };
};

function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function createShopifyOrderAdapter(
  storeUrl: string,
  credentials: IntegrationCredentials
): OrderAdapter {
  const host = storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const accessToken = credentials.shopify?.accessToken?.trim();
  if (!accessToken) {
    throw new Error("Shopify access token is required.");
  }

  const shopifyToken: string = accessToken;
  const baseUrl = `https://${host}/admin/api/2024-01`;

  async function shopifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${body}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    platform: "shopify",
    async pushOrder(payload: OrderPushPayload): Promise<OrderPushResult> {
      const [firstName, ...rest] = (payload.shipping?.name ?? payload.customerEmail).split(" ");
      const lastName = rest.join(" ") || firstName;

      const body = {
        order: {
          email: payload.customerEmail,
          financial_status: "paid",
          note: payload.note ?? `FOSL order ${payload.orderNumber}`,
          line_items: payload.lines.map((line) => ({
            variant_id: Number.parseInt(line.externalProductId, 10),
            quantity: line.quantity,
            price: centsToDecimal(line.unitPriceCents),
            title: line.title,
          })),
          shipping_address: payload.shipping?.line1
            ? {
                first_name: firstName,
                last_name: lastName,
                address1: payload.shipping.line1,
                address2: payload.shipping.line2 ?? "",
                city: payload.shipping.city ?? "",
                province: payload.shipping.state ?? "",
                zip: payload.shipping.postal ?? "",
                country: payload.shipping.country ?? "US",
              }
            : undefined,
        },
      };

      const json = await shopifyFetch<ShopifyOrderResponse>("/orders.json", {
        method: "POST",
        body: JSON.stringify(body),
      });

      return {
        externalOrderId: String(json.order.id),
        externalStatus: json.order.financial_status,
      };
    },
    async fetchOrderStatus(externalOrderId: string): Promise<ExternalOrderStatus> {
      const json = await shopifyFetch<ShopifyOrderResponse>(`/orders/${externalOrderId}.json`);
      const tracking =
        json.order.fulfillments?.find((f) => f.tracking_number)?.tracking_number ?? undefined;

      return {
        externalOrderId,
        status: json.order.financial_status,
        fulfillmentStatus: json.order.fulfillment_status ?? undefined,
        trackingNumber: tracking ?? undefined,
        cancelledAt: json.order.cancelled_at,
      } as ExternalOrderStatus & { cancelledAt?: string | null };
    },
  };
}
