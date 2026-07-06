// src/pages/TMS/TP/tp_tr_closure.jsx
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
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

export default function TpTrainingRequestClosure() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Batch Closure";
  const { id: batchId } = useParams();
  const navigate = useNavigate();

  /* ── layout ── */
  const [navCollapsed, setNavCollapsed] = useState(false);

  /* ── async states ── */
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mediaPreviewSrc, setMediaPreviewSrc] = useState(null);

  /* ── data ── */
  const [batch, setBatch] = useState(null);

  /* ── form state ── */
  const [isExposureVisit, setIsExposureVisit] = useState(false);
  const [exposureVisitCost, setExposureVisitCost] = useState("");
  const [isFieldVisit, setIsFieldVisit] = useState(false);
  const [fieldVisitCost, setFieldVisitCost] = useState("");

  // { [batchParticipantRowId]: { hra: string, ta_da: string, total_cost: string } }
  const [costs, setCosts] = useState({});

  const initializedRef = useRef(false);

  /* ═══════════════════════════════════════════════════════════
     FETCH
  ═══════════════════════════════════════════════════════════ */
  async function fetchBatch(redirectIfClosed = true) {
    setLoading(true);
    setFetchError(null);
    try {
      // ⚠️ SURGICAL FIX: Using the new Comprehensive Detail endpoint
      const resp = await api.get(
        `/tms/batches/comprehensive-detail/${batchId}/`,
      );
      const data = resp?.data;

      if (!data) throw new Error("Empty response");

      setBatch(data);

      // ── redirect if already closed ──
      if (redirectIfClosed && data?.status === "CLOSED") {
        navigate(`/tms/batch-certificate/${batchId}`, { replace: true });
        return null;
      }

      // ── pre-fill visit toggles from existing BatchCost ──
      if (data?.batch_costing) {
        const bc = data.batch_costing;
        setIsExposureVisit(!!bc.is_exposure_visit);
        setExposureVisitCost(String(bc.exposure_visit_cost ?? "0"));
        setIsFieldVisit(!!bc.is_field_visit);
        setFieldVisitCost(String(bc.field_visit_cost ?? "0"));
      }

      // ── pre-fill per-participant costs from existing TPBatchCostBreakup rows ──
      if (data?.participant_costs?.length) {
        const map = {};
        data.participant_costs.forEach((pc) => {
          // batch_beneficiary / batch_trainer are IDs of the through-table rows
          const key = pc.batch_beneficiary ?? pc.batch_trainer;
          if (key != null) {
            map[key] = {
              hra: String(pc.hra ?? "0"),
              ta_da: String(pc.ta_da ?? "0"),
              total_cost: String(pc.total_cost ?? "0"),
            };
          }
        });
        setCosts(map);
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

  // ⚠️ SURGICAL FIXES: Adjusted to use direct Batch model fields natively
  const trainingType = batch?.participant_type; // 'BENEFICIARY' | 'TRAINER'
  const alreadySubmitted = Boolean(batch?.batch_costing);
  const tp = batch?.training_plan || {};
  const centre = batch?.centre || {};

  // Safely extract the block name from the dynamic block_coverages mapping if available
  const blockName =
    batch?.combined_batch_details?.[0]?.block?.block_name_en || "—";

  const successfulParticipants = useMemo(() => {
    if (!batch) return [];

    // Map Beneficiaries using the new nested attendance_summary structure
    if (trainingType === "BENEFICIARY") {
      return (batch.beneficiary_participations || [])
        .filter(
          (bb) =>
            bb.is_active !== false &&
            bb.attendance_summary?.is_successful === true,
        )
        .map((bb) => {
          return {
            ...bb,
            display_name:
              bb.beneficiary?.member_name ||
              `Beneficiary #${bb.beneficiary?.id || bb.id}`,
            attendance_pct:
              bb.attendance_summary?.attendance_percentage || "0.00",
          };
        });
    }

    // Map Trainers using the new nested attendance_summary structure
    if (trainingType === "TRAINER") {
      return (batch.trainer_participations || [])
        .filter(
          (bt) =>
            bt.is_active !== false &&
            bt.attendance_summary?.is_successful === true,
        )
        .map((bt) => {
          return {
            ...bt,
            display_name:
              bt.trainer?.full_name || `Trainer #${bt.trainer?.id || bt.id}`,
            attendance_pct:
              bt.attendance_summary?.attendance_percentage || "0.00",
          };
        });
    }

    return [];
  }, [batch, trainingType]);

  /* ── initialize empty cost rows (edit mode only, runs once) ── */
  useEffect(() => {
    if (alreadySubmitted) return;
    if (initializedRef.current) return;
    if (successfulParticipants.length === 0) return;

    initializedRef.current = true;
    const init = {};
    successfulParticipants.forEach((p) => {
      init[p.id] = { hra: "", ta_da: "", total_cost: "" };
    });
    setCosts(init);
  }, [successfulParticipants, alreadySubmitted]);

  /* ═══════════════════════════════════════════════════════════
     COST HANDLERS
  ═══════════════════════════════════════════════════════════ */
  function handleCostChange(pid, field, raw) {
    const value = raw.replace(/[^0-9.]/g, "");
    setCosts((prev) => {
      const row = {
        ...(prev[pid] || { hra: "", ta_da: "", total_cost: "" }),
        [field]: value,
      };
      const hra = parseFloat(row.hra) || 0;
      const taDa = parseFloat(row.ta_da) || 0;
      row.total_cost = (hra + taDa).toFixed(2);
      return { ...prev, [pid]: row };
    });
  }

  /* ═══════════════════════════════════════════════════════════
     COMPUTED TOTALS
  ═══════════════════════════════════════════════════════════ */
  const participantSubtotal = useMemo(() => {
    let t = 0;
    Object.values(costs).forEach((c) => {
      t += parseFloat(c.total_cost) || 0;
    });
    return t.toFixed(2);
  }, [costs]);

  const grandTotal = useMemo(() => {
    let t = parseFloat(participantSubtotal) || 0;
    if (isExposureVisit) t += parseFloat(exposureVisitCost) || 0;
    if (isFieldVisit) t += parseFloat(fieldVisitCost) || 0;
    return t.toFixed(2);
  }, [
    participantSubtotal,
    isExposureVisit,
    exposureVisitCost,
    isFieldVisit,
    fieldVisitCost,
  ]);

  /* ═══════════════════════════════════════════════════════════
     SUBMIT
  ═══════════════════════════════════════════════════════════ */
  async function handleSubmit() {
    setSubmitError(null);

    // ── validations ──
    if (successfulParticipants.length === 0) {
      setSubmitError("No successful participants found for this batch.");
      return;
    }

    for (const p of successfulParticipants) {
      const c = costs[p.id] || {};
      if (c.hra === "" || c.ta_da === "") {
        setSubmitError(
          "Please fill in TA and DA for every participant before submitting.",
        );
        return;
      }
    }

    if (
      isExposureVisit &&
      (exposureVisitCost === "" || parseFloat(exposureVisitCost) <= 0)
    ) {
      setSubmitError("Please enter a valid Exposure Visit Cost (must be > 0).");
      return;
    }
    if (
      isFieldVisit &&
      (fieldVisitCost === "" || parseFloat(fieldVisitCost) <= 0)
    ) {
      setSubmitError("Please enter a valid Field Visit Cost (must be > 0).");
      return;
    }

    // ⚠️ SURGICAL FIX: Extract training_request natively from the participant mapping
    const trainingRequestId =
      successfulParticipants[0]?.training_request || null;

    setSubmitting(true);
    try {
      // 1. Submit Line-Item Costs
      for (const p of successfulParticipants) {
        const c = costs[p.id] || { hra: "0", ta_da: "0" };
        await api.post("/tms/tp-batch-cost-breakups/", {
          batch: parseInt(batchId, 10),
          batch_beneficiary: trainingType === "BENEFICIARY" ? p.id : null,
          batch_trainer: trainingType === "TRAINER" ? p.id : null,
          participant_type: trainingType,
          hra: parseFloat(c.hra || 0),
          ta_da: parseFloat(c.ta_da || 0),
          is_active: 1,
          created_by: user.id,
        });
      }

      // 2. Submit Master Invoice
      const costResp = await api.post("/tms/batch-costs/", {
        batch: parseInt(batchId, 10),
        training: trainingRequestId, // Passes null natively if batch is unlinked
        is_exposure_visit: isExposureVisit,
        exposure_visit_cost: isExposureVisit
          ? parseFloat(exposureVisitCost || 0)
          : 0,
        is_field_visit: isFieldVisit,
        field_visit_cost: isFieldVisit ? parseFloat(fieldVisitCost || 0) : 0,
        is_active: 1,
        created_by: user.id,
      });
      const masterCostId = costResp.data.id;

      // 3. Submit Closure Request
      await api.post("/tms/batch-closure-requests/", {
        batch: parseInt(batchId, 10),
        batch_costing: masterCostId,
        certificates_issued: false,
        is_active: 1,
        created_by: user.id,
      });

      // 4. Update Batch Status to REVIEW
      await api.patch(`/tms/batches/${batchId}/`, {
        status: "REVIEW",
        updated_by: user.id,
      });

      setSubmitSuccess(true);

      // Re-fetch to lock UI into read-only
      const freshData = await fetchBatch(false);
      if (freshData?.status === "CLOSED") {
        navigate(`/tms/batch-certificate/${batchId}`, { replace: true });
      }
    } catch (e) {
      const d = e?.response?.data;
      const msg =
        d?.non_field_errors?.[0] ||
        d?.detail ||
        (typeof d === "object" ? Object.values(d).flat().join(" | ") : null) ||
        "Submission failed. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
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
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {/* ════════ STATUS BANNERS ════════ */}
              {alreadySubmitted && !submitSuccess && (
                <div className="alert alert-info">
                  Closure has already been submitted. Batch is under DMMU
                  review. The data below is read-only.
                </div>
              )}
              {submitSuccess && (
                <div className="alert alert-success">
                  Batch closure submitted successfully! The batch is now under
                  DMMU review.
                </div>
              )}

              {/* ════════ BATCH & TRAINING PLAN DETAILS ════════ */}
              <div className="cl-card">
                <div className="cl-card-title">
                  📖 Training & Batch Overview
                </div>
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
                  <InfoItem
                    label="Training Type"
                    value={tp?.type_of_training}
                  />
                  <InfoItem label="No. of Days" value={tp?.no_of_days} />
                  <InfoItem label="Block" value={blockName} />
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
                  {batch?.master_trainer_participations?.length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batch.master_trainer_participations.map((mtp) => (
                          <tr key={mtp.id}>
                            <td style={{ fontWeight: 500 }}>
                              {mtp.master_trainer?.full_name}
                            </td>
                            <td>{mtp.master_trainer?.designation}</td>
                            <td>{mtp.master_trainer?.mobile_no}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-msg">
                      No master trainers assigned.
                    </div>
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

              {/* ════════ ATTENDANCE CSVs ════════ */}
              <div className="cl-card">
                <div className="cl-card-title">📝 Daily Attendance Records</div>
                {batch?.attendances?.length > 0 ? (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {batch.attendances.map((att) => (
                      <div
                        key={att.id}
                        style={{
                          border: "1px solid #cbd5e1",
                          borderRadius: 8,
                          padding: 12,
                          background: "#f8fafc",
                          minWidth: 160,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#1e293b",
                            marginBottom: 4,
                          }}
                        >
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
                              fontWeight: 500,
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
                      const isImage =
                        src && !src.toLowerCase().endsWith(".pdf");
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
                  <div className="empty-msg">No media uploaded by TC ID.</div>
                )}
              </div>

              {/* ════════ PARTICIPANTS COST TABLE ════════ */}
              <div className="cl-card">
                <div className="cl-card-title">
                  Successful Participants — Cost Breakup
                  <span className="count-badge">
                    {successfulParticipants.length}
                  </span>
                </div>

                {successfulParticipants.length === 0 ? (
                  <div className="empty-msg">
                    No successful participants found (must have ≥80% attendance
                    & not dropped out).
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Participant Name</th>
                          <th>Attendance %</th>
                          <th>TA (₹)</th>
                          <th>DA (₹)</th>
                          <th>Row Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {successfulParticipants.map((p, i) => {
                          const c = costs[p.id] || {
                            hra: "",
                            ta_da: "",
                            total_cost: "",
                          };
                          return (
                            <tr key={p.id}>
                              <td>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: "#0f172a" }}>
                                {p.display_name}
                              </td>
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
                              {alreadySubmitted ? (
                                /* ── READ-ONLY ── */
                                <>
                                  <td>₹{fmt(c.hra)}</td>
                                  <td>₹{fmt(c.ta_da)}</td>
                                  <td>
                                    <strong style={{ color: "#1e40af" }}>
                                      ₹{fmt(c.total_cost)}
                                    </strong>
                                  </td>
                                </>
                              ) : (
                                /* ── EDITABLE ── */
                                <>
                                  <td>
                                    <input
                                      className="cost-input"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={c.hra}
                                      onChange={(e) =>
                                        handleCostChange(
                                          p.id,
                                          "hra",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="cost-input"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={c.ta_da}
                                      onChange={(e) =>
                                        handleCostChange(
                                          p.id,
                                          "ta_da",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        parseFloat(c.total_cost) > 0
                                          ? "computed-total computed-total--active"
                                          : "computed-total"
                                      }
                                    >
                                      ₹{fmt(c.total_cost)}
                                    </span>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
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
                            Subtotal:
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

              {/* ════════ VISIT COSTS ════════ */}
              <div className="cl-card">
                <div className="cl-card-title">🚙 Additional Visit Costs</div>
                <div className="visit-grid">
                  <div className="visit-row">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={isFieldVisit}
                        disabled={alreadySubmitted}
                        onChange={(e) => {
                          setIsFieldVisit(e.target.checked);
                          if (!e.target.checked) setFieldVisitCost("");
                        }}
                      />
                      <span>
                        Have the participants of this batch attended a Field
                        Visit?
                      </span>
                    </label>
                    {isFieldVisit && (
                      <div className="visit-cost-field">
                        <span className="visit-cost-label">Cost (₹):</span>
                        {alreadySubmitted ? (
                          <span className="computed-total computed-total--active">
                            ₹{fmt(fieldVisitCost)}
                          </span>
                        ) : (
                          <input
                            className="cost-input"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={fieldVisitCost}
                            onChange={(e) => setFieldVisitCost(e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ════════ GRAND TOTAL CARD ════════ */}
              <div className="grand-total-card">
                <div className="grand-total-title">Master Invoice Summary</div>

                <div className="grand-total-row">
                  <span>
                    Participant Costs ({successfulParticipants.length}{" "}
                    participants)
                  </span>
                  <span>₹{fmt(participantSubtotal)}</span>
                </div>

                {isExposureVisit && (
                  <div className="grand-total-row">
                    <span>Exposure Visit Cost</span>
                    <span>₹{fmt(exposureVisitCost || 0)}</span>
                  </div>
                )}

                {isFieldVisit && (
                  <div className="grand-total-row">
                    <span>Field Visit Cost</span>
                    <span>₹{fmt(fieldVisitCost || 0)}</span>
                  </div>
                )}

                <div className="grand-total-divider" />

                <div className="grand-total-row grand-total-final">
                  <span>Grand Total</span>
                  <span>₹{fmt(grandTotal)}</span>
                </div>
              </div>

              {/* ════════ SUBMIT ERROR ════════ */}
              {submitError && (
                <div className="alert alert-error">{submitError}</div>
              )}

              {/* ════════ SUBMIT BUTTON ════════ */}
              {!alreadySubmitted && (
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
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={submitting || successfulParticipants.length === 0}
                  >
                    {submitting
                      ? "Submitting securely…"
                      : "Submit Closure Request →"}
                  </button>
                </div>
              )}

              {alreadySubmitted && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 24,
                    marginBottom: 32,
                  }}
                >
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(-1)}
                  >
                    ← Back to Batches
                  </button>
                </div>
              )}
            </div>
          </main>
          <Footer />
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

        {/* ════════════════════════════════════════════════════════
         STYLES
      ════════════════════════════════════════════════════════ */}
        <style>{`
.content-area {
  display: flex;
  flex: 1;              
  min-width: 0;
}

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
.cost-input { width: 110px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; font-size: 14px; transition: all .2s; }
.cost-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.cost-input::-webkit-inner-spin-button, .cost-input::-webkit-outer-spin-button { opacity: 1; }

/* ── COMPUTED TOTAL CHIP ── */
.computed-total { display: inline-block; padding: 5px 10px; border-radius: 6px; background: #f1f5f9; color: #475569; font-weight: 600; font-size: 14px; min-width: 90px; text-align: right; }
.computed-total--active { background: #dcfce7; color: #166534; }

/* ── VISIT SECTION ── */
.visit-grid { display: flex; flex-direction: column; gap: 14px; }
.visit-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; color: #334155; font-size: 14px; user-select: none; }
.toggle-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; }
.toggle-label input[type="checkbox"]:disabled { cursor: not-allowed; }
.visit-cost-field { display: flex; align-items: center; gap: 10px; animation: fadeIn .2s ease; }
.visit-cost-label { font-size: 13px; color: #64748b; font-weight: 600; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }

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
  .cost-input { width: 85px; }
  .grand-total-final { font-size: 17px; }
}
@media (max-width: 480px) {
  .info-grid { grid-template-columns: 1fr; }
  .visit-row { flex-direction: column; align-items: flex-start; }
}
      `}</style>
      </div>
    </div>
  );
}
