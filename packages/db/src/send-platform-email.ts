import type { EmailProvider } from "@fosl/contracts";
import { getMockPlatformSecrets, getMockPlatformSettings } from "@fosl/mocks";
import { getPlatformSecretsFromDb, getPlatformSettingsFromDb } from "./platform-settings";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type SendResult = { sent: boolean; provider: EmailProvider };

export async function sendPlatformEmail(params: SendEmailParams): Promise<SendResult> {
  let provider: EmailProvider = "console";
  let from = process.env.EMAIL_FROM?.trim() ?? "FOSL <noreply@foslone.com>";
  let postmarkToken = process.env.POSTMARK_SERVER_TOKEN?.trim();
  let resendKey = process.env.RESEND_API_KEY?.trim();

  if (process.env.DATABASE_URL) {
    try {
      const settings = await getPlatformSettingsFromDb();
      const secrets = await getPlatformSecretsFromDb();
      if (settings) {
        provider = settings.email.provider;
        from = settings.email.fromAddress;
        postmarkToken = secrets.postmarkServerToken ?? postmarkToken;
        resendKey = secrets.resendApiKey ?? resendKey;
      }
    } catch (err) {
      console.error("[email] settings read failed:", err);
    }
  } else {
    const settings = getMockPlatformSettings();
    const secrets = getMockPlatformSecrets();
    provider = settings.email.provider;
    from = settings.email.fromAddress;
    postmarkToken = secrets.postmarkServerToken ?? postmarkToken;
    resendKey = secrets.resendApiKey ?? resendKey;
  }

  if (provider === "postmark" && postmarkToken) {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: from,
        To: params.to,
        Subject: params.subject,
        HtmlBody: params.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Postmark error (${response.status}): ${body}`);
    }

    return { sent: true, provider: "postmark" };
  }

  if (provider === "resend" && resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend error (${response.status}): ${body}`);
    }

    return { sent: true, provider: "resend" };
  }

  console.info("[email]", {
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  return { sent: false, provider: "console" };
}
