// src/pages/LDMS/Meetings Map/MeetComponents/ldms_meet_table.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LDMS_API } from "../../../../api/axios";
import {
  FaEye,
  FaEyeSlash,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";

// Helper to format "YYYY-MM-DD,YYYY-MM-DD" into "YYYY-MM-DD to YYYY-MM-DD"
const formatNotifDateRange = (dateStr) => {
  if (!dateStr) return "N/A";
  const parts = dateStr.split(",");
  if (parts.length === 2) return `${parts[0]} to ${parts[1]}`;
  return dateStr;
};

// Helper to format "YYYY-MM" into "MonthName YYYY" (e.g., "May 2024")
const formatMonthName = (yyyyMmStr) => {
  if (!yyyyMmStr) return "";
  const parts = yyyyMmStr.split("-");
  if (parts.length !== 2) return yyyyMmStr; // Fallback if format is unexpected

  const date = new Date(parts[0], parseInt(parts[1]) - 1);
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
};

export default function MeetTable({ filters }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [detailsData, setDetailsData] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10; // Adjust if your DRF page_size is different

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Fetch List Data
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage, // Added for DRF Pagination
          meeting_month: filters.meetingMonth || undefined,
          notif_date: filters.notifDate || undefined,
          district: filters.districtId || undefined,
        };
        const res = await LDMS_API.DLCCMeetList(params);

        setData(res?.data?.results || res?.data || []);
        // Safely extract total count from DRF Paginated response
        setTotalCount(
          res?.data?.count || (Array.isArray(res?.data) ? res.data.length : 0),
        );
      } catch (error) {
        console.error("Failed to fetch meetings list", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [filters, currentPage]); // Added currentPage to dependency array

  // Fetch Detail Data on row expand
  const toggleRow = async (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
      return;
    }

    setExpandedRowId(id);

    // If we already have the details cached, don't refetch
    if (detailsData[id]) return;

    setDetailsLoading(true);
    try {
      const res = await LDMS_API.DLCCMeetDetail(id);
      setDetailsData((prev) => ({ ...prev, [id]: res?.data?.meetings || [] }));
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="nic-table-container">
      {loading ? (
        <div className="nic-loading-state">
          <FaSpinner className="nic-spinner" /> Loading Data...
        </div>
      ) : data.length === 0 ? (
        <div className="nic-empty-state">
          No meeting records found for the selected filters.
        </div>
      ) : (
        <>
          <table className="nic-data-table">
            <thead>
              <tr>
                <th width="5%">S.No</th>
                <th width="20%">Notice Period</th>
                <th width="20%">Meeting Month</th>
                <th width="20%">Scheduled Meetings</th>
                <th width="20%">Reference ID</th>
                <th width="15%">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <React.Fragment key={row.id}>
                  {/* Master Row */}
                  <tr
                    className={`master-row ${expandedRowId === row.id ? "active-row" : ""}`}
                  >
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      <span className="nic-date-range">
                        {formatNotifDateRange(row.notif_date)}
                      </span>
                    </td>
                    <td>
                      <strong>{formatMonthName(row.meeting_month)}</strong>
                    </td>
                    <td>
                      <span className="nic-badge">{row.no_of_meetings}</span>
                    </td>
                    <td>
                      <small>{row.TH_urid}</small>
                    </td>
                    <td>
                      <button
                        className="nic-action-btn"
                        onClick={() => toggleRow(row.id)}
                      >
                        {expandedRowId === row.id ? (
                          <>
                            <FaEyeSlash /> Hide Info
                          </>
                        ) : (
                          <>
                            <FaEye /> View Info
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Details Expanded Row */}
                  {expandedRowId === row.id && (
                    <tr className="detail-row">
                      <td colSpan="6" className="detail-cell">
                        <div className="nic-detail-panel">
                          <h4 className="detail-panel-title">
                            Specific Meeting Schedules
                          </h4>
                          {detailsLoading && !detailsData[row.id] ? (
                            <div className="detail-loading">
                              <FaSpinner className="nic-spinner" /> Fetching
                              schedules...
                            </div>
                          ) : (
                            <table className="nic-sub-table">
                              <thead>
                                <tr>
                                  <th>Meeting No.</th>
                                  <th>Meeting Date</th>
                                  <th>MoM Document</th>
                                  <th>Upload Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsData[row.id]?.map((meet, idx) => (
                                  <tr key={meet.id}>
                                    <td>Meeting {idx + 1}</td>
                                    <td>
                                      {meet.meeting_date || "Not Scheduled Yet"}
                                    </td>
                                    <td>
                                      {meet.mom ? (
                                        <a
                                          href={meet.mom}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="nic-link"
                                        >
                                          <FaFilePdf className="pdf-icon" />{" "}
                                          View MoM
                                        </a>
                                      ) : (
                                        <span className="text-muted">N/A</span>
                                      )}
                                    </td>
                                    <td>
                                      {meet.is_uploaded ? (
                                        <span className="status-badge success">
                                          <FaCheckCircle /> Uploaded
                                        </span>
                                      ) : (
                                        <span className="status-badge pending">
                                          <FaTimesCircle /> Pending
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <button
                                        className="nic-btn-action-small"
                                        onClick={() =>
                                          navigate(
                                            `/ldms/meetings-dlcc/upload/${meet.id}`,
                                          )
                                        }
                                      >
                                        <FaEdit /> Update
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* NIC Pagination Controls */}
          {totalCount > 0 && (
            <div className="nic-pagination-container">
              <div className="nic-pagination-info">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
                entries
              </div>
              <div className="nic-pagination-actions">
                <button
                  className="nic-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <button
                  className="nic-page-btn"
                  disabled={currentPage * pageSize >= totalCount}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .nic-table-container {
          width: 100%;
          overflow-x: auto;
        }

        .nic-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          border: 1px solid #d1d5db;
        }

        .nic-data-table th, .nic-data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .nic-data-table th {
          background-color: #7a0c0c;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .nic-data-table tbody tr.master-row:hover {
          background-color: #fef2f2;
        }

        .nic-data-table tbody tr.active-row {
          background-color: #fff5f5;
          border-left: 4px solid #7a0c0c;
        }

        .nic-date-range {
          font-weight: 500;
          color: #334155;
          white-space: nowrap;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
        }

        .nic-badge {
          background: #e5e7eb;
          color: #374151;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 12px;
        }

        .nic-action-btn {
          background: #ffffff;
          color: #7a0c0c;
          border: 1px solid #7a0c0c;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: 0.2s;
        }

        .nic-action-btn:hover {
          background: #7a0c0c;
          color: #ffffff;
        }

        /* Detail Panel Styling */
        .detail-cell {
          padding: 0;
          background: #fafafa;
        }

        .nic-detail-panel {
          margin: 16px;
          padding: 16px;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
        }

        .detail-panel-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #400b0b;
        }

        .nic-sub-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        
        .nic-sub-table th, .nic-sub-table td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
        }

        .nic-sub-table th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 600;
        }

        .nic-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nic-link:hover { text-decoration: underline; }
        .pdf-icon { color: #ef4444; }

        .text-muted { color: #94a3b8; font-style: italic; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.pending { background: #fee2e2; color: #991b1b; }

        .nic-btn-action-small {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .nic-btn-action-small:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
          color: #7a0c0c;
        }

        .nic-loading-state, .nic-empty-state {
          padding: 32px;
          text-align: center;
          color: #64748b;
          font-weight: 500;
        }

        .nic-spinner {
          animation: spin 1s linear infinite;
        }
        
@keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Pagination Styles */
        .nic-pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 8px 8px 8px;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          margin-top: 8px;
        }

        .nic-pagination-info {
          font-size: 13px;
          color: #4b5563;
          font-weight: 500;
        }

        .nic-pagination-actions {
          display: flex;
          gap: 8px;
        }

        .nic-page-btn {
          background: #ffffff;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-page-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: #7a0c0c;
          border-color: #7a0c0c;
        }

        .nic-page-btn:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
