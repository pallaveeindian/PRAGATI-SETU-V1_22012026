// src/pages/TMS/DMMU/dmmu_batch_review.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";

/* ---------------- simple modal ---------------- */
function Modal({ open, title, onClose, children, width = 600 }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `min(${width}px, 96%)`,
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
            {title}
          </h3>
          <button
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#94a3b8",
            }}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function fmtDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ---------------- main component ---------------- */
export default function DmmuBatchReview() {
  const { id: batchId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);

  // Batch State
  const [batch, setBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  // Master Trainer State
  const [mtList, setMtList] = useState([]);
  const [mtTotal, setMtTotal] = useState(0);
  const [mtPage, setMtPage] = useState(1);
  const [mtPageSize] = useState(10);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtSearch, setMtSearch] = useState("");
  const [mtSelections, setMtSelections] = useState([]); // Array of selected MT objects
  const [mtCheckingId, setMtCheckingId] = useState(null);

  // Actions State
  const [isSaving, setIsSaving] = useState(false);
  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [revertReason, setRevertReason] = useState("");

  /* ---------------- fetch batch detail ---------------- */
  useEffect(() => {
    if (!batchId) return;
    const loadBatch = async () => {
      setLoadingBatch(true);
      try {
        const response = await TMS_API.batchDetailV2(batchId);
        setBatch(response?.data || null);
      } catch (err) {
        console.error("Failed to load batch:", err);
        alert("Failed to load batch details.");
      } finally {
        setLoadingBatch(false);
      }
    };
    loadBatch();
  }, [batchId]);

  /* ---------------- fetch master trainers (Backend Search) ---------------- */
  useEffect(() => {
    const fetchMTs = async () => {
      setMtLoading(true);
      try {
        // SURGICAL FIX: Pass search string to the backend to search the whole database
        const params = {
          page: mtPage,
          page_size: mtPageSize,
        };

        if (mtSearch.trim()) {
          params.search = mtSearch.trim();
        }

        const response = await TMS_API.masterTrainers.list(params);
        setMtList(response?.data?.results || []);
        setMtTotal(response?.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch master trainers:", err);
      } finally {
        setMtLoading(false);
      }
    };

    // SURGICAL FIX: Debounce the API call by 400ms so it doesn't spam the server while typing
    const timeoutId = setTimeout(() => {
      fetchMTs();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [mtPage, mtPageSize, mtSearch]);

  // SURGICAL FIX: Reset to page 1 whenever the search query changes
  useEffect(() => {
    setMtPage(1);
  }, [mtSearch]);

  // We now rely on the backend for searching, so we just map the fetched list directly
  const filteredMtList = mtList;

  const mtTotalPages = Math.max(1, Math.ceil(mtTotal / mtPageSize));

  /* ---------------- mt selection & availability check ---------------- */
  const handleToggleMasterTrainer = async (trainer) => {
    const exists = mtSelections.some((t) => t.id === trainer.id);

    if (exists) {
      setMtSelections((prev) => prev.filter((t) => t.id !== trainer.id));
      return;
    }

    // Check Availability
    setMtCheckingId(trainer.id);
    try {
      // SURGICAL FIX: Pass the current batch's end_date to the availability check API
      const endDateParam = batch?.end_date ? `?end_date=${batch.end_date}` : "";
      const response = await api.get(
        `/tms/mt/${trainer.id}/availability/${endDateParam}`,
      );

      const {
        is_available,
        busy_reason,
        busy_type,
        training_request_id,
        district_name_en,
        block_name_en,
      } = response.data;

      console.log("Availability Response:", response.data);

      if (!is_available) {
        let alertMessage = `Master Trainer ${trainer.full_name} is UNAVAILABLE:\n\n${busy_reason}`;

        // Append TR details if they are busy in the BATCHING phase
        if (busy_type === "TRAINING_REQUEST") {
          alertMessage += `\n\nTraining Request Details:`;
          alertMessage += `\n• ID: ${training_request_id || "N/A"}`;
          alertMessage += `\n• District: ${district_name_en || "N/A"}`;
          alertMessage += `\n• Block: ${block_name_en || "N/A"}`;
        }

        alert(alertMessage);
        return;
      }

      setMtSelections((prev) => [...prev, trainer]);
    } catch (err) {
      console.error("Trainer availability check failed:", err);
      alert("Unable to verify trainer availability. Please try again.");
    } finally {
      setMtCheckingId(null);
    }
  };

  /* ---------------- approve flow ---------------- */
  const handleApprove = async () => {
    if (mtSelections.length === 0) {
      alert(
        "You must assign at least one Master Trainer to this batch before approving.",
      );
      return;
    }

    setIsSaving(true);
    try {
      // 1. Create mapping records for all selected MTs
      for (const mt of mtSelections) {
        await TMS_API.batchMasterTrainers.create({
          batch: batchId,
          master_trainer: mt.id,
          participated: false,
          status: "UNAVAILABLE",
          remarks: "Assigned during DMMU Review",
        });
      }

      // 2. Update Batch status to SCHEDULED using the requested Update API
      await api.patch(`/tms/batch/${batchId}/approve-reject/`, {
        status: "SCHEDULED",
      });

      alert("Batch Approved and Scheduled successfully!");
      navigate("/tms/batches-list/");
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve batch. Please check console.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- reject flow ---------------- */
  const handleConfirmRevert = async () => {
    if (!revertReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    setIsSaving(true);
    try {
      // Update the status and rejection_reason using the requested Update API
      await api.patch(`/tms/batch/${batchId}/approve-reject/`, {
        status: "REJECTED",
        rejection_reason: revertReason.trim(),
      });

      alert("Batch has been REJECTED and returned to the creator.");
      setRevertModalOpen(false);
      navigate("/tms/batches-list/");
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject batch.");
    } finally {
      setIsSaving(false);
    }
  };
  const paxCount =
    (batch?.beneficiary?.length || 0) + (batch?.trainer?.length || 0);

  const handleViewBatch = async (batchId) => {
    try {
      const response = await TMS_API.batchDetailV2(batchId);
      navigate(`/tms/batch-detail/${batchId}`, {
        state: { batchData: response.data },
      });
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to fetch batch details.",
      );
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />

        <div className="main-wrapper">
          <main
            style={{
              padding: "24px",
              minHeight: "100vh",
              backgroundColor: "#f1f5f9",
            }}
          >
            {/* Top Navigation Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#0f172a", fontSize: "22px" }}>
                  Batch Review & Scheduling
                </h2>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  Verify batch details and strictly assign Master Trainers
                  before approval.
                </span>
              </div>
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                &larr; Back to List
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "stretch",
                height: "calc(100vh - 180px)",
              }}
            >
              {/* ========================================================= */}
              {/* LEFT PANEL: BATCH DETAILS (Scrollable Frame)              */}
              {/* ========================================================= */}
              <div
                style={{
                  flex: "0 0 35%",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#1e293b",
                    }}
                  >
                    Batch Summary
                  </h3>

                  <button
                    className="btn-sm btn-flat"
                    onClick={() => handleViewBatch(batchId)}
                  >
                    View Complete Batch Details
                  </button>
                </div>

                <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                  {loadingBatch ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#64748b",
                        padding: "40px",
                      }}
                    >
                      Loading details...
                    </div>
                  ) : !batch ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#ef4444",
                        padding: "40px",
                      }}
                    >
                      Failed to load batch data.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div className="detail-row">
                        <label>Batch Code</label>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#2563eb",
                            fontSize: "16px",
                          }}
                        >
                          {batch.code}
                        </div>
                      </div>

                      <div className="detail-row">
                        <label>Current Status</label>
                        <div>
                          <span
                            style={{
                              background: "#fef3c7",
                              color: "#b45309",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontWeight: "600",
                              fontSize: "12px",
                            }}
                          >
                            {batch.status}
                          </span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <label>Training Plan</label>
                        <div>{batch.training_plan?.training_name || "N/A"}</div>
                      </div>
                      <div className="detail-row">
                        <label>Type of Training</label>
                        <div>
                          {batch.training_plan?.type_of_training || "N/A"}
                        </div>
                      </div>

                      <div className="detail-row">
                        <label>Theme</label>
                        <div>
                          {batch.training_plan?.theme?.theme_name || "N/A"}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div className="detail-row">
                          <label>Start Date</label>
                          <div>{fmtDate(batch.start_date)}</div>
                        </div>
                        <div className="detail-row">
                          <label>End Date</label>
                          <div>{fmtDate(batch.end_date)}</div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div className="detail-row">
                          <label>Participant Type</label>
                          <div>{batch.participant_type}</div>
                        </div>
                        <div className="detail-row">
                          <label>BATCH Type</label>
                          <div>{batch.batch_type} BATCH</div>
                        </div>
                      </div>

                      <div className="detail-row">
                        <label>Total Participants Added</label>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#0f172a",
                          }}
                        >
                          {paxCount}{" "}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "400",
                              color: "#64748b",
                            }}
                          >
                            Trainees
                          </span>
                        </div>
                      </div>

                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px dashed #cbd5e1",
                          margin: "8px 0",
                        }}
                      />

                      <div className="detail-row">
                        <label>Training Partner</label>
                        <div>{batch.partner?.name || "N/A"}</div>
                      </div>

                      <div className="detail-row">
                        <label>Centre / Venue</label>
                        <div>
                          <strong>{batch.centre?.venue_name || "N/A"}</strong>
                          <br />
                          <span style={{ fontSize: "13px", color: "#64748b" }}>
                            {batch.centre?.venue_address ||
                              "No address provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* RIGHT PANEL: MASTER TRAINER LIST & ACTIONS                */}
              {/* ========================================================= */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}
                    >
                      Assign Master Trainers
                    </h3>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>
                      {mtSelections.length} Trainer(s) Selected
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Search name or mobile..."
                      value={mtSearch}
                      onChange={(e) => setMtSearch(e.target.value)}
                      style={{ minWidth: "250px" }}
                    />
                  </div>
                </div>

                {/* MT Table Area */}
                <div
                  style={{ flex: 1, overflowY: "auto", position: "relative" }}
                >
                  <table
                    className="table"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "#f8fafc",
                        zIndex: 10,
                      }}
                    >
                      <tr>
                        <th style={{ width: "50px", textAlign: "center" }}>
                          #
                        </th>
                        <th>S.No.</th>
                        <th>Master Trainer Name</th>
                        <th>Mobile</th>
                        <th>Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mtLoading ? (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              color: "#64748b",
                            }}
                          >
                            Fetching trainers...
                          </td>
                        </tr>
                      ) : filteredMtList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              color: "#64748b",
                            }}
                          >
                            No Master Trainers found.
                          </td>
                        </tr>
                      ) : (
                        filteredMtList.map((mt, index) => {
                          const isSelected = mtSelections.some(
                            (t) => t.id === mt.id,
                          );
                          const isChecking = mtCheckingId === mt.id;

                          return (
                            <tr
                              key={mt.id}
                              style={{
                                background: isSelected
                                  ? "#eff6ff"
                                  : "transparent",
                              }}
                            >
                              <td style={{ textAlign: "center" }}>
                                {isChecking ? (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#2563eb",
                                    }}
                                  >
                                    ...
                                  </span>
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleToggleMasterTrainer(mt)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />
                                )}
                              </td>
                              <td style={{ color: "#64748b" }}>
                                {(mtPage - 1) * mtPageSize + index + 1}
                              </td>
                              <td
                                style={{ fontWeight: "600", color: "#0f172a" }}
                              >
                                {mt.full_name || "-"}
                              </td>
                              <td>{mt.mobile_no || "-"}</td>
                              <td>
                                <span
                                  style={{
                                    background: "#f1f5f9",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    border: "1px solid #cbd5e1",
                                  }}
                                >
                                  {mt.designation || "N/A"}-
                                  {mt.theme_name || "N/A"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div
                  style={{
                    padding: "12px 20px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8fafc",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    Showing page {mtPage} of {mtTotalPages}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-outline"
                      disabled={mtPage <= 1 || mtLoading}
                      onClick={() => setMtPage((p) => p - 1)}
                    >
                      Prev
                    </button>
                    <button
                      className="btn btn-outline"
                      disabled={mtPage >= mtTotalPages || mtLoading}
                      onClick={() => setMtPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Final Execution Actions */}
                <div
                  style={{
                    padding: "20px",
                    borderTop: "1px solid #cbd5e1",
                    background: "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: mtSelections.length > 0 ? "#16a34a" : "#ef4444",
                      fontWeight: "600",
                    }}
                  >
                    {mtSelections.length > 0
                      ? "✓ Master Trainers Verified & Attached"
                      : "⚠ Master Trainer assignment is required"}
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => setRevertModalOpen(true)}
                      disabled={isSaving}
                    >
                      {isSaving ? "Processing..." : "Reject Batch"}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleApprove}
                      disabled={isSaving || mtSelections.length === 0}
                      style={{ opacity: mtSelections.length === 0 ? 0.6 : 1 }}
                    >
                      {isSaving ? "Processing..." : "Approve & Schedule"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* REVERT / REJECTION MODAL */}
      <Modal
        open={revertModalOpen}
        onClose={() => {
          if (!isSaving) setRevertModalOpen(false);
        }}
        title="Reject Batch Application"
      >
        <div
          style={{ fontSize: "14px", color: "#475569", marginBottom: "16px" }}
        >
          Please provide a reason for rejecting this batch. This will mark the
          batch as <strong>REJECTED</strong> and notify the Training Partner.
        </div>
        <textarea
          className="input"
          rows={5}
          placeholder="Detailed rejection reason..."
          value={revertReason}
          onChange={(e) => setRevertReason(e.target.value)}
          disabled={isSaving}
          style={{ width: "100%", marginBottom: "20px", resize: "none" }}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button
            className="btn btn-outline"
            onClick={() => setRevertModalOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirmRevert}
            disabled={isSaving}
          >
            {isSaving ? "Rejecting..." : "Confirm Rejection"}
          </button>
        </div>
      </Modal>

      <style>{`
        /* LAYOUT & UTILS */
        .content-area {
              display: flex;
              flex: 1;
              width: 100%;
            }
        .content-area > *:first-child { flex-shrink: 0; }
        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          background-color: #f8fafc;
        }
        .input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          font-size: 14px;
          color: #0f172a;
          transition: all 0.2s;
        }
        .input:focus { outline: none; border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        
        /* BATCH DETAIL CARD ROWS */
        .detail-row { display: flex; flex-direction: column; gap: 4px; }
        .detail-row label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-row div { font-size: 14px; color: #1e293b; font-weight: 500; }

        /* BUTTONS */
        .btn { padding: 10px 20px; border-radius: 8px; cursor: pointer; border: none; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3); }
        .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
        
        .btn-danger { background: #ef4444; color: #fff; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
        .btn-danger:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
        .btn-danger:disabled { background: #fca5a5; cursor: not-allowed; }
        
        .btn-outline { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; }
        .btn-outline:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }

        /* TABLE */
        .table th { padding: 14px 16px; text-align: left; font-size: 13px; color: #475569; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
        .table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .table tbody tr { transition: background 0.2s; }
        .table tbody tr:hover { background: #f8fafc; }
      `}</style>
    </div>
  );
}
