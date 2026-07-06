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

  const [filters, setFilters] = useState({
    district_id: "",
    block_id: "",
    status: "",
    training_type: "",
    batch_type: "",
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
        centre_id: centre.id, // Fixed Param!
        page_size: 500,
      };

      if (filters.block_id) params.block_id = filters.block_id;
      if (filters.status) params.status = filters.status;
      if (filters.batch_type) params.batch_type = filters.batch_type;
      if (filters.training_type)
        params.request__training_type = filters.training_type;

      const resp = await api.get(
        `/tms/batches-list/?${new URLSearchParams(params)}`,
      );

      // Removed strictly local .filter(is_active) assuming backend handles soft deletes properly
      const items = resp?.data?.results || [];
      setBatches(items);
    } catch (e) {
      console.error("Fetch batches failed", e);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }

  const hasCentre = !!centre;
  const rows = useMemo(() => batches || [], [batches]);

  function renderAction(batch) {
    const status = (batch.status || "").toUpperCase();
    if (["ONGOING", "PENDING", "SCHEDULED"].includes(status)) {
      return (
        <button
          className="btn-sm btn-flat"
          onClick={() => navigate(`/tms/cp/batch-detail/${batch.id}`)}
        >
          View
        </button>
      );
    }
    if (status === "COMPLETED") {
      return (
        <>
          <button
            className="btn-sm btn-flat"
            style={{ marginRight: 6 }}
            onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}
          >
            View
          </button>
          <button
            className="btn-sm btn-flat"
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
          <main
            style={{
              padding: 20,
              minHeight: "100vh",
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <h2
                style={{
                  marginTop: 8,
                  color: "#2b4e72",
                  fontWeight: 700,
                }}
              >
                Training Centre — Batches
              </h2>

              <div
                className="muted"
                style={{
                  marginBottom: 18,
                  color: "#5a8cc2",
                }}
              >
                List of all training batches mapped to your assigned centre.
              </div>

              {/* ===================== */}
              {/* MY CENTRE CARD */}
              {/* ===================== */}

              <div
                className="card"
                style={{
                  marginBottom: 22,
                  padding: 20,
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  borderTop: "4px solid #3d6ba6",
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
                    className="btn btn-sm"
                    style={{
                      marginLeft: "auto",
                      background: "#3d6ba6",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                    onClick={() => fetchCentreChain()}
                    disabled={loadingCentreChain}
                  >
                    {loadingCentreChain ? "Refreshing…" : "Refresh Mapping"}
                  </button>
                </div>

                {loadingCentreChain ? (
                  <div className="table-spinner">
                    Loading your TC ID and centre mapping…
                  </div>
                ) : !cpRecord ? (
                  <div className="muted">
                    No TC ID mapping found for this user.
                  </div>
                ) : !centreLink || !hasCentre ? (
                  <div className="muted">
                    No centre is currently linked to your TC ID profile.
                  </div>
                ) : (
                  <div>
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
              {/* BATCH LIST CARD */}
              {/* ===================== */}

              <div
                className="card"
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  borderTop: "4px solid #5a8cc2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#2b4e72",
                    }}
                  >
                    Batches for My Centre
                  </h3>

                  <button
                    className="btn btn-sm"
                    style={{
                      marginLeft: "auto",
                      background: "#3d6ba6",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                    onClick={() => fetchBatches()}
                    disabled={batchesLoading || !hasCentre}
                  >
                    {batchesLoading ? "Refreshing…" : "Refresh"}
                  </button>
                </div>

                {!hasCentre ? (
                  <div className="muted">
                    Link a centre to your TC ID profile to see batches.
                  </div>
                ) : batchesLoading ? (
                  <div className="table-spinner">Loading batches…</div>
                ) : rows.length === 0 ? (
                  <div className="muted">
                    No batches found for your assigned centre.
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: 520,
                      overflow: "auto",
                      border: "1px solid #d6e3f5",
                      borderRadius: 8,
                    }}
                  >
                    <div className="filter-panel">
                      {/* ⭐ FILTER: district locked */}
                      <input
                        className="input"
                        value={centre?.district?.district_name_en || ""}
                        disabled
                      />

                      {/* ⭐ FILTER: block dropdown */}
                      <select
                        className="input"
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
                        className="input"
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
                        className="input"
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

                      {/* ⭐ FILTER: batch type */}
                      <select
                        className="input"
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

                      {/* ⭐ FILTER: trigger API */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          onClick={() => fetchBatches()}
                        >
                          Fetch Batches
                        </button>
                      </div>
                    </div>
                    <table className="table table-compact">
                      <thead
                        style={{
                          background: "#a7c6ed",
                          color: "#2b4e72",
                        }}
                      >
                        <tr>
                          <th>S.No.</th>
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
                        {rows.map((batch, index) => {
                          const participantsCount = Array.isArray(
                            batch.beneficiary,
                          )
                            ? batch.beneficiary.length
                            : "-";

                          return (
                            <tr key={batch.id}>
                              <td>{index + 1}</td>
                              <td>{batch.code}</td>
                              <td>{batch.status}</td>
                              <td>{fmtDate(batch.start_date)}</td>
                              <td>{fmtDate(batch.end_date)}</td>
                              <td>{batch.batch_type}</td>
                              <td>{batch.pax_count}</td>
                              <td>{renderAction(batch)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`.content-area {
  display: flex;
  flex: 1;              /*  pushes footer down */
  min-width: 0;         /*  prevents overflow bug */
}`}</style>
    </div>
  );
}
