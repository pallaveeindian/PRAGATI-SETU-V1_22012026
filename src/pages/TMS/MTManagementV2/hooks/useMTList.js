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
  const rowsPerPage = 20; // Standardized per backend configuration

  const [filters, setFilters] = useState({
    mandal: "",
    district_category: "",
    district: "",
    designation: "",
    gender: "",
    smmu_recommended: "",
    search: "",
    theme: "",
    ...initialFilters,
  });

  const [lockedTheme, setLockedTheme] = useState(null);

  // --------------------------------------------------------
  // 2. Geoscope & Theme Resolution (Security Barrier)
  // --------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    async function resolveScope() {
      try {
        if (isDMMU) {
          // DMMU District Resolution
          const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
          const districtId =
            geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;

          if (districtId) {
            setLockedDistrict(String(districtId));
            setFilters((prev) => ({ ...prev, district: String(districtId) }));
          }
        } else {
          // SURGICAL ADDITION: SMMU Thematic Expert Resolution
          const themeRes = await TMS_API.trainingThemes.list();
          const allThemes = themeRes?.data?.results || themeRes?.data || [];

          // Check if this SMMU user is listed as the expert on any theme
          const userTheme = allThemes.find(
            (t) => String(t.expert) === String(user.id),
          );

          if (userTheme) {
            setLockedTheme(String(userTheme.id));
            setFilters((prev) => ({ ...prev, theme: String(userTheme.id) }));
          }
        }
      } catch (err) {
        console.error("Failed to resolve user scope:", err);
      } finally {
        setScopeLoading(false); // Unblock fetching
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
        // Forcefully lock parameters if the user is restricted by role or expertise
        if (isDMMU && lockedDistrict) {
          params.district = lockedDistrict;
        }
        // SURGICAL ADDITION: Lock theme if SMMU is an expert
        if (lockedTheme) {
          params.theme = lockedTheme;
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
    lockedTheme,

    // Actions
    triggerRefresh,
  };
}
