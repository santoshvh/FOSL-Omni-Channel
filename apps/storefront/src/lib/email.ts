import { sendPlatformEmail } from "@fosl/db";

type OrderConfirmationEmail = {
  to: string;
  orderNumber: string;
  orderId: string;
  totalCents: number;
  attributed?: boolean;
  commissionCount?: number;
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function buildOrderConfirmationHtml(email: OrderConfirmationEmail) {
  const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3001";
  const orderUrl = `${storefrontUrl}/orders/${encodeURIComponent(email.orderId)}`;

  return `
    <h1>Order confirmed</h1>
    <p>Thanks for your purchase from FOSLOne.</p>
    <p><strong>Order:</strong> ${email.orderNumber}<br />
    <strong>Total:</strong> ${formatUsd(email.totalCents)}</p>
    <p><a href="${orderUrl}">View your order</a></p>
    <p style="color:#64748b;font-size:12px;">Digital downloads and lead-gen follow-ups are sent separately when applicable.</p>
  `.trim();
}

export async function sendOrderConfirmationEmail(email: OrderConfirmationEmail) {
  const subject = `Order confirmed — ${email.orderNumber}`;
  const html = buildOrderConfirmationHtml(email);

  return sendPlatformEmail({
    to: email.to,
    subject,
    html,
  });
}
