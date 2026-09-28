import React, { useState, useEffect, useCallback } from 'react';
import { LOOKUP_API } from '../../api/axios';

const USER_ROLES = [
  { key: 'all', label: 'All Users' },
  { key: 'bmmu', label: 'BMMU Users' },
  { key: 'dmmu', label: 'DMMU Users' },
  { key: 'smmu', label: 'SSMU Users' },
  { key: 'training_partner', label: 'TP Users' },
  { key: 'dtp', label: 'District TP Users' },
];

const UserManagement = () => {
  // 1. Role Tab State
  const [roleTab, setRoleTab] = useState('bmmu');

  // 2. Core Data States
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [profileModal, setProfileModal] = useState({ user: null, mode: 'view' });
  const [actionLoading, setActionLoading] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [editForm, setEditForm] = useState({
    username: '',
    recovery_email: '',
    recovery_mobile: '',
    is_active: true,
    reset_password: false,
  });
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  // 3. Filter & Pagination State
  const [filters, setFilters] = useState({
    search: '',
    status: '',       // 'active' / 'inactive'
    lock_status: '',  // 'locked' / 'unlocked'
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
      setApiError('');
      try {
        const apiParams = {
          page: currentPage,
          page_size: rowsPerPage,
        };

        if (roleTab !== 'all') {
          apiParams.role = roleTab;
        }

        if (filters.search && filters.search.trim() !== '') {
          apiParams.search = filters.search.trim();
        }

        if (filters.status === 'active') {
          apiParams.is_active = 1;
        } else if (filters.status === 'inactive') {
          apiParams.is_active = 0;
        }

        if (filters.lock_status === 'locked') {
          apiParams.is_locked = 1;
        } else if (filters.lock_status === 'unlocked') {
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

        const count = Number.isFinite(Number(resData?.count))
          ? Number(resData.count)
          : data.length;

        setUsers(data);
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

  // Tab ya filters change hone par page 1 par reset karein
  useEffect(() => {
    setCurrentPage(1);
  }, [roleTab, filters]);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  const normalizeBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
    }
    return false;
  };

  const getUserName = (user) => {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    return user.name || user.full_name || fullName || user.username || 'N/A';
  };

  const getLocationName = (user, field, nestedField) =>
    user[field] || user[nestedField]?.name || user[nestedField]?.[`${nestedField}_name_en`] || user[nestedField]?.[`${nestedField}_name`] || 'N/A';

  const getProfileDisplayValue = (value, fallback = '—') =>
    value === null || value === undefined || value === '' ? fallback : String(value);

  const renderProfileSection = (title, fields) => (
    <section style={styles.profileSection}>
      <h3 style={styles.profileSectionTitle}>{title}</h3>
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

  const openProfileModal = (user, mode) => {
    setActionMessage({ type: '', text: '' });
    if (mode === 'edit') {
      setEditForm({
        username: user.username || '',
        recovery_email: user.recovery_email || user.email || '',
        recovery_mobile: user.recovery_mobile || user.mobile || '',
        is_active: normalizeBoolean(user.is_active),
        reset_password: false,
      });
      setResetPasswordValue('');
    }
    setProfileModal({ user, mode });
  };
  const closeProfileModal = () => {
    if (actionLoading) return;
    setActionMessage({ type: '', text: '' });
    setProfileModal({ user: null, mode: 'view' });
  };

  const manageUser = async (updates, successMessage) => {
    const userId = profileModal.user?.id || profileModal.user?.user_id;
    if (!userId) {
      setActionMessage({ type: 'error', text: 'User ID is missing.' });
      return;
    }

    setActionLoading(updates.reset_password ? 'reset' : 'lock');
    setActionMessage({ type: '', text: '' });
    try {
      const response = await LOOKUP_API.users.partialUpdate(userId, updates);
      if (updates.reset_password) {
        const newPassword = response?.data?.default_password
          || response?.data?.new_password
          || response?.data?.password
          || response?.default_password
          || response?.new_password
          || response?.password;
        setResetPasswordValue(newPassword || 'Password reset successfully. Check the user credentials response.');
      }
      setActionMessage({ type: 'success', text: successMessage });
      setProfileModal((current) => ({
        ...current,
        user: updates.is_locked === undefined
          ? current.user
          : { ...current.user, is_locked: updates.is_locked },
      }));
      triggerRefresh();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err?.response?.data?.detail || err?.response?.data?.message || 'Action failed. Please try again.',
      });
    } finally {
      setActionLoading('');
    }
  };

  const handleResetPassword = () =>
    manageUser({ reset_password: true }, 'Password reset successfully.');

  const handleToggleLock = () => {
    const isLocked = normalizeBoolean(profileModal.user?.is_locked);
    manageUser(
      isLocked ? { unlock_account: true, is_locked: 0 } : { is_locked: 1 },
      isLocked ? 'User unlocked successfully.' : 'User locked successfully.',
    );
  };

  const showBlockColumn = ['all', 'bmmu', 'dmmu', 'smmu'].includes(roleTab)
    || users.some((user) => user.block_name_en || user.block?.name || user.block?.block_name_en);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>User Management Dashboard</h1>
        
        {/* Role Toggle Tabs */}
        <div style={styles.tabContainer}>
          {USER_ROLES.map((role) => (
            <button
              key={role.key}
              style={roleTab === role.key ? styles.activeTabBtn : styles.tabBtn}
              onClick={() => setRoleTab(role.key)}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Section */}
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by username, email or mobile..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={styles.searchInput}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filters.lock_status}
            onChange={(e) => setFilters({ ...filters, lock_status: e.target.value })}
            style={styles.filterSelect}
          >
            <option value="">Lock Status (All)</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>
        </div>

        {/* Users Table */}
        {apiError ? (
          <div style={styles.errorBox} role="alert">
            {apiError}
            <button type="button" onClick={triggerRefresh} style={styles.retryBtn}>
              Retry
            </button>
          </div>
        ) : loading ? (
          <p style={styles.text}>Loading users data...</p>
        ) : users.length === 0 ? (
          <p style={styles.text}>No users found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
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
                  return (
                    <tr key={uId}>
                      <td style={styles.td}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td style={{ ...styles.td, fontWeight: '600' }}>{getUserName(user)}</td>
                      <td style={styles.td}>{user.username || 'N/A'}</td>
                      <td style={styles.td}>{getLocationName(user, 'district_name_en', 'district')}</td>
                      {showBlockColumn && (
                        <td style={styles.td}>{getLocationName(user, 'block_name_en', 'block')}</td>
                      )}
                      <td style={styles.td}>
                        <div>{user.recovery_mobile || user.mobile || user.phone || 'N/A'}</div>
                        <small style={styles.mutedText}>{user.recovery_email || user.email || 'N/A'}</small>
                      </td>
                      <td style={styles.td}>{formatDate(user.last_active_on || user.last_login)}</td>
                      <td style={styles.td}>
                        <span style={isActive ? styles.activeBadge : styles.inactiveBadge}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={isLocked ? styles.inactiveBadge : styles.activeBadge}>
                          {isLocked ? 'Locked' : 'Unlocked'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtonsContainer}>
                          <button
                            type="button"
                            onClick={() => openProfileModal(user, 'view')}
                            style={styles.viewBtn}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openProfileModal(user, 'edit')}
                            style={styles.editBtn}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
        <div style={styles.modalBackdrop} role="presentation" onClick={closeProfileModal}>
          <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 id="profile-modal-title" style={styles.modalTitle}>
                  {profileModal.mode === 'edit' ? 'Edit User' : 'User Profile'}
                </h2>
                <p style={styles.modalSubtitle}>{getUserName(profileModal.user)} ({profileModal.user.username || 'N/A'})</p>
              </div>
              <button type="button" onClick={closeProfileModal} style={styles.closeBtn} aria-label="Close profile">
                ×
              </button>
            </div>

            {profileModal.mode === 'edit' ? (
              <div style={styles.editForm}>
                <h3 style={styles.profileSectionTitle}>Identity &amp; Contact</h3>
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
                    value={editForm.is_active ? 'active' : 'inactive'}
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
                  <h3 style={styles.profileSectionTitle}>Security Actions</h3>
                  <div style={styles.securityActionText}>
                    <label style={styles.resetCheckLabel}>
                      <input
                        type="checkbox"
                        checked={editForm.reset_password}
                        onChange={(event) => {
                          setEditForm({ ...editForm, reset_password: event.target.checked });
                          if (!event.target.checked) setResetPasswordValue('');
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
                {renderProfileSection('Account Information', [
                  ['Username', getProfileDisplayValue(profileModal.user.username)],
                  ['System User ID', getProfileDisplayValue(profileModal.user.id || profileModal.user.user_id)],
                  ['Recovery Email', getProfileDisplayValue(profileModal.user.recovery_email || profileModal.user.email, 'Not Provided')],
                  ['Recovery Mobile', getProfileDisplayValue(profileModal.user.recovery_mobile || profileModal.user.mobile, 'Not Provided')],
                ])}
                {renderProfileSection('Jurisdictional Assignment', [
                  ['District', getProfileDisplayValue(getLocationName(profileModal.user, 'district_name_en', 'district'), '—')],
                  ['Block', getProfileDisplayValue(getLocationName(profileModal.user, 'block_name_en', 'block'), '—')],
                ])}
                {renderProfileSection('Security & Status', [
                  ['Account Status', normalizeBoolean(profileModal.user.is_active) ? 'ACTIVE' : 'INACTIVE'],
                  ['Lock State', normalizeBoolean(profileModal.user.is_locked) ? 'LOCKED' : 'UNLOCKED'],
                  ['Suspension State', normalizeBoolean(profileModal.user.is_suspended || profileModal.user.is_suspended_user) ? 'SUSPENDED' : 'NORMAL'],
                ])}
                {renderProfileSection('System Activity', [
                  ['Last Active On', profileModal.user.last_active_on || profileModal.user.last_login ? formatDate(profileModal.user.last_active_on || profileModal.user.last_login) : '—'],
                  ['Locked On', profileModal.user.locked_on ? formatDate(profileModal.user.locked_on) : '—'],
                  ['Suspended On', profileModal.user.suspended_on ? formatDate(profileModal.user.suspended_on) : '—'],
                ])}
              </>
            )}

            {profileModal.mode === 'edit' && actionMessage.text && (
              <div
                role="status"
                style={actionMessage.type === 'error' ? styles.actionErrorBanner : styles.actionSuccessBanner}
              >
                {actionMessage.text}
              </div>
            )}

            {profileModal.mode === 'edit' && (
              <div style={styles.editActions}>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={Boolean(actionLoading) || !editForm.reset_password}
                  style={styles.resetBtn}
                >
                  {actionLoading === 'reset' ? 'Resetting...' : 'Force Password Reset'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleLock}
                  disabled={Boolean(actionLoading)}
                  style={normalizeBoolean(profileModal.user.is_locked) ? styles.unlockBtn : styles.lockBtn}
                >
                  {actionLoading === 'lock'
                    ? 'Updating...'
                    : normalizeBoolean(profileModal.user.is_locked)
                      ? 'Unlock User'
                      : 'Lock User'}
                </button>
                <button type="button" onClick={closeProfileModal} disabled={Boolean(actionLoading)} style={styles.cancelBtn}>
                  Cancel
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
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: 'calc(100vh - 72px)',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  card: {
    padding: '20px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  },
  heading: {
    margin: '0 0 20px 0',
    color: '#1e293b',
    fontSize: '22px',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  tabBtn: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#475569',
  },
  activeTabBtn: {
    padding: '10px 20px',
    backgroundColor: '#d26169',
    color: '#ffffff',
    border: '1px solid #2563eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  searchInput: {
    flex: '1 1 0',
    width: '0',
    minWidth: '0',
    maxWidth: 'none',
    height: '42px',
    minHeight: '42px',
    maxHeight: '42px',
    flexShrink: 0,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '14px',
  },
  filterSelect: {
    flex: '1 1 0',
    width: '0',
    minWidth: '0',
    maxWidth: 'none',
    height: '42px',
    minHeight: '42px',
    maxHeight: '42px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px 10px',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left',
    color: '#475569',
    fontSize: '13px',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '14px',
  },
  activeBadge: {
    padding: '4px 8px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  inactiveBadge: {
    padding: '4px 8px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  viewBtn: {
    padding: '6px 10px',
    backgroundColor: '#0f766e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  editBtn: {
    padding: '6px 10px',
    backgroundColor: '#d26169',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  resetBtn: {
    padding: '6px 10px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  lockBtn: {
    padding: '6px 10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  unlockBtn: {
    padding: '6px 10px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
  },
  pageBtn: {
    padding: '8px 16px',
    backgroundColor: '#d26169',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  text: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },
  errorBox: {
    padding: '14px 16px',
    marginBottom: '18px',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  retryBtn: {
    padding: '7px 14px',
    border: '1px solid #991b1b',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#991b1b',
    cursor: 'pointer',
    fontWeight: '600',
  },
  mutedText: {
    color: '#64748b',
    fontSize: '12px',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  modal: {
    width: 'min(900px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    margin: '-24px -24px 22px',
    padding: '20px 24px',
    background: "linear-gradient(to right, rgb(199, 81, 103) 0%, rgb(215, 109, 119) 50%, rgb(255, 175, 123) 100%)",
    borderRadius: '12px 12px 0 0',
  },
  modalTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '22px',
  },
  modalSubtitle: {
    margin: '5px 0 0',
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: '14px',
  },
  closeBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '28px',
    lineHeight: 1,
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
  },
  profileSection: {
    marginBottom: '20px',
  },
  profileSectionTitle: {
    margin: '0 0 10px',
    padding: '9px 12px',
    borderLeft: '4px solid #0f766e',
    borderRadius: '4px',
    backgroundColor: '#ecfeff',
    color: '#155e75',
    fontSize: '15px',
  },
  editForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
  },
  formLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '700',
  },
  formInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    color: '#1e293b',
    backgroundColor: '#fff',
    fontSize: '14px',
  },
  securitySection: {
    gridColumn: '1 / -1',
    marginTop: '8px',
  },
  securityActionText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    backgroundColor: '#fff7ed',
    color: '#9a3412',
    fontSize: '13px',
  },
  resetCheckLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  passwordBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
    padding: '10px 12px',
    border: '1px solid #fdba74',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#7c2d12',
    wordBreak: 'break-word',
  },
  profileField: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  },
  profileLabel: {
    marginBottom: '5px',
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  profileValue: {
    color: '#1e293b',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  editActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '22px',
    paddingTop: '18px',
    borderTop: '1px solid #e2e8f0',
  },
  actionSuccessBanner: {
    marginBottom: '14px',
    padding: '10px 12px',
    border: '1px solid #86efac',
    borderRadius: '7px',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    fontSize: '13px',
    fontWeight: '700',
  },
  actionErrorBanner: {
    marginBottom: '14px',
    padding: '10px 12px',
    border: '1px solid #fca5a5',
    borderRadius: '7px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    fontSize: '13px',
    fontWeight: '700',
  },
  cancelBtn: {
    padding: '7px 14px',
    backgroundColor: '#fff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default UserManagement;