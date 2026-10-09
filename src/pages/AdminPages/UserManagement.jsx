// src\pages\AdminPages\UserManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { LOOKUP_API } from "../../api/axios";
import { ROLE_ID_MAP } from "../../utils/roleUtils";
import {
  FaLock,
  FaUnlock,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaSearch,
  FaTimes,
  FaUserShield,
  FaToggleOn,
  FaBuilding,
  FaMapMarkerAlt,
  FaUniversity,
  FaHandshake,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaCogs,
  FaGlobe,
  FaAddressCard,
  FaUpload,
  FaIdCard,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaHistory,
  FaKey,
} from "react-icons/fa";

const roleIdFor = (roleKey) =>
  Number(Object.entries(ROLE_ID_MAP).find(([, key]) => key === roleKey)?.[0]);

const ROLE_ICON_COLORS = {
  bmmu: "#2563eb",
  dmmu: "#0891b2",
  smmu: "#7c3aed",
  training_partner: "#db2777",
  crp_ld: "#16a34a",
  crp_ep: "#ea580c",
  master_trainer: "#9333ea",
  state_admin: "#dc2626",
  pmu_admin: "#475569",
  dcnrlm: "#059669",
  tp_contact_person: "#0284c7",
  dtp: "#4f46e5",
  smm_uppld: "#ca8a04",
};

const USER_ROLES = [
  { key: "bmmu", label: "BMMU Users", id: roleIdFor("bmmu"), icon: FaBuilding },
  {
    key: "dmmu",
    label: "DMMU Users",
    id: roleIdFor("dmmu"),
    icon: FaMapMarkerAlt,
  },
  {
    key: "smmu",
    label: "SMMU Users",
    id: roleIdFor("smmu"),
    icon: FaUniversity,
  },
  {
    key: "training_partner",
    label: "Training Partner Users",
    id: roleIdFor("training_partner"),
    icon: FaHandshake,
  },
  {
    key: "crp_ld",
    label: "CRP-LD Users",
    id: roleIdFor("crp_ld"),
    icon: FaUserGraduate,
  },
  {
    key: "crp_ep",
    label: "CRP-EP Users",
    id: roleIdFor("crp_ep"),
    icon: FaChalkboardTeacher,
  },
  {
    key: "master_trainer",
    label: "Master Trainer Users",
    id: roleIdFor("master_trainer"),
    icon: FaUserTie,
  },
  {
    key: "state_admin",
    label: "State Admin Users",
    id: roleIdFor("state_admin"),
    icon: FaUserShield,
  },
  {
    key: "pmu_admin",
    label: "PMU Admin Users",
    id: roleIdFor("pmu_admin"),
    icon: FaCogs,
  },
  {
    key: "dcnrlm",
    label: "DCNRLM Users",
    id: roleIdFor("dcnrlm"),
    icon: FaGlobe,
  },
  {
    key: "tp_contact_person",
    label: "TC Contact Person Users",
    id: roleIdFor("tp_contact_person"),
    icon: FaAddressCard,
  },
  {
    key: "dtp",
    label: "DTP Users",
    id: roleIdFor("dtp"),
    icon: FaMapMarkerAlt,
  },
  {
    key: "smm_uppld",
    label: "SMM UPPLD Users",
    id: roleIdFor("smm_uppld"),
    icon: FaUpload,
  },
];

const UserManagement = () => {
  // 1. Role Tab State
  const [roleTab, setRoleTab] = useState("bmmu");

  // 2. Core Data States
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [profileModal, setProfileModal] = useState({
    user: null,
    mode: "view",
  });
  const [actionLoading, setActionLoading] = useState("");
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });
  const [editForm, setEditForm] = useState({
    username: "",
    recovery_email: "",
    recovery_mobile: "",
    is_active: true,
    reset_password: false,
  });
  const [resetPasswordValue, setResetPasswordValue] = useState("");

  // 3. Filter & Pagination State
  const [filters, setFilters] = useState({
    search: "",
    status: "", // 'active' / 'inactive'
    lock_status: "", // 'locked' / 'unlocked'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // 4. Data Fetching
  useEffect(() => {
    async function fetchUsersData() {
      setLoading(true);
      setApiError("");
      try {
        const selectedRoleId = USER_ROLES.find(
          ({ key }) => key === roleTab,
        )?.id;
        const apiParams = {
          page: currentPage,
          page_size: rowsPerPage,
          // The users endpoint must filter by the numeric role_id.
          role_id: selectedRoleId,
        };

        if (filters.search && filters.search.trim() !== "") {
          apiParams.search = filters.search.trim();
        }

        if (filters.status === "active") {
          apiParams.is_active = 1;
        } else if (filters.status === "inactive") {
          apiParams.is_active = 0;
        }

        if (filters.lock_status === "locked") {
          apiParams.is_locked = 1;
        } else if (filters.lock_status === "unlocked") {
          apiParams.is_locked = 0;
        }

        const response = await LOOKUP_API.users.list(apiParams);

        // Har tarah ke response structure ko handle karne ke liye flexible check
        let data = [];
        const resData = response?.data || response;

        if (Array.isArray(resData)) {
          data = resData;
        } else if (Array.isArray(resData?.results)) {
          data = resData.results;
        } else if (Array.isArray(resData?.users)) {
          data = resData.users;
        } else if (Array.isArray(resData?.data)) {
          data = resData.data;
        }

        // Keep a second client-side guard so a malformed backend response
        // cannot leak another role into the active tab.
        const roleUsers = data.filter(
          (user) => Number(user.role_id ?? user.role) === selectedRoleId,
        );
        const lockFilteredUsers = roleUsers.filter((user) => {
          if (!filters.lock_status) return true;
          const locked = normalizeBoolean(user.is_locked);
          return filters.lock_status === "locked" ? locked : !locked;
        });
        const responseCount = Number(resData?.count);
        const count =
          lockFilteredUsers.length === roleUsers.length &&
          Number.isFinite(responseCount)
            ? responseCount
            : lockFilteredUsers.length;

        setUsers(lockFilteredUsers);
        setTotalItems(count);
      } catch (err) {
        console.error(`Failed to fetch ${roleTab.toUpperCase()} users:`, err);
        setUsers([]);
        setTotalItems(0);
        setApiError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            `Unable to load ${roleTab.toUpperCase()} users. The server returned an error.`,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsersData();
  }, [refreshTrigger, roleTab, currentPage, filters, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleTab, filters]);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const normalizeBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      return ["1", "true", "yes", "y"].includes(value.trim().toLowerCase());
    }
    return false;
  };

  const getUserName = (user) => {
    const fullName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ");
    return user.name || user.full_name || fullName || user.username || "N/A";
  };

  const getInitials = (value) =>
    String(value || "User")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getLocationName = (user, field, nestedField) =>
    user[field] ||
    user[nestedField]?.name ||
    user[nestedField]?.[`${nestedField}_name_en`] ||
    user[nestedField]?.[`${nestedField}_name`] ||
    "N/A";

  const getProfileDisplayValue = (value, fallback = "—") =>
    value === null || value === undefined || value === ""
      ? fallback
      : String(value);

  const renderProfileSection = (title, fields) => {
    const sectionIcons = {
      "Account Information": FaIdCard,
      "Jurisdictional Assignment": FaMapMarkedAlt,
      "Security & Status": FaShieldAlt,
      "System Activity": FaHistory,
      "Identity & Contact": FaIdCard,
      "Security Actions": FaShieldAlt,
    };
    const SectionIcon = sectionIcons[title] || FaUserShield;

    return (
      <section style={styles.profileSection}>
        <h3 style={styles.profileSectionTitle}>
          <span style={styles.sectionIcon}>
            <SectionIcon />
          </span>
          <span>{title}</span>
        </h3>
        <div style={styles.profileGrid}>
          {fields.map(([label, value]) => (
            <div key={label} style={styles.profileField}>
              <div style={styles.profileLabel}>{label}</div>
              <div style={styles.profileValue}>{value}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const openProfileModal = (user, mode) => {
    setActionMessage({ type: "", text: "" });
    if (mode === "edit") {
      setEditForm({
        username: user.username || "",
        recovery_email: user.recovery_email || user.email || "",
        recovery_mobile: user.recovery_mobile || user.mobile || "",
        is_active: normalizeBoolean(user.is_active),
        reset_password: false,
      });
      setResetPasswordValue("");
    }
    setProfileModal({ user, mode });
  };
  const closeProfileModal = () => {
    if (actionLoading) return;
    setActionMessage({ type: "", text: "" });
    setProfileModal({ user: null, mode: "view" });
  };

  const manageUser = async (updates, successMessage) => {
    const userId = profileModal.user?.id || profileModal.user?.user_id;
    if (!userId) {
      setActionMessage({ type: "error", text: "User ID is missing." });
      return;
    }

    setActionLoading(updates.reset_password ? "reset" : "lock");
    setActionMessage({ type: "", text: "" });
    try {
      const response = await LOOKUP_API.users.partialUpdate(userId, updates);
      if (updates.reset_password) {
        const newPassword =
          response?.data?.default_password ||
          response?.data?.new_password ||
          response?.data?.password ||
          response?.default_password ||
          response?.new_password ||
          response?.password;
        setResetPasswordValue(
          newPassword ||
            "Password reset successfully. Check the user credentials response.",
        );
      }
      setActionMessage({ type: "success", text: successMessage });
      setProfileModal((current) => ({
        ...current,
        user:
          updates.is_locked === undefined
            ? current.user
            : { ...current.user, is_locked: updates.is_locked },
      }));
      triggerRefresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text:
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Action failed. Please try again.",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleResetPassword = () =>
    manageUser({ reset_password: true }, "Password reset successfully.");

  const handleToggleLock = () => {
    const isLocked = normalizeBoolean(profileModal.user?.is_locked);
    manageUser(
      isLocked ? { unlock_account: true, is_locked: 0 } : { is_locked: 1 },
      isLocked ? "User unlocked successfully." : "User locked successfully.",
    );
  };

  const showBlockColumn =
    ["bmmu", "dmmu", "smmu"].includes(roleTab) ||
    users.some(
      (user) =>
        user.block_name_en || user.block?.name || user.block?.block_name_en,
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headingRow}>
          <div style={styles.headingIcon}>
            <FaUserShield />
          </div>
          <div>
            <h1 style={styles.heading}>User Management</h1>
            <p style={styles.headingSubtitle}>
              Manage user accounts, access status and security controls
            </p>
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div style={styles.tabContainer}>
          {USER_ROLES.map((role) => (
            <button
              key={role.key}
              type="button"
              aria-pressed={roleTab === role.key}
              aria-label={`Show ${role.label}`}
              style={roleTab === role.key ? styles.activeTabBtn : styles.tabBtn}
              onClick={() => setRoleTab(role.key)}
            >
              <span
                aria-hidden="true"
                style={{
                  ...styles.tabIconBadge,
                  color: ROLE_ICON_COLORS[role.key],
                }}
              >
                <role.icon />
              </span>
              <span style={styles.tabLabel}>
                {role.label.replace(/ Users$/, "")}
              </span>
              <span style={styles.tabCountLabel}>User accounts</span>
            </button>
          ))}
        </div>

        {/* Search & Filter Section */}
        <div style={styles.filterRow}>
          <label style={styles.filterField}>
            <span style={styles.filterLabel}>Search users</span>
            <span style={styles.inputShell}>
              <FaSearch style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Username, email or mobile"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={styles.searchInput}
              />
            </span>
          </label>
          <label style={styles.filterField}>
            <span style={styles.filterLabel}>Account status</span>
            <span style={styles.inputShell}>
              <FaToggleOn style={styles.inputIcon} />
              <select
                aria-label="Filter users by account status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                style={styles.filterSelect}
              >
                <option value="">All account statuses</option>
                <option value="active">Active users</option>
                <option value="inactive">Inactive users</option>
              </select>
            </span>
          </label>
          <label style={styles.filterField}>
            <span style={styles.filterLabel}>Security lock</span>
            <span style={styles.inputShell}>
              <FaLock style={styles.inputIcon} />
              <select
                aria-label="Filter users by lock status"
                value={filters.lock_status}
                onChange={(e) =>
                  setFilters((previous) => ({
                    ...previous,
                    lock_status: e.target.value,
                  }))
                }
                style={styles.filterSelect}
              >
                <option value="">All security states</option>
                <option value="locked">Locked users</option>
                <option value="unlocked">Unlocked users</option>
              </select>
            </span>
          </label>
        </div>

        {/* Users Table */}
        {apiError ? (
          <div style={styles.errorBox} role="alert">
            {apiError}
            <button
              type="button"
              onClick={triggerRefresh}
              style={styles.retryBtn}
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <p style={styles.text}>Loading users data...</p>
        ) : users.length === 0 ? (
          <p style={styles.text}>No users found.</p>
        ) : (
          <div style={styles.tableShell}>
            <div style={styles.tableScroll}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>S.No.</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>District</th>
                    {showBlockColumn && <th style={styles.th}>Block</th>}
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Last Active</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Lock Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const uId = user.id || user.user_id;
                    const isActive = normalizeBoolean(user.is_active);
                    const isLocked = normalizeBoolean(user.is_locked);
                    const displayName = getUserName(user);
                    const initials = displayName
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <tr
                        key={uId}
                        style={index % 2 ? styles.altRow : styles.row}
                      >
                        <td style={{ ...styles.td, ...styles.serialCell }}>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <span style={styles.avatar}>{initials || "?"}</span>
                            <div>
                              <div style={styles.userName}>{displayName}</div>
                              <div style={styles.userRole}>
                                {user.role_name || "User account"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.username}>
                            {user.username || "N/A"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {getLocationName(
                            user,
                            "district_name_en",
                            "district",
                          )}
                        </td>
                        {showBlockColumn && (
                          <td style={styles.td}>
                            {getLocationName(user, "block_name_en", "block")}
                          </td>
                        )}
                        <td style={styles.td}>
                          <div style={styles.contactPrimary}>
                            {user.recovery_mobile ||
                              user.mobile ||
                              user.phone ||
                              "N/A"}
                          </div>
                          <small style={styles.mutedText}>
                            {user.recovery_email || user.email || "N/A"}
                          </small>
                        </td>
                        <td style={styles.td}>
                          {formatDate(user.last_active_on || user.last_login)}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              isActive
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            {isActive ? (
                              <FaCheckCircle style={styles.badgeIcon} />
                            ) : (
                              <FaTimes style={styles.badgeIcon} />
                            )}
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              isLocked
                                ? styles.inactiveBadge
                                : styles.activeBadge
                            }
                          >
                            {isLocked ? (
                              <FaLock style={styles.badgeIcon} />
                            ) : (
                              <FaUnlock style={styles.badgeIcon} />
                            )}
                            {isLocked ? "Locked" : "Unlocked"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtonsContainer}>
                            <button
                              type="button"
                              onClick={() => openProfileModal(user, "view")}
                              style={styles.viewBtn}
                              aria-label={`View ${displayName}`}
                            >
                              <FaEye style={styles.buttonIcon} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openProfileModal(user, "edit")}
                              style={styles.editBtn}
                              aria-label={`Edit ${displayName}`}
                            >
                              <FaEdit style={styles.buttonIcon} />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div style={styles.paginationContainer}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={styles.pageBtn}
          >
            Previous
          </button>
          <span style={styles.text}>
            Page {currentPage} of {totalPages} (Total Items: {totalItems})
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            style={styles.pageBtn}
          >
            Next
          </button>
        </div>
      </div>

      {profileModal.user && (
        <div
          style={styles.modalBackdrop}
          role="presentation"
          onClick={closeProfileModal}
        >
          <div
            style={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalIdentity}>
                <div style={styles.modalAvatar}>
                  {getInitials(getUserName(profileModal.user))}
                </div>
                <div>
                  <span style={styles.modalEyebrow}>
                    {profileModal.mode === "edit"
                      ? "Account settings"
                      : "User account"}
                  </span>
                  <h2 id="profile-modal-title" style={styles.modalTitle}>
                    {profileModal.mode === "edit"
                      ? "Edit User"
                      : "User Profile"}
                  </h2>
                  <p style={styles.modalSubtitle}>
                    {getUserName(profileModal.user)} · @
                    {profileModal.user.username || "N/A"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeProfileModal}
                style={styles.closeBtn}
                aria-label="Close profile"
                title="Close"
              >
                <FaTimes />
                <span>Close</span>
              </button>
            </div>

            {profileModal.mode === "edit" ? (
              <div style={styles.editForm}>
                <h3
                  style={{
                    ...styles.profileSectionTitle,
                    gridColumn: "1 / -1",
                  }}
                >
                  <span style={styles.sectionIcon}>
                    <FaIdCard />
                  </span>
                  <span>Identity &amp; Contact</span>
                </h3>
                <label style={styles.formLabel}>
                  Username
                  <input
                    value={editForm.username}
                    readOnly
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.formLabel}>
                  Account Status
                  <select
                    value={editForm.is_active ? "active" : "inactive"}
                    disabled
                    style={styles.formInput}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label style={styles.formLabel}>
                  Recovery Email
                  <input
                    type="email"
                    value={editForm.recovery_email}
                    readOnly
                    style={styles.formInput}
                    placeholder="Recovery Email"
                  />
                </label>
                <label style={styles.formLabel}>
                  Recovery Mobile
                  <input
                    value={editForm.recovery_mobile}
                    readOnly
                    style={styles.formInput}
                    placeholder="Recovery Mobile"
                  />
                </label>
                <div style={styles.securitySection}>
                  <h3 style={styles.profileSectionTitle}>
                    <span style={styles.sectionIcon}>
                      <FaShieldAlt />
                    </span>
                    <span>Security Actions</span>
                  </h3>
                  <div style={styles.securityActionText}>
                    <label style={styles.resetCheckLabel}>
                      <input
                        type="checkbox"
                        checked={editForm.reset_password}
                        onChange={(event) => {
                          setEditForm({
                            ...editForm,
                            reset_password: event.target.checked,
                          });
                          if (!event.target.checked) setResetPasswordValue("");
                        }}
                        disabled={Boolean(actionLoading)}
                      />
                      <strong>Force Password Reset</strong>
                    </label>
                    <span>This user password will be reset to DEFAULT.</span>
                    {resetPasswordValue && (
                      <div style={styles.passwordBox}>
                        <span>New Password</span>
                        <strong>{resetPasswordValue}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {renderProfileSection("Account Information", [
                  [
                    "Username",
                    getProfileDisplayValue(profileModal.user.username),
                  ],
                  [
                    "System User ID",
                    getProfileDisplayValue(
                      profileModal.user.id || profileModal.user.user_id,
                    ),
                  ],
                  [
                    "Recovery Email",
                    getProfileDisplayValue(
                      profileModal.user.recovery_email ||
                        profileModal.user.email,
                      "Not Provided",
                    ),
                  ],
                  [
                    "Recovery Mobile",
                    getProfileDisplayValue(
                      profileModal.user.recovery_mobile ||
                        profileModal.user.mobile,
                      "Not Provided",
                    ),
                  ],
                ])}
                {renderProfileSection("Jurisdictional Assignment", [
                  [
                    "District",
                    getProfileDisplayValue(
                      getLocationName(
                        profileModal.user,
                        "district_name_en",
                        "district",
                      ),
                      "—",
                    ),
                  ],
                  [
                    "Block",
                    getProfileDisplayValue(
                      getLocationName(
                        profileModal.user,
                        "block_name_en",
                        "block",
                      ),
                      "—",
                    ),
                  ],
                ])}
                {renderProfileSection("Security & Status", [
                  [
                    "Account Status",
                    normalizeBoolean(profileModal.user.is_active)
                      ? "ACTIVE"
                      : "INACTIVE",
                  ],
                  [
                    "Lock State",
                    normalizeBoolean(profileModal.user.is_locked)
                      ? "LOCKED"
                      : "UNLOCKED",
                  ],
                  [
                    "Suspension State",
                    normalizeBoolean(
                      profileModal.user.is_suspended ||
                        profileModal.user.is_suspended_user,
                    )
                      ? "SUSPENDED"
                      : "NORMAL",
                  ],
                ])}
                {renderProfileSection("System Activity", [
                  [
                    "Last Active On",
                    profileModal.user.last_active_on ||
                    profileModal.user.last_login
                      ? formatDate(
                          profileModal.user.last_active_on ||
                            profileModal.user.last_login,
                        )
                      : "—",
                  ],
                  [
                    "Locked On",
                    profileModal.user.locked_on
                      ? formatDate(profileModal.user.locked_on)
                      : "—",
                  ],
                  [
                    "Suspended On",
                    profileModal.user.suspended_on
                      ? formatDate(profileModal.user.suspended_on)
                      : "—",
                  ],
                ])}
              </>
            )}

            {profileModal.mode === "edit" && actionMessage.text && (
              <div
                role="status"
                style={
                  actionMessage.type === "error"
                    ? styles.actionErrorBanner
                    : styles.actionSuccessBanner
                }
              >
                {actionMessage.text}
              </div>
            )}

            {profileModal.mode === "edit" && (
              <div style={styles.editActions}>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={Boolean(actionLoading) || !editForm.reset_password}
                  style={styles.resetBtn}
                >
                  <FaKey style={styles.buttonIcon} />
                  {actionLoading === "reset"
                    ? "Resetting..."
                    : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleLock}
                  disabled={Boolean(actionLoading)}
                  style={
                    normalizeBoolean(profileModal.user.is_locked)
                      ? styles.unlockBtn
                      : styles.lockBtn
                  }
                >
                  {actionLoading === "lock" ? (
                    "Updating..."
                  ) : normalizeBoolean(profileModal.user.is_locked) ? (
                    <>
                      <FaUnlock style={styles.buttonIcon} />
                      Unlock User
                    </>
                  ) : (
                    <>
                      <FaLock style={styles.buttonIcon} />
                      Lock User
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={Boolean(actionLoading)}
                  style={styles.cancelBtn}
                >
                  <FaTimes style={styles.buttonIcon} />
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    minHeight: "calc(100vh - 72px)",
    fontFamily: "Arial, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  card: {
    padding: "20px 30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  heading: {
    margin: 0,
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  headingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  headingIcon: {
    width: "42px",
    height: "42px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, rgb(58, 28, 113) 0%, rgb(119, 19, 29) 50%, rgb(100, 48, 14) 100%)",
    color: "#ffffff",
    fontSize: "20px",
    boxShadow: "0 5px 12px rgba(109, 75, 195, 0.22)",
  },
  headingSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "18px",
    padding: "6px",
    background: "linear-gradient(135deg, #eef2ff, #fdf2f8)",
    border: "1px solid #dbe3f0",
    borderRadius: "10px",
    overflowX: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  },
  tabBtn: {
    minWidth: "96px",
    minHeight: "58px",
    padding: "8px 10px",
    background: "linear-gradient(145deg, #ffffff, #f3f6ff)",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#334155",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
    lineHeight: "1.15",
    transition: "all 160ms ease",
  },
  activeTabBtn: {
    minWidth: "96px",
    minHeight: "58px",
    padding: "8px 10px",
    background:
      "linear-gradient(135deg, rgb(58, 28, 113) 0%, rgb(119, 19, 29) 50%, rgb(100, 48, 14) 100%)",

    color: "#ffffff",
    border: "1px solid #b83e52",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
    lineHeight: "1.15",
    boxShadow: "0 3px 8px rgba(201, 79, 98, 0.2)",
    transition: "all 160ms ease",
  },
  tabLabel: {
    fontSize: "12px",
    textAlign: "center",
    maxWidth: "100px",
    whiteSpace: "normal",
  },
  tabIconBadge: {
    width: "27px",
    height: "27px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    fontSize: "17px",
    boxShadow: "0 2px 5px rgba(15, 23, 42, 0.12)",
  },
  tabCountLabel: {
    fontSize: "10px",
    fontWeight: "600",
    opacity: 0.82,
  },
  filterRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "22px",
    flexWrap: "wrap",
    alignItems: "flex-end",
    padding: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5eaf1",
    borderRadius: "10px",
  },
  filterField: {
    display: "flex",
    flex: "1 1 220px",
    minWidth: "190px",
    flexDirection: "column",
    gap: "6px",
  },
  filterLabel: {
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  inputShell: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "42px",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    transition: "border-color 160ms ease, box-shadow 160ms ease",
  },
  inputIcon: {
    marginLeft: "12px",
    color: "#7c5ac7",
    fontSize: "14px",
    flexShrink: 0,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    padding: "9px 12px 9px 9px",
    border: 0,
    backgroundColor: "transparent",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "13px",
  },
  filterSelect: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    padding: "9px 12px 9px 9px",
    border: 0,
    backgroundColor: "transparent",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "13px",
    cursor: "pointer",
  },
  tableShell: {
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "980px",
    borderCollapse: "collapse",
    marginBottom: 0,
  },
  th: {
    backgroundColor: "#f1f5f9",
    padding: "14px 13px",
    borderBottom: "1px solid #dbe3ee",
    textAlign: "left",
    color: "#475569",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px",
    borderBottom: "1px solid #edf1f5",
    color: "#334155",
    fontSize: "13px",
    verticalAlign: "middle",
  },
  row: {
    backgroundColor: "#ffffff",
  },
  altRow: {
    backgroundColor: "#fbfdff",
  },
  serialCell: {
    width: "46px",
    color: "#94a3b8",
    fontWeight: "700",
    textAlign: "center",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "150px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
    fontSize: "12px",
    fontWeight: "800",
  },
  userName: {
    color: "#1e293b",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  userRole: {
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "11px",
    textTransform: "capitalize",
  },
  username: {
    color: "#2563eb",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  contactPrimary: {
    color: "#334155",
    fontWeight: "600",
    marginBottom: "3px",
  },
  activeBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  inactiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  badgeIcon: {
    fontSize: "11px",
    marginRight: "5px",
  },
  actionButtonsContainer: {
    display: "flex",
    gap: "7px",
    flexWrap: "nowrap",
  },
  viewBtn: {
    padding: "7px 12px",
    backgroundColor: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxShadow: "0 2px 5px rgba(15, 118, 110, 0.18)",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  editBtn: {
    padding: "7px 12px",
    backgroundColor: "#720910",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxShadow: "0 2px 5px rgba(210, 97, 105, 0.18)",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  resetBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxShadow: "0 3px 8px rgba(217, 119, 6, 0.2)",
  },
  lockBtn: {
    padding: "8px 14px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  unlockBtn: {
    padding: "8px 14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },
  pageBtn: {
    padding: "8px 16px",
    backgroundColor: "#720910",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  text: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  errorBox: {
    padding: "14px 16px",
    marginBottom: "18px",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  retryBtn: {
    padding: "7px 14px",
    border: "1px solid #991b1b",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#991b1b",
    cursor: "pointer",
    fontWeight: "600",
  },
  mutedText: {
    color: "#64748b",
    fontSize: "12px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  modal: {
    width: "min(920px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "18px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
    padding: "26px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    margin: "-26px -26px 24px",
    padding: "22px 26px",
    background:
      "linear-gradient(135deg, #9f3d68 0%, #d35c72 52%, #f19a75 100%)",
    borderRadius: "18px 18px 0 0",
    boxShadow: "inset 0 -1px rgba(255, 255, 255, 0.18)",
  },
  modalIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
  },
  modalAvatar: {
    width: "52px",
    height: "52px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.48)",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "800",
    boxShadow: "0 5px 14px rgba(92, 25, 62, 0.18)",
  },
  modalEyebrow: {
    display: "block",
    marginBottom: "3px",
    color: "rgba(255, 255, 255, 0.74)",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  modalTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "23px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
  },
  modalSubtitle: {
    margin: "6px 0 0",
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: "13px",
    fontWeight: "500",
  },
  closeBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 10px",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    color: "#fff",
    cursor: "pointer",
    minWidth: "76px",
    height: "34px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: 1,
    transition: "background-color 160ms ease, border-color 160ms ease",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
  },
  profileSection: {
    marginBottom: "22px",
  },
  profileSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    margin: "0 0 11px",
    padding: "10px 13px",
    border: "1px solid #d7eef2",
    borderLeft: "4px solid #0f766e",
    borderRadius: "9px",
    background: "linear-gradient(90deg, #ecfeff, #f8fdff)",
    color: "#155e75",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "0.01em",
  },
  sectionIcon: {
    width: "25px",
    height: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "7px",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontSize: "13px",
  },
  editForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
    padding: "2px 2px 0",
  },
  formLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.01em",
  },
  formInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },
  securitySection: {
    gridColumn: "1 / -1",
    marginTop: "8px",
  },
  securityActionText: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px",
    border: "1px solid #fed7aa",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #fff7ed, #fffbeb)",
    color: "#9a3412",
    fontSize: "13px",
  },
  resetCheckLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  passwordBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
    padding: "10px 12px",
    border: "1px solid #fdba74",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#7c2d12",
    wordBreak: "break-word",
  },
  profileField: {
    minHeight: "64px",
    padding: "11px 13px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    boxShadow: "0 2px 7px rgba(15, 23, 42, 0.03)",
  },
  profileLabel: {
    marginBottom: "6px",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  profileValue: {
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
  editActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #e2e8f0",
    justifyContent: "flex-end",
  },
  actionSuccessBanner: {
    marginBottom: "14px",
    padding: "10px 12px",
    border: "1px solid #86efac",
    borderRadius: "7px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "700",
  },
  actionErrorBanner: {
    marginBottom: "14px",
    padding: "10px 12px",
    border: "1px solid #fca5a5",
    borderRadius: "7px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "700",
  },
  cancelBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 15px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default UserManagement;
