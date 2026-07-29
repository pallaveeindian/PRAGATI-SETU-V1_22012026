/**
 * context/PDUContext.jsx
 * Global State Management for the Planning Department Update Module.
 * Manages Officer Details, Lokos State Overview, and the enriched 108 Aspirational Blocks data.
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { fetchUPStateData, fetchRawDistrictData } from "../services/lokosApi";
import {
  initializeMappingData,
  getAllAspirationalBlocks,
} from "../utils/mappingData";

// Create the Context
const PDUContext = createContext();

// Custom hook for easy access in components
export const usePDUContext = () => {
  const context = useContext(PDUContext);
  if (!context) {
    throw new Error("usePDUContext must be used within a PDUProvider");
  }
  return context;
};

export const PDUProvider = ({ children }) => {
  // --- State: App Initialization ---
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State: User Inputs ---
  const [officerDetails, setOfficerDetails] = useState({
    name: "",
    designation: "",
    department: "",
    mobile: "",
  });

  // --- State: Lokos Data ---
  const [stateOverview, setStateOverview] = useState(null);
  const [aspirationalBlocks, setAspirationalBlocks] = useState([]);

  /**
   * Bootstraps the application:
   * 1. Loads CSV Mappings
   * 2. Fetches UP State Overview (for Dashboard)
   */
  const initApp = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Initialize CSV mapping data (Block codes, Dist codes, etc.)
      await initializeMappingData();

      // 2. Fetch overall state data for the Dashboard overview
      const upData = await fetchUPStateData();
      setStateOverview(upData);

      setIsInitialized(true);
    } catch (err) {
      console.error("Initialization Error:", err);
      setError(
        "Failed to initialize application data. Please check your network connection.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run initialization exactly once on mount
  useEffect(() => {
    initApp();
  }, [initApp]);

  /**
   * Fetches data SPECIFICALLY for the 108 Aspirational Blocks.
   * It intelligently extracts unique district IDs, fetches only those districts concurrently,
   * and maps the block data back to our 108 list.
   */
  const loadAspirationalBlocksData = async () => {
    if (!isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the base list of 108 blocks from our parsed CSV
      const baseBlocksList = getAllAspirationalBlocks();

      if (!baseBlocksList || baseBlocksList.length === 0) {
        throw new Error("Aspirational Blocks mapping data is empty.");
      }

      // Extract unique Lokos District IDs (so we don't fetch the same district twice)
      // e.g., We only fetch Balrampur once, even if it has 3 aspirational blocks.
      const uniqueDistrictIds = [
        ...new Set(baseBlocksList.map((b) => b.lokos_district_id)),
      ].filter(Boolean);

      // Fetch all required district JSONs concurrently for maximum speed
      const districtResponses = await Promise.all(
        uniqueDistrictIds.map(async (distId) => {
          const data = await fetchRawDistrictData(distId);
          return { distId, data };
        }),
      );

      // Create a lookup dictionary for blazing fast data merging O(1)
      const districtDataMap = {};
      districtResponses.forEach((res) => {
        districtDataMap[res.distId] = res.data;
      });

      // Merge the Lokos live data into our 108 blocks list
      const enrichedBlocks = baseBlocksList.map((block) => {
        // Find the district data
        const distData = districtDataMap[block.lokos_district_id];
        // Drill down to the specific block
        const blockLokosData = distData?.blocks?.[block.lokos_block_id];

        return {
          // Spread our CSV mapping data (api_block_code, district_name, etc.)
          ...block,
          // Attach the live Lokos counts
          cumulativeCounts: blockLokosData?.blockCumulativeCounts || null,
          // Helper properties for quick table rendering
          shgCount: blockLokosData?.blockCumulativeCounts?.shgCount || 0,
          memberCount: blockLokosData?.blockCumulativeCounts?.memberCount || 0,
          rfReceivedCount: 0, // Placeholder: Replace when RF data is available in Lokos API
        };
      });

      setAspirationalBlocks(enrichedBlocks);
    } catch (err) {
      console.error("Error loading Aspirational Blocks Data:", err);
      setError("Failed to fetch block data from Lokos servers.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates the Officer Details globally
   */
  const handleUpdateOfficerDetails = (details) => {
    setOfficerDetails((prev) => ({ ...prev, ...details }));
  };

  // The context value object exposed to all child components
  const value = {
    isInitialized,
    isLoading,
    error,

    // Data
    stateOverview,
    aspirationalBlocks,
    officerDetails,

    // Actions
    loadAspirationalBlocksData,
    updateOfficerDetails: handleUpdateOfficerDetails,
    retryInit: initApp,
  };

  return <PDUContext.Provider value={value}>{children}</PDUContext.Provider>;
};
