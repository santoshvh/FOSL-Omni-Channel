export const ORDER_EMAIL_KEY = "fosl_order_email";

export function getStoredOrderEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ORDER_EMAIL_KEY)?.trim() ?? "";
}

export function setStoredOrderEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_EMAIL_KEY, email.trim().toLowerCase());
}
