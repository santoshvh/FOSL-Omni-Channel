import { setupWorker } from "msw/browser";
import { foslApiHandlers } from "../msw-handlers";

export const mswWorker = setupWorker(...foslApiHandlers);

export async function startMswBrowser() {
  if (typeof window === "undefined") return;
  await mswWorker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}
