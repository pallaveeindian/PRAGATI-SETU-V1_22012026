// src/pages/TMS/LearnMat/LMList.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import {
  FaPlus,
  FaSearch,
  FaFileAlt,
  FaDownload,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

export default function LMList() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const role = user?.role_id;
  const isSMMU = role == 3;

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Lookups
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);

  const didInitRef = useRef(false);

  // 1. Fetch Themes (and lock for SMMU)
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const tRes = await TMS_API.trainingThemes.list({ page_size: 100 });
        const allThemes = tRes?.data?.results || [];

        if (isSMMU) {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );
          if (myTheme) {
            setThemes([myTheme]);
            setThemeFilter(String(myTheme.id)); // Auto-lock to their theme
          } else {
            setThemes([]);
          }
        } else {
          setThemes(allThemes);
        }
      } catch (err) {
        console.error("Failed to fetch themes", err);
      }
    };
    if (user?.id) fetchThemes();
  }, [isSMMU, user?.id]);

  // 2. Fetch Plans based on Theme Filter
  useEffect(() => {
    if (!themeFilter) {
      setPlans([]);
      setPlanFilter("");
      return;
    }
    TMS_API.trainingPlans
      .list({ theme: themeFilter, page_size: 200 })
      .then((r) => setPlans(r?.data?.results || []))
      .catch(() => setPlans([]));
  }, [themeFilter]);

  // 3. Fetch Learning Materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (themeFilter) params.theme_id = themeFilter;
      if (planFilter) params.plan_id = planFilter;

      const resp = await TMS_API.learningMaterials.list(params);
      setMaterials(resp?.data?.data || []);
      setTotalRecords(resp?.data?.count || 0);
    } catch (err) {
      console.error("Failed to fetch learning materials", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent fetching before SMMU theme is resolved
    if (isSMMU && !themeFilter) return;

    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      fetchMaterials();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, themeFilter, planFilter, isSMMU]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, themeFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // SURGICAL ADDITION: Handle Material Removal
  // ============================================================
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      await TMS_API.learningMaterials.destroy(id);
      alert("Learning material removed successfully.");
      fetchMaterials(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete material:", err);
      alert(err?.response?.data?.error || "Failed to remove material.");
    }
  };
  // ============================================================

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            {/* Header & Add Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                borderBottom: "2px solid #a7c6ed",
                paddingBottom: 10,
              }}
            >
              <h2 style={{ margin: 0, color: "#2b4e72" }}>
                Learning Materials Library
              </h2>
              {isSMMU && (
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
                  <button
                    className="btnPrimary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={() => navigate("/tms/learning-materials/add")}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>
              )}
            </div>

            {/* Filters Row */}
            <div
              style={{
                background: "#e4ecf5",
                padding: 16,
                borderRadius: 10,
                marginBottom: 20,
                border: "2px solid #3d6ba6",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="filter-row"
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: 10,
                      top: 10,
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search titles or descriptions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                    style={{ width: "100%", paddingLeft: 32 }}
                  />
                </div>

                <select
                  className="filter-input"
                  value={themeFilter}
                  disabled={isSMMU}
                  onChange={(e) => {
                    setThemeFilter(e.target.value);
                    setPlanFilter("");
                  }}
                  style={{ flex: "1 1 200px" }}
                >
                  <option value="">All Themes</option>
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.theme_name}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-input"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  disabled={!themeFilter || plans.length === 0}
                  style={{ flex: "1 1 200px" }}
                >
                  <option value="">All Training Plans</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.training_name}
                    </option>
                  ))}
                </select>

                <button
                  className="fetch-btn"
                  onClick={fetchMaterials}
                  style={{ flex: "0 0 auto" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Table Area */}
            <div
              style={{
                background: "#fff",
                padding: 14,
                borderRadius: 10,
                border: "2px solid #3d6ba6",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table className="training-table">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>S.No.</th>
                      <th style={{ width: "25%", textAlign: "left" }}>
                        Material Title
                      </th>
                      <th style={{ width: "15%", textAlign: "left" }}>Theme</th>
                      <th style={{ width: "20%", textAlign: "left" }}>
                        Training Plan
                      </th>
                      <th style={{ width: "15%" }}>Uploaded By</th>
                      <th style={{ width: "10%" }}>Date</th>
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#64748b",
                          }}
                        >
                          <FaSpinner
                            className="mt-spin"
                            style={{ marginRight: 8 }}
                          />{" "}
                          Loading materials...
                        </td>
                      </tr>
                    ) : materials.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#64748b",
                          }}
                        >
                          No learning materials found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      materials.map((m, i) => (
                        <tr key={m.id}>
                          <td>{(page - 1) * pageSize + i + 1}</td>
                          <td
                            style={{
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#1e3a8a",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <FaFileAlt style={{ color: "#94a3b8" }} />
                              {m.title}
                            </div>
                            {m.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  marginTop: 4,
                                  fontWeight: "normal",
                                }}
                              >
                                {m.description.length > 60
                                  ? m.description.substring(0, 60) + "..."
                                  : m.description}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {m.theme_name ? (
                              <span className="theme-badge">
                                {m.theme_name}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "left",
                              color: "#475569",
                              fontSize: 13,
                            }}
                          >
                            {m.training_plan_name || "-"}
                          </td>
                          <td style={{ fontSize: 13 }}>
                            {m.created_by_name || "System"}
                          </td>
                          <td style={{ fontSize: 13 }}>
                            {formatDate(m.created_at)}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "center",
                              }}
                            >
                              {m.file ? (
                                <button
                                  className="btnView"
                                  onClick={() => window.open(m.file, "_blank")}
                                  title="Download / View Material"
                                >
                                  <FaDownload style={{ marginRight: 5 }} /> View
                                </button>
                              ) : (
                                <span
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  No File
                                </span>
                              )}

                              {isSMMU && (
                                <button
                                  className="btnDeleteMat"
                                  onClick={() => handleDelete(m.id, m.title)}
                                  title="Remove Material"
                                >
                                  <FaTrash style={{ marginRight: 5 }} /> Remove
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {!loading && totalRecords > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ color: "#2b4e72", fontSize: 14 }}>
                    Showing page <strong>{page}</strong> of{" "}
                    <strong>{totalPages}</strong> ({totalRecords} total
                    materials)
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btnPage"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </button>
                    <button
                      className="btnPage"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <style>{`
        .content-area { display: flex; flex: 1; width: 100%; }
        .main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: #f8fafc; }
        
        .btnPrimary {
          background: #3d6ba6; color: #fff; border: none; border-radius: 6px;
          padding: 8px 16px; font-weight: 600; cursor: pointer; transition: all .25s ease;
        }
        .btnPrimary:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(61,107,166,0.3); }

        .btnView {
          background: #10b981; color: #fff; border: none; border-radius: 6px;
          padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s ease;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .btnView:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(16,185,129,0.2); }

        .btnPage {
          background: #e4ecf5; border: none; padding: 6px 12px; border-radius: 6px;
          cursor: pointer; color: #2b4e72; font-weight: 600; transition: all .2s ease;
        }
        .btnPage:hover:not(:disabled) { background: #a7c6ed; }
        .btnPage:disabled { opacity: 0.5; cursor: not-allowed; }

        .filter-input {
          border: 1px solid #3d6ba6; border-radius: 6px; padding: 8px 12px;
          background: #fff; outline: none; font-size: 14px; transition: all .2s ease;
        }
        .filter-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 2px rgba(61,107,166,0.2); }
        .filter-input:disabled { background: #f1f5f9; color: #94a3b8; border-color: #cbd5e1; cursor: not-allowed; }

        .fetch-btn {
          background: #3d6ba6; color: #fff; border: none; padding: 8px 20px;
          border-radius: 6px; font-weight: 600; cursor: pointer; transition: all .2s;
        }
        .fetch-btn:hover { background: #2b4e72; }

        .training-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .training-table thead { background: #3d6ba6; color: white; }
        .training-table th { padding: 12px 10px; text-align: center; font-weight: 600; }
        .training-table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; vertical-align: middle; }
        .training-table tbody tr { background: #fff; transition: background 0.2s; }
        .training-table tbody tr:hover { background: #f8fafc; }
        
        .theme-badge {
          background: #e0f2fe; color: #0369a1; padding: 4px 10px;
          border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid #bae6fd;
        }
          
        .btnDeleteMat {
          background: #fef2f2; color: #ef4444; border: 1px solid #fca5a5; border-radius: 6px;
          padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s ease;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .btnDeleteMat:hover { 
          background: #fecaca; color: #b91c1c; 
          transform: translateY(-2px); box-shadow: 0 4px 8px rgba(239,68,68,0.2); 
        }

        .mt-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
