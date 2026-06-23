type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(email: TransactionalEmail) {
  const from = process.env.EMAIL_FROM?.trim() ?? "FOSL Hub <hub@demo.foslone.com>";
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
        subject: email.subject,
        html: email.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend error (${response.status}): ${body}`);
    }

    return { sent: true, provider: "resend" as const };
  }

  console.info("[email]", {
    to: email.to,
    subject: email.subject,
    html: email.html,
  });

  return { sent: false, provider: "console" as const };
}

export async function sendPasswordResetEmail(params: { to: string; resetUrl: string }) {
  const subject = "Reset your FOSL Hub password";
  const html = `
    <h1>Reset your password</h1>
    <p>We received a request to reset the password for your FOSL Hub account.</p>
    <p><a href="${params.resetUrl}">Set a new password</a></p>
    <p>This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>
    <p style="color:#64748b;font-size:12px;">If the button does not work, copy and paste this URL into your browser:<br />
    ${params.resetUrl}</p>
  `.trim();

  return sendTransactionalEmail({ to: params.to, subject, html });
}
