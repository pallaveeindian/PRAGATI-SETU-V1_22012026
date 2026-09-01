import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const BatchDateConfig = ({
  trainingDays,
  startDate,
  endDate,
  onDateChange,
}) => {
  // =====================================================================
  // SURGICAL ADDITION: STRICT SYSTEM TIME VERIFICATION (ANTI-TAMPERING)
  // =====================================================================
  const [isTimeTampered, setIsTimeTampered] = useState(false);
  const [actualDateStr, setActualDateStr] = useState("");

  useEffect(() => {
    const verifySystemTime = async () => {
      try {
        // Fetch trusted IST time from internal backend to bypass CORS
        const response = await api.get("/tms/server-time/");
        const data = response.data;

        // Extract strict YYYY-MM-DD from the trusted server
        const serverDateStr = data.date_time.substring(0, 10);

        // Get local PC date strictly formatted to YYYY-MM-DD in IST
        const localDate = new Date();
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const parts = formatter.formatToParts(localDate);
        const localYear = parts.find((p) => p.type === "year").value;
        const localMonth = parts.find((p) => p.type === "month").value;
        const localDay = parts.find((p) => p.type === "day").value;
        const localFormattedStr = `${localYear}-${localMonth}-${localDay}`;

        if (serverDateStr !== localFormattedStr) {
          setIsTimeTampered(true);
          setActualDateStr(serverDateStr);
        } else {
          setIsTimeTampered(false);
        }
      } catch (error) {
        console.warn(
          "Time verification API blocked or failed. Proceeding cautiously.",
        );
      }
    };

    // Check immediately on mount, then continuously poll every 5 seconds
    verifySystemTime();
    const interval = setInterval(verifySystemTime, 5000);
    return () => clearInterval(interval);
  }, []);
  // =====================================================================

  // 1. Min/Max Date Constraints
  const getMinStartDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Earliest start is tomorrow
    return minDate.toISOString().split("T")[0];
  };

  const getMaxStartDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60); // Allow scheduling up to 60 days in advance
    return maxDate.toISOString().split("T")[0];
  };

  // 2. Auto-Calculate End Date
  const calculateEndDate = (startStr, days) => {
    if (!startStr || !days) return "";
    const start = new Date(startStr);
    // End date = Start date + (Total Days - 1)
    start.setDate(start.getDate() + Number(days) - 1);
    return start.toISOString().split("T")[0];
  };

  // 3. Keep End Date synced if plan days change (Edge Case Safety)
  useEffect(() => {
    if (startDate && trainingDays) {
      const newEndDate = calculateEndDate(startDate, trainingDays);
      if (newEndDate !== endDate) {
        onDateChange(startDate, newEndDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingDays, startDate]);

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    const newEnd = calculateEndDate(newStart, trainingDays);
    onDateChange(newStart, newEnd);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        position: "relative", // Ensures the overlay bounds correctly if needed
      }}
    >
      {/* ============================================== */}
      {/* SURGICAL ADDITION: TIME TAMPERING BLOCKER MODAL */}
      {/* ============================================== */}
      {isTimeTampered && (
        <div className="time-lock-overlay">
          <div className="time-lock-modal">
            <div className="pulse-icon">⚠️</div>
            <h2 style={{ color: "#dc2626", marginTop: 0, fontSize: "22px" }}>
              System Clock Mismatch Detected!
            </h2>
            <p
              style={{ color: "#334155", fontSize: "15px", lineHeight: "1.5" }}
            >
              Security protocols require your system clock to match the current{" "}
              <strong>Uttar Pradesh (IST)</strong> date to configure batch
              timelines.
            </p>
            <div className="date-compare">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Actual Live Date:</strong>
                <span style={{ color: "#16a34a", fontWeight: "700" }}>
                  {actualDateStr}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Your PC Date:</strong>
                <span style={{ color: "#dc2626", fontWeight: "700" }}>
                  {new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>
            </div>
            <p
              style={{ fontSize: "13px", color: "#64748b", marginTop: "20px" }}
            >
              Please update your PC's Date and Time settings to sync with the
              automatic internet time.
              <br />
              <br />
              <strong>
                This screen will disappear automatically once fixed.
              </strong>
            </p>
          </div>
          <style>{`
            .time-lock-overlay {
              position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
              display: flex; align-items: center; justify-content: center; z-index: 999999;
            }
            .time-lock-modal {
              background: white; border-top: 6px solid #dc2626; border-radius: 12px;
              padding: 30px; max-width: 500px; text-align: left; 
              box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
              animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .pulse-icon { 
              font-size: 48px; margin-bottom: 16px; text-align: center; 
              animation: pulseRed 1.5s infinite; 
            }
            .date-compare { 
              background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 20px; 
              font-size: 15px; display: flex; flex-direction: column; gap: 10px; 
              border: 1px dashed #cbd5e1; 
            }
            @keyframes popIn { 
              from { opacity: 0; transform: scale(0.8); } 
              to { opacity: 1; transform: scale(1); } 
            }
            @keyframes pulseRed { 
              0% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(220, 38, 38, 0)); } 
              50% { transform: scale(1.15); opacity: 0.8; filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6)); } 
              100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(220, 38, 38, 0)); } 
            }
          `}</style>
        </div>
      )}
      {/* ============================================== */}

      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
          Batch Timeline Configuration
        </h4>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
          Training Duration:{" "}
          <strong style={{ color: "#2563eb" }}>{trainingDays} Days</strong>
        </span>
      </div>

      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Start Date Selection */}
        <div style={{ flex: "1 1 250px" }}>
          <label style={styles.label}>
            Batch Start Date <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="date"
            value={startDate}
            min={getMinStartDate()}
            max={getMaxStartDate()}
            onChange={handleStartChange}
            style={styles.input}
          />
          <div style={styles.helpText}>
            Select the date the training will commence.
          </div>
        </div>

        {/* End Date (Auto-Calculated & Locked) */}
        <div style={{ flex: "1 1 250px" }}>
          <label style={styles.label}>
            Batch End Date (Auto-calculated) 🔒
          </label>
          <input
            type="date"
            value={endDate}
            disabled
            style={{
              ...styles.input,
              backgroundColor: "#f1f5f9",
              color: "#475569",
              cursor: "not-allowed",
            }}
          />
          <div style={styles.helpText}>
            Calculated automatically based on the {trainingDays}-day training
            plan.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  helpText: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "6px",
  },
};

export default BatchDateConfig;
