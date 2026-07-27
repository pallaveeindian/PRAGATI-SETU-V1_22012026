// src/pages/TMS/StaffBatchCreator/CentreSelectionTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import { TMS_API } from "../../../api/axios";

const CentreSelectionTable = ({
  partnerId,
  selectedCentre,
  onSelectCentre,
}) => {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterBlock, setFilterBlock] = useState("");
  const [filterPanchayat, setFilterPanchayat] = useState("");
  const [filterVillage, setFilterVillage] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Keep it compact since there are multiple tables

  // ==========================================
  // 1. DATA FETCHING
  // ==========================================
  useEffect(() => {
    if (!partnerId) return;

    const fetchCentres = async () => {
      setLoading(true);
      try {
        const response = await TMS_API.trainingPartnerCentres.list({
          partner: partnerId,
          page_size: 500, // Fetch all applicable centres for this TP
        });
        const data = response?.data?.results || response?.data || [];
        setCentres(data);
      } catch (error) {
        console.error("Failed to load Training Centres:", error);
        setCentres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCentres();
  }, [partnerId]);

  // ==========================================
  // 2. DYNAMIC DROPDOWN EXTRACTION
  // ==========================================
  // Extract unique locations from the actual centre data to populate dropdowns locally

  const availableDistricts = useMemo(() => {
    const map = new Map();
    centres.forEach((c) => {
      const dId = c.district?.district_id || c.district_id || c.district;
      const dName = c.district?.district_name_en || c.district_name || dId;
      if (dId && !map.has(String(dId))) map.set(String(dId), dName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [centres]);

  const availableBlocks = useMemo(() => {
    if (!filterDistrict) return [];
    const map = new Map();
    centres.forEach((c) => {
      const dId = String(
        c.district?.district_id || c.district_id || c.district,
      );
      if (dId === filterDistrict) {
        const bId = c.block?.block_id || c.block_id || c.block;
        const bName = c.block?.block_name_en || c.block_name || bId;
        if (bId && !map.has(String(bId))) map.set(String(bId), bName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [centres, filterDistrict]);

  const availablePanchayats = useMemo(() => {
    if (!filterBlock) return [];
    const map = new Map();
    centres.forEach((c) => {
      const bId = String(c.block?.block_id || c.block_id || c.block);
      if (bId === filterBlock) {
        const pId = c.panchayat?.panchayat_id || c.panchayat_id || c.panchayat;
        const pName = c.panchayat?.panchayat_name_en || c.panchayat_name || pId;
        if (pId && !map.has(String(pId))) map.set(String(pId), pName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [centres, filterBlock]);

  const availableVillages = useMemo(() => {
    if (!filterPanchayat) return [];
    const map = new Map();
    centres.forEach((c) => {
      const pId = String(
        c.panchayat?.panchayat_id || c.panchayat_id || c.panchayat,
      );
      if (pId === filterPanchayat) {
        const vId = c.village?.village_id || c.village_id || c.village;
        const vName = c.village?.village_name_english || c.village_name || vId;
        if (vId && !map.has(String(vId))) map.set(String(vId), vName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [centres, filterPanchayat]);

  // Handle Cascading Resets
  const handleDistrictChange = (e) => {
    setFilterDistrict(e.target.value);
    setFilterBlock("");
    setFilterPanchayat("");
    setFilterVillage("");
    setCurrentPage(1);
  };

  const handleBlockChange = (e) => {
    setFilterBlock(e.target.value);
    setFilterPanchayat("");
    setFilterVillage("");
    setCurrentPage(1);
  };

  const handlePanchayatChange = (e) => {
    setFilterPanchayat(e.target.value);
    setFilterVillage("");
    setCurrentPage(1);
  };

  // ==========================================
  // 3. FILTERING & PAGINATION
  // ==========================================
  const filteredCentres = useMemo(() => {
    return centres.filter((c) => {
      // Location Filters
      const cDist = String(
        c.district?.district_id || c.district_id || c.district || "",
      );
      const cBlock = String(c.block?.block_id || c.block_id || c.block || "");
      const cPanch = String(
        c.panchayat?.panchayat_id || c.panchayat_id || c.panchayat || "",
      );
      const cVill = String(
        c.village?.village_id || c.village_id || c.village || "",
      );

      if (filterDistrict && cDist !== filterDistrict) return false;
      if (filterBlock && cBlock !== filterBlock) return false;
      if (filterPanchayat && cPanch !== filterPanchayat) return false;
      if (filterVillage && cVill !== filterVillage) return false;

      // Text Search
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const vName = (c.venue_name || "").toLowerCase();
        const vAddr = (c.venue_address || "").toLowerCase();
        if (!vName.includes(lowerSearch) && !vAddr.includes(lowerSearch))
          return false;
      }

      return true;
    });
  }, [
    centres,
    filterDistrict,
    filterBlock,
    filterPanchayat,
    filterVillage,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredCentres.length / rowsPerPage);

  const paginatedCentres = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCentres.slice(start, end);
  }, [filteredCentres, currentPage]);

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header & Global Search */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
          Training Centre Infrastructure
        </h4>
        <input
          type="text"
          placeholder="Search Venue Name or Address..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.searchInput}
        />
      </div>

      {/* Cascading Location Filters */}
      <div style={styles.filterGrid}>
        <select
          value={filterDistrict}
          onChange={handleDistrictChange}
          style={styles.select}
        >
          <option value="">All Districts</option>
          {availableDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={filterBlock}
          onChange={handleBlockChange}
          disabled={!filterDistrict}
          style={styles.select}
        >
          <option value="">All Blocks</option>
          {availableBlocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={filterPanchayat}
          onChange={handlePanchayatChange}
          disabled={!filterBlock}
          style={styles.select}
        >
          <option value="">All Panchayats</option>
          {availablePanchayats.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filterVillage}
          onChange={(e) => {
            setFilterVillage(e.target.value);
            setCurrentPage(1);
          }}
          disabled={!filterPanchayat}
          style={styles.select}
        >
          <option value="">All Villages</option>
          {availableVillages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table Area */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
            <tr>
              <th style={{ ...styles.th, width: "50px", textAlign: "center" }}>
                Select
              </th>
              <th style={styles.th}>Venue Name & Address</th>
              <th style={styles.th}>Location Details</th>
              <th style={styles.th}>Max Capacity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#64748b",
                  }}
                >
                  Loading Training Centres...
                </td>
              </tr>
            ) : paginatedCentres.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#64748b",
                  }}
                >
                  {centres.length === 0
                    ? "No training centres registered for your partner ID."
                    : "No centres match your current filters."}
                </td>
              </tr>
            ) : (
              paginatedCentres.map((centre) => {
                const isSelected = selectedCentre?.id === centre.id;

                const locParts = [
                  centre.district?.district_name_en ||
                    centre.district_name ||
                    "",
                  centre.block?.block_name_en || centre.block_name || "",
                ]
                  .filter(Boolean)
                  .join(" / ");

                return (
                  <tr
                    key={centre.id}
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                      borderBottom: "1px solid #f1f5f9",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => onSelectCentre(centre)}
                  >
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <input
                        type="radio"
                        name="centre_selection"
                        checked={isSelected}
                        onChange={() => onSelectCentre(centre)}
                        style={{ cursor: "pointer", transform: "scale(1.2)" }}
                      />
                    </td>
                    <td style={styles.td}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#0f172a",
                          marginBottom: "4px",
                        }}
                      >
                        {centre.venue_name || "-"}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>
                        {centre.venue_address || "No address provided"}
                      </div>
                    </td>
                    <td style={styles.td}>{locParts || "-"}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "600",
                        color: "#2563eb",
                      }}
                    >
                      {centre.training_hall_capacity
                        ? `${centre.training_hall_capacity} Pax`
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Showing {paginatedCentres.length} of {filteredCentres.length}{" "}
            centres
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={styles.pageBtn(currentPage === 1)}
            >
              Prev
            </button>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                padding: "4px 8px",
              }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={styles.pageBtn(currentPage === totalPages)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  searchInput: {
    padding: "8px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "13px",
    width: "260px",
    outline: "none",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
  },
  select: {
    padding: "8px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#334155",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px 16px",
    color: "#334155",
    verticalAlign: "top",
  },
  pageBtn: (disabled) => ({
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: "600",
    color: disabled ? "#94a3b8" : "#3b82f6",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};

export default CentreSelectionTable;
