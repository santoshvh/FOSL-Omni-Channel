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
  const from = process.env.EMAIL_FROM?.trim() ?? "FOSLOne <orders@demo.foslone.com>";
  const subject = `Order confirmed — ${email.orderNumber}`;
  const html = buildOrderConfirmationHtml(email);
  const resendKey = process.env.RESEND_API_KEY?.trim();

  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email.to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend error (${response.status}): ${body}`);
    }

    return { sent: true, provider: "resend" as const };
  }

  console.info("[email] order confirmation", {
    to: email.to,
    orderNumber: email.orderNumber,
    orderId: email.orderId,
    totalCents: email.totalCents,
  });

  return { sent: false, provider: "console" as const };
}
