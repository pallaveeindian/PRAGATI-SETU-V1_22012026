import React, { useState, useEffect } from 'react';
import api, { TMS_API } from "../../../api/axios";
import KpiCards from "./KpiCards";
import TmsModal from "./TmsModal";
import TmsStyles from "./TmsStyles";
// Naya component import karein (path apne folder structure ke hisaab se adjust kar lena)
import CenterDetail from "./CenterDetail"; 

const TmsPortal = () => {
  const [activeTab, setActiveTab] = useState('tms'); // 'tms' ya 'center'

  const [dashboardData, setDashboardData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalTarget: 0, totalOnboarded: 0, overallAchievement: 0,
    totalEnrolled: 0, totalBatchesFormed: 0, batchesRemaining: 0,
    pending: 0, ongoing: 0, completed: 0, closureSubmitted: 0, rejected: 0,
  });
  const [themeMetrics, setThemeMetrics] = useState({ totalTarget: 0, totalOnboarded: 0, overallAchievement: 0 });
  const [batchMetrics, setBatchMetrics] = useState({
    totalEnrolled: 0, totalBatchesFormed: 0, batchesRemaining: 0,
    pending: 0, ongoing: 0, completed: 0, closureSubmitted: 0, rejected: 0,
  });
  const [batchList, setBatchList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBatches, setModalBatches] = useState([]);
  const [modalParticipants, setModalParticipants] = useState([]);
  const [modalView, setModalView] = useState('batches');
  const [modalTitle, setModalTitle] = useState('');
  
  const [themesRaw, setThemesRaw] = useState([]);
  const [targetsRaw, setTargetsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  // 1. Data Fetching Effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const themesResponse = await TMS_API.trainingThemes.list();
        const themesList = themesResponse?.data?.results || themesResponse?.data || [];
        setThemesRaw(themesList);

        const targetsResponse = await TMS_API.trainingPartnerTargets.list();
        const targetsList = targetsResponse?.data?.results || targetsResponse?.data || [];
        setTargetsRaw(targetsList);

        const years = [...new Set(targetsList.map(item => item.financial_year || item.fy || item.year))].filter(Boolean);
        setAvailableYears(years.sort()); 
        if (years.length > 0) setSelectedYear(years[0]);
      } catch (err) {
        console.error("Error fetching TMS dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Data Filter & Calculate Effect
  useEffect(() => {
    if (themesRaw.length === 0 && targetsRaw.length === 0) return;

    const themeMap = {};
    themesRaw.forEach((theme) => {
      themeMap[theme.id] = theme.theme_name || theme.name || theme.title || theme.short_name || 'Unknown';
    });

    const filteredTargets = targetsRaw.filter((item) => (item.financial_year || item.fy || item.year) === selectedYear);
    const groupedByTheme = {};

    filteredTargets.forEach((item) => {
      let themeId = item.training_plan_full?.theme ?? item.training_theme?.id ?? item.theme_id ?? null;
      if (themeId == null && item.theme) {
        const matched = themesRaw.find((t) => String(t.theme_name) === String(item.theme) || String(t.name) === String(item.theme));
        if (matched) themeId = matched.id;
      }

      const themeKey = themeId != null ? String(themeId) : item.theme || null;
      const themeName = themeId != null ? (themeMap[themeId] || item.theme || 'Unknown Theme') : item.theme || 'Unknown Theme';
      if (!themeKey) return;

      if (!groupedByTheme[themeKey]) groupedByTheme[themeKey] = { themeName, target: 0, onboard: 0 };
      groupedByTheme[themeKey].target += Number(item.target_count || item.target || 0);
      groupedByTheme[themeKey].onboard += Number(item.onboarded_count || item.onboard_count || item.onboarded || item.onboard || 0);
    });

    themesRaw.forEach((theme) => {
      const key = String(theme.id);
      if (!groupedByTheme[key]) groupedByTheme[key] = { themeName: theme.theme_name || theme.name || 'Unknown', target: 0, onboard: 0 };
      else groupedByTheme[key].themeName = theme.theme_name || groupedByTheme[key].themeName;
    });

    const themeData = Object.entries(groupedByTheme).map((entry, index) => {
      const [, data] = entry;
      const target = data.target;
      const onboard = data.onboard;
      const percentage = target > 0 ? Math.round((onboard / target) * 100) : 0;
      return { id: String(index + 1).padStart(2, '0'), theme: data.themeName, target, onboard, percentage };
    });

    setDashboardData(themeData);
    const totalTarget = themeData.reduce((sum, item) => sum + item.target, 0);
    const totalOnboarded = themeData.reduce((sum, item) => sum + item.onboard, 0);
    setThemeMetrics({ totalTarget, totalOnboarded, overallAchievement: totalTarget > 0 ? Math.round((totalOnboarded / totalTarget) * 100) : 0 });
  }, [themesRaw, targetsRaw, selectedYear]);

  // 3. Load batch metrics for selected financial year
  useEffect(() => {
    if (!selectedYear) return;

    const fetchBatchMetrics = async () => {
      try {
        const resp = await api.get("/tms/batches-list/", { params: { financial_year: selectedYear, page_size: 500 } });
        const batches = resp?.data?.results || [];
        const filtered = batches.filter((b) => !(b.financial_year || b.fy || b.year) || (b.financial_year || b.fy || b.year) === selectedYear);
        setBatchList(filtered);

        const statusCounts = { pending: 0, ongoing: 0, completed: 0, rejected: 0 };
        let totalEnrolled = 0, closureSubmitted = 0, batchesRemaining = 0;

        filtered.forEach((batch) => {
          const status = String(batch.status || "").toUpperCase();
          totalEnrolled += Number(batch.pax_count || batch.participant_count || batch.participants || 0);

          if (status === "PENDING") statusCounts.pending += 1;
          if (status === "ONGOING") statusCounts.ongoing += 1;
          if (status === "COMPLETED" || status === "CLOSED") statusCounts.completed += 1;
          if (status === "REJECTED") statusCounts.rejected += 1;

          if (batch.batch_closing?.id || status === "REVIEW") closureSubmitted += 1;
          if (["PENDING", "SCHEDULED", "REVIEW"].includes(status)) batchesRemaining += 1;
        });

        setBatchMetrics({
          totalEnrolled, totalBatchesFormed: filtered.length, batchesRemaining,
          pending: statusCounts.pending, ongoing: statusCounts.ongoing,
          completed: statusCounts.completed, closureSubmitted, rejected: statusCounts.rejected,
        });
      } catch (fetchError) {
        console.error("Error fetching batch metrics:", fetchError);
        setBatchMetrics({ totalEnrolled: 0, totalBatchesFormed: 0, batchesRemaining: 0, pending: 0, ongoing: 0, completed: 0, closureSubmitted: 0, rejected: 0 });
      }
    };
    fetchBatchMetrics();
  }, [selectedYear]);

  // 4. Merge theme and batch metrics into KPI state
  useEffect(() => {
    setKpiData({ ...themeMetrics, ...batchMetrics });
  }, [themeMetrics, batchMetrics]);

  const handleOpenKpiDetail = async (kpiKey) => {
    const labelMap = {
      totalTarget: 'All Batches', totalOnboarded: 'All Batches', overallAchievement: 'All Batches',
      totalEnrolled: 'Total Enrolled Participants', totalBatchesFormed: 'Total Batches Formed',
      pending: 'Pending Batches', ongoing: 'Ongoing Batches', completed: 'Completed Batches',
      closureSubmitted: 'Closure Submitted Batches', rejected: 'Rejected Batches',
    };

    const filtered = batchList.filter((batch) => {
      const status = String(batch.status || '').toUpperCase();
      if (['totalEnrolled', 'totalBatchesFormed', 'totalTarget', 'totalOnboarded', 'overallAchievement'].includes(kpiKey)) return true;
      if (kpiKey === 'batchesRemaining') return ['PENDING', 'SCHEDULED', 'REVIEW'].includes(status);
      if (kpiKey === 'pending') return status === 'PENDING';
      if (kpiKey === 'ongoing') return status === 'ONGOING';
      if (kpiKey === 'completed') return status === 'COMPLETED' || status === 'CLOSED';
      if (kpiKey === 'closureSubmitted') return Boolean(batch.batch_closing?.id) || status === 'REVIEW';
      if (kpiKey === 'rejected') return status === 'REJECTED';
      return true;
    });

    if (kpiKey === 'totalEnrolled') {
      setModalTitle(labelMap[kpiKey] || 'Participants');
      setModalView('participants');
      setModalOpen(true);
      setModalParticipants([]);
      setModalBatches(filtered);

      try {
        const participantPromises = filtered.map(async (batch) => {
          try {
            const resp = await TMS_API.batchDetailV2(batch.id || batch.batch_id);
            const data = resp?.data || {};
            let parts = [];
            if (data.batch_type === 'COMBINED' && Array.isArray(data.combined_batch_details)) {
              data.combined_batch_details.forEach((detail) => (detail.participants || []).forEach((p) => parts.push(p.beneficiary || p.trainer || p)));
            } else if (Array.isArray(data.beneficiary_participations) && data.beneficiary_participations.length) {
              parts = data.beneficiary_participations.map((bp) => bp.beneficiary || bp);
            } else if (Array.isArray(data.trainer_participations) && data.trainer_participations.length) {
              parts = data.trainer_participations.map((tp) => tp.trainer || tp);
            } else if (Array.isArray(data.participants) && data.participants.length) {
              parts = data.participants;
            }
            return parts.map((p) => ({ ...(p || {}), _batchCode: batch.batch_code || batch.batchName || batch.name || '' }));
          } catch (e) {
            return [];
          }
        });
        const results = await Promise.all(participantPromises);
        setModalParticipants(results.flat());
      } catch (e) {
        console.error("Error fetching all participants:", e);
      }
      return;
    }

    setModalTitle(labelMap[kpiKey] || 'Batch Details');
    setModalBatches(filtered);
    setModalView('batches');
    setModalOpen(true);
  };

  const getProgressStyle = (percentage) => {
    if (percentage >= 80) return { status: 'On Track', badgeClass: 'badge-high', fillClass: 'fill-green' };
    if (percentage >= 50) return { status: 'Average', badgeClass: 'badge-med', fillClass: 'fill-yellow' };
    return { status: 'Behind', badgeClass: 'badge-low', fillClass: 'fill-red' };
  };

  const handleExport = () => {
    if (dashboardData.length === 0) return alert("No data available to export!");
    const headers = ['Sr. No', 'Theme Name', 'Total Target', 'Onboard', 'Percentage (%)', 'Status'];
    const rows = dashboardData.map((row, index) => [
      index + 1, `"${row.theme}"`, row.target || 0, row.onboard || 0, `${row.percentage || 0}%`, getProgressStyle(row.percentage).status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TMS_Report_FY_${selectedYear}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h2>Loading Data... ⏳</h2>
      </div>
    );
  }

  const tabBtnStyle = (isActive) => ({
    padding: '10px 24px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #e11d48 100%)' : '#e2e8f0',
color: isActive ? '#ffffff' : '#334155',
    border: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <>
      <TmsStyles />
      <div className="tms-dashboard">
        
        {/* --- Tab Navigation Buttons --- */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('tms')} 
            style={tabBtnStyle(activeTab === 'tms')}
          >
            TMS Admin Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('center')} 
            style={tabBtnStyle(activeTab === 'center')}
          >
            Center Detail
          </button>
        </div>

        {/* --- VIEW 1: TMS PORTAL DASHBOARD --- */}
        {activeTab === 'tms' && (
          <>
           

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fecaca' }}>⚠️ {error}</div>}

            <KpiCards selectedYear={selectedYear} kpiData={kpiData} onCardClick={handleOpenKpiDetail} />

            <TmsModal 
              isOpen={modalOpen}
              modalView={modalView}
              modalTitle={modalTitle}
              selectedYear={selectedYear}
              modalBatches={modalBatches}
              modalParticipants={modalParticipants}
              onClose={() => setModalOpen(false)}
            />

            <div className="table-card">
              <div className="table-header">
                <h3>Theme-wise Target Details for {selectedYear}</h3>


                 {availableYears.length > 0 && (
                <div className="fy-container">
                  <span className="fy-label">Financial Year:</span>
                  <select className="fy-dropdown" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              )}

                <button className="export-btn" onClick={handleExport}>Export Report</button>
              </div>
              
              <div className="table-responsive">
                <table className="tms-table">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Theme Name</th>
                      <th>Total Target</th>
                      <th>Onboard</th>
                      <th>Percentage (%)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData && dashboardData.length > 0 ? (
                      dashboardData.map((row, index) => {
                        const styles = getProgressStyle(row.percentage);
                        return (
                          <tr key={row.id || index}>
                            <td>{row.id || index + 1}</td>
                            <td><strong>{row.theme}</strong></td>
                            <td>{row.target ? row.target.toLocaleString() : '0'}</td>
                            <td>{row.onboard ? row.onboard.toLocaleString() : '0'}</td>
                            <td>
                              <div className="progress-cell">
                                <span className="pct-text">{row.percentage || 0}%</span>
                                <div className="progress-track">
                                  <div className={`progress-fill ${styles.fillClass}`} style={{ width: `${row.percentage || 0}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td><span className={`status-badge ${styles.badgeClass}`}>{styles.status}</span></td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          No theme details found for this financial year.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        
        {activeTab === 'center' && (
          <CenterDetail />
        )}

      </div>
    </>
  );
};

export default TmsPortal;