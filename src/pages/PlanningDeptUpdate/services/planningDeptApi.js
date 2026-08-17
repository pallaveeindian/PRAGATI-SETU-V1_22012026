/**
 * services/planningDeptApi.js
 * Handles pushing the transformed JSON payloads to the UP Planning Department API.
 */

import axios from "axios";
import { getPlanningDeptApiKey } from "../utils/mappingData";

const PLANNING_DEPT_API_URL =
  "https://epariyojana.up.gov.in/tabp/API/DepAPI.asmx/PushData";

/**
 * Helper: Generate SHA-512 Hash natively in the browser
 * Hash format: UserName(8) + APIKey + DDMMYYYY
 */
const generateUserHash = async (apiKey) => {
  const userName = "8"; // As per API spec

  // Get DDMMYYYY for today
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const dateStr = `${dd}${mm}${yyyy}`;

  const rawString = `${userName}${apiKey}${dateStr}`;

  // Encode string to buffer
  const encoder = new TextEncoder();
  const data = encoder.encode(rawString);

  // Hash using native Web Crypto API (no external libraries needed)
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);

  // Convert buffer to Hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex.toUpperCase();
};

/**
 * Helper: Safe Base64 encoding for UTF-8 (Required for Hindi Disclaimer text)
 */
const encodeBase64Utf8 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Pushes the ENTIRE array of 108 blocks to the Planning Department API in a single request.
 *
 * @param {Array<Object>} payloads - The array of formatted JSON payloads for all 108 blocks
 * @returns {Promise<Object>} The API response data
 */
export const pushBulkDataToPlanningDept = async (payloads) => {
  const apiKey = getPlanningDeptApiKey();

  if (!apiKey) {
    throw new Error(
      "Planning Dept API Key is missing. Please ensure mapping data is initialized.",
    );
  }

  if (!payloads || payloads.length === 0) {
    throw new Error("No data payloads provided for upload.");
  }

  try {
    // 1. Generate the dynamic UserHash
    const userHash = await generateUserHash(apiKey);

    // 2. Stringify the entire array and encode in Base64 (UTF-8 safe)
    const jsonString = JSON.stringify(payloads);
    const base64Data = encodeBase64Utf8(jsonString);

    // 3. Prepare parameters for ASMX endpoint (application/x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append("UserHash", userHash);
    params.append("JSON_Data", base64Data);

    // 4. Execute the POST request
    const response = await axios.post(
      PLANNING_DEPT_API_URL,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Failed to push bulk data to Planning Dept:", error);
    throw error;
  }
};
