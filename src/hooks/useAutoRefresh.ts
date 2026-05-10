"use client";

import { useEffect } from "react";

export function useAutoRefresh(callback: () => void | Promise<void>, intervalMs: number, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        void callback();
      }
    };

    const intervalId = window.setInterval(tick, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [callback, enabled, intervalMs]);
}
