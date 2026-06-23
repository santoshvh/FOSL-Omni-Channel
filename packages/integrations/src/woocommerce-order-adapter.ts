import type {
  ExternalOrderStatus,
  IntegrationCredentials,
  OrderAdapter,
  OrderPushPayload,
  OrderPushResult,
} from "./types";

type WooOrder = {
  id: number;
  status: string;
  meta_data?: Array<{ key: string; value: string }>;
};

function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function createWooCommerceOrderAdapter(
  storeUrl: string,
  credentials: IntegrationCredentials
): OrderAdapter {
  const key = credentials.woocommerce?.consumerKey?.trim();
  const secret = credentials.woocommerce?.consumerSecret?.trim();
  if (!key || !secret) {
    throw new Error("WooCommerce consumer key and secret are required.");
  }

  const host = storeUrl.replace(/\/$/, "");
  const baseUrl = host.startsWith("http") ? host : `https://${host}`;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  async function wooFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${baseUrl}/wp-json/wc/v3${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WooCommerce API error (${response.status}): ${body}`);
    }
    return response.json() as Promise<T>;
  }

  return {
    platform: "woocommerce",
    async pushOrder(payload: OrderPushPayload): Promise<OrderPushResult> {
      const [firstName, ...rest] = (payload.shipping?.name ?? "FOSL Customer").split(" ");
      const lastName = rest.join(" ") || "Customer";

      const address = {
        first_name: firstName,
        last_name: lastName,
        address_1: payload.shipping?.line1 ?? "",
        address_2: payload.shipping?.line2 ?? "",
        city: payload.shipping?.city ?? "",
        state: payload.shipping?.state ?? "",
        postcode: payload.shipping?.postal ?? "",
        country: payload.shipping?.country ?? "US",
        email: payload.customerEmail,
      };

      const body = {
        payment_method: "fosl",
        payment_method_title: "FOSL Marketplace",
        set_paid: true,
        status: "processing",
        customer_note: payload.note ?? `FOSL order ${payload.orderNumber}`,
        billing: address,
        shipping: address,
        line_items: payload.lines.map((line) => ({
          product_id: Number.parseInt(line.externalProductId, 10),
          quantity: line.quantity,
          total: centsToDecimal(line.unitPriceCents * line.quantity),
        })),
      };

      const order = await wooFetch<WooOrder>("/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });

      return {
        externalOrderId: String(order.id),
        externalStatus: order.status,
      };
    },
    async fetchOrderStatus(externalOrderId: string): Promise<ExternalOrderStatus> {
      const order = await wooFetch<WooOrder>(`/orders/${externalOrderId}`);
      const trackingMeta = order.meta_data?.find(
        (m) => m.key === "_wc_shipment_tracking_number" || m.key === "_tracking_number"
      );

      return {
        externalOrderId,
        status: order.status,
        trackingNumber: trackingMeta?.value,
      };
    },
  };
}
