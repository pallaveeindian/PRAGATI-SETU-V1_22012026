// src\pages\PlanningDeptUpdate\Pages\PushHistory\PushList.jsx
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
  }, [isInitialized]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Remove empty params to keep URL clean
      const activeParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );

      const response = await api.get("/uppld/achievements/", {
        params: activeParams,
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
  }, []);

  const handleReset = () => {
    setFilters({
      year: "",
      month: "",
      dist_code: "",
      block_code: "",
      prog_code: "",
    });
    setTimeout(fetchData, 0); // Fetch after state clear
  };

  // ==========================================
  // EXCEL-MATCHING MAPPING LOGIC
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

  const getMappedNames = (apiBlockCode) => {
    const block = aspirationalBlocks.find(
      (b) => String(b.api_block_code) === String(apiBlockCode),
    );
    return {
      blockName: block?.block_name || apiBlockCode,
      districtName: block?.districtName || "Unknown",
    };
  };

  const mappedData = useMemo(() => {
    return data.map((row) => {
      const names = getMappedNames(row.block_code);
      const is0511 = String(row.prog_code).endsWith("511");
      const progName = is0511
        ? "Total Households added to SHGs"
        : "SHGs receiving Revolving Fund";

      return {
        ...row,
        monthName: monthMap[row.month] || row.month,
        districtName: names.districtName,
        blockName: names.blockName,
        progName: progName,
        indicatorBadgeColor: is0511 ? "#e0f2fe" : "#fef3c7",
        indicatorTextColor: is0511 ? "#0369a1" : "#b45309",
      };
    });
  }, [data, aspirationalBlocks]);

  // ==========================================
  // BEAUTIFIED TABLE COLUMNS
  // ==========================================
  const columns = [
    {
      key: "year",
      label: "Year",
      align: "center",
      width: "100px",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#1e293b" }}>{row.year}</span>
      ),
    },
    {
      key: "monthName",
      label: "Month",
      align: "left",
      width: "120px",
      render: (row) => (
        <span style={{ color: "#475569", fontWeight: 600 }}>
          {row.monthName}
        </span>
      ),
    },
    {
      key: "districtName",
      label: "District",
      align: "left",
      width: "160px",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {row.districtName}
        </span>
      ),
    },
    {
      key: "blockName",
      label: "Block Name",
      align: "left",
      width: "160px",
      render: (row) => (
        <span style={{ fontWeight: 500, color: "#334155" }}>
          {row.blockName}
        </span>
      ),
    },
    {
      key: "prog_code",
      label: "Indicator / Program",
      align: "left",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              backgroundColor: row.indicatorBadgeColor,
              color: row.indicatorTextColor,
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 800,
              width: "fit-content",
              letterSpacing: "0.5px",
            }}
          >
            CODE: {String(row.prog_code).padStart(4, "0")}
          </span>
          <span
            style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}
          >
            {row.progName}
          </span>
        </div>
      ),
    },
    {
      key: "mon_ach",
      label: "Achievement",
      align: "right",
      width: "140px",
      render: (row) => (
        <strong style={{ color: "#10b981", fontSize: "1.15rem" }}>
          {new Intl.NumberFormat("en-IN").format(row.mon_ach)}
        </strong>
      ),
    },
    {
      key: "updated_at",
      label: "Pushed Timestamp",
      align: "right",
      width: "180px",
      render: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#64748b",
            fontSize: "0.85rem",
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {new Date(row.updated_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span>
            {new Date(row.updated_at).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
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
        onApply={fetchData}
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
          exportFilename="Data_Not_Used_Please_Use_Top_Button"
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
