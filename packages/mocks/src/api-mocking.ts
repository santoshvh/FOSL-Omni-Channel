/** Client-side check: MSW runs only in development when mocking is enabled. */
export function isBrowserApiMockingEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const flag = process.env.NEXT_PUBLIC_API_MOCKING?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  return true;
}
