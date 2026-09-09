import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import { FaDownload } from "react-icons/fa";
import api, { LOOKUP_API } from "../../../api/axios";

import { FaUsers, FaCheck, FaDatabase, FaMinusCircle } from "react-icons/fa";

export default function BeneficiaryAttendanceRatioPage({ financialYear }) {
  // --- UI & Filter States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [ratioThreshold, setRatioThreshold] = useState("all"); // 'all', 'above_80', 'below_80'

  // --- Lookup States ---
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiBlocks, setApiBlocks] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Main Data State ---
  const [apiData, setApiData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. FETCH LOOKUPS (Districts & Blocks)
  // ==========================================
  useEffect(() => {
    const fetchDistricts = async () => {
      setLookupsLoading(true);
      try {
        const res = await LOOKUP_API.districts.list({ page_size: 5000 });
        setApiDistricts(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!selectedDistrict) {
      setApiBlocks([]);
      return;
    }
    const fetchBlocks = async () => {
      try {
        const res = await LOOKUP_API.blocksByDistrict(selectedDistrict, {
          params: { page_size: 5000 },
        });
        setApiBlocks(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching blocks:", err);
        setApiBlocks([]);
      }
    };
    fetchBlocks();
  }, [selectedDistrict]);

  // ==========================================
  // 2. FETCH MAIN ANALYTICS DATA
  // ==========================================
  const fetchReportData = useCallback(async () => {
    if (!financialYear) return;

    setDataLoading(true);
    setApiData([]);
    setPage(1);

    const queryParams = new URLSearchParams();
    queryParams.append("financial_year", financialYear);
    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedBlock) queryParams.append("block_id", selectedBlock);

    try {
      const res = await api.get(
        `/tms/reports/beneficiary-eligibility/?${queryParams.toString()}`,
      );
      if (res.data?.status === "success") {
        setApiData(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching beneficiary eligibility data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [financialYear, selectedDistrict, selectedBlock]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ==========================================
  // 3. THRESHOLD FILTERING
  // ==========================================
  const filteredData = useMemo(() => {
    return apiData.filter((item) => {
      if (ratioThreshold === "above_80") return item.attendance_ratio >= 80.0;
      if (ratioThreshold === "below_80") return item.attendance_ratio < 80.0;
      return true;
    });
  }, [apiData, ratioThreshold]);

  // ==========================================
  // 4. TOTAL METRICS AGGREGATION
  // ==========================================
  const overallAggregates = useMemo(() => {
    if (filteredData.length === 0)
      return {
        totalPax: 0,
        totalSuccess: 0,
        totalUnsuccess: 0,
        avgRatio: "0.0",
      };

    const totals = filteredData.reduce(
      (acc, curr) => {
        acc.totalPax += curr.total_participants;
        acc.totalSuccess += curr.successful_participants;
        acc.totalUnsuccess += curr.unsuccessful_participants;
        return acc;
      },
      { totalPax: 0, totalSuccess: 0, totalUnsuccess: 0 },
    );

    const avgRatio =
      totals.totalPax > 0
        ? ((totals.totalSuccess / totals.totalPax) * 100).toFixed(1)
        : "0.0";

    return { ...totals, avgRatio };
  }, [filteredData]);

  // ==========================================
  // 5. TABLE COLUMNS SETUP
  // ==========================================
  const columns = [
    {
      header: "District",
      key: "district__district_name_en",
      render: (row) => (
        <span style={{ fontWeight: 800, color: "#0f172a" }}>
          DMMU_{row.district_name || "UNKNOWN"}
        </span>
      ),
    },
    {
      header: "Block Area",
      key: "block__block_name_en",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#475569" }}>
          {row.block_name || "-"}
        </span>
      ),
    },
    {
      header: "Total Participants",
      key: "total_participants",
      render: (row) => (
        <div className="num-col" style={{ color: "#0f172a", fontWeight: 700 }}>
          {row.total_participants}
        </div>
      ),
    },
    {
      header: "Successful Participants",
      key: "successful_participants",
      render: (row) => (
        <div className="num-col text-emerald-600 font-bold">
          {row.successful_participants}
        </div>
      ),
    },
    {
      header: "Unsuccessful Participants",
      key: "unsuccessful_participants",
      render: (row) => (
        <div className="num-col text-rose-600 font-bold">
          {row.unsuccessful_participants}
        </div>
      ),
    },
    {
      header: "Net Attendance Ratio",
      key: "attendance_ratio",
      render: (row) => {
        const isSubStandard = row.attendance_ratio < 80.0;
        return (
          <div className="num-col">
            <span
              className={`ratio-pill ${isSubStandard ? "pill-danger" : "pill-success"}`}
            >
              {row.attendance_ratio}%
            </span>
          </div>
        );
      },
    },
  ];

  // ==========================================
  // 6. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    let csvContent =
      "S.No.,District,Block Area,Total Participants,Successful Participants,Unsuccessful Participants,Net Attendance Ratio\n";

    filteredData.forEach((row, i) => {
      csvContent += `"${i + 1}","DMMU_${row.district__district_name_en || "-"}","${row.block__block_name_en || "-"}","${row.total_participants}","${row.successful_participants}","${row.unsuccessful_participants}","${row.attendance_ratio}%"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Beneficiary_Eligibility_${financialYear}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 7. PAGINATION
  // ==========================================
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Beneficiary Eligibility & Attendance Ratio</h2>
        <p>
          Track local attendance trends, evaluate compliance baselines, and
          isolate blocks dropping below the required 80% mark.
        </p>
      </div>

      {/* --- OVERALL STATS CARDS --- */}
      <div className="metrics-grid">
        <div className="metric-card gradient-blue">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Participants</span>
            <span className="metric-value">
              {overallAggregates.totalPax.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="metric-card gradient-green">
          <div className="metric-icon">
            <FaCheck />
          </div>
          <div className="metric-info">
            <span className="metric-label">Successful Participants</span>
            <span className="metric-value">
              {overallAggregates.totalSuccess.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="metric-card gradient-red">
          <div className="metric-icon">
            <FaDatabase />
          </div>
          <div className="metric-info">
            <span className="metric-label">Unsuccessful Participants</span>
            <span className="metric-value">
              {overallAggregates.totalUnsuccess.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="metric-card gradient-orange">
          <div className="metric-icon">
            <FaMinusCircle />
          </div>
          <div className="metric-info">
            <span className="metric-label">Average Net Ratio</span>
            <span className="metric-value">{overallAggregates.avgRatio}%</span>
          </div>
        </div>
      </div>

      {/* --- FILTERS ROW --- */}
      <div className="filters-row">
        <div className="filter-group">
          <label>District Scope</label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedBlock("");
              setPage(1);
            }}
            disabled={lookupsLoading}
          >
            <option value="">-- All Districts --</option>
            {apiDistricts.map((d) => (
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
            disabled={!selectedDistrict}
          >
            <option value="">-- All Blocks --</option>
            {apiBlocks.map((b) => (
              <option key={b.block_id} value={b.block_id}>
                {b.block_name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group broad-conditional-select">
          <label>Attendance Threshold Matrix</label>
          <select
            value={ratioThreshold}
            onChange={(e) => {
              setRatioThreshold(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Show All Attendance Values</option>
            <option value="above_80">Satisfactory Levels (80% & Above)</option>
            <option value="below_80">Attention Required (Below 80%)</option>
          </select>
        </div>

        {(selectedDistrict || selectedBlock || ratioThreshold !== "all") && (
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
                setRatioThreshold("all");
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- TABLE HEADER & EXPORT --- */}
      <div className="table-header-flex">
        <h3>Attendance Ratio Comparison</h3>
        <button
          className="export-btn"
          onClick={exportToCSV}
          disabled={filteredData.length === 0 || dataLoading}
        >
          <FaDownload /> Export Excel
        </button>
      </div>

      {/* --- REUSABLE TABLE UI --- */}
      <TableUI
        data={filteredData}
        columns={columns}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={dataLoading}
      />

      {/* --- PAGINATION --- */}
      {!dataLoading && filteredData.length > 0 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={filteredData.length}
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

        .report-header {
          margin-bottom: 24px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 16px;
        }

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

        /* --- Metric Cards --- */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          padding: 20px;
          border-radius: 14px;
          color: white;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .metric-card:hover { transform: translateY(-4px); }
        .metric-icon { font-size: 30px; background: rgba(255,255,255,0.2); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .metric-info { display: flex; flex-direction: column; }
        .metric-label { font-size: 12px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 26px; font-weight: 800; line-height: 1.2; }

        .gradient-blue { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-green { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-red { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-orange { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }

        /* --- Filters --- */
        .filters-row {
          display: flex; flex-wrap: wrap; gap: 20px; background: #08398A; padding: 20px;
          border-radius: 12px; margin-bottom: 24px;
        }

        .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 200px; }
        .broad-conditional-select { min-width: 280px; }
        .filter-group label { font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-group select {
          padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;
          font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s ease;
        }
        .filter-group select:focus { border-color: #0092E0; box-shadow: 0 0 0 3px rgba(0, 146, 224, 0.15); }
        .filter-group select:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }

        .reset-btn { background: #f1f5f9; color: #ef4444; border: 1px solid #fecaca; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; height: 44px; }
        .reset-btn:hover { background: #ef4444; color: #fff; }

        .table-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .table-header-flex h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }
        .export-btn { display: flex; align-items: center; gap: 8px; background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3); }
        .export-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4); }
        .export-btn:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }

        /* --- Dynamic Cell Styles --- */
        .num-col { text-align: center; }
        .text-emerald-600 { color: #059669; }
        .text-rose-600 { color: #dc2626; }
        .font-bold { font-weight: 700; }

        .ratio-pill {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        
        .pill-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .pill-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
