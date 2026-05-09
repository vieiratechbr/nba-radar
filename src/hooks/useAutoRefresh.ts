"use client";

import { useEffect } from "react";

export function useAutoRefresh(callback: () => void, intervalMs: number, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (document.visibilityState === "visible") {
        callback();
      }
    };

    const intervalId = window.setInterval(tick, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [callback, enabled, intervalMs]);
}
