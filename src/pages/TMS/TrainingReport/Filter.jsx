import React, { useEffect, useState } from "react";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { saveAs } from "file-saver";

/* ================= GEO SCOPE HELPERS ================= */
const GEOSCOPE_KEY = "ps_user_geoscope";
function getGeoscope() {
  try {
    const raw = localStorage.getItem(GEOSCOPE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function safeFirst(arr) {
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

export default function TrainingReportManager({ user }) {
  const role = getCanonicalRole(user || {});

  // ================= 1. FILTER STATE =================
  const [filters, setFilters] = useState({
    training_type: "",
    mandal_id: "",
    district_category_id: "",
    district_id: "",
    block_id: "",
    panchayat_id: "",
    village_id: "",
    aspirational_only: false,

    training_partner_id: "",
    theme_id: "",
    training_plan_id: "",

    status: "", // Request Status
    level: "", // STATE, DISTRICT, BLOCK
    batch_type: "", // SBC, etc

    gender: "",
    designation: "",
  });

  // ================= 2. LOOKUPS STATE =================
  const [lookups, setLookups] = useState({
    districts: [],
    blocks: [],
    panchayats: [],
    villages: [],
    mandals: [],
    categories: [],
    themes: [],
    plans: [],
    partners: [],
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const extractData = (res) => {
    if (!res) return [];
    const data = res.data?.results || res.data || [];
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    (async () => {
      try {
        const [distRes, themeRes, partnerRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 500 }),
          TMS_API.trainingThemes.list({ page_size: 200 }),
          TMS_API.trainingPartners.list({ page_size: 200 }),
        ]);

        setLookups((prev) => ({
          ...prev,
          districts: extractData(distRes),
          themes: extractData(themeRes),
          partners: extractData(partnerRes),
        }));
      } catch (err) {
        console.error("Initial load error", err);
      }
    })();
  }, []);

  /* ================= AUTO PREFILL (DISTRICT + BLOCK) ================= */
  useEffect(() => {
    const geo = getGeoscope() || {};

    const districtId = geo.district_id || safeFirst(geo.districts);

    if (!["dmmu", "smmu", "bmmu"].includes(role)) return;

    setFilters((prev) => {
      if (prev.district_id) return prev;

      return {
        ...prev,
        district_id: districtId || "",
        aspirational_only: false,
      };
    });
  }, [role]);

  useEffect(() => {
    if (!filters.district_id) {
      setLookups((p) => ({ ...p, blocks: [], panchayats: [], villages: [] }));
      return;
    }

    // Fetch Blocks
    LOOKUP_API.blocks
      .list({ district_id: filters.district_id, page_size: 500 })
      .then((r) => {
        let data = extractData(r);
        if (filters.aspirational_only) {
          data = data.filter((b) => Number(b.is_aspirational) === 1);
        }
        setLookups((p) => ({ ...p, blocks: data }));
      });

    // Fetch Mandals if SMMU
    if (role === "smmu") {
      LOOKUP_API.mandals
        .list({ district: filters.district_id, page_size: 500 })
        .then((r) => setLookups((p) => ({ ...p, mandals: extractData(r) })));
    }
  }, [filters.district_id, filters.aspirational_only, role]);

  useEffect(() => {
    const geo = getGeoscope() || {};

    const geoBlockId = geo.block_id || safeFirst(geo.blocks);

    if (!geoBlockId) return;
    if (!lookups.blocks.length) return;

    setFilters((prev) => {
      // already set hai to touch mat karo
      if (prev.block_id) return prev;

      const exists = lookups.blocks.some(
        (b) => String(b.block_id) === String(geoBlockId),
      );

      if (!exists) return prev;

      return {
        ...prev,
        block_id: geoBlockId,
      };
    });
  }, [lookups.blocks]);

  // Panchayats
  useEffect(() => {
    if (!filters.block_id || filters.training_type !== "BENEFICIARY") {
      setLookups((p) => ({ ...p, panchayats: [] }));
      return;
    }
    LOOKUP_API.panchayatsByBlock(filters.block_id).then((r) =>
      setLookups((p) => ({ ...p, panchayats: extractData(r) })),
    );
  }, [filters.block_id, filters.training_type]);

  // Training Plans
  useEffect(() => {
    if (!filters.theme_id) {
      setLookups((p) => ({ ...p, plans: [] }));
      return;
    }
    TMS_API.trainingPlans
      .list({ theme: filters.theme_id })
      .then((r) => setLookups((p) => ({ ...p, plans: extractData(r) })));
  }, [filters.theme_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFilters((prev) => {
      let updated = { ...prev, [name]: val };

      const isLockedRole = ["dmmu", "smmu", "bmmu"].includes(role);

      if (name === "district_id" && !isLockedRole) {
        updated.block_id = "";
      }

      if (name === "theme_id") {
        updated.training_plan_id = "";
      }

      return updated;
    });
  };

  // ================= 6. RENDER =================

  const fetchReport = async (isExport = false) => {
    // 1. STOPS SEARCH IF MANDATORY TYPE IS MISSING
    if (!filters.training_type) {
      alert("Please select a Participant Type (Beneficiary or Trainer) first.");
      return;
    }

    if (isExport) setExporting(true);
    else setLoading(true);

    try {
      // 2. CLEAN PARAMS
      let params = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, v]) => v !== "" && v !== null && v !== false,
        ),
      );

      // 3. BACKEND MAPPING
      if (params.status) {
        params.batch_status = params.status;
        delete params.status;
      }

      // 4. ATTENDANCE LOGIC ALERT (Frontend Workaround)
      // If user picks PENDING, they likely won't get data because backend checks 'attended=True'
      if (params.batch_status === "PENDING") {
        console.warn(
          "Backend only returns participants with marked attendance. Pending batches may return empty results.",
        );
      }
      if (isExport) {
        params.export = "excel";
        const res = await api.get("/tms/cmp-training-report/", {
          params,
          responseType: "blob",
        });
        saveAs(
          res.data,
          `Report_${filters.training_type}_${new Date().toISOString().split("T")[0]}.xlsx`,
        );
      } else {
        const res = await api.get("/tms/cmp-training-report/", { params });

        // 5. DATA FALLBACK
        const data = Array.isArray(res.data) ? res.data : [];
        setReportData(data);

        if (data.length === 0) {
          alert("No records found");
        }
      }
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
      setExporting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#3d6ba6", marginBottom: "20px" }}>
        TMS Reporting Section
      </h3>

      <div className="filter-container-custom">
        {/* ===== ROW 1 ===== */}
        <div className="filter-row top-row">
          {/* Participant Type */}
          <div className="filter-box">
            <label>Type</label>
            <select
              name="training_type"
              value={filters.training_type}
              onChange={handleChange}
              className="filter-input-styled"
            >
              <option value="">Select</option>
              <option value="BENEFICIARY">Beneficiary</option>
              <option value="TRAINER">Trainer</option>
            </select>
          </div>

          {/* District */}
          {role !== "bmmu" && (
            <div className="filter-box">
              <label>District</label>
              <select
                name="district_id"
                value={filters.district_id}
                onChange={handleChange}
                disabled={role === "dmmu"}
                className="filter-input-styled"
              >
                <option value="">All</option>
                {lookups.districts?.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.district_name_en}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Aspirational */}
          {role !== "bmmu" && (
            <div className="filter-box">
              <label>Aspirational</label>
              <label className="aspirational-label">
                <input
                  type="checkbox"
                  name="aspirational_only"
                  checked={filters.aspirational_only}
                  onChange={handleChange}
                />
                Yes
              </label>
            </div>
          )}

          {/* Block */}
          {role !== "bmmu" && (
            <div className="filter-box">
              <label>Block</label>
              <select
                name="block_id"
                value={filters.block_id}
                onChange={handleChange}
                disabled={!filters.district_id}
                className="filter-input-styled"
              >
                <option value="">All</option>
                {lookups.blocks?.map((b) => (
                  <option key={b.block_id} value={b.block_id}>
                    {b.block_name_en}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ===== ROW 2 ===== */}
        <div className="filter-row bottom-row">
          {/* Partner */}
          <div className="filter-box">
            <label>Partner</label>
            <select
              name="training_partner_id"
              value={filters.training_partner_id}
              onChange={handleChange}
              className="filter-input-styled"
            >
              <option value="">All</option>
              {lookups.partners?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div className="filter-box">
            <label>Theme</label>
            <select
              name="theme_id"
              value={filters.theme_id}
              onChange={handleChange}
              className="filter-input-styled"
            >
              <option value="">Select</option>
              {lookups.themes?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.theme_name}
                </option>
              ))}
            </select>
          </div>

          {/* Plan */}
          <div className="filter-box">
            <label>TRaining Plan</label>
            <select
              name="training_plan_id"
              value={filters.training_plan_id}
              onChange={handleChange}
              disabled={!filters.theme_id}
              className="filter-input-styled"
            >
              <option value="">All</option>
              {lookups.plans?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.training_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-box">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="filter-input-styled"
            >
              <option value="">All</option>
              {["PENDING", "ONGOING", "REVIEW", "COMPLETED", "REJECTED"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Level */}
          <div className="filter-box">
            <label>Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleChange}
              className="filter-input-styled"
            >
              <option value="">All</option>
              <option value="STATE">State</option>
              <option value="DISTRICT">District</option>
              <option value="BLOCK">Block</option>
            </select>
          </div>
        </div>

        <div className="action-row">
          <button
            className="btn-view"
            onClick={() => fetchReport(false)}
            disabled={loading || exporting}
          >
            {loading ? "Searching..." : "View Report"}
          </button>
          <button
            className="btn-excel"
            onClick={() => fetchReport(true)}
            disabled={loading || exporting}
          >
            {exporting ? "Downloading..." : "Export Excel"}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              {reportData.length > 0 ? (
                Object.keys(reportData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))
              ) : (
                <th style={{ textAlign: "center" }}>Report Results</th>
              )}
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val ?? "-"}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="20"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  {loading ? (
                    "Fetching data..."
                  ) : (
                    <div>
                      <p>No data found for the selected filters.</p>
                      <p style={{ fontSize: "11px", color: "#999" }}>
                        Note: This report only includes participants where{" "}
                        <b>Attendance</b> has been marked in the system.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .filter-container-custom {
            background: #e4ecf5;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #3d6ba6;
            margin-bottom: 20px;
        }
       .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
       .filter-box {
    flex: 1 1 180px;
    display: flex;
    flex-direction: column;
}
        .filter-box label {
            font-size: 11px;
            font-weight: 700;
            color: #2b4e72;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .filter-input-styled {
            padding: 8px;
            border: 1px solid #3d6ba6;
            border-radius: 6px;
            font-size: 13px;
            background: #fff;
            outline: none;
        }
        .aspirational-label {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 10px;
            background: #fff;
            border: 1px solid #3d6ba6;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            height: 35px;
        }
        .action-row {
            margin-top: 20px;
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .btn-view { background: #3d6ba6; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-excel { background: #1b5e20; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .table-container { margin-top: 25px; overflow-x: auto; border: 1px solid #ccc; border-radius: 8px; background: white; min-height: 100px;}
        .report-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .report-table th { background: #3d6ba6; color: white; padding: 12px; text-align: left; white-space: nowrap; }
        .report-table td { padding: 10px 12px; border-bottom: 1px solid #eee; white-space: nowrap; }
        .report-table tr:hover { background: #f1f4f8; }
        /* TOP ROW - 4 ITEMS */
.top-row .filter-box {
    flex: 1 1 22%;
}

/* BOTTOM ROW - AUTO FIT */
.bottom-row .filter-box {
    flex: 1 1 18%;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
    .filter-box {
        flex: 1 1 100%;
    }
}
      `}</style>
    </div>
  );
}
