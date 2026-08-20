// src/pages/StateLoginPortal/TMSStateLoginDashboard/BatchProgressDashboard.jsx
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import * as XLSX from "xlsx";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { useNavigate } from "react-router-dom";

// Core Chart.js configuration modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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

export default function BatchProgressDashboard({ financialYear }) {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});
  const navigate = useNavigate();
  // --- UI & Filter States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");

  // SURGICAL ADDITION: Theme and Plan Filter States
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // SURGICAL ADDITION: Date Filters State
  const [exactDate, setExactDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Lookup States ---
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  // SURGICAL ADDITION: Theme and Plan Lookup States
  const [apiThemes, setApiThemes] = useState([]);
  const [apiPlans, setApiPlans] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Data States ---
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. BASE GEOSCOPE RESOLUTION (From TrainingBatchList)
  // ==========================================
  const getDefaultScopeParams = useCallback(() => {
    const geo = getGeoscope() || {};
    const blockId = geo.block_id || safeFirst(geo.blocks);
    const districtId = geo.district_id || safeFirst(geo.districts);

    if (role === "bmmu" && blockId) return { block_id: blockId };
    if (role === "dmmu" && districtId) return { district_id: districtId };
    // Add logic for training_partner / dtp if needed for state dashboard scope
    return {};
  }, [role]);

  // ==========================================
  // 2. FETCH INITIAL LOOKUPS
  // ==========================================
  useEffect(() => {
    const fetchInitialLookups = async () => {
      setLookupsLoading(true);
      try {
        const [dRes, tRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 5000 }),
          api.get("/tms/public/training-themes/", {
            params: { page_size: 100 },
          }), // SURGICAL ADDITION
        ]);

        setDistricts(
          Array.isArray(dRes?.data) ? dRes.data : dRes?.data?.results || [],
        );

        // SURGICAL ADDITION
        setApiThemes(tRes?.data?.results || tRes?.data || []);

        // Auto-lock DMMU District
        if (role === "dmmu") {
          const geo = getGeoscope() || {};
          const dmmuDistrictId = geo.district_id || safeFirst(geo.districts);
          if (dmmuDistrictId) {
            setSelectedDistrict(String(dmmuDistrictId));
          }
        }
      } catch (err) {
        console.error("Lookup load failed", err);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchInitialLookups();
  }, [role]);

  // Fetch Blocks when District changes
  useEffect(() => {
    if (role === "bmmu") return;
    if (!selectedDistrict) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocksByDistrict(selectedDistrict)
      .then((r) => setBlocks(r?.data?.results || []))
      .catch(() => setBlocks([]));
  }, [selectedDistrict, role]);

  // SURGICAL ADDITION: Fetch Plans conditionally based on theme
  useEffect(() => {
    if (!selectedTheme) {
      setApiPlans([]);
      return;
    }
    const fetchPlans = async () => {
      try {
        const res = await api.get("/tms/public/training-plans/", {
          params: { theme: selectedTheme, page_size: 500 },
        });
        setApiPlans(res?.data?.results || res?.data || []);
      } catch (err) {
        console.error("Error fetching dependent plans:", err);
      }
    };
    fetchPlans();
  }, [selectedTheme]);

  // ==========================================
  // 3. MAIN BATCH FETCH ENGINE
  // ==========================================
  const fetchBatches = useCallback(async () => {
    if (!user?.id || !financialYear) return;
    setLoading(true);

    try {
      const baseParams = getDefaultScopeParams();

      // Determine effective filters based on Role security
      let effectiveDistrict = selectedDistrict;
      let effectiveBlock = selectedBlock;

      if (role === "bmmu") {
        effectiveDistrict = "";
        effectiveBlock = ""; // Forced by baseParams
      } else if (role === "dmmu") {
        effectiveDistrict = ""; // Forced by baseParams
      }

      const finalParams = {
        ...baseParams,
        search,
        status: selectedStatus,
        financial_year: financialYear,
        district_id: effectiveDistrict,
        block_id: effectiveBlock,
        // SURGICAL ADDITION: Append Theme and Plan Filters
        theme_id: selectedTheme,
        training_plan_id: selectedPlan,
        // SURGICAL ADDITION: Append Date Filters
        exact_date: exactDate,
        start_date: startDate,
        end_date: endDate,
        page_size: 5000, // Fetch all for local dashboard metrics mapping
      };

      const cleanParams = Object.fromEntries(
        Object.entries(finalParams).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const qs = new URLSearchParams(cleanParams).toString();
      const resp = await api.get(`/tms/batches-list/?${qs}`);

      let items = resp?.data?.results || [];

      // Post-process: Hide DRAFT from everyone except DTP (as per your logic)
      if (role !== "dtp") {
        items = items.filter((b) => String(b.status).toUpperCase() !== "DRAFT");
      }

      setBatches(items);
      setPage(1);
    } catch (e) {
      console.error("Batch fetch failed", e);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [
    user?.id,
    financialYear,
    selectedDistrict,
    selectedBlock,
    selectedStatus,
    selectedTheme, // <-- SURGICAL UPDATE: Added theme dependency
    selectedPlan, // <-- SURGICAL UPDATE: Added plan dependency
    exactDate, // <-- SURGICAL UPDATE: Added exactDate
    startDate, // <-- SURGICAL UPDATE: Added startDate
    endDate, // <-- SURGICAL UPDATE: Added endDate
    search,
    role,
    getDefaultScopeParams,
  ]);

  // Re-fetch when major triggers change
  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // ==========================================
  // DISTRICT CHANGE HANDLER
  // ==========================================
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;

    setSelectedDistrict(districtId);
    setSelectedBlock("");
    setBlocks([]);
    setPage(1);
  };

  // ==========================================
  // 4. CHART AGGREGATIONS
  // ==========================================
  const chartConfigData = useMemo(() => {
    const countsMap = {
      PENDING: 0,
      ONGOING: 0,
      SCHEDULED: 0,
      REVIEW: 0,
      COMPLETED: 0,
      CLOSED: 0,
      REJECTED: 0,
    };

    batches.forEach((batch) => {
      const stat = String(batch.status).toUpperCase();
      if (countsMap[stat] !== undefined) {
        countsMap[stat] += 1;
      }
    });

    return {
      labels: Object.keys(countsMap),
      datasets: [
        {
          label: "Batch Count",
          data: Object.values(countsMap),
          backgroundColor: [
            "#e0f2fe", // BATCHING
            "#f1f5f9", // PENDING
            "#fef3c7", // ONGOING
            "#ede9fe", // SCHEDULED
            "#fae8ff", // REVIEW
            "#dcfce7", // COMPLETED
            "#cffafe", // CLOSED
            "#fee2e2", // REJECTED
          ],
          borderColor: [
            "#0369a1", // BATCHING
            "#475569", // PENDING
            "#b45309", // ONGOING
            "#6d28d9", // SCHEDULED
            "#6b21a8", // REVIEW
            "#166534", // COMPLETED
            "#155e75", // CLOSED
            "#991b1b", // REJECTED
          ],
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 35,
        },
      ],
    };
  }, [batches]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b", stepSize: 1 },
      },
    },
  };

  // ==========================================
  // 5. TABLE CONFIGURATION
  // ==========================================
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";

  const columns = [
    {
      header: "Batch Code",
      key: "code",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#2563eb" }}>{row.code}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`status-badge-node stage-${String(row.status).toLowerCase()}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Start Date",
      key: "start_date",
      render: (row) => formatDate(row.start_date),
    },
    {
      header: "End Date",
      key: "end_date",
      render: (row) => formatDate(row.end_date),
    },
    { header: "Level", key: "level" },
    { header: "Type", key: "batch_type" },
    {
      header: "Theme",
      key: "theme",
      render: (row) => row.training_plan?.theme?.theme_name || "-",
    },
    {
      header: "Training Plan",
      key: "plan",
      render: (row) => row.training_plan?.training_name || "-",
    },
    {
      header: "Partner",
      key: "partner",
      render: (row) => row.centre?.partner?.name || "-",
    },
    {
      header: "District",
      key: "district",
      render: (row) => row.district?.district_name_en || "-",
    },
    {
      header: "Block",
      key: "block",
      render: (row) => row.block?.block_name_en || "-",
    },
    {
      header: "Assigned Trainers",
      key: "trainers",
      sortable: false,
      render: (row) => {
        if (
          !Array.isArray(row.master_trainers) ||
          row.master_trainers.length === 0
        )
          return "-";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {row.master_trainers.map((t) => (
              <div key={t.id}>
                <strong>{t.full_name}</strong>
                <br />
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  {t.designation} ({t.mobile_no})
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Count",
      key: "pax_count",
      render: (row) => (
        <div className="num-col fw-bold">{row.pax_count || 0}</div>
      ),
    },
    {
      header: "History",
      key: "history",
      sortable: false,
      render: (row) => (
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate(`/tms/batches/${row.id}/history`)}
        >
          Batch History
        </button>
      ),
    },
  ];

  const handleExportExcel = () => {
    if (!batches || batches.length === 0) {
      alert("No batch data available to export.");
      return;
    }

    const exportData = batches.map((batch, index) => ({
      "S.No": index + 1,
      "Batch Code": batch.code || "-",
      Status: batch.status || "-",
      "Start Date": formatDate(batch.start_date),
      "End Date": formatDate(batch.end_date),
      Level: batch.level || "-",
      Type: batch.batch_type || "-",
      Theme: batch.training_plan?.theme?.theme_name || "-",
      "Training Plan": batch.training_plan?.training_name || "-",
      Partner: batch.centre?.partner?.name || "-",
      District: batch.district?.district_name_en || "-",
      Block: batch.block?.block_name_en || "-",
      "Assigned Trainers": Array.isArray(batch.master_trainers)
        ? batch.master_trainers
            .map(
              (trainer) =>
                `${trainer.full_name || "-"}${
                  trainer.designation ? ` (${trainer.designation})` : ""
                }${trainer.mobile_no ? ` - ${trainer.mobile_no}` : ""}`,
            )
            .join(", ")
        : "-",
      "Participant Count": batch.pax_count || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Pipeline");

    // Auto-size columns
    const columnWidths = Object.keys(exportData[0]).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => String(row[key] ?? "").length),
      );

      return {
        wch: Math.min(Math.max(maxLength + 2, 12), 40),
      };
    });

    worksheet["!cols"] = columnWidths;

    const fileName = `Batch_Pipeline_Registry_${financialYear || "Export"}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Batch Execution & Lifecycle Progress</h2>
        <p>
          Track live execution tracks, status lifecycle shifts, and overarching
          batch metrics.
        </p>
      </div>

      {/* --- FILTERS ROW --- */}
      <div className="filters-row">
        <div className="filter-group">
          <label>District Scope</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={role === "dmmu" || role === "bmmu" || lookupsLoading}
          >
            <option value="">-- All Districts --</option>
            {districts.map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Block Boundary</label>
          <select
            value={selectedBlock}
            onChange={(e) => {
              setSelectedBlock(e.target.value);
              setPage(1);
            }}
            disabled={!selectedDistrict || role === "bmmu"}
          >
            <option value="">-- All Blocks --</option>
            {blocks.map((b) => (
              <option key={b.block_id} value={b.block_id}>
                {b.block_name_en}
              </option>
            ))}
          </select>
        </div>

        {/* SURGICAL ADDITION: Theme Filter */}
        <div className="filter-group">
          <label>Training Theme</label>
          <select
            value={selectedTheme}
            onChange={(e) => {
              setSelectedTheme(e.target.value);
              setSelectedPlan(""); // Reset plan when theme changes
              setPage(1);
            }}
            disabled={lookupsLoading}
          >
            <option value="">-- All Themes --</option>
            {apiThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.theme_name}
              </option>
            ))}
          </select>
        </div>

        {/* SURGICAL ADDITION: Plan Filter */}
        <div className="filter-group">
          <label>Training Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => {
              setSelectedPlan(e.target.value);
              setPage(1);
            }}
            disabled={!selectedTheme}
          >
            <option value="">-- All Plans --</option>
            {apiPlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.training_name || p.title || p.plan_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Current Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">-- All Statuses --</option>
            <option value="PENDING">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
            <option value="ONGOING">Ongoing</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="REVIEW">Under Review</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* SURGICAL ADDITION: Date Filters */}
        <div className="filter-group">
          <label>Exact Date</label>
          <input
            type="date"
            value={exactDate}
            onChange={(e) => {
              setExactDate(e.target.value);
              setStartDate(""); // Clear range if exact date is used
              setEndDate("");
              setPage(1);
            }}
            disabled={lookupsLoading}
          />
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setExactDate(""); // Clear exact date if range is used
              setPage(1);
            }}
            disabled={lookupsLoading}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setExactDate("");
              setPage(1);
            }}
            disabled={lookupsLoading || !startDate}
          />
        </div>

        <div className="filter-group">
          <label>Search Batch Code</label>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. B-PAT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBatches()}
          />
        </div>

        <div
          className="filter-group"
          style={{
            justifyContent: "flex-end",
            paddingBottom: "2px",
            flex: "none",
          }}
        >
          <button className="search-btn" onClick={fetchBatches}>
            Search
          </button>
        </div>

        {/* SURGICAL UPDATE: Include new filters in condition */}
        {(selectedDistrict ||
          selectedBlock ||
          selectedStatus ||
          selectedTheme ||
          selectedPlan ||
          exactDate ||
          startDate ||
          endDate ||
          search) &&
          role !== "dmmu" &&
          role !== "bmmu" && (
            <div
              className="filter-group"
              style={{
                justifyContent: "flex-end",
                paddingBottom: "2px",
                flex: "none",
              }}
            >
              <button
                className="reset-btn"
                onClick={() => {
                  setSelectedDistrict("");
                  setSelectedBlock("");
                  setSelectedStatus("");
                  setSelectedTheme(""); // <-- SURGICAL ADDITION
                  setSelectedPlan(""); // <-- SURGICAL ADDITION
                  setExactDate(""); // <-- SURGICAL ADDITION
                  setStartDate(""); // <-- SURGICAL ADDITION
                  setEndDate(""); // <-- SURGICAL ADDITION
                  setSearch("");
                  // fetchBatches triggers on useEffect
                }}
              >
                Clear
              </button>
            </div>
          )}
      </div>

      {/* --- CHART SECTION --- */}
      <div className="chart-card">
        <h3>Volume Distribution by Workflow Tracking Phase</h3>
        <div className="chart-inner-container">
          {loading ? (
            <div className="empty-state">Loading Chart Data...</div>
          ) : batches.length > 0 ? (
            <Bar data={chartConfigData} options={chartOptions} />
          ) : (
            <div className="empty-state">
              No active batches match to compile chart plot coordinates.
            </div>
          )}
        </div>
      </div>

      {/* --- TABLE HEADER --- */}
      <div className="table-header-flex">
        <div className="table-heading-left">
          <h3>Batch Pipeline Registry</h3>
          <button
            type="button"
            className="export-excel-btn"
            onClick={handleExportExcel}
            disabled={loading || !batches.length}
            title="Export batch data to Excel"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* --- TABLE UI --- */}
      <TableUI
        data={batches}
        columns={columns}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
      />

      {/* --- PAGINATION --- */}
      {!loading && batches.length > 0 && (
        <TablePagination
          page={page}
          totalPages={Math.ceil(batches.length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={batches.length}
        />
      )}

      {/* --- STYLES --- */}
      <style>{`
        .analytics-white-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          animation: fadeIn 0.4s ease-in-out;
        }

        .report-header { margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; }
        .report-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #083A8B;
          margin: 0 0 8px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin: 0;
          letter-spacing: 0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .report-header p {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;          
        }
        .filters-row {
          display: flex; flex-wrap: wrap; gap: 20px; background: #08398A; padding: 20px;
          border-radius: 12px; margin-bottom: 24px;
        }

        .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 180px; }
        .filter-group label { font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; }
        .filter-group select, .search-input, .filter-group input[type="date"] {
          padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;
          font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s ease; background: #fff;
          font-family: inherit; box-sizing: border-box; min-height: 40px;
        }
        .filter-group select:focus, .search-input:focus, .filter-group input[type="date"]:focus { border-color: #0092E0; box-shadow: 0 0 0 3px rgba(0, 146, 224, 0.15); }
        .filter-group select:disabled, .filter-group input[type="date"]:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }

        .search-btn { background: #ffffff; color: #08398A; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; height: 44px; }
        .search-btn:hover { background: #16A34A; color: #fff; }        

        .reset-btn { background: #fff; color: #08398A; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; height: 44px; }
        .reset-btn:hover { background: #8d1212; color: #fff; }

        .chart-card { background: #ffffff; border: 3px solid #08398A; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
        .chart-card h3 { margin: 0 0 20px 0; color: #0f172a; font-size: 16px; }
        .chart-inner-container { height: 320px; width: 100%; display: flex; justify-content: center; }

        .table-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .table-header-flex h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }

        .num-col { text-align: center; }
        
        /* Custom Status Node Badges */
        .status-badge-node {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: 1px solid transparent;
            white-space: nowrap;
        }
        .stage-batching { background: #e0f2fe; color: #0369a1; border-color: #7dd3fc; }
        .stage-pending { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
        .stage-ongoing { background: #fef3c7; color: #b45309; border-color: #fde047; }
        .stage-review { background: #fae8ff; color: #6b21a8; border-color: #f0abfc; }
        .stage-completed { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
        .stage-rejected { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .stage-scheduled { background: #ede9fe; color: #6d28d9; border-color: #c4b5fd; }
        .stage-closed { background: #cffafe; color: #155e75; border-color: #67e8f9; }

        .empty-state { text-align: center; padding: 48px; color: #94a3b8; font-size: 15px; font-style: italic; width: 100%; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .table-heading-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .export-excel-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          height: 40px;
          padding: 0 16px;
          border: 1px solid #15803d;
          border-radius: 8px;
          background: #16a34a;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .export-excel-btn:hover:not(:disabled) {
          background: #15803d;
          border-color: #166534;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
        }

        .export-excel-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .export-excel-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .export-icon {
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }        
      `}</style>
    </div>
  );
}
