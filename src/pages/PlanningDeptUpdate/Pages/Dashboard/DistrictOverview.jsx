import React, { useState, useMemo } from "react";
import PDUCard from "../../components/PDUCard";
import PDUDataTable from "../../components/PDUDataTable";
import "./styles/DistrictOverview.css";

/**
 * DistrictOverview - Displays the Lokos data breakdown for all 75 UP Districts.
 *
 * @param {Object} districtsData - The raw districts object from the Lokos State API response.
 */
const DistrictOverview = ({ districtsData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'shgHighest', 'memberHighest'

  // Transform, Filter, and Sort the raw object into an array for the DataTable
  const tableData = useMemo(() => {
    if (!districtsData) return [];

    // 1. Convert Object to Array
    let dataArray = Object.values(districtsData).map((dist) => ({
      id: dist.lgdDistrict,
      lokosId: Object.keys(districtsData).find(
        (key) => districtsData[key] === dist,
      ),
      name: dist.districtName,
      blockCount: dist.districtCumulativeCounts?.blockCount || 0,
      panchayatCount: dist.districtCumulativeCounts?.panchayatCount || 0,
      shgCount: dist.districtCumulativeCounts?.shgCount || 0,
      memberCount: dist.districtCumulativeCounts?.memberCount || 0,
    }));

    // 2. Filter by Search Term
    if (searchTerm) {
      dataArray = dataArray.filter((dist) =>
        dist.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 3. Apply Sorting
    dataArray.sort((a, b) => {
      if (sortBy === "shgHighest") return b.shgCount - a.shgCount;
      if (sortBy === "memberHighest") return b.memberCount - a.memberCount;
      // Default: Sort by Name A-Z
      return a.name.localeCompare(b.name);
    });

    return dataArray;
  }, [districtsData, searchTerm, sortBy]);

  // Define the columns for the PDUDataTable
  const columns = [
    {
      key: "name",
      label: "District Name",
      align: "left",
    },
    {
      key: "blockCount",
      label: "Total Blocks",
      align: "center",
    },
    {
      key: "panchayatCount",
      label: "Gram Panchayats",
      align: "center",
      render: (row) =>
        new Intl.NumberFormat("en-IN").format(row.panchayatCount),
    },
    {
      key: "shgCount",
      label: "Total SHGs",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.shgCount),
    },
    {
      key: "memberCount",
      label: "Total Members (HHs)",
      align: "right",
      render: (row) => new Intl.NumberFormat("en-IN").format(row.memberCount),
    },
  ];

  // Create the toolbar (Search + Sort) to pass into the PDUCard header
  const cardHeader = (
    <div className="pdu-dist-overview-header">
      <h3 className="pdu-dist-overview-title">All Districts Progress</h3>

      <div className="pdu-dist-overview-controls">
        <input
          type="text"
          className="pdu-dist-search"
          placeholder="Search district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="pdu-dist-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort A-Z</option>
          <option value="shgHighest">Highest SHGs</option>
          <option value="memberHighest">Highest Members</option>
        </select>
      </div>
    </div>
  );

  return (
    <PDUCard className="pdu-dist-overview-card">
      {/* Inject our custom header with search/sort controls */}
      {cardHeader}

      {/* 
                Pass the data to our reusable table. 
                If the user sorts by highest SHG/Members, we turn on the top 3 highlight! 
            */}
      <PDUDataTable
        columns={columns}
        data={tableData}
        highlightTopThree={
          sortBy === "shgHighest" || sortBy === "memberHighest"
        }
        emptyMessage="No districts found matching your search."
      />
    </PDUCard>
  );
};

export default DistrictOverview;
