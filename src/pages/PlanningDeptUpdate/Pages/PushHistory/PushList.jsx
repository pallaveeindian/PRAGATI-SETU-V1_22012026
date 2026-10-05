// src/pages/PlanningDeptUpdate/Pages/PushHistory/PushList.jsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../../../../api/axios";
import { usePDUContext } from "../../context/PDUContext";

import PDUCard from "../../components/PDUCard";
import PDUDataTable from "../../components/PDUDataTable";
import PushListFilter from "./PushListFilter";
import PushExport from "./PushExport";

export default function PushList() {
  const { isInitialized, loadAspirationalBlocksData, aspirationalBlocks } =
    usePDUContext();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    year: "",
    month: "",
    dist_code: "",
    block_code: "",
    prog_code: "",
  });

  // Ensure mapping context is loaded so we can map names dynamically
  useEffect(() => {
    if (isInitialized && aspirationalBlocks.length === 0) {
      loadAspirationalBlocksData();
    }
  }, [isInitialized, aspirationalBlocks.length, loadAspirationalBlocksData]);

  const fetchData = async (overrideFilters = null) => {
    setLoading(true);
    try {
      const targetFilters = overrideFilters || filters;
      // Remove empty params to keep URL clean
      const activeParams = Object.fromEntries(
        Object.entries(targetFilters).filter(([_, v]) => v !== ""),
      );

      const response = await api.get("/uppld/achievements/", {
        params: { ...activeParams, limit: 10000 },
      });
      setData(response.data?.results || response.data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    const emptyFilters = {
      year: "",
      month: "",
      dist_code: "",
      block_code: "",
      prog_code: "",
    };
    setFilters(emptyFilters);
    fetchData(emptyFilters);
  };

  // ==========================================
  // EXCEL-MATCHING MAPPING & PIVOT LOGIC
  // ==========================================
  const monthMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const getMappedNames = (apiBlockCode, apiDistCode) => {
    const block = aspirationalBlocks.find(
      (b) => String(b.api_block_code) === String(apiBlockCode),
    );
    const distFallback = aspirationalBlocks.find(
      (b) =>
        String(b.api_district_code) === String(apiDistCode) &&
        b.districtName &&
        b.districtName !== "Unknown",
    );

    return {
      blockName: block?.block_name || block?.blockNameEn || apiBlockCode || "—",
      districtName:
        block?.districtName && block.districtName !== "Unknown"
          ? block.districtName
          : distFallback?.districtName || apiDistCode || "Unknown",
    };
  };

  const formatTwoDecimals = (val, fallback = "0.00") => {
    if (val === null || val === undefined || val === "") return fallback;
    const num = Number(val);
    return Number.isNaN(num) ? fallback : num.toFixed(2);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return isoString;

      const datePart = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timePart = d
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();

      return `${datePart} ${timePart}`;
    } catch {
      return isoString;
    }
  };

  // Group 0511 and 0512 records by (Year + Month + Block) into unified rows
  const mappedData = useMemo(() => {
    const groupedMap = new Map();

    data.forEach((row) => {
      const bCode = row.block_code ?? row.Block_code ?? "";
      const dCode = row.dist_code ?? "";
      const yr = row.year ?? "";
      const mo = row.month ?? "";
      const key = `${yr}_${mo}_${bCode}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          year: yr,
          month: mo,
          dist_code: dCode,
          block_code: bCode,
          row0511: null,
          row0512: null,
          updated_at: row.updated_at || row.created_at || null,
        });
      }

      const group = groupedMap.get(key);
      const pCode = String(row.prog_code || "");

      if (pCode.endsWith("511")) {
        group.row0511 = row;
      } else if (pCode.endsWith("512")) {
        group.row0512 = row;
      }

      const rowTime = row.updated_at || row.created_at;
      if (
        rowTime &&
        (!group.updated_at || new Date(rowTime) > new Date(group.updated_at))
      ) {
        group.updated_at = rowTime;
      }
    });

    return Array.from(groupedMap.values()).map((group) => {
      const names = getMappedNames(group.block_code, group.dist_code);
      const r511 = group.row0511;
      const r512 = group.row0512;

      return {
        year: group.year || "—",
        monthName: monthMap[Number(group.month)] || group.month || "—",
        districtName: names.districtName,
        blockName: names.blockName,

        // 0511 (SHG HHs)
        hhs_num: r511
          ? formatTwoDecimals(r511.mon_ach_numerator ?? r511.mon_ach, "0.00")
          : "—",
        hhs_den: r511
          ? formatTwoDecimals(r511.mon_ach_denominator ?? 1, "1.00")
          : "—",
        hhs_ach: r511 ? formatTwoDecimals(r511.mon_ach, "0.00") : "—",

        // 0512 (Revolving Fund)
        rf_num: r512
          ? formatTwoDecimals(r512.mon_ach_numerator ?? 0, "0.00")
          : "—",
        rf_den: r512
          ? formatTwoDecimals(r512.mon_ach_denominator ?? 0, "0.00")
          : "—",
        rf_ach: r512 ? formatTwoDecimals(r512.mon_ach, "0.00") : "—",

        timestamp: formatTimestamp(group.updated_at),
        raw_updated_at: group.updated_at,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, aspirationalBlocks]);

  // ==========================================
  // TWO-TIER TABLE COLUMNS (MATCHING EXCEL)
  // ==========================================
  const columns = [
    {
      key: "districtName",
      label: "District",
      align: "center",
      width: "140px",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {row.districtName}
        </span>
      ),
    },
    {
      key: "blockName",
      label: "Block",
      align: "center",
      width: "140px",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#334155" }}>
          {row.blockName}
        </span>
      ),
    },
    {
      key: "monthName",
      label: "Month",
      align: "center",
      width: "110px",
      render: (row) => (
        <span style={{ color: "#475569", fontWeight: 600 }}>
          {row.monthName}
        </span>
      ),
    },
    {
      key: "year",
      label: "Financial Year",
      align: "center",
      width: "110px",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#1e293b" }}>{row.year}</span>
      ),
    },
    {
      key: "hhs_num",
      label: "Total number of elligible households (HHs) added to SHGs",
      subLabel: "Numerator",
      align: "center",
      width: "150px",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.hhs_num}</span>
      ),
    },
    {
      key: "hhs_den",
      label: "1",
      subLabel: "Denominator",
      align: "center",
      width: "110px",
      render: (row) => (
        <span style={{ fontWeight: 500, color: "#475569" }}>{row.hhs_den}</span>
      ),
    },
    {
      key: "hhs_ach",
      label: "5.3 Total number of elligible households (HHs) added to SHGs",
      subLabel: "Achievement",
      align: "center",
      width: "160px",
      render: (row) => (
        <strong style={{ color: "#0369a1", fontSize: "1rem" }}>
          {row.hhs_ach}
        </strong>
      ),
    },
    {
      key: "rf_num",
      label: "Total number of SHGs receiving revolving fund in the block",
      subLabel: "Numerator",
      align: "center",
      width: "150px",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.rf_num}</span>
      ),
    },
    {
      key: "rf_den",
      label: "Total number of SHGs in the block",
      subLabel: "Denominator",
      align: "center",
      width: "130px",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#475569" }}>{row.rf_den}</span>
      ),
    },
    {
      key: "rf_ach",
      label:
        "5.4 Percentage of SHGs that have received Revolving Fund against total SHGs in the block",
      subLabel: "Achievement",
      align: "center",
      width: "170px",
      render: (row) => (
        <strong style={{ color: "#10b981", fontSize: "1rem" }}>
          {row.rf_ach}
        </strong>
      ),
    },
    {
      key: "timestamp",
      label: "Timestamp",
      align: "center",
      width: "140px",
      render: (row) => (
        <span
          style={{
            color: "#334155",
            fontSize: "0.85rem",
            fontWeight: 500,
            whiteSpace: "normal",
            display: "inline-block",
            lineHeight: 1.35,
          }}
        >
          {row.timestamp}
        </span>
      ),
    },
  ];

  return (
    <div
      className="pdu-push-list-wrapper"
      style={{
        padding: "24px",
        maxWidth: "1600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Modern Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          padding: "28px 32px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🌐</span>
            <h1
              style={{
                margin: 0,
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              API Push History Ledger
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "#64748b",
              fontWeight: 500,
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Track, verify, and export all synchronization records securely
            pushed to the State Planning Department infrastructure.
          </p>
        </div>
        <div style={{ padding: "8px" }}>
          <PushExport filters={filters} />
        </div>
      </div>

      {/* Filters */}
      <PushListFilter
        filters={filters}
        setFilters={setFilters}
        onApply={() => fetchData()}
        onReset={handleReset}
        loading={loading}
      />

      {/* Main Data Table */}
      <PDUCard
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "24px",
              backgroundColor: "#3b82f6",
              borderRadius: "4px",
            }}
          ></div>
          <h3
            style={{
              margin: 0,
              color: "#1e293b",
              fontSize: "1.15rem",
              fontWeight: 700,
            }}
          >
            Transmission Ledger Records
          </h3>
        </div>

        <PDUDataTable
          columns={columns}
          data={mappedData}
          emptyMessage={
            loading
              ? "Establishing secure connection & fetching transmission records..."
              : "No push records found for the selected criteria."
          }
          exportFilename="Pragati_Setu_UPPLD_Push_History.xlsx"
        />
      </PDUCard>

      {/* UI Keyframes for smooth entrance */}
      <style>
        {`
          .pdu-push-list-wrapper {
            animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
