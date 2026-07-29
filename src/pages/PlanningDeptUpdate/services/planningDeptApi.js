/**
 * services/planningDeptApi.js
 * Handles pushing the transformed JSON payloads to the UP Planning Department API.
 */

import axios from "axios";
import { getPlanningDeptApiKey } from "../utils/mappingData";

const PLANNING_DEPT_API_URL =
  "https://api.up.gov.in/planning/api/insert-aspirational-data";

/**
 * Pushes a single block's payload to the Planning Department API.
 *
 * @param {Object} payload - The strictly formatted JSON payload built by payloadBuilder.js
 * @returns {Promise<Object>} The API response data
 */
export const pushSingleBlockData = async (payload) => {
  // Retrieve the API key we extracted from the CSV during initialization
  const apiKey = getPlanningDeptApiKey();

  if (!apiKey) {
    throw new Error(
      "Planning Dept API Key is missing. Please ensure mapping data is initialized.",
    );
  }

  try {
    const response = await axios.post(PLANNING_DEPT_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        // Note: Adjust the exact header key ('x-api-key', 'Authorization', 'ApiKey', etc.)
        // based on the specific documentation provided by the Planning Dept.
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      `Failed to push data for Block Code ${payload.Block_code}:`,
      error,
    );
    throw error; // Rethrow to be handled by the UI component
  }
};

/**
 * Sequentially pushes an array of block payloads ONE BY ONE.
 * This is designed to work perfectly with your PDUStatusModal.jsx to show real-time progress.
 *
 * @param {Array<Object>} payloads - Array of JSON payloads for the 108 blocks
 * @param {Function} onProgress - Callback function triggered after every single request
 *                                e.g., (current, total, isSuccess, blockCode) => {}
 * @returns {Promise<Object>} Summary of the batch operation { successCount, failedBlocks }
 */
export const pushAllBlocksSequentially = async (payloads, onProgress) => {
  let successCount = 0;
  const failedBlocks = [];
  const total = payloads.length;

  for (let i = 0; i < total; i++) {
    const currentPayload = payloads[i];

    try {
      await pushSingleBlockData(currentPayload);
      successCount++;

      // Notify UI of success
      if (onProgress) {
        onProgress(i + 1, total, true, currentPayload.Block_code);
      }
    } catch (error) {
      failedBlocks.push({
        blockCode: currentPayload.Block_code,
        error: error.message,
      });

      // Notify UI of failure
      if (onProgress) {
        onProgress(i + 1, total, false, currentPayload.Block_code);
      }
    }

    // Optional: Add a small delay between requests to prevent overwhelming the external API server
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return {
    total,
    successCount,
    failedCount: failedBlocks.length,
    failedBlocks,
  };
};
