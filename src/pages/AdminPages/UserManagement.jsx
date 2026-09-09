import React, { useState, useEffect, useCallback } from 'react';
import { TMS_API } from '../../api/axios'; // Apne project ke mutabiq path check kar lein

const UserManagement = () => {
  // 1. Role Tab State ('bmmu' ya 'dmmu')
  const [roleTab, setRoleTab] = useState('bmmu');

  // 2. Core Data States
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  // 4. Data Fetching (BMMU & DMMU APIs)
  useEffect(() => {
    async function fetchUsersData() {
      setLoading(true);
      setApiError('');
      try {
        // Role ke hisaab se dynamic API choose hogi
        const fetchMethod = roleTab === 'dmmu' ? TMS_API.dmmuUsers : TMS_API.bmmuUsers;

        const apiParams = {
          page: currentPage,
          page_size: rowsPerPage,
        };

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

        const response = await fetchMethod(apiParams);

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

  const getUserName = (user) => {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    return user.name || user.full_name || fullName || user.username || 'N/A';
  };

  const getLocationName = (user, field, nestedField) =>
    user[field] || user[nestedField]?.name || user[nestedField]?.[`${nestedField}_name_en`] || 'N/A';

  // 5. User Management Action Handler (Password Reset, Lock, Unlock)
  const handleUserAction = async (userId, username, actionType) => {
    let confirmMsg = `Kya aap waqai user "${username}" ka password reset karna chahte hain?`;
    let payload = { user_id: userId };

    if (actionType === 'reset') {
      payload.reset_password = true;
    } else if (actionType === 'lock') {
      confirmMsg = `Kya aap user "${username}" ko lock karna chahte hain?`;
      payload.is_locked = 1;
    } else if (actionType === 'unlock') {
      confirmMsg = `Kya aap user "${username}" ko unlock karna chahte hain?`;
      payload.is_locked = 0;
    }

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await TMS_API.manageUser(payload);
      // Table ko refresh karein taaki updated data dikhe
      triggerRefresh();
      return {
        success: true,
        data: response?.data,
        message: response?.data?.detail || "Action performed successfully!",
      };
    } catch (err) {
      console.error("User mutation failed:", err);
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to perform action.";
      return { success: false, error: errorMsg };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>User Management Dashboard</h1>
        
        {/* Role Toggle Tabs (BMMU / DMMU) */}
        <div style={styles.tabContainer}>
          <button
            style={roleTab === 'bmmu' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setRoleTab('bmmu')}
          >
            BMMU Users
          </button>
          <button
            style={roleTab === 'dmmu' ? styles.activeTabBtn : styles.tabBtn}
            onClick={() => setRoleTab('dmmu')}
          >
            DMMU Users
          </button>
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
                  {roleTab === 'bmmu' && <th style={styles.th}>Block</th>}
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
                  const isLocked = user.is_locked === 1 || user.is_locked === true;
                  return (
                    <tr key={uId}>
                      <td style={styles.td}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td style={{ ...styles.td, fontWeight: '600' }}>{getUserName(user)}</td>
                      <td style={styles.td}>{user.username || 'N/A'}</td>
                      <td style={styles.td}>{getLocationName(user, 'district_name_en', 'district')}</td>
                      {roleTab === 'bmmu' && (
                        <td style={styles.td}>{getLocationName(user, 'block_name_en', 'block')}</td>
                      )}
                      <td style={styles.td}>
                        <div>{user.recovery_mobile || user.mobile || user.phone || 'N/A'}</div>
                        <small style={styles.mutedText}>{user.recovery_email || user.email || 'N/A'}</small>
                      </td>
                      <td style={styles.td}>{formatDate(user.last_active_on || user.last_login)}</td>
                      <td style={styles.td}>
                        <span style={user.is_active ? styles.activeBadge : styles.inactiveBadge}>
                          {user.is_active ? 'Active' : 'Inactive'}
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
                            disabled={submitting}
                            onClick={() => handleUserAction(uId, user.username, 'reset')}
                            style={styles.resetBtn}
                          >
                            Reset Pwd
                          </button>
                          {isLocked ? (
                            <button
                              disabled={submitting}
                              onClick={() => handleUserAction(uId, user.username, 'unlock')}
                              style={styles.unlockBtn}
                            >
                              Unlock
                            </button>
                          ) : (
                            <button
                              disabled={submitting}
                              onClick={() => handleUserAction(uId, user.username, 'lock')}
                              style={styles.lockBtn}
                            >
                              Lock
                            </button>
                          )}
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
    backgroundColor: '#2563eb',
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
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    minWidth: '220px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
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
    backgroundColor: '#2563eb',
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
};

export default UserManagement;