import React, { useEffect, useState } from 'react';
import Header from '../layout/Header.jsx';
import Sidebar from '../layout/Sidebar.jsx';
import CrpList from './CrpList.jsx';
import CrpDetailModal from './CrpDetailModal.jsx';
import Footer from '../layout/Footer.jsx';
import { useAuth } from '../../../../contexts/AuthContext.jsx';
import LoginStatus from './LoginStatus.jsx';
import GraphDashboard from './GraphDashboard.jsx';
import { EPSAKHI_API, LOOKUP_API } from '../../../../api/axios.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EPSMS dashboard modal crashed', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '1px solid #fdba74', color: '#9a2c00' }}>
          The CRP details view hit an unexpected issue. Please refresh and try again.
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.username || user?.name || 'User';

  const [activeMenu, setActiveMenu] = useState('Home Dashboard');
  const [activeCrp, setActiveCrp] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [crpData, setCrpData] = useState([]);
  const [crpLoading, setCrpLoading] = useState(false);
  const [crpError, setCrpError] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [detailRows, setDetailRows] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailSummary, setDetailSummary] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  



  const getDmmuIdValue = (source, visited = new WeakSet()) => {
    if (!source || typeof source !== 'object') return null;
    if (visited.has(source)) return null;
    visited.add(source);

    if (Array.isArray(source)) {
      for (const item of source) {
        const nestedValue = getDmmuIdValue(item, visited);
        if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
          return nestedValue;
        }
      }
      return null;
    }

    const dmmuCandidates = [
      source?.dmmu_id,
      source?.dmmuId,
      source?.dmmu?.id,
      source?.dmmu?.dmmu_id,
      source?.created_by,
      source?.createdBy,
      source?.created_by_id,
      source?.createdById,
      source?.district?.dmmu_id,
      source?.district?.dmmuId,
      source?.district?.created_by,
      source?.district?.createdBy,
      source?.geoscope?.dmmu_id,
      source?.geoscope?.dmmuId,
      source?.geoscope?.dmmu?.id,
      source?.geoscope?.dmmu?.dmmu_id,
    ];

    const dmmuValue = dmmuCandidates.find((value) => value !== undefined && value !== null && value !== '');
    if (dmmuValue !== undefined && dmmuValue !== null && dmmuValue !== '') {
      return dmmuValue;
    }

    for (const value of Object.values(source)) {
      if (value && typeof value === 'object') {
        const nestedValue = getDmmuIdValue(value, visited);
        if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
          return nestedValue;
        }
      }
    }

    return null;
  };

  const resolveDmmuId = async (source) => {
    const fromSource = getDmmuIdValue(source) || getDmmuIdValue(source?.district);
    if (fromSource) return fromSource;

    const directId = getDmmuIdValue(user);
    if (directId) return directId;

    try {
      const cachedGeo = JSON.parse(localStorage.getItem('ps_user_geoscope') || 'null');
      const cachedId = getDmmuIdValue(cachedGeo);
      if (cachedId) return cachedId;
    } catch (e) {
      console.warn('Unable to read cached geoscope', e);
    }

    if (user?.id) {
      try {
        const geoscopeRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
        const geoscope = geoscopeRes?.data || geoscopeRes || {};
        const geoscopeId = getDmmuIdValue(geoscope);
        if (geoscopeId) return geoscopeId;
      } catch (e) {
        console.warn('Unable to fetch geoscope for DMMU ID', e);
      }
    }

    const sessionUser = JSON.parse(sessionStorage.getItem('ps_user') || 'null');
    const sessionId = getDmmuIdValue(sessionUser);
    if (sessionId) return sessionId;

    return null;
  };

  const normalizeRows = (payload, visited = new WeakSet()) => {
    if (Array.isArray(payload)) {
      return payload.filter((item) => item !== null && item !== undefined);
    }

    if (!payload || typeof payload !== 'object') {
      return [];
    }
    if (visited.has(payload)) {
      return [];
    }
    visited.add(payload);

    const candidateArrays = [
      payload.results,
      payload.data,
      payload.items,
      payload.districts,
      payload.district_wise_counts,
      payload.district_wise_summary,
      payload.details,
      payload.mapped_crp_list,
      payload.crps,
      payload.summary,
      payload.rows,
      payload.crp_details,
      payload.crpep_details,
      payload.detail,
      payload.response,
      payload.payload,
      payload.result,
    ];

    for (const candidate of candidateArrays) {
      if (Array.isArray(candidate)) {
        return candidate.filter((item) => item !== null && item !== undefined);
      }
    }

    for (const value of Object.values(payload)) {
      if (value && typeof value === 'object') {
        const nestedRows = normalizeRows(value, visited);
        if (nestedRows.length) {
          return nestedRows;
        }
      }
    }

    return [payload];
  };

  const findFieldValue = (source, fieldNames = [], visited = new WeakSet()) => {
    if (!source || typeof source !== 'object') return '';
    if (visited.has(source)) return '';
    visited.add(source);
    if (Array.isArray(source)) {
      for (const item of source) {
        const nested = findFieldValue(item, fieldNames, visited);
        if (nested) return nested;
      }
      return '';
    }

    for (const field of fieldNames) {
      const value = source[field];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object') {
        const nested = findFieldValue(value, fieldNames, visited);
        if (nested) return nested;
      }
    }

    return '';
  };

  const matchesDistrict = (row, districtName, districtId, dmmuId) => {
    if (!row || typeof row !== 'object') return false;

    const normalize = (value) => String(value || '').trim().toLowerCase();
    const rowDistrictName = findFieldValue(row, ['district_name', 'district', 'districtName', 'district_name_en', 'district_name_hi']);
    const rowDistrictId = findFieldValue(row, ['district_id', 'districtId', 'district_id_value', 'district_code', 'districtCode']);
    const rowDmmuId = findFieldValue(row, ['dmmu_id', 'dmmuId', 'dmmu']);

    const sameName = districtName ? normalize(rowDistrictName) === normalize(districtName) : false;
    const sameId = districtId ? normalize(rowDistrictId) === normalize(districtId) : false;
    const sameDmmu = dmmuId ? normalize(rowDmmuId) === normalize(dmmuId) : false;

    return sameName || sameId || sameDmmu;
  };

  const extractDetailRows = (payload) => {
    const normalizedPayload = payload && typeof payload === 'object' ? payload : {};
    const directCandidates = [
      normalizedPayload.crp_details,
      normalizedPayload.details,
      normalizedPayload.data,
      normalizedPayload.result,
      normalizedPayload.results,
      normalizedPayload.rows,
      normalizedPayload.items,
      normalizedPayload.crps,
      normalizedPayload.records,
      normalizedPayload.list,
    ];

    const detailRows = directCandidates.reduce((rows, candidate) => {
      if (rows.length) return rows;
      return normalizeRows(candidate);
    }, []);

    const completedCrpCount = Number.isFinite(Number(normalizedPayload.completed_crp_count))
      ? Number(normalizedPayload.completed_crp_count)
      : Number.isFinite(Number(normalizedPayload.completedCrpCount))
        ? Number(normalizedPayload.completedCrpCount)
        : Number.isFinite(Number(normalizedPayload.count))
          ? Number(normalizedPayload.count)
          : Number.isFinite(Number(normalizedPayload.total))
            ? Number(normalizedPayload.total)
            : detailRows.length;

    return { rows: detailRows, completedCrpCount };
  };

  const loadDetailRows = async (districtName, districtId, districtDmmuId, shouldOpenModal = true) => {
    setSelectedDistrict({ name: districtName, dmmuId: districtDmmuId, districtId });
    setDetailRows([]);
    setDetailSummary(null);
    setDetailError('');
    setDetailLoading(true);
    if (shouldOpenModal) {
      setIsDetailModalOpen(true);
    }

    if (!districtDmmuId) {
      setDetailError('DMMU ID not available for this district.');
      setDetailLoading(false);
      return;
    }

    try {
      const detailResponse = await EPSAKHI_API.mappedCrpListDetail(districtDmmuId);
      const payload = detailResponse?.data ?? detailResponse ?? {};
      const { rows: actualDetailRows, completedCrpCount } = extractDetailRows(payload);

      setDetailRows(actualDetailRows);
      setDetailSummary({ completedCrpCount, districtName, districtId, dmmuId: districtDmmuId });

      if (!actualDetailRows.length) {
        setDetailError('No Onboarded CRP Details');
      }
    } catch (error) {
      console.error('Failed to fetch district CRP Details:', error);
      setDetailRows([]);
      setDetailSummary(null);
      setDetailError(error?.response?.data?.detail || error?.message || 'Unable to load district CRP details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDistrictSelect = async (item) => {
    const districtName = findFieldValue(item, ['district_name', 'district', 'districtName', 'district_name_en', 'district_name_hi']) || findFieldValue(item, ['name']) || 'Selected District';
    const districtId = findFieldValue(item, ['district_id', 'districtId', 'district_id_value', 'district_code', 'districtCode']) || '';

    // Try common fields first, then fallback to resolveDmmuId which performs deeper lookup
    let districtDmmuId =
      item?.dmmu_user_id ||
      item?.dmmu_id ||
      item?.dmmuId ||
      item?.dmmu?.id ||
      item?.dmmu?.dmmu_id ||
      null;

    if (!districtDmmuId) {
      try {
        districtDmmuId = await resolveDmmuId(item);
      } catch (e) {
        console.warn('resolveDmmuId failed for district select', e);
      }
    }
    await loadDetailRows(districtName, districtId, districtDmmuId, true);
  };

  const refreshDetailRows = async () => {
    if (!selectedDistrict?.name) return;
    await loadDetailRows(selectedDistrict.name, selectedDistrict.districtId || '', selectedDistrict.dmmuId, false);
  };



  useEffect(() => {
    let isMounted = true;

    const getDmmuId = async () => resolveDmmuId(user);

    const fetchMappedCrps = async () => {
      setCrpLoading(true);
      setCrpError('');

      try {
        const listResponse = await EPSAKHI_API.mappedCrpList();
        console.log('Fetched mapped CRP list:', listResponse);
        const payload = listResponse?.data ?? listResponse ?? {};
        const normalizedRows = normalizeRows(payload);

        if (isMounted) {
          setCrpData(normalizedRows);
          setCrpError('');
          if (!normalizedRows.length) {
            setCrpError('No mapped CRP district data returned for this user.');
          }
        }
      } catch (error) {
        console.error('Failed to fetch mapped CRP list:', error);
        if (isMounted) {
          setCrpData([]);
          setCrpError(error?.response?.data?.detail || error?.message || 'Unable to load mapped CRP list');
        }
      } finally {
        if (isMounted) {
          setCrpLoading(false);
        }
      }
    };

    fetchMappedCrps();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.dmmu_id, user?.dmmu?.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#ffffff', fontFamily: "'Segoe UI', sans-serif" }}>
      <Header
        activeMenu={activeMenu}
        onLogout={onLogout || logout}
        displayName={displayName}
      />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        />

        <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
            {activeMenu === 'Home Dashboard' ? (
              <GraphDashboard onShowMappedCrpList={() => setActiveMenu('Mapped CRP List')} />
            ) : activeMenu === 'Login Status' ? (
              <LoginStatus />
            ) : (
              <>
                <CrpList
                  isOpen={true}
                  crps={crpData}
                  title="Mapped CRP List"
                  loading={crpLoading}
                  error={crpError}
                  onSelectDistrict={handleDistrictSelect}
                />
                {selectedDistrict && (
                  <ErrorBoundary>
                    <CrpDetailModal
                      isOpen={isDetailModalOpen}
                      title={`CRP DETAILS FOR ${selectedDistrict.name}`}
                      data={detailRows}
                      detailCount={detailSummary?.completedCrpCount}
                      loading={detailLoading}
                      error={detailError}
                      onClose={() => {
                        setIsDetailModalOpen(false);
                        // Clear selected district and detail rows so the modal fully unmounts
                        // and can be freshly opened on subsequent "View" clicks.
                        setSelectedDistrict(null);
                        setDetailRows([]);
                        setDetailSummary(null);
                        setDetailError('');
                      }}
                      selectedDistrict={selectedDistrict}
                      onPanchayatSaved={refreshDetailRows}
                    />
                  </ErrorBoundary>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;