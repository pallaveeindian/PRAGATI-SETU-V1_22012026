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
  // LOCATION HELPERS - API RESPONSE STRUCTURE
  // ==========================================

  const getDistrictId = (centre) =>
    centre?.district_full?.district_id ??
    centre?.district_id ??
    centre?.district ??
    "";

  const getDistrictName = (centre) =>
    centre?.district_full?.district_name_en ??
    centre?.district_name_en ??
    centre?.district_name ??
    "";

  const getBlockId = (centre) =>
    centre?.block_full?.block_id ?? centre?.block_id ?? centre?.block ?? "";

  const getBlockName = (centre) =>
    centre?.block_full?.block_name_en ??
    centre?.block_name_en ??
    centre?.block_name ??
    "";

  const getPanchayatId = (centre) =>
    centre?.panchayat_full?.panchayat_id ??
    centre?.panchayat_id ??
    centre?.panchayat ??
    "";

  const getPanchayatName = (centre) =>
    centre?.panchayat_full?.panchayat_name_en ??
    centre?.panchayat_name_en ??
    centre?.panchayat_name ??
    "";

  const getVillageId = (centre) =>
    centre?.village_full?.village_id ??
    centre?.village_id ??
    centre?.village ??
    "";

  const getVillageName = (centre) =>
    centre?.village_full?.village_name_english ??
    centre?.village_name_english ??
    centre?.village_name ??
    "";

  // ==========================================
  // 2. DYNAMIC DROPDOWN EXTRACTION
  // ==========================================

  const availableDistricts = useMemo(() => {
    const map = new Map();

    centres.forEach((centre) => {
      const id = getDistrictId(centre);
      const name = getDistrictName(centre);

      if (id && name && !map.has(String(id))) {
        map.set(String(id), name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [centres]);

  const availableBlocks = useMemo(() => {
    if (!filterDistrict) return [];

    const map = new Map();

    centres.forEach((centre) => {
      const districtId = String(getDistrictId(centre));

      if (districtId === String(filterDistrict)) {
        const id = getBlockId(centre);
        const name = getBlockName(centre);

        if (id && name && !map.has(String(id))) {
          map.set(String(id), name);
        }
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [centres, filterDistrict]);

  const availablePanchayats = useMemo(() => {
    if (!filterBlock) return [];

    const map = new Map();

    centres.forEach((centre) => {
      const blockId = String(getBlockId(centre));

      if (blockId === String(filterBlock)) {
        const id = getPanchayatId(centre);
        const name = getPanchayatName(centre);

        if (id && name && !map.has(String(id))) {
          map.set(String(id), name);
        }
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [centres, filterBlock]);

  const availableVillages = useMemo(() => {
    if (!filterPanchayat) return [];

    const map = new Map();

    centres.forEach((centre) => {
      const panchayatId = String(getPanchayatId(centre));

      if (panchayatId === String(filterPanchayat)) {
        const id = getVillageId(centre);
        const name = getVillageName(centre);

        if (id && name && !map.has(String(id))) {
          map.set(String(id), name);
        }
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
      const cDist = String(getDistrictId(c));
      const cBlock = String(getBlockId(c));
      const cPanch = String(getPanchayatId(c));
      const cVill = String(getVillageId(c));

      if (filterDistrict && cDist !== String(filterDistrict)) return false;
      if (filterBlock && cBlock !== String(filterBlock)) return false;
      if (filterPanchayat && cPanch !== String(filterPanchayat)) return false;
      if (filterVillage && cVill !== String(filterVillage)) return false;

      // Text Search
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();

        const searchableText = [
          c.venue_name,
          c.venue_address,
          getDistrictName(c),
          getBlockName(c),
          getPanchayatName(c),
          getVillageName(c),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(lowerSearch)) {
          return false;
        }
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
                  getDistrictName(centre),
                  getBlockName(centre),
                  getPanchayatName(centre),
                  getVillageName(centre),
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
