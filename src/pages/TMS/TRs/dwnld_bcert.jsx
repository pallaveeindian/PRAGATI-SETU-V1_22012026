// src/pages/TMS/TRs/dwnld_bcert.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import api from "../../../api/axios";

/* =========================================================
   HELPERS
========================================================= */

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
    return url;
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DownloadBatchCertificate() {
  const { id: batchId } = useParams();
  const navigate = useNavigate();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportFileUrl, setReportFileUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchSignedCertificate() {
      if (!batchId) return;

      setLoading(true);
      setErrorMsg("");

      try {
        const resp = await api.get("/tms/batch-reports/", {
          params: {
            batch: batchId,
            status: "DMM_SIGNED",
          },
        });

        const reportRow = resp?.data?.results?.[0] || resp?.data?.[0];

        if (reportRow && reportRow.report_file) {
          setReportFileUrl(buildMediaUrl(reportRow.report_file));
        } else {
          setErrorMsg(
            "The certificate for this batch has not been signed by the DMM yet, or it does not exist.",
          );
        }
      } catch (err) {
        console.error("Failed to fetch signed batch report:", err);
        setErrorMsg(
          "Failed to retrieve the certificate. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSignedCertificate();
  }, [batchId]);

  return (
    <div className="app-shell">
      <Header />
      <div
        className="content-area"
        style={{ display: "flex", flex: 1, minWidth: 0 }}
      >
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div
          className="main-area"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <main style={{ padding: 24, flex: 1, background: "#f4f7f6" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {/* Header section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72" }}>
                  Download Batch Certificate
                </h2>
                <div style={{ marginLeft: "auto" }}>
                  <button
                    className="btn-outline"
                    onClick={() => navigate(-1)}
                    style={{
                      background: "#fff",
                      color: "#3d6ba6",
                      border: "1px solid #3d6ba6",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Main Card */}
              <div
                style={{
                  background: "#fff",
                  padding: 32,
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                {loading ? (
                  <div style={{ color: "#64748b", fontSize: "16px" }}>
                    Checking certificate status...
                  </div>
                ) : errorMsg ? (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ fontSize: "40px", marginBottom: 12 }}>
                      📄🚫
                    </div>
                    <h3 style={{ color: "#dc2626", margin: "0 0 8px 0" }}>
                      Certificate Not Ready
                    </h3>
                    <p style={{ color: "#64748b", margin: 0 }}>{errorMsg}</p>
                  </div>
                ) : (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ fontSize: "48px", marginBottom: 16 }}>
                      ✅📄
                    </div>
                    <h3 style={{ color: "#16a34a", margin: "0 0 12px 0" }}>
                      Certificate is Ready
                    </h3>
                    <p style={{ color: "#64748b", marginBottom: 24 }}>
                      The batch certificate has been successfully signed by the
                      DMM and is ready for download/print.
                    </p>

                    <button
                      onClick={() => window.open(reportFileUrl, "_blank")}
                      style={{
                        background: "#3d6ba6",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(61, 107, 166, 0.2)",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      View / Print Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
