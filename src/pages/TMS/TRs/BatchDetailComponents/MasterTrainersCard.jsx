// src/pages/TMS/TRs/BatchDetailComponents/MasterTrainersCard.jsx
import React, { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import api, { TMS_API } from "../../../../api/axios";

/* ---------------- simple modal ---------------- */
function Modal({ open, title, onClose, children, width = 800 }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
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
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            background: "#1e3a8a",
            color: "#ffffff",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            {title}
          </h3>
          <button
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#ffffff",
              opacity: 0.8,
            }}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div
          style={{ padding: "24px", overflowY: "auto", background: "#f8fafc" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function MasterTrainersCard({
  masterTrainers,
  batchData,
  onRefresh,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Master Trainer List State
  const [mtList, setMtList] = useState([]);
  const [mtTotal, setMtTotal] = useState(0);
  const [mtPage, setMtPage] = useState(1);
  const [mtPageSize] = useState(10);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtSearch, setMtSearch] = useState("");
  const [mtThemeFilter, setMtThemeFilter] = useState("");
  const [mtDesignationFilter, setMtDesignationFilter] = useState("");
  const [availableThemes, setAvailableThemes] = useState([]);

  // Action States
  const [mtCheckingId, setMtCheckingId] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);

  // Determine if replacement is allowed (Only for ONGOING or SCHEDULED)
  const canReplace =
    batchData && ["ONGOING", "SCHEDULED"].includes(batchData.status);

  /* ---------------- Fetch Themes ---------------- */
  useEffect(() => {
    if (!isModalOpen) return;
    const fetchThemes = async () => {
      try {
        const response = await TMS_API.trainingThemes.list({ page_size: 100 });
        setAvailableThemes(response?.data?.results || []);
      } catch (err) {
        console.error("Failed to fetch themes:", err);
      }
    };
    fetchThemes();
  }, [isModalOpen]);

  /* ---------------- Fetch Master Trainers ---------------- */
  useEffect(() => {
    if (!isModalOpen) return;
    const fetchMTs = async () => {
      setMtLoading(true);
      try {
        const params = {
          page: mtPage,
          page_size: mtPageSize,
        };

        if (mtSearch.trim()) params.search = mtSearch.trim();
        if (mtThemeFilter) params.theme = mtThemeFilter;
        if (mtDesignationFilter) params.designation = mtDesignationFilter;

        const response = await TMS_API.masterTrainers.list(params);
        setMtList(response?.data?.results || []);
        setMtTotal(response?.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch master trainers:", err);
      } finally {
        setMtLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMTs();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [
    isModalOpen,
    mtPage,
    mtPageSize,
    mtSearch,
    mtThemeFilter,
    mtDesignationFilter,
  ]);

  useEffect(() => {
    setMtPage(1);
  }, [mtSearch, mtThemeFilter, mtDesignationFilter]);

  const mtTotalPages = Math.max(1, Math.ceil(mtTotal / mtPageSize));

  /* ---------------- Handle Replacement Selection ---------------- */
  const handleSelectNewMT = async (trainer) => {
    // 1. Check Availability
    setMtCheckingId(trainer.id);
    try {
      const queryParams = new URLSearchParams();
      if (batchData?.start_date)
        queryParams.append("start_date", batchData.start_date);
      if (batchData?.end_date)
        queryParams.append("end_date", batchData.end_date);

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const availResponse = await api.get(
        `/tms/mt/${trainer.id}/availability/${queryString}`,
      );
      const { is_available, busy_reason } = availResponse.data;

      if (!is_available) {
        alert(
          `Master Trainer ${trainer.full_name} is UNAVAILABLE:\n\n${busy_reason}`,
        );
        return;
      }

      // 2. If available, confirm replacement
      if (
        !window.confirm(
          `Are you sure you want to assign ${trainer.full_name} to this batch?`,
        )
      ) {
        return;
      }

      // 3. Execute Replacement API
      setIsReplacing(true);
      const replacePayload = {
        batch_id: batchData.id,
        master_trainer_id: trainer.id,
      };

      const replaceResponse = await api.post(
        "/tms/batch/replace-master-trainer/",
        replacePayload,
      );

      if (replaceResponse.data.status === "success") {
        alert("Master Trainer replaced successfully!");
        setIsModalOpen(false);
        if (typeof onRefresh === "function") {
          onRefresh();
        }
      }
    } catch (err) {
      console.error("Replacement failed:", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to replace Master Trainer. Please check console.";
      alert(errorMsg);
    } finally {
      setMtCheckingId(null);
      setIsReplacing(false);
    }
  };

  if (!masterTrainers || masterTrainers.length === 0) {
    return null;
  }

  return (
    <div className="master-trainer-card">
      <div className="master-trainer-heading">
        <span>👨‍🏫 Master Trainer{masterTrainers.length > 1 ? "s" : ""}</span>
      </div>

      <div className="master-trainer-list">
        {masterTrainers.map((trainer, idx) => {
          // Flatten nested trainer object for easier access
          const mtData = trainer.master_trainer || trainer;

          return (
            <div className="master-trainer-info" key={trainer.id || idx}>
              <div className="mt-details">
                <div>
                  <strong>Name:</strong>{" "}
                  {mtData.full_name || mtData.name || "-"}
                </div>
                <div>
                  <strong>Mobile:</strong>{" "}
                  {mtData.mobile_no || mtData.mobile || "-"}
                </div>
                <div>
                  <strong>Designation:</strong> {mtData.designation || "-"}
                </div>
              </div>

              {/* Replace Action Button */}
              {canReplace && (
                <div className="mt-actions">
                  <button
                    className="btn-replace"
                    onClick={() => setIsModalOpen(true)}
                    title="Replace this Master Trainer"
                  >
                    <FaExchangeAlt /> Replace
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- Replacement Modal ---------------- */}
      <Modal
        open={isModalOpen}
        title={`Select New Master Trainer for Batch: ${batchData?.code || ""}`}
        onClose={() => !isReplacing && setIsModalOpen(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            height: "100%",
          }}
        >
          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <select
              className="mt-filter-input"
              value={mtThemeFilter}
              onChange={(e) => setMtThemeFilter(e.target.value)}
              disabled={isReplacing}
            >
              <option value="">All Themes</option>
              {availableThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.theme_name}
                </option>
              ))}
            </select>

            <select
              className="mt-filter-input"
              value={mtDesignationFilter}
              onChange={(e) => setMtDesignationFilter(e.target.value)}
              disabled={isReplacing}
            >
              <option value="">All Designations</option>
              <option value="BRP">BRP</option>
              <option value="DRP">DRP</option>
              <option value="SRP">SRP</option>
            </select>

            <input
              type="text"
              className="mt-filter-input"
              placeholder="Search name or mobile..."
              value={mtSearch}
              onChange={(e) => setMtSearch(e.target.value)}
              disabled={isReplacing}
              style={{ flex: 1, minWidth: "200px" }}
            />
          </div>

          {/* Table */}
          <div
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead style={{ background: "#f1f5f9", color: "#475569" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #cbd5e1",
                    }}
                  >
                    Master Trainer Name
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #cbd5e1",
                    }}
                  >
                    Mobile
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #cbd5e1",
                    }}
                  >
                    Designation & Theme
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "2px solid #cbd5e1",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mtLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#64748b",
                      }}
                    >
                      <FaSpinner
                        className="mt-spin"
                        style={{ marginRight: "8px" }}
                      />{" "}
                      Fetching available trainers...
                    </td>
                  </tr>
                ) : mtList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#64748b",
                      }}
                    >
                      No Master Trainers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  mtList.map((mt) => {
                    const isChecking = mtCheckingId === mt.id;
                    return (
                      <tr
                        key={mt.id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          transition: "background 0.2s",
                        }}
                        className="mt-row-hover"
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {mt.full_name || "-"}
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>
                          {mt.mobile_no || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background: "#e0f2fe",
                              color: "#1e40af",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {mt.designation || "N/A"} - {mt.theme_name || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            className="btn-select-mt"
                            onClick={() => handleSelectNewMT(mt)}
                            disabled={isReplacing || isChecking}
                          >
                            {isChecking ? (
                              <>
                                <FaSpinner className="mt-spin" /> Checking...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle /> Assign
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!mtLoading && mtList.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#fff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Showing page <strong>{mtPage}</strong> of {mtTotalPages}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="mt-page-btn"
                  disabled={mtPage <= 1 || isReplacing}
                  onClick={() => setMtPage((p) => p - 1)}
                >
                  Prev
                </button>
                <button
                  className="mt-page-btn"
                  disabled={mtPage >= mtTotalPages || isReplacing}
                  onClick={() => setMtPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <style>{`
        .master-trainer-card {
          background: #e4ecf5;
          border: 2px solid #5a8cc2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .master-trainer-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 16px;
          color: #1e3a8a;
          border-bottom: 2px solid #a7c6ed;
          padding-bottom: 8px;
        }
        .master-trainer-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .master-trainer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .mt-details {
          display: flex;
          gap: 32px;
          color: #334155;
          font-size: 14px;
        }
        .btn-replace {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fffbeb;
          color: #ca8a04;
          border: 1px solid #fde047;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-replace:hover {
          background: #fef08a;
          color: #a16207;
        }
        .mt-filter-input {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          color: #1e293b;
        }
        .mt-filter-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        .mt-row-hover:hover {
          background-color: #f8fafc !important;
        }
        .btn-select-mt {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-select-mt:hover:not(:disabled) { background: #1d4ed8; }
        .btn-select-mt:disabled { background: #94a3b8; cursor: not-allowed; }
        
        .mt-page-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .mt-page-btn:hover:not(:disabled) { background: #f1f5f9; }
        .mt-page-btn:disabled { color: #94a3b8; cursor: not-allowed; }

        .mt-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .master-trainer-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .mt-details {
            flex-direction: column;
            gap: 6px;
          }
          .mt-actions {
            width: 100%;
          }
          .btn-replace {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
