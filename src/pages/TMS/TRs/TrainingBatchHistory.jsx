// src/pages/TMS/TRs/TrainingBatchHistory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import api, { TMS_API } from "../../../api/axios";

export default function TrainingBatchHistory() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [batchCode, setBatchCode] = useState("");

  const [batchBlocks, setBatchBlocks] = useState([]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CREATED":
        return "#2563eb";
      case "APPROVED":
        return "#16a34a";
      case "ONGOING":
        return "#f59e0b";
      case "CLOSED":
        return "#dc2626";
      case "REJECTED":
        return "#7c3aed";
      case "CANCELLED":
        return "#6b7280";
      default:
        return "#0284c7";
    }
  };

  const fmtDateTime = (iso) => {
    try {
      if (!iso) return "-";
      const d = new Date(iso);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return iso || "-";
    }
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        // 1. Fetch Batch Details for Code and Blocks (Coverage)
        const batchResp = await TMS_API.batchDetailV2(batchId);
        setBatchCode(batchResp?.data?.code || "");
        const combinedBatchDetails =
          batchResp?.data?.combined_batch_details || [];

        const blocks = combinedBatchDetails
          .map((item) => item.block)
          .filter(Boolean);

        setBatchBlocks(blocks);

        // 2. Fetch Batch History Timeline
        const historyResp = await api.get(`/tms/batches/${batchId}/history/`);
        let data = historyResp?.data?.results || historyResp?.data || [];

        // SURGICAL ADDITION: Inject base creation log using batch details
        if (batchResp?.data?.created_at) {
          data.push({
            id: "initial_creation_event",
            status: "CREATED",
            remarks: "Batch succesfully created and sent to Approval authority",
            created_at: batchResp.data.created_at,
          });
        }

        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistoryData(data);
      } catch (error) {
        console.error("Failed to fetch batch history:", error);
      } finally {
        setLoading(false);
      }
    }
    if (batchId) fetchHistory();
  }, [batchId]);

  // Batch Coverage (Blocks) स्ट्रिंग जेनरेट करना
  const renderBatchCoverage = () => {
    if (batchBlocks && batchBlocks.length > 0) {
      // यदि कंबाइंड/मल्टीपल ब्लॉक्स हैं तो उन्हें कॉमा से अलग करके दिखाएं
      return batchBlocks.map((b) => b.block_name_en || b.name || b).join(", ");
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
        <div className="main-area">
          <main style={{ padding: 24 }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              {/* Header section */}
              <div className="history-header">
                <div>
                  <h2 className="history-page-title">🕒 Batch History</h2>
                  <p className="history-subtitle">
                    Batch Code: {batchCode ? `${batchCode}` : "N/A"}
                  </p>
                </div>
                <button className="btn-back" onClick={() => navigate(-1)}>
                  ← Back to Details
                </button>
              </div>

              <div className="summary-card">
                <div className="summary-item">
                  <span>Batch Code</span>
                  <strong>{batchCode || "-"}</strong>
                </div>

                {/* बदला हुआ सेक्शन: Batch ID की जगह अब Batch Coverage (Blocks) प्रदर्शित होगा */}
                <div className="summary-item">
                  <span>Batch Coverage</span>
                  <strong
                    style={{
                      fontSize: "15px",
                      display: "block",
                      marginTop: "2px",
                      lineHeight: "1.3",
                    }}
                  >
                    {renderBatchCoverage()}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Current Status</span>
                  <strong>
                    {historyData.length ? historyData[0].status : "-"}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Total Changes</span>
                  <strong>{historyData.length}</strong>
                </div>
              </div>

              {/* Timeline Card Container */}
              <div className="history-card">
                {loading ? (
                  <div className="history-loading">Loading timeline logs…</div>
                ) : (
                  <div className="timeline-container">
                    {historyData.map((log, index) => (
                      <div className="timeline-item" key={log.id || index}>
                        {/* Left Side: Timestamp */}
                        <div className="timeline-time">
                          <span className="time-text">
                            {fmtDateTime(log.created_at)}
                          </span>
                        </div>

                        {/* Middle: Timeline Indicator */}
                        <div className="timeline-badge-wrapper">
                          <div className="timeline-badge"></div>
                        </div>

                        {/* Right Side: Status Content Card */}
                        <div className="timeline-panel">
                          <div className="panel-header">
                            <span
                              className="status-pill"
                              style={{ background: getStatusColor(log.status) }}
                            >
                              {log.status}
                            </span>
                          </div>
                          {log.remarks ? (
                            <div className="panel-body">
                              <p className="remark-text">
                                <strong>Remark:</strong> {log.remarks}
                              </p>
                            </div>
                          ) : (
                            <div className="panel-body">
                              <p className="remark-text muted">
                                No remark provided.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <style>{`
                .content-area { display: flex; flex: 1; width: 100%; }
                .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .history-page-title { margin: 0; color: #2b4e72; font-weight: 700; }
                .history-subtitle { margin: 4px 0 0 0; color: #5a8cc2; font-size: 14px; }
                .btn-back { background: #5a8cc2; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; }
                .btn-back:hover { background: #3d6ba6; transform: translateX(-2px); }
                .history-card { background: white; border: 2px solid #a7c6ed; border-radius: 12px; padding: 30px 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); min-height: 350px; }
                .history-loading { text-align: center; padding: 40px; color: #5a8cc2; font-size: 15px; }
                
                /* Timeline UI Layout */
                .timeline-container { position: relative; padding: 10px 0; list-style: none; }
                .timeline-container:before { position: absolute; top: 0; bottom: 0; left: 200px; width: 3px; content: " "; background-color: #a7c6ed; }
                .timeline-item { position: relative; display: flex; margin-bottom: 24px; }
                .timeline-time { width: 180px; text-align: right; padding-right: 20px; display: flex; align-items: center; justify-content: flex-end; }
                .time-text { font-size: 13px; font-weight: 600; color: #2b4e72; }
                .timeline-badge-wrapper { width: 43px; display: flex; justify-content: center; align-items: center; z-index: 10; }
                .timeline-badge { width: 14px; height: 14px; border-radius: 50%; background-color: #3d6ba6; border: 3px solid #fff; box-shadow: 0 0 0 3px #a7c6ed; }
                .timeline-item:hover .timeline-badge { background-color: #2563eb; transform: scale(1.2); transition: all 0.2s ease; }
                .timeline-panel { position: relative; width: calc(100% - 243px); background: #f8fbff; border: 1px solid #a7c6ed; border-radius: 8px; padding: 14px 18px; transition: box-shadow 0.2s; }
                .timeline-panel:hover { box-shadow: 0 4px 8px rgba(37, 99, 235, 0.08); background: #fff; }
                .panel-header { margin-bottom: 6px; }
                .status-pill { display: inline-block; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; color: #fff; }
                .remark-text { margin: 0; font-size: 13.5px; color: #2b4e72; line-height: 1.4; }
                .remark-text.muted { color: #8fa0b5; font-style: italic; }
                
                /* Summary Grid Card */
                .summary-card{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
                .summary-item{ background:#fff; border:2px solid #a7c6ed; border-radius:10px; padding:16px; box-shadow:0 4px 10px rgba(0,0,0,.05); display:flex; flex-direction:column; justify-content:center; }
                .summary-item span{ display:block; font-size:12px; color:#5a8cc2; margin-bottom:6px; font-weight:600; }
                .summary-item strong{ color:#2b4e72; font-size:18px; font-weight:700; word-break: break-word; }
                
                @media(max-width:900px){ .summary-card{ grid-template-columns:repeat(2,1fr); } }
                @media(max-width:600px){ .summary-card{ grid-template-columns:1fr; } }
            `}</style>
    </div>
  );
}
