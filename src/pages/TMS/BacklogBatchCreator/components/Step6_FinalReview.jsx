// src/pages/TMS/BacklogBatchCreator/components/Step6_FinalReview.jsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const fmt = (val) =>
  parseFloat(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const num = (v) => parseFloat(v || 0);

const TABLE_COLUMNS = [
  ["S.No.", { width: "65px" }],
  ["Participant Name"],
  ["LokOS SHG Code"],
  ["LokOS Member Code"],
  ["Reason for Ineligibility"],
];

export default function Step6_FinalReview({
  batchData,
  onPrev,
  onGoToParticipants,
}) {
  const navigate = useNavigate();
  const b = batchData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [engagedModal, setEngagedModal] = useState(false);
  const [engagedParticipants, setEngagedParticipants] = useState([]);
  const [engagedError, setEngagedError] = useState("");
  const [participantSearch, setParticipantSearch] = useState("");

  const combinedPool = useMemo(() => {
    const trainers = Array.isArray(b.masterTrainers) ? b.masterTrainers : [];
    const trainees = Array.isArray(b.selectedParticipants)
      ? b.selectedParticipants
      : [];

    return [
      ...trainers.map((mt) => ({
        _role: "trainer",
        _id: mt.id,
        _name: mt.full_name,
        _key: `trainer-${mt.id}`,
      })),
      ...trainees.map((p) => ({
        _role: "trainee",
        _id: p.id,
        _name: p.member_name || p.full_name || "-",
        _key: `trainee-${p.id}`,
      })),
    ];
  }, [b.masterTrainers, b.selectedParticipants]);

  const trainingDates = useMemo(() => {
    if (!b.startDate || !b.endDate) return [];

    const dates = [];
    const current = new Date(b.startDate);
    const end = new Date(b.endDate);

    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [b.startDate, b.endDate]);

  const filteredEngagedParticipants = useMemo(() => {
    const search = participantSearch.trim().toLowerCase();
    if (!search) return engagedParticipants;

    return engagedParticipants.filter((p) =>
      [p.name, p.id, p.lokos_shg_code, p.lokos_member_code, p.reason].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(search),
      ),
    );
  }, [engagedParticipants, participantSearch]);

  const closeModal = () => {
    setEngagedModal(false);
    setParticipantSearch("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const processedMedia = await Promise.all(
        (b.mediaUploads || []).map(async (m) => ({
          ...m,
          base64Data: await fileToBase64(m.file),
        })),
      );

      const blockCounts = {};
      if (b.batchType === "COMBINED") {
        b.selectedParticipants.forEach((p) => {
          const bId = p.block_id || p.block;
          if (bId) blockCounts[bId] = (blockCounts[bId] || 0) + 1;
        });
      }
      const blocks_coverage = Object.entries(blockCounts).map(
        ([bId, count]) => ({
          block_id: parseInt(bId),
          participant_count: count,
        }),
      );

      const schedules = trainingDates.map((date) => ({
        schedule_date: date,
        start_time: b.timeOfTraining,
        remarks: "Offline Backlog Batch Auto-Schedule",
      }));

      const attendances = trainingDates.map((date) => ({
        date,
        participant_records: combinedPool.map((p) => ({
          participant_id: p._id,
          participant_role: p._role,
          participant_name: p._name,
          present: b.attendanceMatrix[date]?.[p._key] || false,
        })),
        media: processedMedia
          .filter((m) => m.date === date)
          .map((m) => ({ category: m.category, file: m.base64Data })),
      }));

      const participant_costs = combinedPool.map((p) => {
        const c = b.participantCosts[p._key] || {};
        return {
          participant_id: p._id,
          participant_role: p._role,
          ta_da: num(c.ta_da),
          total_cost: num(c.total_cost),
        };
      });

      const cost = b.batchCost;

      const payload = {
        batch_info: {
          training_plan_id: b.trainingPlanId,
          district_id: b.districtId,
          block_id:
            b.batchType === "SEPARATE" && b.level === "BLOCK"
              ? parseInt(b.blockIds[0])
              : null,
          partner_id: b.partnerId,
          centre_id: b.centreId,
          level: b.level,
          participant_type: b.participantType,
          batch_type: b.batchType,
          start_date: b.startDate,
          end_date: b.endDate,
          time_of_training: b.timeOfTraining,
          financial_year: b.financialYear,
        },
        blocks_coverage,
        master_trainers: b.masterTrainers.map((mt) => ({
          id: mt.id,
          status: "AVAILABLE",
        })),
        participants: b.selectedParticipants.map((p) => ({ id: p.id })),
        schedules,
        ekyc_verifications: b.ekycList,
        attendances,
        participant_costs,
        batch_cost: {
          is_field_visit: cost.is_field_visit,
          field_visit_cost: num(cost.field_visit_cost),
          is_exposure_visit: cost.is_exposure_visit,
          exposure_visit_cost: num(cost.exposure_visit_cost),
          grand_total_cost: num(cost.grand_total_cost),
        },
        closure_request: { certificates_issued: b.certificates_issued },
      };

      await api.post("/tms/backlog-batch-oneshot/", payload);

      setSubmitSuccess(true);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/tms/batches-list/");
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Backlog Submission Failed:", err);
      const d = err?.response?.data;

      if (
        Array.isArray(d?.engaged_participants) &&
        d.engaged_participants.length > 0
      ) {
        setEngagedParticipants(d.engaged_participants);
        setEngagedError(
          d?.error ||
            "One or more participants are already engaged, have successfully completed this training, or are missing prerequisite step completion.",
        );
        setParticipantSearch("");
        setEngagedModal(true);
        return;
      }

      setSubmitError(
        d?.error ||
          d?.detail ||
          (typeof d === "object" ? JSON.stringify(d) : null) ||
          "An unexpected error occurred during submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const busy = isSubmitting || submitSuccess;

  const summaryCards = [
    {
      title: "Batch Configuration",
      rows: [
        ["Type:", `${b.batchType} BATCH`],
        ["Level:", `${b.level} LEVEL`],
        ["Timeline:", `${b.startDate} to ${b.endDate}`],
        ["Financial Year:", b.financialYear],
      ],
    },
    {
      title: "Participant Pool",
      rows: [
        ["Target Audience:", b.participantType, { color: "#2563eb" }],
        ["Total Enrolled:", `${b.selectedParticipants.length} Pax`],
        ["Master Trainers:", `${b.masterTrainers.length} Assigned`],
        ["E-KYC Status:", "100% Verified", { color: "#16a34a" }],
      ],
    },
    {
      title: "Evidence & Costing",
      rows: [
        ["Total Training Days:", `${trainingDates.length} Days`],
        ["Media Attached:", `${b.mediaUploads?.length || 0} Files`],
        [
          "Grand Total Cost:",
          `₹${fmt(b.batchCost.grand_total_cost)}`,
          { color: "#1e3a8a", fontSize: "16px" },
        ],
        ["Issue Certificates:", b.certificates_issued ? "Yes" : "No"],
      ],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
        position: "relative",
      }}
    >
      {/* FINAL REVIEW */}
      <div style={styles.reviewContainer}>
        <h3 style={styles.heading}>6. Final Review & Confirmation</h3>

        <p style={styles.description}>
          Please review the compiled backlog batch summary before final
          submission. This will lock the records and compute achievements.
        </p>

        {submitError && (
          <div style={styles.errorBox}>
            ⚠ Submission Failed: {submitError}
            <div style={styles.errorSubtext}>
              Your data is safe. Click "Back" to fix the issue in the previous
              steps and try again.
            </div>
          </div>
        )}

        <div style={styles.summaryGrid}>
          {summaryCards.map(({ title, rows }) => (
            <div key={title} style={styles.card}>
              <div style={styles.cardHeader}>{title}</div>
              {rows.map(([label, value, extra]) => (
                <div key={label} style={styles.row}>
                  <span style={styles.label}>{label}</span>
                  <span style={{ ...styles.val, ...extra }}>{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div style={styles.footer}>
        <button
          onClick={onPrev}
          disabled={busy}
          style={{
            ...styles.backButton,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          ← Back to Financial Costs
        </button>

        <button
          onClick={handleSubmit}
          disabled={busy}
          style={{
            ...styles.submitButton,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {isSubmitting
            ? "Executing Transaction..."
            : "Create Backlog Batch ✅"}
        </button>
      </div>

      {/* SUBMITTING OVERLAY */}
      {isSubmitting && !submitSuccess && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div className="spinner" style={styles.spinner} />
            <h3 style={styles.spinnerHeading}>Processing Atomic Transaction</h3>
            <p style={styles.spinnerDescription}>
              Compiling payload and securely mapping database relations...
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {submitSuccess && (
        <div
          style={{ ...styles.overlay, background: "rgba(22, 163, 74, 0.9)" }}
        >
          <div style={styles.successCard}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
            <h2 style={styles.successHeading}>Batch Created Successfully!</h2>
            <p style={styles.successDescription}>
              The offline backlog batch has been fully digitized.
            </p>
            <div style={styles.countdownText}>
              Redirecting to batch dashboard in{" "}
              <span style={styles.countdownNumber}>{countdown}</span> seconds...
            </div>
          </div>
        </div>
      )}

      {/* INELIGIBLE PARTICIPANTS MODAL */}
      {engagedModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleWrapper}>
                <div style={styles.warningIcon}>⚠️</div>
                <div>
                  <h2 style={styles.modalTitle}>
                    Participant Eligibility Validation
                  </h2>
                  <p style={styles.modalSubtitle}>
                    Backlog batch creation could not be completed.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEngagedModal(false)}
                style={styles.closeIconButton}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.validationError}>
                <strong>Batch Creation Blocked</strong>
                <p>{engagedError}</p>
              </div>

              <div style={styles.statsRow}>
                {[
                  ["Total Ineligible Participants", engagedParticipants.length],
                  ["Showing Records", filteredEngagedParticipants.length],
                ].map(([label, value]) => (
                  <div key={label} style={styles.statsCard}>
                    <span style={styles.statsLabel}>{label}</span>
                    <strong style={styles.statsNumber}>{value}</strong>
                  </div>
                ))}
              </div>

              <div style={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search participant name, SHG code, member code or reason..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  style={styles.searchInput}
                />
                {participantSearch && (
                  <button
                    type="button"
                    onClick={() => setParticipantSearch("")}
                    style={styles.clearSearchButton}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.participantTable}>
                  <thead>
                    <tr>
                      {TABLE_COLUMNS.map(([title, extra]) => (
                        <th key={title} style={{ ...styles.th, ...extra }}>
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEngagedParticipants.length > 0 ? (
                      filteredEngagedParticipants.map((p, i) => (
                        <tr key={p.id ?? i} style={styles.tableRow}>
                          <td style={styles.td}>{i + 1}</td>
                          <td style={styles.nameCell}>{p.name || "-"}</td>
                          <td style={styles.td}>{p.lokos_shg_code || "-"}</td>
                          <td style={styles.td}>
                            {p.lokos_member_code || "-"}
                          </td>
                          <td style={styles.reasonCell}>
                            <span style={styles.reasonBadge}>
                              {p.reason || "Not eligible for this training."}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={styles.emptyTable}>
                          No matching participants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={styles.tableFooter}>
                Showing {filteredEngagedParticipants.length} of{" "}
                {engagedParticipants.length} ineligible participants
              </div>

              <div style={styles.informationBox}>
                <span style={{ fontSize: "18px" }}>ℹ️</span>
                <p>
                  Please go back to the participant selection step and remove or
                  replace the ineligible participants. Your previously entered
                  batch information will remain saved.
                </p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={closeModal}
                style={styles.modalCloseButton}
              >
                Close Details
              </button>

              <button
                type="button"
                onClick={() => {
                  closeModal();
                  setSubmitError(null);
                  (onGoToParticipants || onPrev)();
                }}
                style={styles.modalBackButton}
              >
                ← Go Back and Correct Participants
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const flexBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const overlayBase = {
  ...flexCenter,
  inset: 0,
  backdropFilter: "blur(4px)",
  padding: "16px",
};

const floatingCard = {
  background: "#ffffff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  textAlign: "center",
  maxWidth: "400px",
};

const orangeBox = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
};

const outlineBtn = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#475569",
  borderRadius: "8px",
  fontWeight: "600",
};

const cellBase = { padding: "13px 12px", verticalAlign: "top" };

const styles = {
  reviewContainer: {
    background: "#f8fafc",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  heading: { margin: "0 0 8px 0", color: "#1e3a8a", fontSize: "18px" },
  description: { margin: "0 0 24px 0", color: "#64748b", fontSize: "14px" },
  errorBox: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
    fontWeight: "600",
    fontSize: "14px",
  },
  errorSubtext: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#b91c1c",
    fontWeight: "500",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardHeader: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "8px",
    marginBottom: "4px",
  },
  row: { ...flexBetween, gap: "10px" },
  label: { fontSize: "14px", color: "#475569", fontWeight: "500" },
  val: {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "700",
    textAlign: "right",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    padding: "16px 0",
    borderTop: "1px solid #e2e8f0",
  },
  backButton: { ...outlineBtn, padding: "10px 24px" },
  submitButton: {
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff",
    border: "none",
    padding: "10px 32px",
    borderRadius: "8px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
  },

  // Overlays
  overlay: {
    ...overlayBase,
    position: "absolute",
    background: "rgba(15, 23, 42, 0.6)",
    zIndex: 1000,
  },
  overlayCard: { ...floatingCard },
  spinner: {
    width: "32px",
    height: "32px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px auto",
  },
  spinnerHeading: { margin: "0 0 8px 0", color: "#0f172a" },
  spinnerDescription: { margin: 0, color: "#64748b", fontSize: "13px" },
  successCard: {
    ...floatingCard,
    transform: "scale(1.05)",
    transition: "transform 0.3s ease",
  },
  successHeading: { margin: "0 0 8px 0", color: "#166534" },
  successDescription: {
    margin: "0 0 16px 0",
    color: "#15803d",
    fontWeight: "500",
  },
  countdownText: { fontSize: "14px", color: "#475569", fontWeight: "600" },
  countdownNumber: { color: "#2563eb", fontSize: "16px" },

  // Modal
  modalOverlay: {
    ...overlayBase,
    position: "fixed",
    background: "rgba(15, 23, 42, 0.78)",
    backdropFilter: "blur(5px)",
    zIndex: 3000,
  },
  modalContainer: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "1150px",
    maxHeight: "92vh",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    ...flexBetween,
    background: "#fff7ed",
    borderBottom: "1px solid #fed7aa",
    padding: "18px 24px",
  },
  modalTitleWrapper: { display: "flex", alignItems: "center", gap: "12px" },
  warningIcon: { fontSize: "30px" },
  modalTitle: {
    margin: 0,
    color: "#9a3412",
    fontSize: "19px",
    fontWeight: "800",
  },
  modalSubtitle: { margin: "5px 0 0", color: "#9a3412", fontSize: "13px" },
  closeIconButton: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    color: "#9a3412",
    cursor: "pointer",
    padding: "5px 8px",
  },
  modalBody: {
    padding: "22px 24px",
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
  },
  validationError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "9px",
    padding: "15px 18px",
    marginBottom: "18px",
    color: "#991b1b",
    fontSize: "13px",
  },
  statsRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  statsCard: {
    ...orangeBox,
    borderRadius: "9px",
    padding: "12px 20px",
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  statsLabel: { fontSize: "12px", color: "#9a3412", fontWeight: "600" },
  statsNumber: { fontSize: "25px", color: "#c2410c", fontWeight: "800" },
  searchWrapper: { display: "flex", gap: "8px", marginBottom: "14px" },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: "11px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  clearSearchButton: {
    ...outlineBtn,
    padding: "0 15px",
    cursor: "pointer",
  },

  // Table
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "400px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
  },
  participantTable: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
    fontSize: "13px",
    textAlign: "left",
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: "#1e3a8a",
    color: "#ffffff",
    padding: "14px 12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #1e40af",
  },
  tableRow: { borderBottom: "1px solid #e2e8f0", background: "#ffffff" },
  td: { ...cellBase, color: "#475569", whiteSpace: "nowrap" },
  nameCell: {
    ...cellBase,
    color: "#0f172a",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  reasonCell: {
    ...cellBase,
    padding: "11px 12px",
    minWidth: "280px",
    whiteSpace: "normal",
  },
  reasonBadge: {
    display: "inline-block",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "6px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "1.5",
    fontWeight: "600",
  },
  emptyTable: {
    padding: "35px 15px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
  },
  tableFooter: {
    padding: "10px 2px",
    color: "#64748b",
    fontSize: "12px",
    textAlign: "right",
  },
  informationBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "12px 15px",
    marginTop: "12px",
  },
  modalFooter: {
    ...flexBetween,
    padding: "15px 24px",
    borderTop: "1px solid #e2e8f0",
    flexWrap: "wrap",
    background: "#f8fafc",
  },
  modalCloseButton: { ...outlineBtn, padding: "11px 20px", cursor: "pointer" },
  modalBackButton: {
    background: "#1d4ed8",
    border: "none",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
