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

    tick();

    const intervalId = window.setInterval(tick, intervalMs);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") tick();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback, enabled, intervalMs]);
}
