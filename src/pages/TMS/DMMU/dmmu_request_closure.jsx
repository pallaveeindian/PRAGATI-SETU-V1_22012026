// src/pages/TMS/DMMU/dmmu_request_closure.jsx
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import {
  getCanonicalRole,
  ROLE_WELCOME_MESSAGES,
} from "../../../utils/roleUtils";

/* ─── tiny helpers ─────────────────────────────────────────── */
function InfoItem({ label, value, children }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">{children ?? value ?? "—"}</span>
    </div>
  );
}

function fmt(val) {
  const n = parseFloat(val);
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("/media/")) return url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch (e) {
      return url;
    }
  }
  return url;
}

/* ═══════════════════════════════════════════════════════════ */

export default function DmmuBatchClosureReview() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "DMMU Dashboard";

  // Note: We are using the parameter 'id' from your route, but it now represents the BATCH ID.
  const { id: batchId } = useParams();
  const navigate = useNavigate();

  /* ── layout ── */
  const [navCollapsed, setNavCollapsed] = useState(false);

  /* ── async states ── */
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [mediaPreviewSrc, setMediaPreviewSrc] = useState(null);

  /* ── data ── */
  const [batch, setBatch] = useState(null);

  /* ── reject modal state ── */
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const inFlightRef = useRef(false);

  /* ═══════════════════════════════════════════════════════════
     FETCH
  ═══════════════════════════════════════════════════════════ */
  async function fetchBatch(redirectIfClosed = true) {
    setLoading(true);
    setFetchError(null);
    try {
      const resp = await api.get(`/tms/batches/${batchId}/detail/`);
      const data = resp?.data;

      if (!data) throw new Error("Empty response");

      setBatch(data);

      // ── redirect if already closed ──
      if (redirectIfClosed && data?.status === "CLOSED") {
        navigate(`/tms/batch-certificate/${batchId}`, { replace: true });
        return null;
      }

      return data;
    } catch {
      setFetchError("Failed to load batch details. Please refresh the page.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBatch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  /* ═══════════════════════════════════════════════════════════
     DERIVED DATA EXTRACTIONS
  ═══════════════════════════════════════════════════════════ */
  const trainingType = batch?.request?.training_type; // 'BENEFICIARY' | 'TRAINER'
  const tp = batch?.request?.training_plan || {};
  const req = batch?.request || {};
  const centre = batch?.centre || {};
  const batchCosting = batch?.batch_costing || {};
  const isReviewStatus = batch?.status === "REVIEW";

  const successfulParticipants = useMemo(() => {
    if (!batch) return [];

    // Map Beneficiaries
    if (trainingType === "BENEFICIARY") {
      return (batch.beneficiary_participations || [])
        .filter((bb) => {
          if (!bb.is_active) return false;
          const summary = (batch.beneficiary_summaries || []).find(
            (s) => s.batch_beneficiary === bb.id,
          );
          return summary?.is_successful === true;
        })
        .map((bb) => {
          const fullBen =
            (batch.beneficiary || []).find((b) => b.id === bb.beneficiary) ||
            {};
          const summary = (batch.beneficiary_summaries || []).find(
            (s) => s.batch_beneficiary === bb.id,
          );
          // Find line item cost
          const costLine =
            (batch.participant_costs || []).find(
              (c) => c.batch_beneficiary === bb.id,
            ) || {};

          return {
            ...bb,
            display_name:
              fullBen.member_name || `Beneficiary #${bb.beneficiary}`,
            attendance_pct: summary?.attendance_percentage || "0.00",
            hra: costLine.hra || 0,
            ta_da: costLine.ta_da || 0,
            total_cost: costLine.total_cost || 0,
            age: fullBen.age || "-",
            gender: fullBen.gender || "-",
            category: fullBen.social_category || "-",
            mobile: fullBen.mobile || "-",
          };
        });
    }

    // Map Trainers
    if (trainingType === "TRAINER") {
      return (batch.trainer_participations || [])
        .filter((bt) => bt.is_active && bt.attended === true)
        .map((bt) => {
          const fullTr =
            (batch.trainer || []).find((t) => t.id === bt.trainer) || {};
          const costLine =
            (batch.participant_costs || []).find(
              (c) => c.batch_trainer === bt.id,
            ) || {};
          return {
            ...bt,
            display_name: fullTr.full_name || `Trainer #${bt.trainer}`,
            attendance_pct: "100.00",
            hra: costLine.hra || 0,
            ta_da: costLine.ta_da || 0,
            total_cost: costLine.total_cost || 0,
            age: fullTr.date_of_birth ? `DOB: ${fullTr.date_of_birth}` : "-",
            gender: fullTr.gender || "-",
            category: fullTr.social_category || "-",
            mobile: fullTr.mobile_no || "-",
          };
        });
    }
    return [];
  }, [batch, trainingType]);

  const participantSubtotal = useMemo(() => {
    return successfulParticipants.reduce(
      (sum, p) => sum + parseFloat(p.total_cost || 0),
      0,
    );
  }, [successfulParticipants]);

  /* ═══════════════════════════════════════════════════════════
     ACTIONS (APPROVE / REJECT)
  ═══════════════════════════════════════════════════════════ */
  async function handleApprove() {
    if (
      !window.confirm(
        "Are you sure you want to APPROVE this batch? This will close the batch and make it elligible for Certificate generation.",
      )
    )
      return;

    if (!batch?.batch_closing?.id) {
      alert(
        "Error: Batch Closure Request object missing. The TP might not have submitted properly.",
      );
      return;
    }

    setActionLoading(true);
    try {
      // 1. Mark batch as CLOSED
      await api.patch(`/tms/batches/${batchId}/`, {
        status: "CLOSED",
        updated_by: user.id,
      });

      // 2. Flip certificates_issued to True (Triggers Backend Generation)
      await api.patch(
        `/tms/batch-closure-requests/${batch.batch_closing.id}/`,
        {
          certificates_issued: true,
          updated_by: user.id,
        },
      );

      alert("Batch Approved and Closed Successfully!");
      navigate(`/tms/batch-certificate/${batchId}`, { replace: true });
    } catch (e) {
      console.error("Batch approval failed", e);
      alert("An error occurred while approving the batch.");
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      // Mark batch as REJECTED with reason
      await api.patch(`/tms/batches/${batchId}/`, {
        status: "REJECTED",
        rejection_reason: rejectionReason,
        updated_by: user.id,
      });

      alert("Batch has been REJECTED and returned to the Training Partner.");
      setRejectModalOpen(false);
      navigate(-1);
    } catch (e) {
      console.error("Batch rejection failed", e);
      alert("An error occurred while rejecting the batch.");
      setActionLoading(false);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     LOADING / ERROR SCREENS
  ═══════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="app-shell">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area" style={{ padding: 40, color: "#2b4e72" }}>
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Loading comprehensive batch details…</span>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="app-shell">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area" style={{ padding: 40 }}>
          <div className="alert alert-error">{fetchError}</div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />

      <div className="main-area">
        <div className="dashboard-header">
          <h2 className="dashboard-title">{roleMessage}</h2>
        </div>

        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
                gap: 8,
              }}
            >
              <h2 style={{ margin: 0 }}>DMMU Review — Batch #{batchId}</h2>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => fetchBatch(false)}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
            </div>

            {/* ════════ STATUS BANNERS ════════ */}
            {isReviewStatus && (
              <div className="alert alert-info">
                <strong>Attention:</strong> This batch has been submitted for
                closure by the Training Partner. Please review the costs and
                media below, then Approve or Reject.
              </div>
            )}
            {batch?.status === "REJECTED" && (
              <div className="alert alert-error">
                <strong>Status:</strong> This batch was rejected. <br />
                <strong>Reason:</strong>{" "}
                {batch.rejection_reason || "No reason provided."}
              </div>
            )}

            {/* ════════ BATCH & TRAINING PLAN DETAILS ════════ */}
            <div className="cl-card">
              <div className="cl-card-title">📖 Training & Batch Overview</div>
              <div className="info-grid">
                <InfoItem
                  label="Batch Code"
                  value={batch?.code || `#${batchId}`}
                />
                <InfoItem label="Status">
                  <span
                    className={`status-badge status-${String(batch?.status || "").toLowerCase()}`}
                  >
                    {batch?.status}
                  </span>
                </InfoItem>
                <InfoItem label="Participant Type" value={trainingType} />
                <InfoItem label="Batch Type" value={batch?.batch_type} />
                <InfoItem
                  label="Start Date"
                  value={fmtDate(batch?.start_date)}
                />
                <InfoItem label="End Date" value={fmtDate(batch?.end_date)} />

                <div
                  style={{
                    gridColumn: "1 / -1",
                    borderTop: "1px solid #e2e8f0",
                    margin: "8px 0",
                  }}
                />

                <InfoItem label="Training Plan" value={tp?.training_name} />
                <InfoItem
                  label="Training Level"
                  value={tp?.level_of_training}
                />
                <InfoItem label="Training Type" value={tp?.type_of_training} />
                <InfoItem label="No. of Days" value={tp?.no_of_days} />
                <InfoItem
                  label="District"
                  value={req?.district?.district_name_en}
                />
                <InfoItem label="Block" value={req?.block?.block_name_en} />
              </div>
            </div>

            {/* ════════ CENTRE DETAILS ════════ */}
            <div className="cl-card">
              <div className="cl-card-title">🏢 Centre & Facilities</div>
              <div className="info-grid">
                <InfoItem label="Venue Name" value={centre?.venue_name} />
                <InfoItem label="Centre Type" value={centre?.centre_type} />
                <InfoItem label="Address" value={centre?.venue_address} />
                <InfoItem
                  label="Training Halls"
                  value={`${centre?.training_hall_count || 0} (Capacity: ${centre?.training_hall_capacity || 0})`}
                />
                <InfoItem
                  label="Toilets / Bathrooms"
                  value={centre?.toilets_bathrooms}
                />
                <InfoItem
                  label="Power & Water"
                  value={centre?.power_water_facility}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className={`facility-badge ${centre?.medical_kit ? "yes" : "no"}`}
                >
                  Medical Kit
                </span>
                <span
                  className={`facility-badge ${centre?.open_space ? "yes" : "no"}`}
                >
                  Open Space
                </span>
                <span
                  className={`facility-badge ${centre?.field_visit_facility ? "yes" : "no"}`}
                >
                  Field Visit
                </span>
                <span
                  className={`facility-badge ${centre?.transport_facility ? "yes" : "no"}`}
                >
                  Transport
                </span>
                <span
                  className={`facility-badge ${centre?.dining_facility ? "yes" : "no"}`}
                >
                  Dining Room
                </span>
              </div>
              {/* Nested Centre Rooms */}
              {centre?.rooms?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h5 style={{ margin: "0 0 10px 0", color: "#334155" }}>
                    Training Halls / Rooms
                  </h5>
                  <table className="table" style={{ maxWidth: 400 }}>
                    <thead style={{ background: "#f8fafc" }}>
                      <tr>
                        <th style={{ padding: "6px 10px" }}>Room Name</th>
                        <th style={{ padding: "6px 10px" }}>Capacity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {centre.rooms.map((r) => (
                        <tr key={r.id}>
                          <td style={{ padding: "6px 10px" }}>{r.room_name}</td>
                          <td style={{ padding: "6px 10px" }}>
                            {r.room_capacity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Nested Centre Pictures */}
              {centre?.submissions?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h5 style={{ margin: "0 0 10px 0", color: "#334155" }}>
                    Centre Media / Documents
                  </h5>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {centre.submissions.map((sub) => {
                      const src = normalizeMediaUrl(sub.file);
                      const isImage =
                        src && !src.toLowerCase().endsWith(".pdf");
                      return (
                        <div
                          key={sub.id}
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: 8,
                            overflow: "hidden",
                            width: 120,
                          }}
                        >
                          {isImage ? (
                            <img
                              src={src}
                              alt="Centre Media"
                              style={{
                                width: "100%",
                                height: 80,
                                objectFit: "cover",
                                cursor: "zoom-in",
                              }}
                              onClick={() => setMediaPreviewSrc(src)}
                            />
                          ) : (
                            <div
                              onClick={() => window.open(src, "_blank")}
                              style={{
                                height: 80,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                background: "#e2e8f0",
                              }}
                            >
                              <span style={{ fontSize: 11, fontWeight: 600 }}>
                                View PDF
                              </span>
                            </div>
                          )}
                          <div
                            style={{
                              padding: "4px",
                              fontSize: "10px",
                              textAlign: "center",
                              background: "#f8fafc",
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            {sub.category}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ════════ MASTER TRAINERS & SCHEDULES ════════ */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: 20,
              }}
            >
              <div className="cl-card">
                <div className="cl-card-title">🧑‍🏫 Master Trainers</div>
                {batch?.master_trainers?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.master_trainers.map((mt) => (
                        <tr key={mt.id}>
                          <td style={{ fontWeight: 500 }}>{mt.full_name}</td>
                          <td>{mt.designation}</td>
                          <td>{mt.mobile_no}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-msg">No master trainers assigned.</div>
                )}
              </div>

              <div className="cl-card">
                <div className="cl-card-title">📅 Batch Schedules</div>
                {batch?.schedules?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.schedules.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 500 }}>
                            {fmtDate(s.schedule_date)}
                          </td>
                          <td>{s.start_time || "—"}</td>
                          <td>{s.remarks || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-msg">No schedules found.</div>
                )}
              </div>
            </div>

            {/* ════════ DAILY ATTENDANCE RECORDS ════════ */}
            <div className="cl-card">
              <div className="cl-card-title">📝 Daily Attendance Records</div>
              {batch?.attendances?.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {batch.attendances.map((att) => (
                    <div
                      key={att.id}
                      style={{
                        border: "1px solid #cbd5e1",
                        borderRadius: 8,
                        background: "#f8fafc",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "#e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          Day: {fmtDate(att.date)}
                        </div>
                        {att.csv_upload ? (
                          <a
                            href={normalizeMediaUrl(att.csv_upload)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 13,
                              color: "#2563eb",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            📥 Download CSV
                          </a>
                        ) : (
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>
                            No CSV Uploaded
                          </span>
                        )}
                      </div>

                      {/* Participant Records Table */}
                      {att.participant_records?.length > 0 ? (
                        <div
                          style={{
                            padding: 12,
                            overflowX: "auto",
                            maxHeight: 200,
                            background: "#fff",
                          }}
                        >
                          <table className="table" style={{ fontSize: 13 }}>
                            <thead style={{ background: "#f1f5f9" }}>
                              <tr>
                                <th style={{ padding: "6px 10px" }}>
                                  Participant Name
                                </th>
                                <th style={{ padding: "6px 10px" }}>Role</th>
                                <th style={{ padding: "6px 10px" }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {att.participant_records.map((pr) => (
                                <tr key={pr.id}>
                                  <td style={{ padding: "6px 10px" }}>
                                    {pr.participant_name}
                                  </td>
                                  <td style={{ padding: "6px 10px" }}>
                                    {pr.participant_role}
                                  </td>
                                  <td style={{ padding: "6px 10px" }}>
                                    <span
                                      style={{
                                        padding: "2px 8px",
                                        borderRadius: 12,
                                        fontSize: 11,
                                        fontWeight: "bold",
                                        background: pr.present
                                          ? "#dcfce7"
                                          : "#fee2e2",
                                        color: pr.present
                                          ? "#166534"
                                          : "#991b1b",
                                      }}
                                    >
                                      {pr.present ? "Present" : "Absent"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: 12,
                            fontSize: 13,
                            color: "#64748b",
                            background: "#fff",
                          }}
                        >
                          No participant records found for this day.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-msg">No attendance recorded.</div>
              )}
            </div>

            {/* ════════ BATCH MEDIA GALLERY ════════ */}
            <div className="cl-card">
              <div className="cl-card-title">
                📸 Batch Media (Photos & Docs)
              </div>
              {batch?.batch_pictures?.length > 0 ? (
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {batch.batch_pictures.map((m) => {
                    const src = normalizeMediaUrl(m.file);
                    const isImage = src && !src.toLowerCase().endsWith(".pdf");
                    return (
                      <div
                        key={m.id}
                        style={{
                          width: 140,
                          background: "#f1f5f9",
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid #cbd5e1",
                        }}
                      >
                        {isImage ? (
                          <img
                            src={src}
                            alt={m.category}
                            onClick={() => setMediaPreviewSrc(src)}
                            style={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              cursor: "zoom-in",
                            }}
                          />
                        ) : (
                          <div
                            onClick={() => window.open(src, "_blank")}
                            style={{
                              height: 100,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              background: "#e2e8f0",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#334155",
                              }}
                            >
                              View PDF
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            padding: "8px",
                            fontSize: 12,
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {m.category}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-msg">
                  No media uploaded by Contact Person.
                </div>
              )}
            </div>

            {/* ════════ PARTICIPANTS COST TABLE (READ-ONLY) ════════ */}
            <div className="cl-card">
              <div className="cl-card-title">
                💰 Successful Participants — Cost Breakup
                <span className="count-badge">
                  {successfulParticipants.length}
                </span>
              </div>

              {successfulParticipants.length === 0 ? (
                <div className="empty-msg">
                  No successful participants found (must have ≥80% attendance &
                  not dropped out).
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Participant Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Category</th>
                        <th>Mobile</th>
                        <th>Attendance %</th>
                        <th>HRA (₹)</th>
                        <th>TA / DA (₹)</th>
                        <th>Row Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {successfulParticipants.map((p, i) => (
                        <tr key={p.id}>
                          <td>{i + 1}</td>
                          <td style={{ fontWeight: 600, color: "#0f172a" }}>
                            {p.display_name}
                          </td>
                          <td>{p.gender}</td>
                          <td>{p.age}</td>
                          <td>{p.category}</td>
                          <td>{p.mobile}</td>
                          <td>
                            <span
                              style={{
                                background: "#dcfce7",
                                color: "#166534",
                                padding: "3px 8px",
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: "bold",
                              }}
                            >
                              {p.attendance_pct}%
                            </span>
                          </td>
                          <td>₹{fmt(p.hra)}</td>
                          <td>₹{fmt(p.ta_da)}</td>
                          <td>
                            <strong style={{ color: "#1e40af" }}>
                              ₹{fmt(p.total_cost)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "right",
                            fontWeight: 700,
                            color: "#2b4e72",
                            padding: "10px",
                          }}
                        >
                          Participant Subtotal:
                        </td>
                        <td
                          style={{
                            fontWeight: 700,
                            color: "#2b4e72",
                            padding: "10px",
                            fontSize: 16,
                          }}
                        >
                          ₹{fmt(participantSubtotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* ════════ GRAND TOTAL CARD (READ-ONLY) ════════ */}
            <div className="grand-total-card">
              <div className="grand-total-title">Master Invoice Summary</div>

              <div className="grand-total-row">
                <span>
                  Participant Costs ({successfulParticipants.length}{" "}
                  participants)
                </span>
                <span>₹{fmt(participantSubtotal)}</span>
              </div>

              {batchCosting?.is_exposure_visit && (
                <div className="grand-total-row">
                  <span>Exposure Visit Cost</span>
                  <span>₹{fmt(batchCosting.exposure_visit_cost || 0)}</span>
                </div>
              )}

              {batchCosting?.is_field_visit && (
                <div className="grand-total-row">
                  <span>Field Visit Cost</span>
                  <span>₹{fmt(batchCosting.field_visit_cost || 0)}</span>
                </div>
              )}

              <div className="grand-total-divider" />

              <div className="grand-total-row grand-total-final">
                <span>Grand Total Requested by TP</span>
                <span>₹{fmt(batchCosting?.grand_total_cost || 0)}</span>
              </div>
            </div>

            {/* ════════ APPROVE / REJECT ACTION BAR ════════ */}
            {isReviewStatus && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 24,
                  marginBottom: 32,
                }}
              >
                <button
                  className="btn btn-outline"
                  style={{
                    borderColor: "#ef4444",
                    color: "#b91c1c",
                    fontWeight: "bold",
                  }}
                  disabled={actionLoading}
                  onClick={() => setRejectModalOpen(true)}
                >
                  Reject Batch
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ background: "#10b981", borderColor: "#10b981" }}
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing…" : "Approve and Close Batch"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Lightbox for media preview */}
      {mediaPreviewSrc && (
        <div
          onClick={() => setMediaPreviewSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={mediaPreviewSrc}
            alt="Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 6 }}
          />
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: 500,
              padding: 24,
              borderRadius: 10,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#b91c1c" }}>
              Reject Batch Closure
            </h3>
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 12 }}>
              Please provide a reason for rejecting this batch. It will be sent
              back to the Training Partner.
            </p>
            <textarea
              className="cost-input"
              style={{ width: "100%", height: 100, marginBottom: 16 }}
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={actionLoading}
            />
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setRejectModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "#ef4444" }}
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
         STYLES
      ════════════════════════════════════════════════════════ */}
      <style>{`
/* ── LAYOUT ── */
.dashboard-header { display: flex; align-items: center; margin-bottom: 16px; }
.dashboard-title { margin-top: 25px; margin-left: 30px; color: #2b4e72; }

/* ── CARDS ── */
.cl-card {
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  padding: 20px;
  margin-bottom: 20px;
}
.cl-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

/* ── INFO GRID ── */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.info-item { display: flex; flex-direction: column; gap: 3px; }
.info-label { font-size: 12px; font-weight: 600; color: #64748b; }
.info-value { font-size: 14px; color: #0f172a; font-weight: 500; }

.facility-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid transparent; }
.facility-badge.yes { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
.facility-badge.no { background: #fee2e2; color: #991b1b; border-color: #fecaca; text-decoration: line-through; }

/* ── COUNT BADGE ── */
.count-badge { background: #3b82f6; color: #fff; border-radius: 12px; padding: 2px 10px; font-size: 13px; font-weight: 600; }

/* ── TABLE ── */
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table thead { background: #f1f5f9; color: #334155; }
.table th { padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1; white-space: nowrap; }
.table td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
.table tbody tr:hover { background: #f8fafc; }

/* ── COST INPUT ── */
.cost-input { padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; font-size: 14px; transition: all .2s; }
.cost-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }

/* ── GRAND TOTAL CARD ── */
.grand-total-card { background: linear-gradient(135deg, #1e293b, #334155); border-radius: 12px; padding: 22px 24px; margin-bottom: 20px; color: #f8fafc; }
.grand-total-title { font-size: 14px; font-weight: 700; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
.grand-total-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 15px; opacity: 0.9; }
.grand-total-divider { border-top: 1px solid rgba(255,255,255,0.2); margin: 10px 0; }
.grand-total-final { font-size: 20px; font-weight: 800; opacity: 1; color: #fff; }

/* ── ALERTS ── */
.alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; font-size: 14px; }
.alert-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.alert-success { background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0; }
.alert-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

/* ── BUTTONS ── */
.btn { padding: 9px 18px; border-radius: 7px; cursor: pointer; border: none; font-weight: 600; font-size: 14px; transition: all .22s ease; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-primary { background: #2563eb; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(37,99,235,0.2); }
.btn-outline { background: #fff; color: #475569; border: 1px solid #cbd5e1; }
.btn-outline:hover:not(:disabled) { background: #f8fafc; }
.btn-lg { padding: 11px 26px; font-size: 15px; }

/* ── STATUS BADGES ── */
.status-badge { padding: 3px 8px; border-radius: 5px; font-weight: 600; font-size: 12px; }
.status-draft { background: #fef08a; color: #92400e; }
.status-pending { background: #fecaca; color: #991b1b; }
.status-ongoing { background: #fef08a; color: #92400e; }
.status-scheduled { background: #bae6fd; color: #075985; }
.status-completed { background: #dcfce7; color: #166534; }
.status-review { background: #fed7aa; color: #9a3412; }
.status-closed { background: #e2e8f0; color: #334155; }
.status-rejected { background: #fecaca; color: #991b1b; }

/* ── EMPTY STATE ── */
.empty-msg { padding: 20px; color: #64748b; font-style: italic; text-align: center; }

/* ── LOADING SPINNER ── */
.spinner-wrap { display: flex; align-items: center; gap: 14px; font-size: 16px; color: #334155; font-weight: 600; }
.spinner { width: 28px; height: 28px; border: 3px solid #cbd5e1; border-top-color: #3b82f6; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .info-grid { grid-template-columns: repeat(2, 1fr); }
  .grand-total-final { font-size: 17px; }
}
@media (max-width: 480px) {
  .info-grid { grid-template-columns: 1fr; }
}
      `}</style>
    </div>
  );
}
