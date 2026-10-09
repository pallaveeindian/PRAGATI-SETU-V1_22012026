// src\pages\AdminPages\TmsPortal\CenterDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import api, { TMS_API } from "../../../api/axios";
import CenterView from "./CenterView";
import { AuthContext } from "../../../contexts/AuthContext";

import EditCenter from "./EditCenter";

const CenterDetail = () => {
  const { authReady, isAuthenticated } = useContext(AuthContext) || {};
  const [groupedCenters, setGroupedCenters] = useState({});
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [editingCenterId, setEditingCenterId] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem("tms-editing-center-id") || null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [districtSearch, setDistrictSearch] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const savedPage = Number(
      window.sessionStorage.getItem("tms-centre-list-page"),
    );
    return Number.isInteger(savedPage) && savedPage > 0 ? savedPage : 1;
  });
  const itemsPerPage = 15;

  const fetchCenterDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/tms/training-partner-centres/");
      const results = response?.data?.results || response?.data || [];

      // Data ko District ke hisaab se group karna
      const grouped = results.reduce((acc, center) => {
        const districtName = center.district_full?.district_name_en || "N/A";
        if (!acc[districtName]) {
          acc[districtName] = [];
        }
        acc[districtName].push(center);
        return acc;
      }, {});

      setGroupedCenters(grouped);
    } catch (err) {
      console.error("Error fetching center details:", err);
      setError(
        err?.response?.status === 401
          ? new Error("Your session has expired. Please log in again.")
          : err,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady || !isAuthenticated) return;
    fetchCenterDetails();
  }, [authReady, isAuthenticated]);

  useEffect(() => {
    if (editingCenterId) {
      window.sessionStorage.setItem(
        "tms-editing-center-id",
        String(editingCenterId),
      );
    } else {
      window.sessionStorage.removeItem("tms-editing-center-id");
    }
  }, [editingCenterId]);

  useEffect(() => {
    window.sessionStorage.setItem("tms-centre-list-page", String(currentPage));
  }, [currentPage]);

  const toggleDetails = (districtName) => {
    setExpandedDistrict((current) =>
      current === districtName ? null : districtName,
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        Loading Center Details... ⏳
      </div>
    );
  }

  const districtNames = Object.keys(groupedCenters);
  const normalizedSearch = districtSearch.trim().toLowerCase();
  const centerSearchResults = districtNames.flatMap((district) =>
    groupedCenters[district]
      .filter((center) =>
        [center.venue_name, center.venue_address, center.centre_type].some(
          (value) =>
            String(value || "")
              .toLowerCase()
              .includes(normalizedSearch),
        ),
      )
      .map((center) => ({ ...center, districtName: district })),
  );
  const isCenterSearch =
    Boolean(normalizedSearch) &&
    !districtNames.some((district) =>
      district.toLowerCase().includes(normalizedSearch),
    );
  const filteredDistrictNames = districtNames.filter(
    (district) =>
      district.toLowerCase().includes(normalizedSearch) ||
      groupedCenters[district].some((center) =>
        [center.venue_name, center.venue_address, center.centre_type].some(
          (value) =>
            String(value || "")
              .toLowerCase()
              .includes(normalizedSearch),
        ),
      ),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDistrictNames.length / itemsPerPage),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDistricts = filteredDistrictNames.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setExpandedDistrict(null);
    }
  };

  const handleView = (center) => {
    setSelectedCenter(center);
  };

  const handleEdit = (center) => {
    setEditingCenterId(center.id);
  };

  const handleExportExcel = () => {
    const exportRows = isCenterSearch
      ? centerSearchResults.map(({ districtName, ...center }) => ({
          districtName,
          center,
        }))
      : filteredDistrictNames.flatMap((district) =>
          groupedCenters[district].map((center) => ({
            districtName: district,
            center,
          })),
        );

    if (exportRows.length === 0) {
      alert("No center data available to export.");
      return;
    }

    const escapeCell = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = exportRows.map(({ districtName, center }) => [
      districtName,
      center.venue_name || "N/A",
      center.venue_address || "N/A",
      center.training_hall_capacity || "N/A",
      center.centre_type || "N/A",
    ]);
    const headers = ["District", "Center Name", "Address", "Capacity", "Type"];
    const csv = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Center_Details.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (center) => {
    if (
      !window.confirm(`Are you sure you want to delete "${center.venue_name}"?`)
    )
      return;

    try {
      await TMS_API.trainingPartnerCentres.destroy(center.id);
      setGroupedCenters((current) => {
        const updated = { ...current };
        const district = center.district_full?.district_name_en || "N/A";
        updated[district] = (updated[district] || []).filter(
          (item) => item.id !== center.id,
        );
        if (updated[district].length === 0) delete updated[district];
        return updated;
      });
      alert("Centre deleted successfully.");
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Failed to delete centre. Please try again.",
      );
    }
  };

  if (editingCenterId) {
    return (
      <EditCenter
        centreId={editingCenterId}
        onClose={() => setEditingCenterId(null)}
      />
    );
  }

  return (
    <div
      className="table-card center-details-page"
      style={{
        padding: "0 20px",
        margin: "0 auto",
        width: "100%",
        maxWidth: "none",
      }}
    >
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #fecaca",
          }}
        >
          Failed to load center details. Please check console.
        </div>
      )}

      <div className="center-details-toolbar">
        <div>
          <div className="center-details-eyebrow">Center Directory</div>
          <div className="center-details-count">
            {filteredDistrictNames.length} districts found
          </div>
        </div>
        <div className="center-details-title">Center Management Dashboard</div>
        <div className="center-details-actions">
          <label className="center-search-label" htmlFor="district-search">
            Search District / Center
          </label>
          <input
            id="district-search"
            type="search"
            value={districtSearch}
            onChange={(event) => {
              setDistrictSearch(event.target.value);
              setCurrentPage(1);
              setExpandedDistrict(null);
            }}
            placeholder="District or center name"
          />
          <button
            type="button"
            className="center-export-button"
            onClick={handleExportExcel}
          >
            Export to Excel
          </button>
        </div>
      </div>

      {isCenterSearch ? (
        <div
          className="table-responsive center-search-results-table"
          style={{
            marginTop: "20px",
            border: "2px solid #2f629e",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <table
            className="tms-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #2f629e" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Sr. No</th>
                <th style={{ padding: "12px", textAlign: "left" }}>
                  Center Name
                </th>
                <th style={{ padding: "12px", textAlign: "left" }}>District</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
                <th style={{ padding: "12px", textAlign: "center" }}>
                  Capacity
                </th>
                <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {centerSearchResults.length > 0 ? (
                centerSearchResults.map((center, index) => (
                  <tr
                    key={center.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "12px" }}>{index + 1}</td>
                    <td style={{ padding: "12px" }}>
                      <strong>{center.venue_name || "N/A"}</strong>
                    </td>
                    <td style={{ padding: "12px" }}>{center.districtName}</td>
                    <td style={{ padding: "12px" }}>
                      {center.venue_address || "N/A"}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {center.training_hall_capacity || "N/A"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {center.centre_type || "N/A"}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <button
                          type="button"
                          title="View centre"
                          onClick={() => handleView(center)}
                          style={{
                            padding: "6px 9px",
                            border: "1px solid #2f629e",
                            borderRadius: "4px",
                            background: "#fff",
                            color: "#2f629e",
                            cursor: "pointer",
                          }}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          title="Edit centre"
                          onClick={() => handleEdit(center)}
                          style={{
                            padding: "6px 9px",
                            border: "1px solid #2f629e",
                            borderRadius: "4px",
                            background: "#2f629e",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          title="Delete centre"
                          onClick={() => handleDelete(center)}
                          style={{
                            padding: "6px 9px",
                            border: "1px solid #dc2626",
                            borderRadius: "4px",
                            background: "#fff",
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No center found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="table-responsive"
          style={{
            marginTop: "20px",
            border: "2px solid #2f629e",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <table
            className="tms-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #2f629e" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Sr. No</th>
                <th style={{ padding: "12px", textAlign: "left" }}>District</th>
                <th style={{ padding: "12px", textAlign: "center" }}>
                  Total Centers
                </th>
                <th style={{ padding: "12px", textAlign: "center" }}>
                  Center Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDistricts.length > 0 ? (
                currentDistricts.map((district, index) => (
                  <React.Fragment key={district}>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "12px" }}>
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <strong>{district}</strong>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            background: "#e2e8f0",
                            padding: "2px 12px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {groupedCenters[district].length}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          className="export-btn"
                          style={{
                            padding: "6px 12px",
                            background:
                              expandedDistrict === district
                                ? "#dc2626"
                                : "#2f629e",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleDetails(district)}
                        >
                          {expandedDistrict === district
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Sub Table for Centers Details */}
                    {expandedDistrict === district && (
                      <tr
                        style={{
                          background: "#f8fafc",
                          borderBottom: "2px solid #2f629e",
                        }}
                      >
                        <td colSpan="4" style={{ padding: "20px" }}>
                          <h4
                            style={{ margin: "0 0 10px 0", color: "#2f629e" }}
                          >
                            {" "}
                            Centers in {district}
                          </h4>

                          <div
                            style={{
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <table
                              className="tms-table"
                              style={{
                                width: "100%",
                                background: "#fff",
                                borderCollapse: "collapse",
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background: "#e2e8f0",
                                    borderBottom: "1px solid #cbd5e1",
                                  }}
                                >
                                  <th
                                    style={{
                                      padding: "10px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Center Name
                                  </th>
                                  <th
                                    style={{
                                      padding: "10px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Address
                                  </th>
                                  <th
                                    style={{
                                      padding: "10px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Capacity
                                  </th>
                                  <th
                                    style={{
                                      padding: "10px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Type
                                  </th>
                                  <th
                                    style={{
                                      padding: "10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {groupedCenters[district].map(
                                  (center, cIdx) => (
                                    <tr
                                      key={center.id}
                                      style={{
                                        borderBottom:
                                          cIdx !==
                                          groupedCenters[district].length - 1
                                            ? "1px solid #e2e8f0"
                                            : "none",
                                      }}
                                    >
                                      <td style={{ padding: "10px" }}>
                                        {center.venue_name}
                                      </td>
                                      <td style={{ padding: "10px" }}>
                                        {center.venue_address}
                                      </td>
                                      <td style={{ padding: "10px" }}>
                                        {center.training_hall_capacity || "N/A"}
                                      </td>
                                      <td style={{ padding: "10px" }}>
                                        {center.centre_type || "N/A"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "10px",
                                          textAlign: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "6px",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          <button
                                            type="button"
                                            title="View centre"
                                            aria-label={`View ${center.venue_name}`}
                                            onClick={() => handleView(center)}
                                            style={{
                                              padding: "6px 9px",
                                              border: "1px solid #2f629e",
                                              borderRadius: "4px",
                                              background: "#fff",
                                              color: "#2f629e",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <FaEye />
                                          </button>
                                          <button
                                            type="button"
                                            title="Edit centre"
                                            aria-label={`Edit ${center.venue_name}`}
                                            onClick={() => handleEdit(center)}
                                            style={{
                                              padding: "6px 9px",
                                              border: "1px solid #2f629e",
                                              borderRadius: "4px",
                                              background: "#2f629e",
                                              color: "#fff",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <FaEdit />
                                          </button>
                                          <button
                                            type="button"
                                            title="Delete centre"
                                            aria-label={`Delete ${center.venue_name}`}
                                            onClick={() => handleDelete(center)}
                                            style={{
                                              padding: "6px 9px",
                                              border: "1px solid #dc2626",
                                              borderRadius: "4px",
                                              background: "#fff",
                                              color: "#dc2626",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No center details available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS UI */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "10px 0",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "14px" }}>
            Showing {filteredDistrictNames.length ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, filteredDistrictNames.length)} of{" "}
            {filteredDistrictNames.length} Districts
          </span>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "6px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                background: currentPage === 1 ? "#f1f5f9" : "#fff",
                color: currentPage === 1 ? "#94a3b8" : "#334155",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ◀ Previous
            </button>

            <span
              style={{ fontSize: "14px", fontWeight: "600", padding: "0 8px" }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                background: currentPage === totalPages ? "#f1f5f9" : "#fff",
                color: currentPage === totalPages ? "#94a3b8" : "#334155",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next ▶
            </button>
          </div>
        </div>
      )}

      {selectedCenter && (
        <CenterView
          center={selectedCenter}
          onClose={() => setSelectedCenter(null)}
        />
      )}
      <style>{`
                .center-details-page {
                    box-sizing: border-box;
                }
                .center-details-toolbar {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 18px;
                    padding: 18px 20px;
                    border: 1px solid #d7e3f2;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f8fbff, #eef5fc);
                    box-shadow: 0 4px 14px rgba(32, 76, 125, 0.08);
                }
                .center-details-eyebrow {
                    color: #2f629e;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }
                .center-details-title {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #234f82;
                    font-size: 20px;
                    font-weight: 800;
                    line-height: 1.2;
                    white-space: nowrap;
                }
                .center-details-count {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 14px;
                }
                .center-details-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .center-search-label {
                    color: #2f629e;
                    font-size: 13px;
                    font-weight: 700;
                }
                .center-details-actions input {
                    width: 220px;
                    min-height: 38px;
                    box-sizing: border-box;
                    padding: 8px 11px;
                    border: 1px solid #a7c6ed;
                    border-radius: 6px;
                    outline: none;
                    color: #1e3a5f;
                    background: #fff;
                }
                .center-details-actions input:focus {
                    border-color: #2f629e;
                    box-shadow: 0 0 0 3px rgba(47, 98, 158, .12);
                }
                .center-export-button {
                    min-height: 38px;
                    padding: 8px 15px;
                    border: 0;
                    border-radius: 6px;
                    background: #10a875;
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                }
                .center-export-button:hover {
                    background: #07865d;
                }
                .center-details-page .table-responsive {
                    width: 100%;
                    overflow-x: auto;
                }
                .center-details-page .tms-table th {
                    background: #edf4fb;
                    color: #244c78;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: .03em;
                }
                .center-details-page .tms-table tbody tr:hover {
                    background: #f7fbff;
                }
                @media (max-width: 720px) {
                    .center-details-page {
                        padding: 0 10px !important;
                    }
                    .center-details-toolbar {
                        align-items: stretch;
                        flex-direction: column;
                    }
                    .center-details-title {
                        position: static;
                        transform: none;
                        align-self: center;
                        order: -1;
                    }
                    .center-details-actions {
                        justify-content: flex-start;
                    }
                    .center-details-actions input {
                        flex: 1 1 180px;
                    }
                }
            `}</style>
    </div>
  );
};

export default CenterDetail;
