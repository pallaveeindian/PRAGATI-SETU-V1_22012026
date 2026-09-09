// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step1_EkycManager/Schedule
import React, { useState, useMemo, useEffect } from "react";
import api from "../../../../../../../api/axios";

// Helper to get today's date in YYYY-MM-DD local format
function todayLocalISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Helper to format 24h DB time to 12h UI time
const formatTo12Hour = (time) => {
  if (!time) return "—";
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  let hh12 = hours % 12;
  if (hh12 === 0) hh12 = 12;
  return `${hh12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

export default function ScheduleSetup({
  batchId,
  schedule,
  hasSchedule,
  refreshData,
}) {
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [startAmPm, setStartAmPm] = useState("AM");
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const today = useMemo(() => todayLocalISO(), []);

  const handleSaveSchedule = async () => {
    if (!batchId) return;
    if (hasSchedule) {
      alert("Schedule already saved once for this batch.");
      return;
    }

    const h = parseInt(startHour || "0", 10);
    const m = parseInt(startMinute || "0", 10);

    if (!h || h < 1 || h > 12) {
      alert("Please enter a valid hour (1–12).");
      return;
    }
    if (m < 0 || m > 59) {
      alert("Please enter valid minutes (0–59).");
      return;
    }

    // Convert to 24-hour format
    let hh24 = h % 12;
    if (startAmPm === "PM") {
      hh24 += 12;
    }

    const hhStr = hh24.toString().padStart(2, "0");
    const mmStr = m.toString().padStart(2, "0");
    const timeStr = `${hhStr}:${mmStr}:00`;

    setIsSaving(true);
    try {
      const payload = {
        batch: batchId,
        schedule_date: today,
        start_time: timeStr,
        remarks: remarks || "",
      };

      await api.post("/tms/batch-schedules/", payload);

      // Refresh the parent's data to lock this section
      await refreshData();
    } catch (e) {
      console.error("Save schedule failed", e);
      alert("Failed to save start time. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (hasSchedule && schedule) {
      console.log("Schedule already exists:", schedule);
    }
  }, [hasSchedule, schedule]);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: "#eff6ff", // Light NIC blue tint
        border: "1px solid #bfdbfe",
        marginBottom: 20,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <h4 style={{ marginTop: 0, color: "#1e3a8a", marginBottom: 4 }}>
        Day 1 Setup
      </h4>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>
        Today: <strong>{today}</strong>. Set the batch start time once. This
        baseline time will be reused to unlock attendance on all subsequent
        training days.
      </div>

      {hasSchedule && schedule ? (
        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Start Date
              </div>
              <div style={{ fontWeight: 500, color: "#0f172a" }}>
                {schedule.schedule_date}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Daily Start Time
              </div>
              <div style={{ fontWeight: 500, color: "#0f172a" }}>
                {formatTo12Hour(schedule.start_time)}
              </div>
            </div>
            {schedule.remarks && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Remarks
                </div>
                <div style={{ fontSize: 13, color: "#334155" }}>
                  {schedule.remarks}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 6,
            border: "1px solid #e2e8f0",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: "#0f172a",
              display: "block",
              marginBottom: 8,
            }}
          >
            Batch Start Time <span style={{ color: "#ef4444" }}>*</span>
          </label>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Time Inputs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                background: "#f8fafc",
                padding: "4px 8px",
              }}
            >
              <input
                type="number"
                min={1}
                max={12}
                placeholder="HH"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value.slice(0, 2))}
                style={{
                  width: 50,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              />
              <span style={{ fontWeight: 600, color: "#94a3b8" }}>:</span>
              <input
                type="number"
                min={0}
                max={59}
                placeholder="MM"
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value.slice(0, 2))}
                style={{
                  width: 50,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              />
              <div
                style={{
                  height: 24,
                  width: 1,
                  background: "#cbd5e1",
                  margin: "0 4px",
                }}
              />
              <select
                value={startAmPm}
                onChange={(e) => setStartAmPm(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            {/* Remarks Input */}
            <div style={{ flex: 1, minWidth: 250 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Optional remarks regarding timing..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{ fontSize: 14 }}
              />
            </div>

            {/* Save Button */}
            <button
              className="btn btn-primary"
              onClick={handleSaveSchedule}
              disabled={isSaving || !startHour || !startMinute}
              style={{
                background: "#002174",
                borderColor: "#002174",
                minWidth: 140,
              }}
            >
              {isSaving ? "Saving..." : "Save Start Time"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
