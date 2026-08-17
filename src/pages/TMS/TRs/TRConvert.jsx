// src/pages/TMS/TRs/TRCovert.jsx
import React, { useState, useEffect, useCallback } from "react";
import api, { TMS_API } from "../../../api/axios";
import {
  FaSyncAlt,
  FaExclamationTriangle,
  FaTrash,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

export default function TRConvert({ trId }) {
  const [tr, setTr] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(0);

  // Conversion States
  const [financialYear, setFinancialYear] = useState("");
  const [engagementStatus, setEngagementStatus] = useState("idle"); // 'idle', 'checking', 'has_engaged'
  const [engagedParticipants, setEngagedParticipants] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // --------------------------------------------------------
  // 1. Fetch TR & Participants
  // --------------------------------------------------------
  useEffect(() => {
    if (!trId) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch TR Details
        const trResp = await TMS_API.trainingRequests.retrieve(trId);
        const trData = trResp?.data ?? trResp ?? null;
        setTr(trData);

        if (trData) {
          // Set initial financial year if it exists
          setFinancialYear(trData.financial_year || "");
        }

        // Fetch Participants
        const pResp = await api.get(`/tms/tr/${trId}/participants/`);
        setParticipants(pResp?.data?.results || []);
      } catch (err) {
        console.error("Failed to fetch TR details for conversion:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [trId, refreshToggle]);

  // --------------------------------------------------------
  // 2. Helper: Extract Engagement IDs
  // --------------------------------------------------------
  const getEngagementId = useCallback((p, type) => {
    if (type === "BENEFICIARY") return p.lokos_member_code;
    if (type === "TRAINER") {
      if (p.master_trainer_id) return String(p.master_trainer_id);
      if (p.trainer && typeof p.trainer === "object")
        return String(p.trainer.id);
      return String(p.trainer || p.id);
    }
    if (type === "STAFF") {
      if (p.employee_id) return String(p.employee_id);
      if (p.staff && typeof p.staff === "object")
        return String(p.staff.employee_id || p.staff.id);
      return String(p.staff || p.id);
    }
    return null;
  }, []);

  // --------------------------------------------------------
  // 3. Handle Eligibility Check & Conversion
  // --------------------------------------------------------
  const handleCheckAndConvert = async () => {
    if (!financialYear) {
      alert("Please select a Financial Year.");
      return;
    }

    setIsConverting(true);
    setEngagementStatus("checking");

    try {
      // Step A: Check Engagement if there are participants
      if (participants.length > 0 && tr?.training_type) {
        const idsToCheck = participants
          .map((p) => getEngagementId(p, tr.training_type))
          .filter(Boolean);

        if (idsToCheck.length > 0) {
          const checkResp = await api.post("/tms/check-training-engagement/", {
            participant_type: tr.training_type,
            financial_year: financialYear,
            ids: idsToCheck,
          });

          const engagedIds = checkResp?.data?.engaged_ids || [];

          if (engagedIds.length > 0) {
            // Find which participants matched the engaged IDs
            const engagedList = participants.filter((p) => {
              const pId = getEngagementId(p, tr.training_type);
              return engagedIds.includes(pId);
            });

            setEngagedParticipants(engagedList);
            setEngagementStatus("has_engaged");
            setIsConverting(false);
            return; // Stop conversion process
          }
        }
      }

      // Step B: All Clear -> Patch Financial Year
      await api.patch(`/tms/training-requests/${trId}/`, {
        financial_year: financialYear,
      });

      alert(`Training Request successfully converted to ${financialYear}!`);
      setEngagementStatus("idle");
      setRefreshToggle((t) => t + 1); // Refresh data to show updated TR
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("An error occurred during conversion. Please check the console.");
      setEngagementStatus("idle");
    } finally {
      setIsConverting(false);
    }
  };

  // --------------------------------------------------------
  // 4. Handle Removal of Ineligible Participants
  // --------------------------------------------------------
  const handleRemoveIneligible = async () => {
    if (engagedParticipants.length === 0) return;

    if (
      !window.confirm(
        `Remove ${engagedParticipants.length} ineligible participant(s)?`,
      )
    )
      return;

    setIsRemoving(true);
    try {
      // Extract the primary keys of the TRParticipant rows
      const participantPks = engagedParticipants.map((p) => p.id).join(",");

      await api.post("/tms/tr-participants/bulk-remove/", {
        tr_id: trId,
        participant_ids: participantPks,
      });

      alert("Ineligible participants removed successfully.");
      setEngagementStatus("idle");
      setEngagedParticipants([]);
      setRefreshToggle((t) => t + 1); // Refresh list
    } catch (err) {
      console.error("Failed to remove ineligible participants:", err);
      const errMsg =
        err?.response?.data?.error || "Failed to remove participants.";
      alert(errMsg);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!trId) {
    return (
      <div className="nic-muted-text">No Training Request ID provided.</div>
    );
  }

  return (
    <div className="tr-convert-container">
      <div className="tr-convert-header">
        <h3
          style={{
            margin: 0,
            color: "#1e3a8a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaSyncAlt /> Convert Training Request
        </h3>
        <span className="tr-badge">TR #{trId}</span>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <FaSpinner className="nic-spin" style={{ marginRight: "8px" }} />{" "}
          Loading TR Data...
        </div>
      ) : tr ? (
        <div className="tr-convert-body">
          {/* TR Info Summary */}
          <div className="tr-info-box">
            <div>
              <strong>Current FY:</strong> {tr.financial_year || "N/A"}
            </div>
            <div>
              <strong>Type:</strong> {tr.training_type}
            </div>
            <div>
              <strong>Status:</strong> {tr.status}
            </div>
            <div>
              <strong>Total Participants:</strong> {participants.length}
            </div>
          </div>

          {/* Participants Table */}
          <h4 style={{ margin: "20px 0 10px 0", color: "#334155" }}>
            Current Participants
          </h4>
          <div
            className="table-responsive"
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <table className="nic-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>S.No</th>
                  <th>Participant Name</th>
                  <th>Identifier (Code/ID)</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#64748b",
                      }}
                    >
                      No participants attached to this TR.
                    </td>
                  </tr>
                ) : (
                  participants.map((p, idx) => {
                    const identifier =
                      getEngagementId(p, tr.training_type) || "—";
                    return (
                      <tr key={p.id}>
                        <td
                          style={{
                            textAlign: "center",
                            color: "#64748b",
                            fontWeight: "600",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td style={{ fontWeight: "600", color: "#0f172a" }}>
                          {p.member_name || p.full_name || p.name || "—"}
                        </td>
                        <td
                          style={{ fontFamily: "monospace", color: "#1e40af" }}
                        >
                          {identifier}
                        </td>
                        <td>{p.mobile || p.mobile_no || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px dashed #cbd5e1",
              margin: "24px 0",
            }}
          />

          {/* Conversion Actions */}
          <div className="conversion-actions-box">
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Target Financial Year
              </label>
              <select
                className="nic-select"
                value={financialYear}
                onChange={(e) => {
                  setFinancialYear(e.target.value);
                  setEngagementStatus("idle"); // Reset status if FY changes
                }}
                disabled={isConverting || isRemoving}
                style={{ width: "200px" }}
              >
                <option value="">-- Select FY --</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>

            <div>
              <button
                className="nic-btn-primary"
                onClick={handleCheckAndConvert}
                disabled={
                  isConverting ||
                  isRemoving ||
                  !financialYear ||
                  financialYear === tr.financial_year
                }
                style={{ padding: "10px 20px" }}
              >
                {isConverting ? (
                  <>
                    <FaSpinner
                      className="nic-spin"
                      style={{ marginRight: "6px" }}
                    />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle style={{ marginRight: "6px" }} /> Check &
                    Convert
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning Box for Ineligible Participants */}
          {engagementStatus === "has_engaged" && (
            <div className="ineligible-warning-box">
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#b91c1c",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaExclamationTriangle /> Ineligible Participants Found
              </h4>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  color: "#991b1b",
                }}
              >
                The following participants are engaged in an overlapping batch
                for the selected Financial Year. They must be removed from this
                Training Request before conversion can proceed.
              </p>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #fca5a5",
                  borderRadius: "6px",
                  maxHeight: "150px",
                  overflow: "auto",
                  marginBottom: "12px",
                }}
              >
                <table className="nic-table" style={{ margin: 0 }}>
                  <thead style={{ background: "#fee2e2" }}>
                    <tr>
                      <th style={{ color: "#991b1b" }}>Name</th>
                      <th style={{ color: "#991b1b" }}>Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagedParticipants.map((ep) => (
                      <tr key={ep.id}>
                        <td>
                          {ep.member_name || ep.full_name || ep.name || "—"}
                        </td>
                        <td style={{ fontFamily: "monospace" }}>
                          {getEngagementId(ep, tr.training_type) || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "right" }}>
                <button
                  className="nic-btn-danger"
                  onClick={handleRemoveIneligible}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <>
                      <FaSpinner
                        className="nic-spin"
                        style={{ marginRight: "6px" }}
                      />{" "}
                      Removing...
                    </>
                  ) : (
                    <>
                      <FaTrash style={{ marginRight: "6px" }} /> Remove
                      Ineligible Participants
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
          Failed to load Training Request details.
        </div>
      )}

      <style>{`
        .tr-convert-container {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .tr-convert-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tr-badge {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13px;
        }
        .tr-convert-body {
          padding: 20px;
        }
        .tr-info-box {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          background: #f1f5f9;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          color: #334155;
          font-size: 14px;
        }
        .conversion-actions-box {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          background: #f8fafc;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .ineligible-warning-box {
          margin-top: 20px;
          background: #fef2f2;
          border: 1px solid #f87171;
          padding: 16px;
          border-radius: 8px;
        }

        /* Generic NIC Styles */
        .nic-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
        .nic-table th { background: #f1f5f9; color: #475569; padding: 10px; font-weight: 600; border-bottom: 1px solid #cbd5e1; }
        .nic-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
        .nic-table tbody tr:hover { background: #f8fafc; }
        .nic-select { padding: 8px 12px; border: 1px solid #94a3b8; border-radius: 6px; font-size: 14px; outline: none; }
        .nic-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .nic-btn-primary { background: #1e3a8a; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .nic-btn-primary:hover:not(:disabled) { background: #1e40af; }
        .nic-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .nic-btn-danger { background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-weight: 600; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; }
        .nic-btn-danger:hover:not(:disabled) { background: #dc2626; }
        .nic-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
        .nic-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
