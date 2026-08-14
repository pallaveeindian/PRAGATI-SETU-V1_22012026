/**
 * /src/pages/PlanningDeptUpdate/context/PDUContext.jsx
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
import {
  fetchUPStateData,
  fetchRawDistrictData,
  fetchDistrictRFData,
} from "../services/lokosApi";
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
      const baseBlocksList = getAllAspirationalBlocks();
      if (!baseBlocksList || baseBlocksList.length === 0) {
        throw new Error("Aspirational Blocks mapping data is empty.");
      }

      const uniqueDistrictIds = [
        ...new Set(baseBlocksList.map((b) => b.lokos_district_id)),
      ].filter(Boolean);

      // Fetch BOTH Demographic and RF data concurrently
      const districtResponses = await Promise.all(
        uniqueDistrictIds.map(async (distId) => {
          const [demographicData, rfDataArray] = await Promise.all([
            fetchRawDistrictData(distId).catch(() => null),
            fetchDistrictRFData(distId).catch(() => []),
          ]);
          return { distId, demographicData, rfDataArray };
        }),
      );

      // Create lookup dictionaries for blazing fast O(1) data merging
      const districtDataMap = {};
      const rfDataMap = {};

      districtResponses.forEach((res) => {
        districtDataMap[res.distId] = res.demographicData;

        // Convert RF Array into a lookup object by blockId
        rfDataMap[res.distId] = {};
        if (res.rfDataArray && Array.isArray(res.rfDataArray)) {
          res.rfDataArray.forEach((rfBlock) => {
            rfDataMap[res.distId][rfBlock.blockId] = rfBlock;
          });
        }
      });

      // Merge the Lokos live data into our 108 blocks list
      const enrichedBlocks = baseBlocksList.map((block) => {
        const distData = districtDataMap[block.lokos_district_id];
        const blockLokosData =
          distData?.district?.blocks?.[block.lokos_block_id];

        // Extract the specific RF data for this block
        const blockRfData =
          rfDataMap[block.lokos_district_id]?.[block.lokos_block_id];

        return {
          ...block,
          districtName: distData?.district?.districtName || "Unknown",
          cumulativeCounts: blockLokosData?.blockCumulativeCounts || null,
          shgCount: blockLokosData?.blockCumulativeCounts?.shgCount || 0,
          voCount: blockLokosData?.blockCumulativeCounts?.voCount || 0,
          clfCount: blockLokosData?.blockCumulativeCounts?.clfCount || 0,
          memberCount: blockLokosData?.blockCumulativeCounts?.memberCount || 0,
          potentialDidiCount:
            blockLokosData?.blockCumulativeCounts?.potentialDidiCount || 0,
          crpsCount: blockLokosData?.blockCumulativeCounts?.crpsCount || 0,
          aajeevikaRegisterCount:
            blockLokosData?.blockCumulativeCounts?.aajeevikaRegisterCount || 0,

          // --- NEW RF SPECIFIC DATA ---
          rfReceivedCount: blockRfData?.shgReceivingRf || 0, // This is what goes to the API
          rfPercentage: blockRfData?.shgReceivingRfPercentage || 0,
          rfTotalAmount: blockRfData?.rfReceived || 0,
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
