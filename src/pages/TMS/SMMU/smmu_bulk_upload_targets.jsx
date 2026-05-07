// src/pages/TMS/SMMU/smmu_bulk_upload_targets.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";

const GEOSCOPE_KEY = "ps_user_geoscope";

export default function SmmuBulkUploadTargets() {
  const { user } = useContext(AuthContext) || {};
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [effectiveUserId, setEffectiveUserId] = useState(null);

  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const fileInputRef = useRef(null);

  // User Resolution
  async function resolveUserId() {
    const candidate = user?.id ?? user?.user_id ?? user?.TH_urid ?? null;
    if (candidate) {
      setEffectiveUserId(candidate);
      return candidate;
    }
    try {
      const raw = window.localStorage.getItem(GEOSCOPE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user_id) {
          setEffectiveUserId(parsed.user_id);
          return parsed.user_id;
        }
      }
    } catch (e) {}

    const uid = user?.id ?? user?.user_id ?? null;
    setEffectiveUserId(uid);
    return uid;
  }

  // Fetch Reference Data
  useEffect(() => {
    (async () => {
      setLoading(true);
      await resolveUserId();
      await Promise.all([
        fetchThemesAndPlans(),
        fetchPartners(),
        fetchDistricts(),
      ]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchThemesAndPlans() {
    try {
      const expert = effectiveUserId || user?.id || user?.user_id || null;
      const themesResp = await TMS_API.trainingThemes.list({
        expert,
        limit: 200,
      });
      const themeResults =
        themesResp?.data?.results ?? themesResp?.results ?? [];
      setThemes(themeResults);

      const collected = [];
      for (const th of themeResults) {
        try {
          const pResp = await TMS_API.trainingPlans.list({
            theme: th.id,
            limit: 500,
          });
          const pResults = pResp?.data?.results ?? pResp?.results ?? [];
          pResults.forEach((p) => {
            collected.push({
              id: p.id,
              training_name: p.training_name,
              type_of_training: p.type_of_training,
              theme_name: th.theme_name,
            });
          });
        } catch (e) {
          console.warn("fetchPlans for theme", th?.id, e);
        }
      }
      setPlans(collected);
    } catch (err) {
      console.error("fetchThemesAndPlans", err);
    }
  }

  async function fetchPartners() {
    try {
      const res = await TMS_API.trainingPartners.list({ limit: 500 });
      const data = res?.data ?? res;
      setPartners(data?.results || []);
    } catch (err) {
      console.error("fetchPartners", err);
    }
  }

  async function fetchDistricts() {
    try {
      const res = await LOOKUP_API.districts.list({ page_size: 500 });
      const data = res?.data ?? res;
      setDistricts(data?.results || []);
    } catch (err) {
      console.error("fetchDistricts", err);
    }
  }

  // Generate & Download Excel/CSV Format
  const handleDownloadFormat = () => {
    const headers = [
      "partner_id",
      "training_plan_id",
      "district_id",
      "district_name_en",
      "target_count",
      "financial_year",
      "notes",
    ];
    // Add one sample row for clarity
    const sampleRow = [
      "1",
      "5",
      "",
      "Lucknow",
      "10",
      "2023-24",
      "Sample Bulk Target",
    ];

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Bulk_Target_Format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage(null);

    try {
      const response = await TMS_API.bulkUploadTargets.create(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({
        type: "success",
        text: response?.data?.message || "Bulk upload successful!",
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const errDetails = error.response?.data?.details;
      const errText =
        error.response?.data?.error || "Failed to upload targets.";

      setMessage({
        type: "error",
        text: errText,
        details: errDetails,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: { margin: "20px auto", padding: "16px 16px" },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      background: "#fff",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      border: "1px solid #a7c6ed",
      maxHeight: "600px",
      display: "flex",
      flexDirection: "column",
    },
    tableWrapper: {
      overflowY: "auto",
      flex: 1,
      border: "1px solid #e5e7eb",
      borderRadius: 6,
    },
    th: {
      background: "#e4ecf5",
      padding: "10px",
      textAlign: "left",
      color: "#2b4e72",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    td: {
      padding: "8px 10px",
      borderBottom: "1px solid #f1f3f5",
      fontSize: 13,
      color: "#333",
    },
    idBadge: {
      background: "#3d6ba6",
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      fontWeight: "bold",
      fontSize: 12,
    },
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area" style={{ display: "flex", flex: 1 }}>
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area" style={{ width: "100%" }}>
          <main style={{ padding: 18 }}>
            <div style={styles.container}>
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  background: "#e4ecf5",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #a7c6ed",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: "#2b4e72" }}>
                    Bulk Assign Targets
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#5a8cc2",
                      marginTop: 4,
                    }}
                  >
                    Download the format, cross-reference IDs from below, and
                    upload.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleDownloadFormat}
                    style={{
                      background: "#fff",
                      color: "#3d6ba6",
                      border: "1px solid #3d6ba6",
                      padding: "8px 14px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ⬇ Download Format
                  </button>

                  <input
                    type="file"
                    accept=".csv, .xls, .xlsx"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    style={{
                      background: "#3d6ba6",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: 6,
                      cursor: uploading ? "not-allowed" : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {uploading ? "Uploading..." : "⬆ Upload CSV/Excel"}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div
                style={{
                  background: "#f7fbff",
                  border: "1px solid #c9ddf5",
                  borderRadius: 8,
                  padding: "14px 18px",
                  marginBottom: 18,
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    color: "#2b4e72",
                    fontSize: 16,
                  }}
                >
                  Important Instructions for Bulk Upload
                </h4>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: "#4b6480",
                    fontSize: 13,
                    lineHeight: 1.8,
                  }}
                >
                  <li>
                    Please download the provided format first and fill data only
                    in the same format.
                  </li>

                  <li>
                    Do not change, rename, remove, or reorder any column names
                    in the format file.
                  </li>

                  <li>
                    Please refer to the <strong>Training Partners</strong> table
                    below and enter the correct <strong>partner_id</strong>.
                  </li>

                  <li>
                    Please refer to the <strong>Modules</strong> table below and
                    enter the correct <strong>training_plan_id</strong>.
                  </li>

                  <li>
                    Target type is automatically considered as{" "}
                    <strong>MODULE</strong>. No target_type column is required.
                  </li>

                  <li>
                    Please provide either a valid <strong>district_id</strong>{" "}
                    from the table below OR the exact correct spelling of{" "}
                    <strong>district_name_en</strong>.
                  </li>

                  <li>
                    If district name spelling does not exactly match the master
                    record, the upload may fail.
                  </li>

                  <li>
                    Please enter financial year strictly in the same format such
                    as <strong>2024-25</strong>, <strong>2025-26</strong>,{" "}
                    <strong>2026-27</strong>, etc.
                  </li>

                  <li>
                    <strong>notes</strong> field is optional and may be left
                    blank.
                  </li>

                  <li>
                    Please ensure all IDs and values entered in the Excel/CSV
                    file are accurate before uploading.
                  </li>

                  <li>
                    Duplicate target assignment is not allowed for the same
                    Training Partner, Module, District, and Financial Year
                    combination.
                  </li>

                  <li>
                    If a target already exists for the same Training Partner and
                    Module in the same district, then the Financial Year must be
                    different.
                  </li>

                  <li>
                    Empty mandatory fields or invalid IDs may cause the entire
                    upload to fail.
                  </li>

                  <li>
                    Upload supports only <strong>.csv</strong>,{" "}
                    <strong>.xls</strong>, and <strong>.xlsx</strong> files.
                  </li>
                </ul>
              </div>

              {/* Messages */}
              {message && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 16,
                    background:
                      message.type === "error" ? "#fdecea" : "#e6f4ea",
                    color: message.type === "error" ? "#d9534f" : "#28a745",
                    border: `1px solid ${message.type === "error" ? "#d9534f" : "#28a745"}`,
                  }}
                >
                  <strong>{message.text}</strong>
                  {message.details && Array.isArray(message.details) && (
                    <ul
                      style={{
                        margin: "8px 0 0 0",
                        paddingLeft: 20,
                        fontSize: 13,
                      }}
                    >
                      {message.details.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Reference Tables */}
              {loading ? (
                <div
                  style={{ padding: 20, textAlign: "center", color: "#5a8cc2" }}
                >
                  Loading reference data...
                </div>
              ) : (
                <div style={styles.grid}>
                  {/* Partners Column */}
                  <div style={styles.card}>
                    <h5 style={{ color: "#2b4e72", marginTop: 0 }}>
                      1. Training Partners
                    </h5>
                    <div style={styles.tableWrapper}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Partner Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partners.map((p) => (
                            <tr key={p.id}>
                              <td style={styles.td}>
                                <span style={styles.idBadge}>{p.id}</span>
                              </td>
                              <td style={styles.td}>{p.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Modules Column */}
                  <div style={styles.card}>
                    <h5 style={{ color: "#2b4e72", marginTop: 0 }}>
                      2. Modules (Your Themes)
                    </h5>
                    <div style={styles.tableWrapper}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Training Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.length > 0 ? (
                            plans.map((p) => (
                              <tr key={p.id}>
                                <td style={styles.td}>
                                  <span style={styles.idBadge}>{p.id}</span>
                                </td>
                                <td style={styles.td}>
                                  <div>{p.training_name}</div>
                                  <div style={{ fontSize: 11, color: "#666" }}>
                                    {p.theme_name}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="2"
                                style={{ ...styles.td, textAlign: "center" }}
                              >
                                No modules found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Districts Column */}
                  <div style={styles.card}>
                    <h5 style={{ color: "#2b4e72", marginTop: 0 }}>
                      3. Districts
                    </h5>
                    <div style={styles.tableWrapper}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>District Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {districts.map((d) => (
                            <tr key={d.district_id || d.id}>
                              <td style={styles.td}>
                                <span style={styles.idBadge}>
                                  {d.district_id || d.id}
                                </span>
                              </td>
                              <td style={styles.td}>
                                {d.district_name_en || d.name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
