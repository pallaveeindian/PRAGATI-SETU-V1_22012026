// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step1_EkycManager/EkycStepMain.jsx
import React, { useState } from "react";
import api from "../../../../../../../api/axios";

// Step 1 Sub-components
import ScheduleSetup from "./ScheduleSetup";
import BulkVerifyModal from "./BulkVerifyModal";
import BeneficiaryEkycTable from "./EkycTables/BeneficiaryEkycTable";
import MasterTrainerEkycTable from "./EkycTables/MasterTrainerEkycTable";
import StaffEkycTable from "./EkycTables/StaffEkycTable";

export default function EkycStepMain({
  batchId,
  batchData,
  schedule,
  ekycRows,
  allEkycVerified,
  refreshData,
}) {
  const hasSchedule = !!schedule;

  // Device Connection State
  const [testingConn, setTestingConn] = useState(false);
  const [connStatus, setConnStatus] = useState("idle"); // idle | testing | ok | failed
  const [connMessage, setConnMessage] = useState("");

  // Individual Row Verification State
  const [recordingFor, setRecordingFor] = useState(null);
  const [verifyingFor, setVerifyingFor] = useState(null);

  // Bulk Verification State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Derive pending rows for the bulk verify tool
  const pendingRows = ekycRows.filter(
    (r) => (r.ekyc_status || "PENDING").toUpperCase() !== "VERIFIED",
  );

  // Partition the rows into our 3 specific domains for rendering
  const mtRows = ekycRows.filter(
    (r) => r.participant_role === "trainer" || r.original?.trainer,
  );
  const staffRows = ekycRows.filter((r) => r.original?.staff);
  const benRows = ekycRows.filter(
    (r) =>
      !r.original?.master_trainer && !r.original?.trainer && !r.original?.staff,
  );

  /* ------------------- ACTIONS ------------------- */

  const handleTestConnection = () => {
    setConnStatus("testing");
    setConnMessage("Testing connection...");
    setTestingConn(true);
    setTimeout(() => {
      setConnStatus("ok");
      setConnMessage("Device connected successfully. You can start EKYC.");
      setTestingConn(false);
    }, 1200);
  };

  const handleRecord = (row) => {
    setRecordingFor(row.key);
    setTimeout(() => setRecordingFor(null), 800); // Simulate brief recording delay
  };

  const handleVerifySingle = async (row) => {
    setVerifyingFor(row.key);
    try {
      const payload = {
        ekyc_status: "VERIFIED",
        verified_on: new Date().toISOString(),
      };

      if (row.id) {
        await api.patch(`/tms/batch-ekyc/${row.id}/`, payload);
      } else {
        await api.post("/tms/batch-ekyc/", {
          batch: batchId,
          participant_id: row.participant_id,
          participant_role: row.participant_role,
          ...payload,
        });
      }

      // Refresh the global data to show updated status
      await refreshData();
    } catch (e) {
      console.error("EKYC verify failed", e);
      alert("Could not mark as verified. Please try again.");
    } finally {
      setVerifyingFor(null);
      setRecordingFor(null);
    }
  };

  /* ------------------- RENDER ------------------- */

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* 1. Schedule Setup Block */}
      <ScheduleSetup
        batchId={batchId}
        hasSchedule={hasSchedule}
        refreshData={refreshData}
        schedule={schedule}
      />

      {/* 2. EKYC Instructions & Device Tester */}
      <div
        style={{
          padding: 18,
          borderRadius: 8,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div>
            <h4 style={{ marginTop: 0, color: "#0f172a", marginBottom: 4 }}>
              Day 1 E-KYC Verification
            </h4>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              Connect fingerprint scanner to verify participants against Aadhar,
              or use Bulk Verify to override.
            </p>
          </div>

          {/* BULK VERIFY ACTION */}
          {!allEkycVerified && pendingRows.length > 0 && hasSchedule && (
            <button
              className="btn btn-outline-primary"
              style={{
                background: "#fff",
                borderColor: "#002174",
                color: "#002174",
                fontWeight: 600,
              }}
              onClick={() => setIsBulkModalOpen(true)}
            >
              Bulk Verify All ({pendingRows.length})
            </button>
          )}
        </div>

        {/* Device Connector Banner */}
        <div
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#e5f3ff",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleTestConnection}
            disabled={testingConn}
            style={{ background: "#002ca3" }}
          >
            {testingConn ? "Testing..." : "Test Scanner Connection"}
          </button>

          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color:
                connStatus === "ok"
                  ? "#15803d"
                  : connStatus === "failed"
                    ? "#b91c1c"
                    : "#475569",
            }}
          >
            {connStatus === "testing" && "Testing connection... ⏳"}
            {connStatus === "ok" && "✅ " + connMessage}
            {connStatus === "idle" && "Scanner not connected."}
          </span>
        </div>

        {/* 3. The Separated Tables */}
        {ekycRows.length === 0 ? (
          <div
            className="text-center p-4 text-muted"
            style={{ background: "#fff", borderRadius: 8 }}
          >
            No participants found assigned to this batch.
          </div>
        ) : (
          <>
            <MasterTrainerEkycTable
              rows={mtRows}
              recordingFor={recordingFor}
              verifyingFor={verifyingFor}
              hasSchedule={hasSchedule}
              onRecord={handleRecord}
              onVerify={handleVerifySingle}
            />

            <StaffEkycTable
              rows={staffRows}
              recordingFor={recordingFor}
              verifyingFor={verifyingFor}
              hasSchedule={hasSchedule}
              onRecord={handleRecord}
              onVerify={handleVerifySingle}
            />

            <BeneficiaryEkycTable
              rows={benRows}
              recordingFor={recordingFor}
              verifyingFor={verifyingFor}
              hasSchedule={hasSchedule}
              onRecord={handleRecord}
              onVerify={handleVerifySingle}
            />
          </>
        )}
      </div>

      {/* 4. Bulk Verification Modal */}
      <BulkVerifyModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        pendingRows={pendingRows}
        batchId={batchId}
        onSuccess={() => refreshData()}
      />
    </div>
  );
}
