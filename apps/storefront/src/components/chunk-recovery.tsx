"use client";

import { useEffect } from "react";

const RELOAD_KEY = "fosl-chunk-reload";

function isChunkLoadFailure(message: string) {
  return /ChunkLoadError|Loading chunk [\d]+ failed/i.test(message);
}

export function ChunkRecovery() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const message = event.message ?? "";
      if (!isChunkLoadFailure(message)) return;
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
            ? reason.message
            : "";
      if (!isChunkLoadFailure(message)) return;
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
