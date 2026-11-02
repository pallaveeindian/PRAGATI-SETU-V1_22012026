import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LDMS_API } from "../../../../api/axios";
import {
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";

export default function MeetTable({ filters }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Determine which API and Route to use based on meetingType
  const isBLCC = filters?.meetingType === "BLCC";
  const apiResource = isBLCC ? LDMS_API.blccMeetings : LDMS_API.dlccMeetings;
  const routePrefix = isBLCC ? "meetings-blcc" : "meetings-dlcc";

  // Fetch List Data
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          meeting_month: filters.meetingMonth || undefined,
          // Send geographical filters if SMMU is filtering
          ...(isBLCC
            ? { block: filters.blockId }
            : { district: filters.districtId }),
        };

        const res = await apiResource.list(params);

        setData(res?.data?.results || res?.data || []);
        setTotalCount(
          res?.data?.count || (Array.isArray(res?.data) ? res.data.length : 0),
        );
      } catch (error) {
        console.error(`Failed to fetch ${filters.meetingType} list`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [filters, currentPage, isBLCC, apiResource]);

  // Helper to format dates nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Scheduled";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="nic-table-container">
      {loading ? (
        <div className="nic-loading-state">
          <FaSpinner className="nic-spinner" /> Loading Data...
        </div>
      ) : data.length === 0 ? (
        <div className="nic-empty-state">
          No {filters?.meetingType} meeting records found for the selected
          filters.
        </div>
      ) : (
        <>
          <table className="nic-data-table">
            <thead>
              <tr>
                <th width="5%">S.No</th>
                <th width="15%">Reference ID</th>
                <th width="20%">Meeting Date</th>
                <th width="25%">MoM Document</th>
                <th width="20%">Upload Status</th>
                <th width="15%">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id} className="master-row">
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>

                  <td>
                    <small className="nic-ref-id">{row.TH_urid}</small>
                  </td>

                  <td>
                    <div className="nic-date-display">
                      <FaCalendarAlt className="date-icon" />
                      <strong>{formatDate(row.meeting_date)}</strong>
                    </div>
                  </td>

                  <td>
                    {row.mom ? (
                      <a
                        href={row.mom}
                        target="_blank"
                        rel="noreferrer"
                        className="nic-link"
                      >
                        <FaFilePdf className="pdf-icon" /> View MoM
                      </a>
                    ) : (
                      <span className="text-muted">Not Uploaded</span>
                    )}
                  </td>

                  <td>
                    {row.is_uploaded ? (
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
                        navigate(`/ldms/meetings/upload/${row.id}`)
                      }
                    >
                      <FaEdit /> Update
                    </button>
                  </td>
                </tr>
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
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          vertical-align: middle;
        }

        .nic-data-table th {
          background-color: #7a0c0c;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .nic-data-table tbody tr.master-row {
          background-color: #ffffff;
          transition: background-color 0.2s;
        }

        .nic-data-table tbody tr.master-row:hover {
          background-color: #fef2f2;
        }

        .nic-ref-id {
          font-family: monospace;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .nic-date-display {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #1e293b;
        }
        
        .date-icon {
          color: #94a3b8;
        }

        .nic-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nic-link:hover { text-decoration: underline; }
        .pdf-icon { color: #ef4444; font-size: 16px; }

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
          padding: 6px 12px;
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
          padding: 40px;
          text-align: center;
          color: #64748b;
          font-weight: 500;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
        }

        .nic-spinner {
          animation: spin 1s linear infinite;
          margin-right: 8px;
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
