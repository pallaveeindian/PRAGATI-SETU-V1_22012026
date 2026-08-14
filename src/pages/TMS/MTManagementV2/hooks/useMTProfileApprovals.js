// src/pages/TMS/MTManagementV2/hooks/useMTProfileApprovals.js
import { useState, useEffect, useCallback, useContext } from "react";
import { TMS_API, LOOKUP_API } from "../../../../api/axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getCanonicalRole } from "../../../../utils/roleUtils";

/**
 * Orchestrator Hook for Master Trainer Profile Registration Approvals
 * Handles Pagination, Filtering, Action mutations, and RBAC Geoscope Locks.
 *
 * @param {object} initialFilters - Optional overrides/additions to default filters
 * @returns {object} State and handler functions for the MT Profile Approvals UI
 */
export function useMTProfileApprovals(initialFilters = {}) {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  // Identify roles
  const isSMMU =
    role === "smmu" || role === "3" || String(user?.role_id) === "3";
  const isDMMU =
    role === "dmmu" || role === "2" || String(user?.role_id) === "2";
  const isBMMU =
    role === "bmmu" || role === "1" || String(user?.role_id) === "1";

  // --------------------------------------------------------
  // 1. Core State
  // --------------------------------------------------------
  const [approvals, setApprovals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Security / Scoping State
  const [lockedDistrict, setLockedDistrict] = useState(null);
  const [lockedBlock, setLockedBlock] = useState(null);
  const [lockedTheme, setLockedTheme] = useState(null);

  // We block the initial API call until scope is resolved to prevent data leaks
  const [scopeLoading, setScopeLoading] = useState(isDMMU || isBMMU || isSMMU);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const [filters, setFilters] = useState({
    district_id: "",
    block_id: "",
    designation: "",
    status: "PENDING", // By default, show pending registrations
    theme: "",
    ...initialFilters,
  });

  // --------------------------------------------------------
  // 2. Geoscope & Theme Resolution (Security Barrier)
  // --------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    async function resolveScope() {
      try {
        // Geographic locks for DMMU and BMMU
        if (isDMMU || isBMMU) {
          const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
          const districtId =
            geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;
          const blockId =
            geoRes?.data?.blocks?.[0] ?? geoRes?.data?.block ?? null;

          if (districtId) {
            setLockedDistrict(String(districtId));
            setFilters((prev) => ({
              ...prev,
              district_id: String(districtId),
            }));
          }
          if (isBMMU && blockId) {
            setLockedBlock(String(blockId));
            setFilters((prev) => ({ ...prev, block_id: String(blockId) }));
          }
        }

        // Thematic locks for SMMU Experts
        if (isSMMU) {
          const themeRes = await TMS_API.trainingThemes.list();
          const allThemes = themeRes?.data?.results || themeRes?.data || [];
          const userTheme = allThemes.find(
            (t) => String(t.expert) === String(user.id),
          );

          if (userTheme) {
            setLockedTheme(String(userTheme.id));
            setFilters((prev) => ({ ...prev, theme: String(userTheme.id) }));
          }
        }
      } catch (err) {
        console.error("Failed to resolve approval scope:", err);
      } finally {
        setScopeLoading(false); // Unblock fetching
      }
    }

    resolveScope();
  }, [user?.id, isDMMU, isBMMU, isSMMU]);

  // --------------------------------------------------------
  // 3. API Fetch Execution
  // --------------------------------------------------------
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Prevent fetching if we are still waiting for the security scope to resolve
    if (scopeLoading) return;

    async function fetchApprovals() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: rowsPerPage,
        };

        // Attach valid filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params[key] = value;
          }
        });

        // STRICT SECURITY OVERRIDE:
        // Forcefully lock parameters if the user is restricted by role or expertise
        if ((isDMMU || isBMMU) && lockedDistrict) {
          params.district_id = lockedDistrict;
        }
        if (isBMMU && lockedBlock) {
          params.block_id = lockedBlock;
        }
        if (lockedTheme) {
          params.theme = lockedTheme;
        }

        const response = await TMS_API.mtV2.profileStatusList(params);

        const data = response?.data?.results || response?.data || [];
        const count = response?.data?.count || data.length;

        setApprovals(data);
        setTotalItems(count);
      } catch (error) {
        console.error("Failed to fetch MT Profile Approvals:", error);
        setApprovals([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }

    fetchApprovals();
  }, [
    currentPage,
    filters,
    refreshTrigger,
    scopeLoading,
    lockedDistrict,
    lockedBlock,
    lockedTheme,
    isDMMU,
    isBMMU,
  ]);

  // Reset to page 1 whenever any filter is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // --------------------------------------------------------
  // 4. Verification Patch Mutation
  // --------------------------------------------------------
  /**
   * Approves or Rejects a Master Trainer's profile.
   * @param {number} trainerId - ID of the MasterTrainer
   * @param {string} statusValue - 'VERIFIED' or 'REJECTED'
   * @param {string} remarks - Optional reasoning (mandatory for rejection conventionally)
   */
  const handleVerifyProfile = useCallback(
    async (trainerId, statusValue, remarks = "") => {
      setActionLoading(true);
      try {
        const payload = {
          master_trainer_id: trainerId,
          status: statusValue,
          remarks: remarks,
        };

        const response = await TMS_API.mtV2.verifyProfile(payload);

        // Refresh the list immediately after successful verification/rejection
        triggerRefresh();

        return { success: true, data: response.data };
      } catch (err) {
        console.error(`Failed to mark profile as ${statusValue}:`, err);
        let errorMsg = "Failed to update profile verification status.";

        if (err?.response?.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err?.response?.data?.message) {
          errorMsg = err.response.data.message;
        }

        return { success: false, error: errorMsg };
      } finally {
        setActionLoading(false);
      }
    },
    [triggerRefresh],
  );

  // --------------------------------------------------------
  // 5. Return Output interface
  // --------------------------------------------------------
  return {
    // Data State
    approvals,
    loading: loading || scopeLoading,
    actionLoading,

    // Pagination Controls
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,

    // Filtering Controls
    filters,
    setFilters,

    // RBAC Context for UI rendering logic
    isSMMU,
    isDMMU,
    isBMMU,
    lockedDistrict,
    lockedBlock,
    lockedTheme,

    // Actions
    triggerRefresh,
    handleVerifyProfile,
  };
}
