/**
 * /src/pages/PlanningDeptUpdate/services/lokosApi.js
 * Handles fetching data from the Lokos CDN APIs for the Planning Department Update module.
 */

import axios from "axios";

// Base URLs for the Lokos CDN
const LOKOS_BASE_UP_URL =
  "https://cdn.lokos.in/lokos-in/lakhpati_didi/prod/UP/LAKHPATI_DIDI_DATA.json";
const LOKOS_DISTRICT_BASE_URL =
  "https://cdn.lokos.in/lokos-in/lakhpati_didi/prod/UP/district";

/**
 * 1. Fetch UP State Overview Data
 * Returns the state totals and the district-wise totals.
 *
 * @returns {Promise<Object>} The raw UP state JSON response
 */
export const fetchUPStateData = async () => {
  try {
    const response = await axios.get(LOKOS_BASE_UP_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching UP State Data from Lokos:", error);
    throw error;
  }
};

/**
 * 2. Fetch Raw District Data
 * Fetches the entire JSON file for a specific district (which includes all blocks, panchayats, and villages).
 *
 * @param {string|number} districtId - The Lokos District ID (e.g., 31012)
 * @returns {Promise<Object>} The raw district JSON response
 */
export const fetchRawDistrictData = async (districtId) => {
  if (!districtId) throw new Error("District ID is required");

  try {
    const url = `${LOKOS_DISTRICT_BASE_URL}/${districtId}/LAKHPATI_DIDI_DATA.json`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching District Data for ID ${districtId}:`, error);
    throw error;
  }
};

/**
 * 3. Fetch ALL Blocks wise totals of a District
 * Converts the nested blocks object into an array for easy mapping in UI.
 *
 * @param {string|number} districtId - The Lokos District ID
 * @returns {Promise<Array>} Array of block objects with their cumulative counts
 */
export const fetchAllBlocksByDistrict = async (districtId) => {
  try {
    const data = await fetchRawDistrictData(districtId);

    if (!data || !data.blocks) {
      return [];
    }

    // Convert the "blocks" object into an array and inject the blockId inside the object
    const blocksArray = Object.entries(data.blocks).map(
      ([blockId, blockData]) => {
        return {
          lokosBlockId: blockId,
          blockName: blockData.blockName,
          lgdBlock: blockData.lgdBlock,
          cumulativeCounts: blockData.blockCumulativeCounts,
          // Omitting the deeper 'panchayat' node to keep the response lightweight for the block view
        };
      },
    );

    return blocksArray;
  } catch (error) {
    console.error(`Error fetching blocks for district ${districtId}:`, error);
    throw error;
  }
};

/**
 * 4. Fetch ALL Panchayats wise totals of a specific Block
 *
 * @param {string|number} districtId - The Lokos District ID
 * @param {string|number} blockId - The Lokos Block ID
 * @returns {Promise<Array>} Array of panchayat objects with their cumulative counts
 */
export const fetchAllPanchayatsByBlock = async (districtId, blockId) => {
  try {
    const data = await fetchRawDistrictData(districtId);

    // Drill down to the specific block
    const block = data?.blocks?.[blockId];

    if (!block || !block.panchayat) {
      console.warn(
        `Block ${blockId} not found or has no panchayats in District ${districtId}`,
      );
      return [];
    }

    // Convert the "panchayat" object into an array
    const panchayatsArray = Object.entries(block.panchayat).map(
      ([panchayatId, panchayatData]) => {
        return {
          lokosPanchayatId: panchayatId,
          panchayatName: panchayatData.panchayatName,
          lgdPanchayat: panchayatData.lgdPanchayat,
          cumulativeCounts: panchayatData.panchayatCumulativeCounts,
        };
      },
    );

    return panchayatsArray;
  } catch (error) {
    console.error(`Error fetching panchayats for block ${blockId}:`, error);
    throw error;
  }
};

/**
 * 5. Fetch ALL Villages wise totals of a specific Panchayat
 *
 * @param {string|number} districtId - The Lokos District ID
 * @param {string|number} blockId - The Lokos Block ID
 * @param {string|number} panchayatId - The Lokos Panchayat ID
 * @returns {Promise<Array>} Array of village objects with their counts
 */
export const fetchAllVillagesByPanchayat = async (
  districtId,
  blockId,
  panchayatId,
) => {
  try {
    const data = await fetchRawDistrictData(districtId);

    // Drill down: District -> Block -> Panchayat -> Villages
    const block = data?.blocks?.[blockId];
    if (!block)
      throw new Error(`Block ${blockId} not found in District ${districtId}`);

    const panchayat = block.panchayat?.[panchayatId];
    if (!panchayat || !panchayat.villages) {
      console.warn(
        `Panchayat ${panchayatId} not found or has no villages in Block ${blockId}`,
      );
      return [];
    }

    // Convert the "villages" object into an array
    const villagesArray = Object.entries(panchayat.villages).map(
      ([villageId, villageData]) => {
        return {
          lokosVillageId: villageId,
          villageName: villageData.villageName,
          lgdVillage: villageData.lgdVillage,
          village_id: villageData.village_id,
          // For villages, Lokos keeps the counts flat on the village object (no 'CumulativeCounts' wrapper)
          cumulativeCounts: {
            shgCount: villageData.shgCount,
            voCount: villageData.voCount,
            clfCount: villageData.clfCount,
            memberCount: villageData.memberCount,
            crpsCount: villageData.crpsCount,
            potentialDidiCount: villageData.potentialDidiCount,
            aajeevikaRegisterCount: villageData.aajeevikaRegisterCount,
          },
        };
      },
    );

    return villagesArray;
  } catch (error) {
    console.error(
      `Error fetching villages for panchayat ${panchayatId}:`,
      error,
    );
    throw error;
  }
};
