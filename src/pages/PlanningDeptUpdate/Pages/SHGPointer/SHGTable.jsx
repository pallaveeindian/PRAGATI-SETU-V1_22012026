// src/pages/PlanningDeptUpdate/Pages/SHGPointer/SHGTable.jsx
import React, { useState, useMemo } from "react";
import PDUCard from "../../components/PDUCard";
import PDUDataTable from "../../components/PDUDataTable";
import { usePDUContext } from "../../context/PDUContext";
import "./styles/SHGTable.css";

/**
 * SHGTable - Renders the data table specifically for Pointer 1 (Indicator 0511).
 * Focuses on Total Eligible Households (HHs) added to SHGs (memberCount).
 */
export default function SHGTable() {
  const { aspirationalBlocks, isLoading } = usePDUContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  // Memoized formatting, filtering, and sorting of the 108 blocks
  // 1. Extract a unique, sorted list of District Names from the 108 blocks for the Dropdown
  const uniqueDistricts = useMemo(() => {
    if (!aspirationalBlocks) return [];
    const dists = [...new Set(aspirationalBlocks.map((b) => b.districtName))];
    return dists.filter((d) => d !== "Unknown").sort();
  }, [aspirationalBlocks]);

  // 2. Memoized formatting, filtering, and sorting of the 108 blocks
  const tableData = useMemo(() => {
    if (!aspirationalBlocks || aspirationalBlocks.length === 0) return [];
    let filteredData = [...aspirationalBlocks];

    // Filter by Dropdown District
    if (selectedDistrict !== "ALL") {
      filteredData = filteredData.filter(
        (b) => b.districtName === selectedDistrict,
      );
    }

    // Filter by Text Search (Block name or API code)
    if (searchTerm) {
      filteredData = filteredData.filter(
        (block) =>
          block.block_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.api_block_code?.toString().includes(searchTerm),
      );
    }

    // Sort by memberCount (Households) descending to create a Leaderboard
    filteredData.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));

    return filteredData;
  }, [aspirationalBlocks, searchTerm, selectedDistrict]);

  // Define columns tailored for Indicator 0511 with all detailed counts
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
    {
      key: "block_name",
      label: "Block Name",
      align: "left",
    },
    {
      key: "voCount",
      label: "VOs",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.voCount || 0),
    },
    {
      key: "clfCount",
      label: "CLFs",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.clfCount || 0),
    },
    {
      key: "crpsCount",
      label: "CRPs",
      align: "right",
      render: (row) =>
        new Intl.NumberFormat("en-IN").format(row.crpsCount || 0),
    },
    {
      key: "shgCount",
      label: "Total SHGs",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.shgCount || 0),
    },
    {
      key: "memberCount",
      label: "Eligible HouseHolds",
      align: "right",
      render: (row) => (
        <strong style={{ color: "#2563eb", fontSize: "1.05rem" }}>
          {new Intl.NumberFormat("en-IN").format(row.memberCount || 0)}
        </strong>
      ),
    },
    {
      key: "potentialDidiCount",
      label: "Potential Didis",
      align: "right",
      render: (row) =>
        new Intl.NumberFormat("en-IN").format(row.potentialDidiCount || 0),
    },
    {
      key: "aajeevikaRegisterCount",
      label: "Aajeevika",
      align: "right",
      render: (row) =>
        new Intl.NumberFormat("en-IN").format(row.aajeevikaRegisterCount || 0),
    },
  ];

  // Custom Header with Search Bar and District Filter Dropdown
  const headerControls = (
    <div
      className="pdu-shg-table-header"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3
        className="pdu-shg-table-title"
        style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}
      >
        108 Aspirational Blocks Performance
      </h3>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* District Filter Dropdown */}
        <select
          className="pdu-shg-search"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          <option value="ALL">All Districts</option>
          {uniqueDistricts.map((dist, idx) => (
            <option key={idx} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        {/* Text Search */}
        <input
          type="text"
          className="pdu-shg-search"
          placeholder="Search block name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <PDUCard className="pdu-shg-table-card">
      {headerControls}
      <PDUDataTable
        columns={columns}
        data={tableData}
        highlightTopThree={true} // Awards 🥇🥈🥉 to the top 3 blocks
        emptyMessage={
          isLoading
            ? "Fetching live data from Lokos..."
            : "No blocks found matching your search."
        }
      />
    </PDUCard>
  );
}
