// src/pages/TMS/TRs/batch_certificate.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

const CERT_CACHE_KEY = "tms_batch_certificate_cache_v1";

function getCacheKey(batchId) {
  return `${CERT_CACHE_KEY}_${batchId}`;
}

function saveCache(batchId, payload) {
  try {
    localStorage.setItem(
      getCacheKey(batchId),
      JSON.stringify({ ts: Date.now(), payload }),
    );
  } catch {}
}

function loadCache(batchId) {
  try {
    const raw = localStorage.getItem(getCacheKey(batchId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("/media/")) return url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch (e) {
      return url;
    }
  }
  return url;
}

function buildMediaUrl(url) {
  if (!url) return null;

  try {
    const normalizedPath = normalizeMediaUrl(url);

    let base = api?.defaults?.baseURL;

    // fallback if baseURL is invalid
    if (!base || !base.startsWith("http")) {
      base = window.location.origin; // fallback to current origin
    }

    const apiBase = new URL(base);

    return `${apiBase.protocol}//${apiBase.host}${normalizedPath}`;
  } catch (e) {
    console.error("buildMediaUrl failed:", url, e);
    return url; // fallback: at least don't crash UI
  }
}

export default function BatchCertificate() {
  const { user } = useContext(AuthContext) || {};
  const { id: batchId } = useParams();
  const role = getCanonicalRole(user || {});
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [batchDetail, setBatchDetail] = useState(null);
  const [closureRow, setClosureRow] = useState(null);
  const [reportRow, setReportRow] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const [showFinancialModal, setShowFinancialModal] = useState(false);

  const [financialYear, setFinancialYear] = useState("2025-26");

  // NEW: State to hold the PDF Blob URL from the backend
  const [generating, setGenerating] = useState(false);

  const didRunRef = useRef(false);

  const requestLevel = batchDetail?.request?.level || null;
  const isBMMU = role === "bmmu";
  const isDMMU = role === "dmmu";
  const isSMMU = role === "smmu";
  const isBatchClosed = batchDetail?.status === "CLOSED";
  const canGenerate =
    isBatchClosed &&
    ((isBMMU && requestLevel === "BLOCK") ||
      (isDMMU && requestLevel === "DISTRICT"));

  /* ---------------- fetchers ---------------- */

  async function fetchBatchDetail() {
    if (!batchId) return null;
    try {
      const resp = await api.get(`/tms/batches/${batchId}/detail/`);
      return resp?.data || null;
    } catch (e) {
      console.error("fetch batch detail failed", e);
      return null;
    }
  }

  async function fetchClosureRow() {
    if (!batchId) return null;
    try {
      const resp = await api.get(
        `/tms/batch-closure-requests/?batch=${batchId}&page_size=1`,
      );
      return resp?.data?.results?.[0] || null;
    } catch (e) {
      console.error("fetch closure failed", e);
      return null;
    }
  }

  async function fetchReportRow() {
    if (!batchId) return null;
    try {
      const resp = await api.get(
        `/tms/batch-reports/?batch=${batchId}&page_size=1`,
      );
      return resp?.data?.results?.[0] || null;
    } catch (e) {
      console.error("fetch report failed", e);
      return null;
    }
  }

  /* ---------------- generate certificate (BACKEND API) ---------------- */
  async function fetchCertificatePdf() {
    if (!batchDetail) return;

    setGenerating(true);
    try {
      const resp = await api.get(`/tms/batches/${batchId}/gen-cert/`, {
        params: { financial_year: financialYear },
        responseType: "blob", // Crucial for receiving PDF
      });

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // SURGICAL CHANGE: Open directly in the browser's default PDF viewer!
      // This gives the user native Print and Download buttons automatically.
      window.open(url, "_blank");

      setShowFinancialModal(false);
    } catch (e) {
      console.error("fetch certificate pdf failed", e);
      let msg =
        "Failed to generate certificate. Please ensure the batch is CLOSED and certificates are issued.";

      // Attempt to parse JSON error message from Blob response
      if (e.response && e.response.data && e.response.data instanceof Blob) {
        try {
          const text = await e.response.data.text();
          const json = JSON.parse(text);
          if (json.detail) msg = json.detail;
        } catch (err) {}
      }
      alert(msg);
    } finally {
      setGenerating(false);
    }
  }

  /* ---------------- loadAll ---------------- */
  async function loadAll() {
    if (!batchId || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cached = loadCache(batchId);
      if (cached && !refreshToken) {
        const payload = cached.payload || {};
        setBatchDetail(payload.batchDetail || null);
        setClosureRow(payload.closureRow || null);
        setReportRow(payload.reportRow || null);
        setLoading(false);
        return;
      }

      const detail = await fetchBatchDetail();
      setBatchDetail(detail);

      const closureResult = await fetchClosureRow();
      setClosureRow(closureResult);

      let reportResult = null;
      if (closureResult?.certificates_issued) {
        reportResult = await fetchReportRow();
        setReportRow(reportResult);
      }

      saveCache(batchId, {
        batchDetail: detail,
        closureRow: closureResult,
        reportRow: reportResult,
      });
    } catch (e) {
      console.error("loadAll failed", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    if (didRunRef.current && refreshToken === 0) return;
    didRunRef.current = true;
    loadAll();
  }, [batchId, user?.id, refreshToken]);

  /* ---------------- upload handler ---------------- */
  async function handleUploadSignedPdf(file) {
    if (!file || !batchId) return;
    setUploading(true);
    setUploadError("");

    try {
      let currentReport = reportRow;
      if (!currentReport) {
        const createResp = await api.post("/tms/batch-reports/", {
          batch: batchId,
          status: "DRAFT",
        });
        currentReport = createResp?.data;
        setReportRow(currentReport);
      }

      if (!currentReport?.id) throw new Error("Unable to create batch report");

      const formData = new FormData();
      formData.append("report_file", file);

      const oldStatus = currentReport.status || "DRAFT";
      let newStatus = oldStatus;
      if (isBMMU) newStatus = "BMM_SIGNED";
      else if (isDMMU) newStatus = "DMM_SIGNED";
      else if (isSMMU && oldStatus === "DMM_SIGNED") newStatus = "SMM_SIGNED";

      formData.append("status", newStatus);

      const patchResp = await api.patch(
        `/tms/batch-reports/${currentReport.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setReportRow(patchResp?.data);

      if (!closureRow?.certificates_issued && closureRow?.id) {
        await api.patch(`/tms/batch-closure-requests/${closureRow.id}/`, {
          certificates_issued: true,
        });
        setClosureRow({ ...closureRow, certificates_issued: true });
      }
    } catch (e) {
      console.error("upload failed", e);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function renderUploadButton() {
    return (
      <label
        className="btn-sm btn-flat"
        style={{ cursor: uploading ? "not-allowed" : "pointer" }}
      >
        {uploading ? "Uploading..." : "Upload Signed PDF"}
        <input
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadSignedPdf(file);
            e.target.value = "";
          }}
        />
      </label>
    );
  }

  function renderReportTable() {
    const status = reportRow?.status || "DRAFT";
    const fileUrl = reportRow?.report_file
      ? buildMediaUrl(reportRow.report_file)
      : null;
    const canUpload =
      (isBMMU && !["DMM_SIGNED", "SMM_SIGNED"].includes(status)) ||
      (isDMMU && status !== "SMM_SIGNED") ||
      (isSMMU && status === "DMM_SIGNED");

    return (
      <table className="table table-compact">
        <thead>
          <tr>
            <th>Status</th>
            <th>Action</th>
            {canUpload && <th>Upload</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{status}</td>
            <td>
              {fileUrl ? (
                <button
                  className="btn-sm btn-flat"
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  View PDF
                </button>
              ) : (
                "-"
              )}
            </td>
            {canUpload && <td>{renderUploadButton()}</td>}
          </tr>
        </tbody>
      </table>
    );
  }

  /* ---------------- main UI ---------------- */
  const headerTitle = batchDetail?.code
    ? `Batch Certificate — ${batchDetail.code}`
    : "Batch Certificate";

  const isTrainingCompleted =
    batchDetail?.status === "CLOSED" || batchDetail?.status === "COMPLETED";

  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 1000, margin: "20px auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0 }}>{headerTitle}</h2>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button
                  className="btn"
                  onClick={() => setRefreshToken((t) => t + 1)}
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
            ) : !batchDetail ? (
              <div style={{ padding: 40 }}>Unable to load batch details.</div>
            ) : (
              <>
                {/* Batch Info */}
                <div
                  style={{
                    background: "#fff",
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 20,
                  }}
                >
                  <h3>Batch Details</h3>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    <div>
                      <strong>Code:</strong> {batchDetail.code}
                    </div>
                    <div>
                      <strong>Status:</strong> {batchDetail.status}
                    </div>
                    <div>
                      <strong>Level:</strong> {requestLevel}
                    </div>
                    <div>
                      <strong>Dates:</strong> {batchDetail.start_date} to{" "}
                      {batchDetail.end_date}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div
                  style={{ background: "#fff", padding: 20, borderRadius: 8 }}
                >
                  <h3>Batch Closure Certificate</h3>

                  {!isBatchClosed ? (
                    <div
                      style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}
                    >
                      Batch is not CLOSED yet. Certificate generation and
                      uploads are disabled.
                    </div>
                  ) : (
                    <div>
                      {/* 1. Generate Button (Only visible to the assigned authority) */}
                      {canGenerate && (
                        <button
                          className="btn"
                          onClick={() => setShowFinancialModal(true)}
                          disabled={generating}
                          style={{ marginBottom: 20 }}
                        >
                          {generating
                            ? "Generating..."
                            : "Generate Batch Certificate (PDF)"}
                        </button>
                      )}

                      {isSMMU && !canGenerate && (
                        <div
                          style={{
                            marginBottom: 16,
                            fontSize: 13,
                            color: "#475569",
                          }}
                        >
                          Signed certificates will be generated and uploaded by
                          the respective authorities.
                        </div>
                      )}

                      {/* 2. Upload & Status Table (Always visible if CLOSED) */}
                      {renderReportTable()}

                      {uploadError && (
                        <div
                          style={{
                            color: "#dc2626",
                            marginTop: 12,
                            fontSize: 13,
                          }}
                        >
                          {uploadError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================
        MODALS MOVED TO ROOT LEVEL 
        (Prevents z-index stacking and fixed-positioning layout bugs)
        ======================================================================== 
      */}

      {/* Financial Year Modal */}
      {showFinancialModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowFinancialModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Select Financial Year</h3>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                margin: "12px 0",
                borderRadius: 4,
                border: "1px solid #d1d5db",
              }}
            >
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setShowFinancialModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={fetchCertificatePdf}
                disabled={generating}
              >
                {generating ? "Generating..." : "Generate Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
