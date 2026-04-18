// src/pages/TMS/TRs/training_batch_detail.jsx
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";

const DETAIL_CACHE_PREFIX = "tms_batch_detail_cache_v1::";

function loadCache(id) {
  try {
    const raw = localStorage.getItem(DETAIL_CACHE_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveCache(id, payload) {
  try {
    localStorage.setItem(
      DETAIL_CACHE_PREFIX + id,
      JSON.stringify({ ts: Date.now(), payload }),
    );
  } catch (e) { }
}

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";

  // If the URL already starts with a relative path like /media/, it's perfect.
  if (url.startsWith("/media/")) {
    return url;
  }

  // If it's an absolute URL (http:// or https://), strip the domain completely
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname; // Extracts ONLY the path (e.g., "/media/uploads/file.jpg")
    } catch (error) {
      console.warn("Invalid media URL:", url);
      return url;
    }
  }

  // Fallback for any weird edge cases
  return url;
}
export default function TrainingBatchDetail() {
  const { id: batchId } = useParams();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const [trainingRequestDetail, setTrainingRequestDetail] = useState(null);
  const [masterTrainers, setMasterTrainers] = useState([]);
  const [centreDetail, setCentreDetail] = useState(null);

  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(null);
  const [selectedAttendanceRecords, setSelectedAttendanceRecords] = useState(
    [],
  );
  const [loadingSelectedAttendance, setLoadingSelectedAttendance] =
    useState(false);

  const [refreshToken, setRefreshToken] = useState(0);
  const inFlightRef = useRef(false);

  // NEW: closure + media state
  const [closureRequest, setClosureRequest] = useState(null);
  const [batchMedia, setBatchMedia] = useState([]);
  const [loadingClosureInfo, setLoadingClosureInfo] = useState(false);
  const [selectedMediaDate, setSelectedMediaDate] = useState(null);
  const [mediaPreviewSrc, setMediaPreviewSrc] = useState(null);

  const mediaByDate = useMemo(() => {
    const grouped = {};
    (batchMedia || []).forEach((m) => {
      const dt = m.date || "";
      if (!grouped[dt]) grouped[dt] = [];
      grouped[dt].push(m);
    });
    return grouped;
  }, [batchMedia]);

  const effectiveTrainingType =
    trainingRequestDetail?.training_type || batchData?.request?.training_type;

  const isTrainerTraining = effectiveTrainingType === "TRAINER";

  const displayedParticipants = useMemo(() => {
    if (!batchData) return [];

    // TRAINER TRAINING
    if (isTrainerTraining) {
      const trainerIds = new Set(
        (batchData.trainer_participations || []).map((tp) => tp.trainer),
      );

      return (batchData.trainer || []).filter((t) => trainerIds.has(t.id));
    }

    // BENEFICIARY TRAINING
    const beneficiaryIds = new Set(
      (batchData.beneficiary_participations || []).map((bp) => bp.beneficiary),
    );

    return (batchData.beneficiary || []).filter((b) =>
      beneficiaryIds.has(b.id),
    );
  }, [batchData, isTrainerTraining]);

  async function fetchAll() {
    if (!batchId) return;

    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingAll(true);

    let trDetail = null;
    let fullCentreData = null;
    let attendances = [];

    try {
      // 1. Batch detail
      const batchResp = await api.get(`/tms/batches/${batchId}/detail/`);
      const batchResponse = batchResp?.data || null;
      setBatchData(batchResponse);

      const requestId = batchResponse?.request?.id;
      setMasterTrainers(batchResponse?.master_trainers || []);

      // 2. Training request detail
      if (requestId) {
        const trResp = await api.get(
          `/tms/training-requests/${requestId}/detail/`,
        );
        trDetail = trResp?.data || null;
        setTrainingRequestDetail(trDetail);
      }

      // 3. Centre detail
      if (batchResponse?.centre?.id) {
        const centreResp = await api.get(
          `/tms/training-partner-centres/${batchResponse.centre.id}/detail/`,
        );
        fullCentreData = centreResp?.data || batchResponse.centre;
        setCentreDetail(fullCentreData);
      }

      // 4. Attendance
      try {
        setLoadingAttendance(true);
        const attResp = await api.get(
          `/tms/batch-attendance/?batch=${batchId}`,
        );
        const attData = attResp?.data ?? {};
        attendances = attData.results || attData || [];
        attendances.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
        setAttendanceList(attendances);
      } catch (e) {
        setAttendanceList([]);
      } finally {
        setLoadingAttendance(false);
      }
    } catch (e) {
      console.error("fetchAll failed:", e);
    } finally {
      setLoadingAll(false);
      inFlightRef.current = false;
    }
  }

  // NEW: fetch closure + media
  async function fetchClosureInfo() {
    if (!batchId) return;
    try {
      setLoadingClosureInfo(true);
      // closure
      const crResp = await api.get(
        `/tms/batch-closure-requests/?batch=${batchId}`,
      );
      const crData = crResp?.data ?? crResp ?? {};
      const crList = crData.results || crData || [];
      setClosureRequest(crList[0] || null);

      // media
      const mediaResp = await api.get(
        `/tms/batch-media/?batch=${batchId}&page_size=500`,
      );
      const mData = mediaResp?.data ?? mediaResp ?? {};
      const mList = mData.results || mData || [];
      setBatchMedia(mList);
    } catch (e) {
      console.error("❌ fetchClosureInfo failed:", e);
      setClosureRequest(null);
      setBatchMedia([]);
    } finally {
      setLoadingClosureInfo(false);
    }
  }

  useEffect(() => {
    fetchAll(refreshToken > 0);
    fetchClosureInfo();
  }, [batchId, refreshToken]);

  function handleRefresh() {
    console.log("🔄 Refresh clicked");
    try {
      localStorage.removeItem(DETAIL_CACHE_PREFIX + batchId);
    } catch (e) { }
    setSelectedAttendanceDate(null);
    setSelectedAttendanceRecords([]);
    setSelectedMediaDate(null);
    setMediaPreviewSrc(null);
    setRefreshToken((t) => t + 1);
  }

  const hasMasterTrainers = masterTrainers && masterTrainers.length > 0;
  const firstMasterTrainer = hasMasterTrainers ? masterTrainers[0] : null;

  /* ------------- fetch participant records for a given attendance date ------------- */
  async function fetchAttendanceParticipantsForDate(dateStr) {
    if (!batchId || !dateStr) return;
    setLoadingSelectedAttendance(true);
    setSelectedAttendanceDate(dateStr);
    setSelectedAttendanceRecords([]);
    setSelectedMediaDate(dateStr); // NEW: also select media for this date

    try {
      // 1) Find the BatchAttendance row for this date
      const attResp = await api.get(
        `/tms/batch-attendance/?batch=${batchId}&date=${dateStr}`,
      );
      const attData = attResp?.data ?? attResp ?? {};
      const attendance = (attData.results || attData || [])[0];
      if (!attendance?.id) {
        setSelectedAttendanceRecords([]);
        return;
      }

      // 2) Fetch participant records for this attendance id
      const recResp = await api.get(
        `/tms/participant-attendance/?attendance=${attendance.id}`,
      );
      const recData = recResp?.data ?? recResp ?? {};
      const recs = recData.results || recData || [];
      setSelectedAttendanceRecords(recs);
    } catch (e) {
      console.error("❌ fetchAttendanceParticipantsForDate failed:", e);
      setSelectedAttendanceRecords([]);
    } finally {
      setLoadingSelectedAttendance(false);
    }
  }

  if (loadingAll && !batchData) {
    return (
      <div className="app-shell">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav
            left={<div className="app-title">Pragati Setu — Batch Detail</div>}
          /> */}
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              <div className="table-spinner">Loading batch details…</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav
          left={<div className="app-title">Pragati Setu — Batch Detail</div>}
        /> */}
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              <div className="batch-header">
                <h2 className="batch-page-title">
                  Batch #{batchId}
                  {batchData?.code ? (
                    <span className="batch-code">({batchData.code})</span>
                  ) : (
                    ""
                  )}
                </h2>

                <div className="batch-header-actions">
                  <button className="btn-primary" onClick={handleRefresh}>
                    Refresh
                  </button>

                  <button className="btn-secondary" onClick={() => navigate(-1)}>
                    Back
                  </button>
                </div>
              </div>

              {/* NEW: Closure banner */}
              {/* CLOSURE BANNER */}
              {loadingClosureInfo ? (
                <div className="closure-banner loading">
                  Checking batch closure status…
                </div>
              ) : closureRequest ? (
                <div className="closure-banner closed">
                  <strong>This batch is now closed.</strong>A closure request has
                  been submitted for this batch and is under review / processing.
                </div>
              ) : null}

              <div className="batch-main-card">
                {!batchData ? (
                  <div className="muted">
                    Batch not found.
                    <button className="btn-sm" onClick={handleRefresh}>
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. TRAINING DETAILS */}
                    <div className="training-section">
                      <h3 className="section-title">📋 Training Details</h3>

                      <div className="training-grid">
                        <div className="info-tile">
                          <span className="info-label">Type</span>
                          <span className="info-value">
                            {trainingRequestDetail?.training_type ||
                              batchData?.request?.training_type ||
                              "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Level</span>
                          <span className="info-value">
                            {trainingRequestDetail?.level ||
                              batchData?.request?.level ||
                              "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Status</span>
                          <span className="info-value highlight">
                            {trainingRequestDetail?.status ||
                              batchData?.request?.status ||
                              "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Training Name</span>
                          <span className="info-value">
                            {trainingRequestDetail?.training_plan
                              ?.training_name || "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Type of Training</span>
                          <span className="info-value">
                            {trainingRequestDetail?.training_plan
                              ?.type_of_training || "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Level of Training</span>
                          <span className="info-value">
                            {trainingRequestDetail?.training_plan
                              ?.level_of_training || "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">No. of Days</span>
                          <span className="info-value">
                            {trainingRequestDetail?.training_plan?.no_of_days ||
                              "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">District</span>
                          <span className="info-value">
                            {trainingRequestDetail?.district?.district_name_en ||
                              "-"}
                          </span>
                        </div>

                        <div className="info-tile">
                          <span className="info-label">Block</span>
                          <span className="info-value">
                            {trainingRequestDetail?.block?.block_name_en || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. BATCH DETAILS */}
                    <div className="batch-card">
                      <h3 className="batch-title">🎯 Batch Details</h3>

                      <div className="batch-grid">
                        <div className="batch-item">
                          <div className="batch-label">Batch Code</div>
                          <div className="batch-value highlight">
                            {batchData.code || "-"}
                          </div>
                        </div>

                        <div className="batch-item">
                          <div className="batch-label">Batch Type</div>
                          <div className="batch-value">
                            {batchData.batch_type || "-"}
                          </div>
                        </div>

                        <div className="batch-item">
                          <div className="batch-label">Status</div>
                          <div className="batch-value status">
                            {batchData.status || "-"}
                          </div>
                        </div>

                        <div className="batch-item">
                          <div className="batch-label">Start Date</div>
                          <div className="batch-value">
                            {fmtDate(batchData.start_date)}
                          </div>
                        </div>

                        <div className="batch-item">
                          <div className="batch-label">End Date</div>
                          <div className="batch-value">
                            {fmtDate(batchData.end_date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 3. ATTENDANCE + MEDIA DETAILS */}
                    <div style={{ marginBottom: 24 }}>
                      <h3 className="attendance-title">
                        📅 Attendance (All Dates)
                      </h3>

                      {loadingAttendance ? (
                        <div className="table-spinner">Loading attendance…</div>
                      ) : attendanceList.length === 0 ? (
                        <div className="muted">
                          No attendance records found for this batch.
                        </div>
                      ) : (
                        <>
                          <div className="attendance-table-wrapper">
                            <table className="table table-compact attendance-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Created At</th>
                                  <th>CSV Uploaded</th>
                                </tr>
                              </thead>

                              <tbody>
                                {attendanceList.map((att) => (
                                  <tr key={att.id}>
                                    <td>
                                      <button
                                        type="button"
                                        className={
                                          selectedAttendanceDate === att.date
                                            ? "attendance-date-btn active"
                                            : "attendance-date-btn"
                                        }
                                        onClick={() =>
                                          fetchAttendanceParticipantsForDate(
                                            att.date,
                                          )
                                        }
                                      >
                                        {fmtDate(att.date)}
                                      </button>
                                    </td>

                                    <td>{fmtDate(att.created_at)}</td>

                                    <td>
                                      <span
                                        className={
                                          att.csv_upload
                                            ? "badge badge-uploaded"
                                            : "badge badge-not-uploaded"
                                        }
                                      >
                                        {att.csv_upload
                                          ? "Uploaded"
                                          : "Not Uploaded"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {selectedAttendanceDate && (
                            <div className="attendance-detail">
                              <h4 className="attendance-subtitle">
                                Attendance on {fmtDate(selectedAttendanceDate)}
                              </h4>

                              {loadingSelectedAttendance ? (
                                <div className="table-spinner">
                                  Loading participant records…
                                </div>
                              ) : selectedAttendanceRecords.length === 0 ? (
                                <div className="muted">
                                  No participant attendance records for this date.
                                </div>
                              ) : (
                                <div className="attendance-participant-table">
                                  <table className="table table-compact attendance-table">
                                    <thead>
                                      <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {selectedAttendanceRecords.map((r) => (
                                        <tr key={r.id}>
                                          <td>{r.participant_name}</td>

                                          <td>
                                            <span className="role-pill">
                                              {r.participant_role === "trainer"
                                                ? "Trainer"
                                                : "Trainee"}
                                            </span>
                                          </td>

                                          <td>
                                            <span
                                              className={
                                                r.present
                                                  ? "badge badge-present"
                                                  : "badge badge-absent"
                                              }
                                            >
                                              {r.present ? "Present" : "Absent"}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* NEW: Media thumbnails for this date */}
                              {selectedMediaDate &&
                                mediaByDate[selectedMediaDate] &&
                                mediaByDate[selectedMediaDate].length > 0 && (
                                  <div
                                    style={{
                                      marginTop: 16,
                                      paddingTop: 8,
                                      borderTop: "1px dashed #e5e7eb",
                                    }}
                                  >
                                    <h4>Media on {fmtDate(selectedMediaDate)}</h4>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 12,
                                      }}
                                    >
                                      {mediaByDate[selectedMediaDate].map((m) => {
                                        const src = normalizeMediaUrl(m.file);
                                        const isImage =
                                          src &&
                                          !src.toLowerCase().endsWith(".pdf");
                                        return (
                                          <div
                                            key={m.id}
                                            style={{
                                              width: 150,
                                              borderRadius: 6,
                                              border: "1px solid #e5e7eb",
                                              padding: 8,
                                              background: "#fff",
                                              fontSize: 12,
                                            }}
                                          >
                                            {isImage ? (
                                              <img
                                                src={src}
                                                alt={m.category}
                                                style={{
                                                  width: "100%",
                                                  height: 90,
                                                  objectFit: "cover",
                                                  borderRadius: 4,
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  setMediaPreviewSrc(src)
                                                }
                                              />
                                            ) : (
                                              <div
                                                style={{
                                                  height: 90,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  background: "#f9fafb",
                                                  borderRadius: 4,
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  window.open(src, "_blank")
                                                }
                                              >
                                                View PDF
                                              </div>
                                            )}
                                            <div
                                              style={{
                                                marginTop: 4,
                                                fontWeight: 600,
                                              }}
                                            >
                                              {m.category}
                                            </div>
                                            {m.notes && (
                                              <div
                                                style={{
                                                  marginTop: 2,
                                                  color: "#4b5563",
                                                }}
                                              >
                                                {m.notes}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 4. CENTRE DETAILS */}
                    {centreDetail && (
                      <div className="centre-card">
                        <h3 className="centre-title">🏢 Centre Details</h3>

                        <div className="centre-grid">
                          {/* LEFT SIDE */}
                          <div className="centre-left">
                            <div className="centre-name">
                              {centreDetail.venue_name}
                            </div>

                            <div className="centre-address">
                              {centreDetail.venue_address}
                            </div>

                            <div className="centre-meta">
                              <div>
                                <strong>Serial:</strong>{" "}
                                {centreDetail.serial_number || "-"}
                              </div>
                              <div>
                                <strong>Type:</strong>{" "}
                                {centreDetail.centre_type || "-"}
                              </div>
                              <div>
                                <strong>Halls:</strong>{" "}
                                {centreDetail.training_hall_count || 0} (Capacity:{" "}
                                {centreDetail.training_hall_capacity || 0})
                              </div>
                            </div>

                            {centreDetail.rooms?.length > 0 && (
                              <div className="centre-halls">
                                <h4>Training Halls</h4>

                                <table className="centre-table">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Capacity</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {centreDetail.rooms.map((room) => (
                                      <tr key={room.id}>
                                        <td>{room.room_name}</td>
                                        <td>{room.room_capacity}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* RIGHT SIDE */}
                          <div className="centre-right">
                            <h4 className="facility-title">Facilities</h4>

                            <div className="facility-grid">
                              <div className="facility-item">
                                Security
                                <span>
                                  {centreDetail.security_arrangements || "-"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Toilets
                                <span>
                                  {centreDetail.toilets_bathrooms || "-"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Power/Water
                                <span>
                                  {centreDetail.power_water_facility || "-"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Medical Kit
                                <span>
                                  {centreDetail.medical_kit ? "✅" : "❌"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Open Space
                                <span>
                                  {centreDetail.open_space ? "✅" : "❌"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Field Visit
                                <span>
                                  {centreDetail.field_visit_facility
                                    ? "✅"
                                    : "❌"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Transport
                                <span>
                                  {centreDetail.transport_facility ? "✅" : "❌"}
                                </span>
                              </div>

                              <div className="facility-item">
                                Dining
                                <span>
                                  {centreDetail.dining_facility ? "✅" : "❌"}
                                </span>
                              </div>
                            </div>

                            <div className="centre-other">
                              <strong>Other:</strong>{" "}
                              {centreDetail.other_details || "-"}
                            </div>

                            {centreDetail.submissions?.length > 0 && (
                              <div className="media-section">
                                <h4>Media</h4>

                                <div className="media-grid">
                                  {centreDetail.submissions.map((submission) => {
                                    const src = normalizeMediaUrl(
                                      submission.file,
                                    );

                                    return (
                                      <div
                                        key={submission.id}
                                        className="media-card"
                                      >
                                        <img
                                          src={src}
                                          alt={submission.category}
                                          onClick={() =>
                                            window.open(src, "_blank")
                                          }
                                        />

                                        <div>{submission.category}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. PARTICIPANT DETAILS */}
                    <div>
                      <h3 className="participants-title">
                        👥 {isTrainerTraining ? "Batch Trainers" : "Participants"}{" "}
                        ({displayedParticipants.length})
                      </h3>

                      {hasMasterTrainers && firstMasterTrainer && (
                        <div className="master-trainer-card">
                          <div className="master-trainer-heading">
                            👨‍🏫 Master Trainer
                          </div>

                          <div className="master-trainer-info">
                            <div>
                              <strong>Name:</strong>{" "}
                              {firstMasterTrainer.full_name ||
                                firstMasterTrainer.name ||
                                "-"}
                            </div>

                            <div>
                              <strong>Mobile:</strong>{" "}
                              {firstMasterTrainer.mobile_no ||
                                firstMasterTrainer.mobile ||
                                "-"}
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          maxHeight: 400,
                          overflow: "auto",
                          borderRadius: 8, // UI CHANGE
                          border: "1px solid #a7c6ed", // UI CHANGE
                          background: "#fff",
                        }}
                      >
                        <table
                          className="table table-compact"
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: 14,
                          }}
                        >
                          <thead
                            style={{
                              background: "#e4ecf5", // UI CHANGE
                              position: "sticky", // UI CHANGE
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            <tr>
                              <th className="thStyle">S.No.</th>
                              <th className="thStyle">Name</th>
                              <th className="thStyle">Mobile</th>

                              {isTrainerTraining ? (
                                <>
                                  <th className="thStyle">Remarks</th>
                                  <th className="thStyle">Registered On</th>
                                  <th className="thStyle">Replaced</th>
                                </>
                              ) : (
                                <>
                                  <th className="thStyle">Age</th>
                                  <th className="thStyle">Gender</th>
                                  <th className="thStyle">PLD</th>
                                  <th className="thStyle">Social Category</th>
                                  <th className="thStyle">Religion</th>
                                  <th className="thStyle">Education</th>
                                  <th className="thStyle">Address</th>
                                </>
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {displayedParticipants.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={isTrainerTraining ? 6 : 10}
                                  style={{
                                    textAlign: "center",
                                    padding: 20,
                                    color: "#2b4e72", // UI CHANGE
                                    background: "#f8fbff",
                                  }}
                                >
                                  No participants assigned
                                </td>
                              </tr>
                            ) : (
                              displayedParticipants.map((p, index) => (
                                <tr
                                  key={p.id || index}
                                  style={{
                                    borderBottom: "1px solid #e4ecf5", // UI CHANGE
                                    transition: "background 0.2s",
                                  }}
                                  onMouseEnter={
                                    (e) =>
                                    (e.currentTarget.style.background =
                                      "#f4f8fd") // UI CHANGE hover
                                  }
                                  onMouseLeave={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                  }
                                >
                                  <td className="tdStyle">{index + 1}</td>

                                  <td className="table-cell table-cell-bold">
                                    {p.full_name || p.member_name || "-"}
                                  </td>

                                  <td className="tdStyle">
                                    {p.mobile_no || p.mobile || "-"}
                                  </td>

                                  {isTrainerTraining ? (
                                    <>
                                      <td className="tdStyle">
                                        {p.remarks || "-"}
                                      </td>
                                      <td className="tdStyle">
                                        {fmtDate(p.registered_on)}
                                      </td>
                                      <td
                                        className={`table-cell-bold ${p.is_replaced
                                          ? "replaced-yes"
                                          : "replaced-no"
                                          }`}
                                      >
                                        {p.is_replaced ? "Yes" : "No"}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="tdStyle">{p.age || "-"}</td>
                                      <td className="tdStyle">
                                        {p.gender || "-"}
                                      </td>
                                      <td className="tdStyle">
                                        {p.pld_status || "-"}
                                      </td>
                                      <td className="tdStyle">
                                        {p.social_category || "-"}
                                      </td>
                                      <td className="tdStyle">
                                        {p.religion || "-"}
                                      </td>
                                      <td className="tdStyle">
                                        {p.education || "-"}
                                      </td>

                                      <td className="table-cell table-cell-ellipsis">
                                        {p.address || "-"}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
          <Footer />

          {/* NEW: lightbox for media preview */}
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
                zIndex: 2000,
                cursor: "zoom-out",
              }}
            >
              <img
                src={mediaPreviewSrc}
                alt="Preview"
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: 6,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <style>{`

    .content-area {
  display: flex;
  flex: 1;
  width: 100%;
}

      /* Row hover */
.table tbody tr:hover {
  background: #e4ecf5;
  transition: background .2s ease;
}

/* Table header style */
.thStyle {
  padding: 10px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  color: #2b4e72;
  border-bottom: 2px solid #a7c6ed;
}

/* common table cell style (replacement of tdStyle) */
.table-cell {
  padding: 10px 12px;
  font-size: 13px;
  color: #2b4e72;
}

/* bold cell */
.table-cell-bold {
  font-weight: 600;
}

/* address column ellipsis */
.table-cell-ellipsis {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* when replaced */
.replaced-yes {
  color: #5a8cc2;
  font-weight: 600;
}

/* when not replaced */
.replaced-no {
  color: #3d6ba6;
  font-weight: 600;
}
/* Section title */
.participants-title {
  color: #2b4e72;
  font-weight: 700;
  margin-bottom: 14px;
}

/* Master trainer card */
.master-trainer-card {
  background: #e4ecf5;
  border: 2px solid #5a8cc2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

/* Master trainer heading */
.master-trainer-heading {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  color: #3d6ba6;
}

/* Trainer info layout */
.master-trainer-info {
  display: flex;
  gap: 20px;
  color: #2b4e72;
  font-size: 14px;
}

/* main card */
.centre-card{
  background:#fff;
  border:2px solid #a7c6ed;
  border-radius:10px;
  padding:20px;
  margin-bottom:24px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
}

/* title */
.centre-title{
  margin-bottom:18px;
  color:#2b4e72;
  font-weight:700;
}

/* grid layout */
.centre-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:24px;
}

/* venue name */
.centre-name{
  font-size:20px;
  font-weight:700;
  color:#3d6ba6;
  margin-bottom:6px;
}

/* address */
.centre-address{
  color:#5a8cc2;
  margin-bottom:14px;
}

/* meta info */
.centre-meta div{
  margin-bottom:6px;
  color:#2b4e72;
}

/* halls table */
.centre-table{
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
}

.centre-table th{
  background:#e4ecf5;
  color:#2b4e72;
  padding:8px;
  text-align:left;
}

.centre-table td{
  border-top:1px solid #a7c6ed;
  padding:8px;
}

/* facilities */
.facility-title{
  margin-bottom:10px;
  color:#3d6ba6;
}

.facility-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
}

.facility-item{
  background:#e4ecf5;
  border:1px solid #a7c6ed;
  border-radius:6px;
  padding:8px 10px;
  font-size:13px;
  display:flex;
  justify-content:space-between;
  color:#2b4e72;
}

/* other text */
.centre-other{
  margin-top:12px;
  font-size:13px;
  color:#2b4e72;
}

/* media */
.media-section{
  margin-top:16px;
}

.media-grid{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-top:8px;
}

.media-card{
  background:#e4ecf5;
  border:1px solid #a7c6ed;
  border-radius:6px;
  padding:6px;
  text-align:center;
  width:90px;
}

.media-card img{
  width:80px;
  height:80px;
  object-fit:cover;
  border-radius:4px;
  cursor:pointer;
}

.media-card div{
  font-size:11px;
  margin-top:4px;
  color:#2b4e72;
}
/* title */
.attendance-title{
  margin-bottom:16px;
  color:#2b4e72;
  font-weight:700;
}

/* table wrapper */
.attendance-table-wrapper{
  max-height:250px;
  overflow:auto;
  border:1px solid #a7c6ed;
  border-radius:8px;
}

/* table styling */
.attendance-table thead{
  background:#e4ecf5;
  color:#2b4e72;
}

.attendance-table th{
  font-weight:600;
}

/* date button */
.attendance-date-btn{
  border:1px solid #a7c6ed;
  background:#e4ecf5;
  color:#2b4e72;
  padding:4px 10px;
  border-radius:6px;
  cursor:pointer;
  font-size:12px;
}

.attendance-date-btn:hover{
  background:#a7c6ed;
}

.attendance-date-btn.active{
  background:#3d6ba6;
  color:#fff;
  border-color:#3d6ba6;
}

/* badges */
.badge{
  font-size:12px;
  padding:3px 8px;
  border-radius:999px;
  font-weight:500;
}

/* csv uploaded */
.badge-uploaded{
  background:#e4ecf5;
  color:#2b4e72;
}

/* csv not uploaded */
.badge-not-uploaded{
  background:#f3f4f6;
  color:#555;
}

/* present */
.badge-present{
  background:#e4ecf5;
  color:#2b4e72;
}

/* absent */
.badge-absent{
  background:#fde2e2;
  color:#b91c1c;
}

/* role pill */
.role-pill{
  background:#e4ecf5;
  padding:2px 8px;
  border-radius:999px;
  font-size:12px;
  color:#3d6ba6;
}

/* participant section */
.attendance-detail{
  margin-top:16px;
  padding-top:12px;
  border-top:1px solid #a7c6ed;
}

/* subtitle */
.attendance-subtitle{
  margin-bottom:8px;
  color:#3d6ba6;
}

/* participant table scroll */
.attendance-participant-table{
  max-height:300px;
  overflow:auto;
}
/* card container */
.batch-card{
  background:#fff;
  border:2px solid #a7c6ed;
  border-radius:10px;
  padding:18px;
  margin-bottom:24px;
  box-shadow:0 4px 10px rgba(0,0,0,0.05);
}

/* section title */
.batch-title{
  margin-bottom:16px;
  color:#2b4e72;
  font-weight:700;
}

/* grid */
.batch-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:14px;
}

/* info tile */
.batch-item{
  background:#e4ecf5;
  border:1px solid #a7c6ed;
  border-radius:8px;
  padding:12px 14px;
}

/* label */
.batch-label{
  font-size:12px;
  color:#5a8cc2;
  margin-bottom:4px;
}

/* value */
.batch-value{
  font-size:15px;
  font-weight:600;
  color:#2b4e72;
}

/* highlight batch code */
.batch-value.highlight{
  color:#3d6ba6;
  font-weight:700;
}

/* status style */
.batch-value.status{
  color:#3d6ba6;
  font-weight:700;
}
  /* header */
.batch-header{
  display:flex;
  align-items:center;
  margin-bottom:14px;
}

.batch-page-title{
  margin:0;
  color:#2b4e72;
}

.batch-code{
  color:#5a8cc2;
  margin-left:6px;
  font-weight:600;
}

.batch-header-actions{
  margin-left:auto;
  display:flex;
  gap:8px;
}

/* buttons */
.btn-primary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btn-primary:hover{
   transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

.btn-secondary{
  background:#5a8cc2;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
    transition:all .25s ease;
}
    .btn-secondary:hover{
   transform: translateY(-6px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.15);
}

/* closure banner */
.closure-banner{
  margin-bottom:14px;
  padding:10px 12px;
  border-radius:8px;
  font-size:14px;
}

.closure-banner.loading{
  background:#f9fafb;
  border:1px dashed #a7c6ed;
}

.closure-banner.closed{
  background:#e4ecf5;
  border:1px solid #a7c6ed;
  color:#2b4e72;
}

/* main card */
.batch-main-card{
  background:white;
  border:2px solid #a7c6ed;
  border-radius:10px;
  padding:20px;
}

/* section title */
.section-title{
  margin-bottom:16px;
  color:#2b4e72;
}

/* grid */
.training-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;
}

/* info tiles */
.info-tile{
  background:#e4ecf5;
  border:1px solid #a7c6ed;
  border-radius:8px;
  padding:10px 12px;
  display:flex;
  flex-direction:column;
}

.info-label{
  font-size:12px;
  color:#5a8cc2;
}

.info-value{
  font-size:14px;
  font-weight:600;
  color:#2b4e72;
}

.info-value.highlight{
  color:#3d6ba6;
}
.training-section{
margin-bottom:20px
}
`}</style>
    </div>
  );
}
