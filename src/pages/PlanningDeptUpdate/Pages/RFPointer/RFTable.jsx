// src\pages\PlanningDeptUpdate\Pages\RFPointer\RFTable.jsx
import React, { useState, useMemo } from "react";
import PDUCard from "../../components/PDUCard";
import PDUDataTable from "../../components/PDUDataTable";
import { usePDUContext } from "../../context/PDUContext";

export default function RFTable() {
  const { aspirationalBlocks, isLoading } = usePDUContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  const uniqueDistricts = useMemo(() => {
    if (!aspirationalBlocks) return [];
    const dists = [...new Set(aspirationalBlocks.map((b) => b.districtName))];
    return dists.filter((d) => d !== "Unknown").sort();
  }, [aspirationalBlocks]);

  const tableData = useMemo(() => {
    if (!aspirationalBlocks || aspirationalBlocks.length === 0) return [];
    let filteredData = [...aspirationalBlocks];

    if (selectedDistrict !== "ALL") {
      filteredData = filteredData.filter(
        (b) => b.districtName === selectedDistrict,
      );
    }

    if (searchTerm) {
      filteredData = filteredData.filter(
        (block) =>
          block.block_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.api_block_code?.toString().includes(searchTerm),
      );
    }

    // Sort by RF Receiving Count descending
    filteredData.sort(
      (a, b) => (b.rfReceivedCount || 0) - (a.rfReceivedCount || 0),
    );

    return filteredData;
  }, [aspirationalBlocks, searchTerm, selectedDistrict]);

  const columns = [
    {
      key: "districtName",
      label: "District",
      align: "left",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#4b5563" }}>
          {row.districtName}
        </span>
      ),
    },
    { key: "block_name", label: "Block Name", align: "left" },
    {
      key: "shgCount",
      label: "Total SHGs",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.shgCount || 0),
    },
    {
      key: "rfReceivedCount",
      label: "SHGs Received RF (0512)",
      align: "right",
      render: (row) => (
        <strong style={{ color: "#10b981", fontSize: "1.05rem" }}>
          {new Intl.NumberFormat("en-IN").format(row.rfReceivedCount || 0)}
        </strong>
      ),
    },
    {
      key: "rfPercentage",
      label: "RF %",
      align: "right",
      render: (row) => `${row.rfPercentage || 0}%`,
    },
    {
      key: "rfTotalAmount",
      label: "Total RF Disbursed (₹)",
      align: "right",
      render: (row) =>
        `₹ ${new Intl.NumberFormat("en-IN").format(row.rfTotalAmount || 0)}`,
    },
  ];

  const headerControls = (
    <div
      className="pdu-shg-table-header"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h3
        className="pdu-shg-table-title"
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        108 Aspirational Blocks - RF Status
      </h3>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="ALL">All Districts</option>
          {uniqueDistricts.map((dist, idx) => (
            <option key={idx} value={dist}>
              {dist}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search block name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            outline: "none",
            minWidth: "200px",
          }}
        />
      </div>
    </div>
  );

  return (
    <PDUCard className="pdu-shg-table-card" style={{ overflow: "hidden" }}>
      {headerControls}
      <PDUDataTable
        columns={columns}
        data={tableData}
        highlightTopThree={true}
        exportFilename="Pragati_Setu_RF_Report.xlsx"
        emptyMessage={
          isLoading ? "Fetching live data from Lokos..." : "No blocks found."
        }
      />
    </PDUCard>
  );
}
