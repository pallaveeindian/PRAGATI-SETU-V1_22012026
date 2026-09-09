// src/pages/TMS/TRs/BatchRescheduleModal.jsx
import React, { useEffect, useState } from "react";
import api, { TMS_API } from "../../../api/axios";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BatchRescheduleModal({
  isOpen,
  onClose,
  batchId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [batchData, setBatchData] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorData, setErrorData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen && batchId) {
      fetchBatchDetails();
    } else {
      // Reset state on close
      setStartDate("");
      setEndDate("");
      setErrorData(null);
      setErrorMsg("");
      setBatchData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, batchId]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    setErrorMsg("");
    setErrorData(null);
    try {
      const resp = await TMS_API.batchDetailV2(batchId);
      setBatchData(resp?.data || null);
    } catch (err) {
      setErrorMsg("Failed to load batch details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);

    if (newStart && batchData?.training_plan?.no_of_days) {
      const days = parseInt(batchData.training_plan.no_of_days, 10);

      // Calculate end date based on local time to avoid timezone shifts
      const d = new Date(newStart);
      d.setDate(d.getDate() + (days - 1)); // -1 because start day counts as day 1

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      setEndDate(`${y}-${m}-${day}`);
    } else {
      setEndDate("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg("Start date is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // Using the endpoint provided: /tms/batch/<int:batch_id>/reschedule/
      await api.post(`/tms/batch/${batchId}/reschedule/`, {
        start_date: startDate,
        end_date: endDate,
      });

      alert("Batch rescheduled successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const data = err?.response?.data;
      setErrorData(data);
      let msg = "";

      if (data?.conflicts?.length) {
        msg = `${data.detail}\n\n`;

        if (data.suggested_start_date) {
          msg += `📅 Suggested Start Date: ${formatDate(
            data.suggested_start_date,
          )}\n\n`;
        }

        msg += "Conflicting Master Trainer(s):\n\n";

        data.conflicts.forEach((trainer, index) => {
          msg += `${index + 1}. ${trainer.trainer_name}\n`;
          msg += `   • Batch: ${trainer.batch_code}\n`;
          msg += `   • Busy: ${formatDate(trainer.batch_start_date)} - ${formatDate(
            trainer.batch_end_date,
          )}\n`;
          msg += `   • Available From: ${formatDate(
            trainer.available_from,
          )}\n\n`;
        });
      } else {
        msg =
          data?.detail ||
          data?.error ||
          data?.message ||
          (typeof data === "string" ? data : JSON.stringify(data)) ||
          "Failed to reschedule batch.";
      }

      setErrorMsg(data?.detail || "Failed to reschedule batch.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 450,
          borderRadius: 12,
          padding: 24,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            color: "#1e293b",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "10px",
          }}
        >
          Reschedule Batch #{batchData?.code || batchId}
        </h3>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "30px", color: "#64748b" }}
          >
            Loading batch parameters...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fdba74",
                  borderLeft: "5px solid #ea580c",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>⚠️</span>

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#9a3412",
                        fontSize: 15,
                      }}
                    >
                      {errorMsg}
                    </div>

                    {errorData?.suggested_start_date && (
                      <div
                        style={{
                          marginTop: 4,
                          color: "#0369a1",
                          fontWeight: 600,
                        }}
                      >
                        📅 Suggested Start Date :{" "}
                        {formatDate(errorData.suggested_start_date)}
                      </div>
                    )}
                  </div>
                </div>

                {errorData?.conflicts?.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                    }}
                  >
                    {errorData.conflicts.map((trainer, index) => (
                      <div
                        key={index}
                        style={{
                          background: "#fff",
                          border: "1px solid #fed7aa",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#1e293b",
                            marginBottom: 8,
                            fontSize: 15,
                          }}
                        >
                          👤 {trainer.trainer_name}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "120px 1fr",
                            rowGap: 6,
                            fontSize: 13,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>Batch</span>

                          <span
                            style={{
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {trainer.batch_code}
                          </span>

                          <span style={{ color: "#64748b" }}>Busy</span>

                          <span>
                            {formatDate(trainer.batch_start_date)}
                            {" - "}
                            {formatDate(trainer.batch_end_date)}
                          </span>

                          <span style={{ color: "#64748b" }}>Available</span>

                          <span
                            style={{
                              color: "#15803d",
                              fontWeight: 700,
                            }}
                          >
                            {formatDate(trainer.available_from)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "14px",
                }}
              >
                Training Plan Duration
              </label>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "#334155",
                  border: "1px solid #e2e8f0",
                }}
              >
                {batchData?.training_plan?.no_of_days} Day(s)
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "14px",
                }}
              >
                Select New Start Date{" "}
                <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={handleStartDateChange}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "14px",
                }}
              >
                Calculated End Date
              </label>
              <input
                type="date"
                disabled
                value={endDate}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "#f1f5f9",
                  color: "#64748b",
                  outline: "none",
                  fontSize: "15px",
                  cursor: "not-allowed",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                Auto-calculated based on plan duration.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !startDate}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#3d6ba6",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: submitting || !startDate ? "not-allowed" : "pointer",
                  opacity: submitting || !startDate ? 0.7 : 1,
                }}
              >
                {submitting ? "Rescheduling..." : "Reschedule Batch"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
