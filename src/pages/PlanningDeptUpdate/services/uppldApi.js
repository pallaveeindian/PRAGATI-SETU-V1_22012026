/**
 * services/uppldApi.js
 * Handles securely syncing the exact Planning Dept Payload to our local Django Backend.
 */

import api from "../../../api/axios"; // Utilizing your centralized authenticated Axios instance
import { getPlanningDeptApiKey } from "../utils/mappingData";

// Since baseURL in axios.js is already "/api/v1", we only need the relative path
const LOCAL_SYNC_URL = "/uppld/sync-local-data/";

/**
 * Helper: Generate SHA-512 Hash natively in the browser
 */
const generateUserHash = async (apiKey) => {
  const userName = "8"; // As per API spec
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const dateStr = `${dd}${mm}${yyyy}`;

  const rawString = `${userName}${apiKey}${dateStr}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(rawString);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

/**
 * Helper: Safe Base64 encoding for UTF-8
 */
const encodeBase64Utf8 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Syncs the ENTIRE array of 108 blocks to the Local Django Database.
 *
 * @param {Array<Object>} payloads - The array of formatted JSON payloads
 * @returns {Promise<Object>} The API response data
 */
export const syncLocalAspirationalData = async (payloads) => {
  const apiKey = getPlanningDeptApiKey();

  if (!apiKey) {
    throw new Error("Planning Dept API Key is missing.");
  }
  if (!payloads || payloads.length === 0) {
    throw new Error("No data payloads provided for local sync.");
  }

  try {
    const userHash = await generateUserHash(apiKey);
    const jsonString = JSON.stringify(payloads);
    const base64Data = encodeBase64Utf8(jsonString);

    // Using DRF standard JSON posting via your central api instance
    const response = await api.post(LOCAL_SYNC_URL, {
      UserHash: userHash,
      JSON_Data: base64Data,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to sync data to Local DB:", error);
    throw error;
  }
};
