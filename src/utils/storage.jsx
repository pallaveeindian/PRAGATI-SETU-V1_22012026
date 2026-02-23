// src/utils/storage.js
import { encrypt, decrypt } from "./secureStorage";
const ACCESS_KEY = "ps_access";
const REFRESH_KEY = "ps_refresh";
const USER_KEY = "ps_user";

export function setAuth({ access, refresh, user }) {
  try {
    if (access !== undefined && access !== null)
      sessionStorage.setItem(ACCESS_KEY, access);
    if (refresh !== undefined && refresh !== null)
      sessionStorage.setItem(REFRESH_KEY, refresh);
    if (user !== undefined && user !== null)
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("storage setAuth failed", e);
  }
}

export function getAccessToken() {
  try {
    return sessionStorage.getItem(ACCESS_KEY);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getRefreshToken() {
  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getUser() {
  try {
    const s = sessionStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function clearAuth() {
  try {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function getApiHeaders() {
  try {
    const apiId = import.meta.env.VITE_API_ID;
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiId && apiKey) {
      return { "X-API-ID": apiId, "X-API-KEY": apiKey };
    }
    return {};
  } catch (e) {
    console.error("storage getApiHeaders failed", e);
    return {};
  }
}

const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour

export async function getCached(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const { data, ts } = await decrypt(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export async function setCached(key, data) {
  const payload = await encrypt({ data, ts: Date.now() });
  localStorage.setItem(key, payload);
}

export function clearAllCache() {
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("tms_") ||
      key.startsWith("lookup:") ||
      key.startsWith("analytics:")
    ) {
      localStorage.removeItem(key);
    }
  });
}

window.__PS_CLEAR_CACHE__ = clearAllCache;

const CACHE_PREFIXES = ["lookup:", "analytics:"];

/**
 * Clears only analytics / lookup cache.
 * DOES NOT touch auth/session keys.
 */
export function clearAppCacheOnly() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (CACHE_PREFIXES.some((p) => key.startsWith(p))) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error("Failed to clear app cache", e);
  }
}
