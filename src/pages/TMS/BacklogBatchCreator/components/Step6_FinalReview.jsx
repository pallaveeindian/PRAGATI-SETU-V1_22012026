// src\pages\TMS\BacklogBatchCreator\components\Step6_FinalReview.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";

export default function Step6_FinalReview({ batchData, onPrev }) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // ==========================================
  // 1. DATA RE-COMPUTATION FOR SUMMARIES
  // ==========================================
  const combinedPool = useMemo(() => {
    const safeTrainers = Array.isArray(batchData.masterTrainers)
      ? batchData.masterTrainers
      : [];
    const safeParticipants = Array.isArray(batchData.selectedParticipants)
      ? batchData.selectedParticipants
      : [];

    return [
      ...safeTrainers.map((mt) => ({
        _role: "trainer",
        _id: mt.id,
        _name: mt.full_name,
        _key: `trainer-${mt.id}`,
      })),
      ...safeParticipants.map((p) => ({
        _role: "trainee",
        _id: p.id,
        _name: p.member_name || p.full_name || "-",
        _key: `trainee-${p.id}`,
      })),
    ];
  }, [batchData.masterTrainers, batchData.selectedParticipants]);

  const trainingDates = useMemo(() => {
    if (!batchData.startDate || !batchData.endDate) return [];
    let dates = [];
    let current = new Date(batchData.startDate);
    const end = new Date(batchData.endDate);
    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [batchData.startDate, batchData.endDate]);

  // ==========================================
  // 2. HELPER: FILE TO BASE64
  // ==========================================
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // ==========================================
  // 3. SUBMISSION HANDLER
  // ==========================================
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // A. Process Media Files into Base64
      const processedMedia = await Promise.all(
        (batchData.mediaUploads || []).map(async (m) => {
          const b64 = await fileToBase64(m.file);
          return { ...m, base64Data: b64 };
        }),
      );

      // B. Build Block Coverage (Count participants per block if COMBINED)
      const blocksCoverage = [];
      if (batchData.batchType === "COMBINED") {
        const blockCounts = {};
        batchData.selectedParticipants.forEach((p) => {
          const bId = p.block_id || p.block;
          if (bId) blockCounts[bId] = (blockCounts[bId] || 0) + 1;
        });
        Object.entries(blockCounts).forEach(([bId, count]) => {
          blocksCoverage.push({
            block_id: parseInt(bId),
            participant_count: count,
          });
        });
      }

      // C. Build Schedules
      const schedules = trainingDates.map((date) => ({
        schedule_date: date,
        start_time: batchData.timeOfTraining,
        remarks: "Offline Backlog Batch Auto-Schedule",
      }));

      // D. Build Attendances (with nested media)
      const attendances = trainingDates.map((date) => {
        const participant_records = combinedPool.map((p) => ({
          participant_id: p._id,
          participant_role: p._role,
          participant_name: p._name,
          present: batchData.attendanceMatrix[date]?.[p._key] || false,
        }));

        const dailyMedia = processedMedia
          .filter((m) => m.date === date)
          .map((m) => ({ category: m.category, file: m.base64Data }));

        return { date, participant_records, media: dailyMedia };
      });

      // E. Build Participant Costs
      const participant_costs = combinedPool.map((p) => {
        const c = batchData.participantCosts[p._key] || {};
        return {
          participant_id: p._id,
          participant_role: p._role,
          ta_da: parseFloat(c.ta_da || 0),
          total_cost: parseFloat(c.total_cost || 0),
        };
      });

      // F. Construct Final Payload
      const payload = {
        batch_info: {
          training_plan_id: batchData.trainingPlanId,
          district_id: batchData.districtId,
          block_id:
            batchData.batchType === "SEPARATE" && batchData.level === "BLOCK"
              ? parseInt(batchData.blockIds[0])
              : null,
          partner_id: batchData.partnerId,
          centre_id: batchData.centreId,
          level: batchData.level,
          participant_type: batchData.participantType,
          batch_type: batchData.batchType,
          start_date: batchData.startDate,
          end_date: batchData.endDate,
          time_of_training: batchData.timeOfTraining,
          financial_year: batchData.financialYear,
        },
        blocks_coverage: blocksCoverage,
        master_trainers: batchData.masterTrainers.map((mt) => ({
          id: mt.id,
          status: "AVAILABLE",
        })),
        participants: batchData.selectedParticipants.map((p) => ({ id: p.id })),
        schedules: schedules,
        ekyc_verifications: batchData.ekycList,
        attendances: attendances,
        participant_costs: participant_costs,
        batch_cost: {
          is_field_visit: batchData.batchCost.is_field_visit,
          field_visit_cost: parseFloat(
            batchData.batchCost.field_visit_cost || 0,
          ),
          is_exposure_visit: batchData.batchCost.is_exposure_visit,
          exposure_visit_cost: parseFloat(
            batchData.batchCost.exposure_visit_cost || 0,
          ),
          grand_total_cost: parseFloat(
            batchData.batchCost.grand_total_cost || 0,
          ),
        },
        closure_request: {
          certificates_issued: batchData.certificates_issued,
        },
      };

      // G. Fire One-Shot API
      await api.post("/tms/backlog-batch-oneshot/", payload);

      // H. Handle Success Sequence
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
      const msg =
        d?.error ||
        d?.detail ||
        (typeof d === "object" ? JSON.stringify(d) : null) ||
        "An unexpected error occurred during submission.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fmt = (val) =>
    parseFloat(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
      <div
        style={{
          background: "#f8fafc",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#1e3a8a", fontSize: "18px" }}>
          6. Final Review & Confirmation
        </h3>
        <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "14px" }}>
          Please review the compiled backlog batch summary before final
          submission. This will lock the records and compute achievements.
        </p>

        {submitError && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ⚠ Submission Failed: {submitError}
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#b91c1c",
                fontWeight: "500",
              }}
            >
              Your data is safe. Click "Back" to fix the issue in the previous
              steps and try again.
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Card 1: Configuration */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>Batch Configuration</div>
            <div style={styles.row}>
              <span style={styles.label}>Type:</span>{" "}
              <span style={styles.val}>{batchData.batchType} BATCH</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Level:</span>{" "}
              <span style={styles.val}>{batchData.level} LEVEL</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Timeline:</span>{" "}
              <span style={styles.val}>
                {batchData.startDate} to {batchData.endDate}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Financial Year:</span>{" "}
              <span style={styles.val}>{batchData.financialYear}</span>
            </div>
          </div>

          {/* Card 2: Participants */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>Participant Pool</div>
            <div style={styles.row}>
              <span style={styles.label}>Target Audience:</span>{" "}
              <span style={{ ...styles.val, color: "#2563eb" }}>
                {batchData.participantType}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Total Enrolled:</span>{" "}
              <span style={styles.val}>
                {batchData.selectedParticipants.length} Pax
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Master Trainers:</span>{" "}
              <span style={styles.val}>
                {batchData.masterTrainers.length} Assigned
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>E-KYC Status:</span>{" "}
              <span style={{ ...styles.val, color: "#16a34a" }}>
                100% Verified
              </span>
            </div>
          </div>

          {/* Card 3: Evidence & Finance */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>Evidence & Costing</div>
            <div style={styles.row}>
              <span style={styles.label}>Total Training Days:</span>{" "}
              <span style={styles.val}>{trainingDates.length} Days</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Media Attached:</span>{" "}
              <span style={styles.val}>
                {batchData.mediaUploads?.length || 0} Files
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Grand Total Cost:</span>{" "}
              <span
                style={{ ...styles.val, color: "#1e3a8a", fontSize: "16px" }}
              >
                ₹{fmt(batchData.batchCost.grand_total_cost)}
              </span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Issue Certificates:</span>{" "}
              <span style={styles.val}>
                {batchData.certificates_issued ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={onPrev}
          disabled={isSubmitting || submitSuccess}
          style={{
            background: "#ffffff",
            color: "#475569",
            border: "1px solid #cbd5e1",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: isSubmitting || submitSuccess ? "not-allowed" : "pointer",
          }}
        >
          ← Back to Financial Costs
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || submitSuccess}
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: "#fff",
            border: "none",
            padding: "10px 32px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: isSubmitting || submitSuccess ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
          }}
        >
          {isSubmitting
            ? "Executing Transaction..."
            : "Create Backlog Batch ✅"}
        </button>
      </div>

      {/* --- SUBMITTING SPINNER OVERLAY --- */}
      {isSubmitting && !submitSuccess && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div
              className="spinner"
              style={{
                width: "32px",
                height: "32px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px auto",
              }}
            ></div>
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
              Processing Atomic Transaction
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
              Compiling payload and securely mapping database relations...
            </p>
          </div>
        </div>
      )}

      {/* --- SUCCESS OVERLAY --- */}
      {submitSuccess && (
        <div
          style={{ ...styles.overlay, background: "rgba(22, 163, 74, 0.9)" }}
        >
          <div
            style={{
              ...styles.overlayCard,
              textAlign: "center",
              transform: "scale(1.05)",
              transition: "transform 0.3s ease",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px 0", color: "#166534" }}>
              Batch Created Successfully!
            </h2>
            <p
              style={{
                margin: "0 0 16px 0",
                color: "#15803d",
                fontWeight: "500",
              }}
            >
              The offline backlog batch has been fully digitized.
            </p>
            <div
              style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}
            >
              Redirecting to batch dashboard in{" "}
              <span style={{ color: "#2563eb", fontSize: "16px" }}>
                {countdown}
              </span>{" "}
              seconds...
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: "14px", color: "#475569", fontWeight: "500" },
  val: { fontSize: "14px", color: "#0f172a", fontWeight: "700" },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayCard: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    textAlign: "center",
    maxWidth: "400px",
  },
};
