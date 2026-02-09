// src/utils/useIdleSession.js
import { useEffect, useRef } from "react";

export default function useIdleSession({
  enabled = true,
  refreshAccess,
  logout,
  idleMaxMs = 2 * 60 * 1000, // 2 min
  refreshIntervalMs = 1 * 60 * 1000, // 1 min
}) {
  const lastActivityRef = useRef(Date.now());
  const refreshTimerRef = useRef(null);
  const ACTIVE_WINDOW_MS = 60 * 1000; // 1 min

  // Track user activity
  useEffect(() => {
    if (!enabled) return;

    const bumpActivity = () => {
      const now = Date.now();
      const wasIdle = now - lastActivityRef.current > refreshIntervalMs;
      lastActivityRef.current = now;

      if (wasIdle && refreshAccess) {
        refreshAccess().catch(() => logout());
      }
    };

    window.addEventListener("click", bumpActivity);
    window.addEventListener("keydown", bumpActivity);
    window.addEventListener("mousemove", bumpActivity);
    window.addEventListener("scroll", bumpActivity);

    return () => {
      window.removeEventListener("click", bumpActivity);
      window.removeEventListener("keydown", bumpActivity);
      window.removeEventListener("mousemove", bumpActivity);
      window.removeEventListener("scroll", bumpActivity);
    };
  }, [enabled, refreshAccess, logout, refreshIntervalMs]);

  // Idle + refresh logic
  useEffect(() => {
    if (!enabled || !refreshAccess || !logout) return;

    refreshTimerRef.current = setInterval(async () => {
      const idleFor = Date.now() - lastActivityRef.current;

      // 🔴 HARD LOGOUT on inactivity
      if (idleFor >= idleMaxMs) {
        clearInterval(refreshTimerRef.current);
        logout();
        return;
      }

      // ✅ Refresh ONLY if user is active
      if (idleFor <= ACTIVE_WINDOW_MS) {
        try {
          await refreshAccess();
        } catch (err) {
          console.error("Idle refresh failed", err);
          clearInterval(refreshTimerRef.current);
          logout();
        }
      }
    }, refreshIntervalMs);

    return () => clearInterval(refreshTimerRef.current);
  }, [enabled, refreshAccess, logout, idleMaxMs, refreshIntervalMs]);
}
