import { useState, useEffect, useCallback } from "react";
import { TMS_API } from "../../../../api/axios";

/**
 * Generalized User Management Hook (Backend Pagination & Filtering)
 * @param {string} targetRole - Expected values: "bmmu" or "dmmu"
 */
export function useUsers(targetRole = "bmmu") {
  // --------------------------------------------------------
  // 1. Core State
  // --------------------------------------------------------
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter & Pagination State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    lock_status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // --------------------------------------------------------
  // 2. Data Fetching (Backend Paginated)
  // --------------------------------------------------------
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        // Dynamically select the correct API endpoint based on the target role
        const fetchMethod =
          targetRole === "dmmu" ? TMS_API.dmmuUsers : TMS_API.bmmuUsers;

        // Build API Parameters
        const apiParams = {
          page: currentPage,
          page_size: rowsPerPage,
        };

        // Map textual search
        if (filters.search && filters.search.trim() !== "") {
          apiParams.search = filters.search.trim();
        }

        // Map Account Status (Active/Inactive -> 1/0)
        if (filters.status === "active") {
          apiParams.is_active = 1;
        } else if (filters.status === "inactive") {
          apiParams.is_active = 0;
        }

        // Map Lock Status (Locked/Unlocked -> 1/0)
        if (filters.lock_status === "locked") {
          apiParams.is_locked = 1;
        } else if (filters.lock_status === "unlocked") {
          apiParams.is_locked = 0;
        }

        // Execute Request
        const response = await fetchMethod(apiParams);

        // Extract DRF Paginated Data
        const data = response?.data?.results || response?.data || [];
        const count = response?.data?.count || data.length;

        setUsers(data);
        setTotalItems(count);
      } catch (err) {
        console.error(
          `Failed to fetch ${targetRole.toUpperCase()} users:`,
          err,
        );
        setUsers([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [refreshTrigger, targetRole, currentPage, filters, rowsPerPage]);

  // Reset to page 1 whenever filters are changed so we don't end up on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate Total Pages dynamically based on the backend count
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // --------------------------------------------------------
  // 3. Validations
  // --------------------------------------------------------
  const validatePayload = (payload) => {
    const errors = [];

    if (payload.username !== undefined) {
      if (payload.username.trim().length < 4) {
        errors.push("Username must be at least 4 characters long.");
      }
    }

    if (payload.recovery_email !== undefined && payload.recovery_email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.recovery_email)) {
        errors.push("Invalid recovery email format.");
      }
    }

    if (
      payload.recovery_mobile !== undefined &&
      payload.recovery_mobile !== ""
    ) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(payload.recovery_mobile)) {
        errors.push("Recovery mobile must be exactly 10 digits.");
      }
    }

    return errors;
  };

  // --------------------------------------------------------
  // 4. Mutations (Universal update via manageUser)
  // --------------------------------------------------------

  /**
   * Universal User Mutation Handler
   * @param {number|string} userId - The ID of the user to manage
   * @param {object} updates - Map of fields to update (e.g., { reset_password: true })
   */
  const manageUserMutation = async (userId, updates) => {
    if (!userId) return { success: false, error: "User ID is required." };

    // Run Validations locally before hitting the server
    const validationErrors = validatePayload(updates);
    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(" ") };
    }

    setSubmitting(true);
    try {
      // Build the payload mapping expected by the backend
      const payload = {
        user_id: userId,
        ...updates,
      };

      const response = await TMS_API.manageUser(payload);

      // Trigger a silent table refresh so the user sees the updated data instantly
      triggerRefresh();

      return {
        success: true,
        data: response.data,
        message: response?.data?.detail || "User updated successfully.",
      };
    } catch (err) {
      console.error("User mutation failed:", err);
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to update user.";
      return { success: false, error: errorMsg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Data & Loading State
    users,
    loading,
    submitting,
    targetRole, // Exposed just in case child components need to conditionally render text (e.g. "DMMU" vs "BMMU")

    // Pagination Controls
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    rowsPerPage,

    // Filter Controls
    filters,
    setFilters,

    // Actions
    triggerRefresh,
    manageUserMutation,
  };
}
