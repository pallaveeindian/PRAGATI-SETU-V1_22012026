// src/pages/TMS/MTManagementV2/hooks/useMTList.js
import { useState, useEffect, useCallback, useContext } from "react";
import { TMS_API, LOOKUP_API } from "../../../../api/axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getCanonicalRole } from "../../../../utils/roleUtils";

/**
 * Orchestrator Hook for Master Trainer Data Table (MTManagementV2)
 * Handles Pagination, Filtering, and DMMU Geoscope Route Locking.
 * * @param {object} initialFilters - Optional overrides/additions to default filters
 * @returns {object} State and handler functions for the MT list UI
 */
export function useMTList(initialFilters = {}) {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  // Identify if user is DMMU (adjust conditions based on your exact role constants)
  const isDMMU =
    role === "dmmu" || role === "2" || String(user?.role_id) === "13";

  // --------------------------------------------------------
  // 1. Core State
  // --------------------------------------------------------
  const [trainers, setTrainers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Security / Scoping State
  const [lockedDistrict, setLockedDistrict] = useState(null);
  // We block the initial API call until DMMU scope is resolved to prevent data leaks
  const [scopeLoading, setScopeLoading] = useState(isDMMU);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50; // Standardized per backend configuration

  const [filters, setFilters] = useState({
    mandal: "",
    district_category: "",
    district: "",
    theme: "",
    designation: "",
    gender: "",
    smmu_recommended: "",
    search: "",
    ...initialFilters,
  });

  // --------------------------------------------------------
  // 2. Geoscope Resolution (DMMU Security Barrier)
  // --------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    async function resolveScope() {
      if (isDMMU) {
        try {
          const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
          const districtId =
            geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;

          if (districtId) {
            setLockedDistrict(String(districtId));
            // Force the filter state to the locked district immediately
            setFilters((prev) => ({ ...prev, district: String(districtId) }));
          }
        } catch (err) {
          console.error("Failed to fetch DMMU geoscope mapping:", err);
        } finally {
          setScopeLoading(false); // Unblock fetching
        }
      } else {
        // SMMU users don't need geoscope resolution
        setScopeLoading(false);
      }
    }

    resolveScope();
  }, [user?.id, isDMMU]);

  // --------------------------------------------------------
  // 3. API Fetch Execution
  // --------------------------------------------------------
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Prevent fetching if we are still waiting for the security scope to resolve
    if (scopeLoading) return;

    async function fetchMasterTrainers() {
      setLoading(true);
      try {
        // Construct clean params object (exclude empty strings)
        const params = {
          page: currentPage,
          page_size: rowsPerPage,
        };

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params[key] = value;
          }
        });

        // STRICT SECURITY OVERRIDE:
        // Even if a malicious request alters the filter state, we forcefully overwrite it
        if (isDMMU && lockedDistrict) {
          params.district = lockedDistrict;
        }

        const response = await TMS_API.mtV2.list(params);

        const data = response?.data?.results || response?.data || [];
        const count = response?.data?.count || data.length;

        setTrainers(data);
        setTotalItems(count);
      } catch (error) {
        console.error("Failed to fetch Master Trainers:", error);
        setTrainers([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }

    fetchMasterTrainers();
  }, [
    currentPage,
    filters,
    refreshTrigger,
    lockedDistrict,
    scopeLoading,
    isDMMU,
  ]);

  // Reset to page 1 whenever any filter is changed to avoid empty table states
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // --------------------------------------------------------
  // 4. Return Output interface
  // --------------------------------------------------------
  return {
    // Data State
    trainers,
    loading: loading || scopeLoading,

    // Pagination Controls
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,

    // Filtering Controls
    filters,
    setFilters,

    // RBAC Context for UI rendering
    isDMMU,
    lockedDistrict,

    // Actions
    triggerRefresh,
  };
}
