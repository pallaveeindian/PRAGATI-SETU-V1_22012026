// src/pages/TMS/TP_CP/cp_batch_list.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TmsLeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API } from "../../../api/axios";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

export default function CpBatchList() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  // States for Centre Chain
  const [loadingCentreChain, setLoadingCentreChain] = useState(false);
  const [cpRecord, setCpRecord] = useState(null);
  const [centreLink, setCentreLink] = useState(null);
  const [centre, setCentre] = useState(null);

  // States for Batches & Filters
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState({
    district_id: "",
    block_id: "",
    status: "",
    training_type: "",
    batch_type: "",
    financial_year: "2026-27",
  });

  // 1. Fetch the CP -> Link -> Centre chain on mount
  useEffect(() => {
    fetchCentreChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 2. Fetch Blocks when district_id is available
  useEffect(() => {
    if (!filters.district_id) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocksByDistrict(filters.district_id)
      .then((res) => setBlocks(res?.data?.results || []))
      .catch(() => setBlocks([]));
  }, [filters.district_id]);

  // 3. Fetch Batches automatically once the Centre is loaded
  useEffect(() => {
    if (centre?.id) {
      fetchBatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centre?.id]);

  // --- API FUNCTIONS ---

  async function fetchCentreChain() {
    if (!user?.id) return;

    setLoadingCentreChain(true);
    setCpRecord(null);
    setCentreLink(null);
    setCentre(null);
    setBatches([]);

    try {
      // Step A: Get Contact Person profile
      const cpResp = await api.get(
        `/tms/training-partner-contact-persons/?master_user=${user.id}`,
      );
      const cp = cpResp?.data?.results?.[0];
      if (!cp) return;
      setCpRecord(cp);

      // Step B: Get the Centre Mapping Link
      const linkResp = await api.get(
        `/tms/tpcp-centre-links/?contact_person=${cp.id}`,
      );
      const link = linkResp?.data?.results?.[0];
      if (!link?.allocated_centre) return;
      setCentreLink(link);

      // Step C: Get Centre Details
      const centreResp = await api.get(
        `/tms/training-partner-centres/${link.allocated_centre}/detail/`,
      );
      const centreData = centreResp?.data;

      if (centreData) {
        setCentre(centreData);
        setFilters((f) => ({
          ...f,
          district_id: centreData?.district?.district_id || "",
        }));
      }
    } catch (e) {
      console.error("Centre chain load failed", e);
    } finally {
      setLoadingCentreChain(false);
    }
  }

  async function fetchBatches() {
    if (!centre?.id) return;

    setBatchesLoading(true);
    try {
      const params = {
        centre_id: centre.id,
        page_size: 500,
      };

      if (filters.block_id) params.block_id = filters.block_id;
      if (filters.status) params.status = filters.status;
      if (filters.batch_type) params.batch_type = filters.batch_type;
      if (filters.training_type)
        params.request__training_type = filters.training_type;
      if (filters.financial_year)
        params.financial_year = filters.financial_year;

      const resp = await api.get(
        `/tms/batches-list/?${new URLSearchParams(params)}`,
      );

      const items = resp?.data?.results || [];
      setBatches(items);
      setCurrentPage(1);
    } catch (e) {
      console.error("Fetch batches failed", e);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }

  const hasCentre = !!centre;

  const visibleBatches = useMemo(() => {
    return (batches || []).filter((b) => {
      const status = String(b.status).toUpperCase();

      return !["DRAFT", "PENDING", "REJECTED", "REVIEW"].includes(status);
    });
  }, [batches]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleBatches.length / rowsPerPage),
  );

  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return visibleBatches.slice(start, start + rowsPerPage);
  }, [visibleBatches, currentPage, rowsPerPage]);

  function renderAction(batch) {
    const status = (batch.status || "").toUpperCase();
    if (["ONGOING", "SCHEDULED"].includes(status)) {
      return (
        <button
          className="btnView"
          onClick={() => navigate(`/tms/cp/batch-detail/${batch.id}`)}
        >
          View
        </button>
      );
    }
    if (["CLOSED", "PENDING", "REJECTED"].includes(status)) {
      return (
        <>
          <button
            className="btnView"
            style={{ marginRight: 6 }}
            onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}
          >
            View
          </button>
        </>
      );
    }
    if (["COMPLETED"].includes(status)) {
      return (
        <>
          <button
            className="btnView"
            style={{ marginRight: 6 }}
            onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}
          >
            View
          </button>
          <button
            className="btnView"
            onClick={() => navigate(`/tms/cp/batch-closure/${batch.id}`)}
          >
            Send Closure Request
          </button>
        </>
      );
    }
    return null;
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div style={{ width: "100%", margin: "10px 0" }}>
              {/* ===================== */}
              {/* MY CENTRE CARD (Styled exactly like filter-panel) */}
              {/* ===================== */}
              <div
                style={{
                  background: "#e4ecf5",
                  padding: 16,
                  borderRadius: 10,
                  marginBottom: 14,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#2b4e72",
                    }}
                  >
                    My Centre
                  </h3>

                  <button
                    className="btnPrimary"
                    style={{ marginLeft: "auto" }}
                    onClick={() => fetchCentreChain()}
                    disabled={loadingCentreChain}
                  >
                    {loadingCentreChain ? "Refreshing…" : "Refresh Mapping"}
                  </button>
                </div>

                {loadingCentreChain ? (
                  <div style={{ color: "#64748b", padding: "10px 0" }}>
                    Loading your TC ID and centre mapping…
                  </div>
                ) : !cpRecord ? (
                  <div style={{ color: "#64748b", fontStyle: "italic" }}>
                    No TC ID mapping found for this user.
                  </div>
                ) : !centreLink || !hasCentre ? (
                  <div style={{ color: "#64748b", fontStyle: "italic" }}>
                    No centre is currently linked to your TC ID profile.
                  </div>
                ) : (
                  <div style={{ color: "#2b4e72" }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Centre Name:</strong> {centre.venue_name}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <strong>Address:</strong> {centre.venue_address}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <strong>Type:</strong> {centre.centre_type}
                      &nbsp;|&nbsp;
                      <strong>Halls:</strong> {centre.training_hall_count}
                    </div>
                  </div>
                )}
              </div>

              {/* ===================== */}
              {/* FILTER PANEL FOR BATCHES */}
              {/* ===================== */}
              {hasCentre && (
                <div
                  style={{
                    background: "#e4ecf5",
                    padding: 16,
                    borderRadius: 10,
                    marginBottom: 14,
                    border: "2px solid #3d6ba6",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="filter-row"
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: 12,
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "auto",
                    }}
                  >
                    <input
                      className="filter-input"
                      value={centre?.district?.district_name_en || ""}
                      disabled
                    />

                    <select
                      className="filter-input"
                      value={filters.block_id}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          block_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Block</option>
                      {blocks.map((b) => (
                        <option key={b.block_id} value={b.block_id}>
                          {b.block_name_en}
                        </option>
                      ))}
                    </select>

                    {/* ⭐ FILTER: status */}
                    <select
                      className="filter-input"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="">Status</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>

                    {/* ⭐ FILTER: training type */}
                    <select
                      className="filter-input"
                      value={filters.training_type}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          training_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Participant</option>
                      <option value="BENEFICIARY">Beneficiary</option>
                      <option value="TRAINER">Trainer</option>
                    </select>

                    <select
                      className="filter-input"
                      value={filters.batch_type}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          batch_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Batch Type</option>
                      <option value="SEPARATE">Separate</option>
                      <option value="COMBINED">Combined</option>
                    </select>

                    <select
                      className="filter-input"
                      value={filters.financial_year}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          financial_year: e.target.value,
                        }))
                      }
                    >
                      <option value="">Financial Year</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2026-27">2026-27</option>
                    </select>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 16,
                    }}
                  >
                    <button
                      className="fetch-btn"
                      onClick={() => fetchBatches()}
                    >
                      Fetch Batches
                    </button>
                  </div>
                </div>
              )}

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72" }}>
                  Batches for My Centre
                </h2>
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
                  <button
                    className="btnPrimary"
                    onClick={() => fetchBatches()}
                    disabled={batchesLoading || !hasCentre}
                  >
                    {batchesLoading ? "Refreshing…" : "Refresh"}
                  </button>
                </div>
              </div>

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 14,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ maxHeight: "100%", overflow: "auto" }}>
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>District</th>
                        <th>Block</th>
                        <th>Batch Code</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Batch Type</th>
                        <th>Participants</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {batchesLoading ? (
                        <tr>
                          <td
                            colSpan={8}
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#1f2937",
                            }}
                          >
                            Loading data...
                          </td>
                        </tr>
                      ) : visibleBatches.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "#1f2937",
                            }}
                          >
                            No batches found
                          </td>
                        </tr>
                      ) : (
                        paginatedBatches.map((batch, index) => {
                          const participantsCount = Array.isArray(
                            batch.beneficiary,
                          )
                            ? batch.beneficiary.length
                            : "-";

                          return (
                            <tr key={batch.id}>
                              <td>
                                {(currentPage - 1) * rowsPerPage + index + 1}
                              </td>
                              <td>{batch.district.district_name_en}</td>
                              <td>{batch?.block?.block_name_en || "-"}</td>
                              <td
                                style={{ fontWeight: "600", color: "#2563eb" }}
                              >
                                {batch.code}
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${String(batch.status).toLowerCase()}`}
                                >
                                  {batch.status}
                                </span>
                              </td>
                              <td>{fmtDate(batch.start_date)}</td>
                              <td>{fmtDate(batch.end_date)}</td>
                              <td>{batch.batch_type}</td>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {batch.pax_count}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                    justifyContent: "center",
                                  }}
                                >
                                  {renderAction(batch)}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <div style={{ color: "#2b4e72", fontSize: 14 }}>
                    Page {currentPage} of {totalPages || 1}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btnPage"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Prev
                    </button>
                    <button
                      className="btnPage"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`
/* LAYOUT FIXES */
.content-area {
  display: flex;
  flex: 1;
  width: 100%;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Critical: Prevents table from stretching off-screen */
  background-color: #f8fafc;
}

/* BUTTON */
.btnPrimary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnPrimary:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}
.btnPrimary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* VIEW BUTTON */
.btnView{
  background:#5a8cc2;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnView:hover{
  transform: translateY(-6px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.15);
}

/* TABLE */
.training-table{
  width:100%;
  border-collapse:collapse;
  font-size:14px;
}

/* HEADER */
.training-table thead{
  background:#3d6ba6;
  color:white;
}

.training-table th{
  padding:10px;
  text-align:left;
  font-weight:600;
  text-align:center;
  justify-content:center;  
}

/* BODY */
.training-table td{
  padding:10px;
  border-bottom:1px solid #e4ecf5;
  text-align:center;
  justify-content:center;  
}

/* ROW BACKGROUND */
.training-table tbody tr{
  background:#f8fbff;
}

/* ALTERNATE ROW */
.training-table tbody tr:nth-child(even){
  background:#edf4fb;
}

/* HOVER */
.training-table tbody tr:hover{
  background:#a7c6ed;
  transition:background .2s;
}

/* LOADING / EMPTY */
.training-table tbody td{
  color:#1f2937;
}

/* DELETE BUTTON */
.btnDelete{
  background:#ef4444;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnDelete:hover{
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.25);
}

/* PAGINATION BUTTON */
.btnPage{
  background:#e4ecf5;
  border:none;
  padding:6px 10px;
  border-radius:6px;
  cursor:pointer;
  color:#2b4e72;
  transition:all .2s ease;
}

.btnPage:hover:not(:disabled){
  background:#a7c6ed;
}

.btnPage:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

/* ACTIVE PAGE */
.activePage{
  background:#3d6ba6 !important;
  color:#fff !important;
}

.status-badge{
  display:inline-block;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.3px;
  text-transform:uppercase;
  min-width:95px;
  text-align:center;
  border:1px solid transparent;
}

/* DRAFT */
.status-draft{
  background:#f3f4f6;
  color:#4b5563;
  border-color:#d1d5db;
}

/* PENDING */
.status-pending{
  background:#fef3c7;
  color:#92400e;
  border-color:#fcd34d;
}

/* REJECTED */
.status-rejected{
  background:#fee2e2;
  color:#b91c1c;
  border-color:#fca5a5;
}

/* ONGOING */
.status-ongoing{
  background:#dbeafe;
  color:#1d4ed8;
  border-color:#93c5fd;
}

/* SCHEDULED */
.status-scheduled{
  background:#ede9fe;
  color:#6d28d9;
  border-color:#c4b5fd;
}

/* COMPLETED */
.status-completed{
  background:#dcfce7;
  color:#166534;
  border-color:#86efac;
}

/* REVIEW */
.status-review{
  background:#ffedd5;
  color:#c2410c;
  border-color:#fdba74;
}

/* CLOSED */
.status-closed{
  background:#cffafe;
  color:#155e75;
  border-color:#67e8f9;
}

/* FILTER STYLES */
.filter-input{
  border:1px solid #3d6ba6;
  border-radius:6px;
  padding:7px 10px;
  background:#fff;
  outline:none;
  font-size:14px;
  min-width:160px;
  transition:all .2s ease;
}

.filter-input:focus{
  border-color:#5a8cc2;
  box-shadow:0 0 0 2px rgba(61,107,166,0.2);
}

.filter-input:disabled {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
  border-color: #cbd5e1;
}

.fetch-btn{
  background:#3d6ba6;
  color:#fff;
  border:none;
  padding:8px 18px;
  border-radius:6px;
  font-weight:500;
  cursor:pointer;
  transition:all .25s ease;
  white-space: nowrap;
}

.fetch-btn:hover{
  background:#5a8cc2;
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(0,0,0,0.12);
}

@media (max-width: 1200px){
  .filter-row{
    flex-wrap: wrap !important;
    white-space: normal !important;
  }
}

@media (max-width: 768px){
  .filter-input{
    min-width: 140px;
    flex: 1 1 45%; 
  }
  .aspirational-box{
    flex: 1 1 45%;
    justify-content: center;
  }
}

@media (max-width: 480px){
  .filter-input{
    flex: 1 1 100%;
    min-width: unset;
  }
  .aspirational-box{
    flex: 1 1 100%;
  }
  .fetch-btn{
    width: 100%;
  }
}
      `}</style>
    </div>
  );
}
