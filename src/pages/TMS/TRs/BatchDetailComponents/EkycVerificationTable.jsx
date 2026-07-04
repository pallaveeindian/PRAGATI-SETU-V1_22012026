// src/pages/TMS/TRs/BatchDetailComponents/EkycVerificationTable.jsx
import React from "react";
import { FaIdCard } from "react-icons/fa";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("/media/")) return url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch (error) {
      return url;
    }
  }
  return url;
}

export default function EkycVerificationTable({ ekycVerifications = [] }) {
  if (!ekycVerifications || ekycVerifications.length === 0) {
    return null;
  }

  return (
    <div className="training-section" style={{ marginTop: 24 }}>
      <h3 className="section-title">
        <FaIdCard style={{ marginRight: "8px" }} /> eKYC Verifications
      </h3>

      <div className="table-wrapper">
        <table className="table table-compact ekyc-table">
          <thead>
            <tr>
              <th className="thStyle">Participant ID</th>
              <th className="thStyle">Role</th>
              <th className="thStyle">Status</th>
              <th className="thStyle">Verified On</th>
              <th className="thStyle">Document</th>
            </tr>
          </thead>
          <tbody>
            {ekycVerifications.map((kyc) => (
              <tr key={kyc.id}>
                <td className="table-cell table-cell-bold">
                  {kyc.participant_id || "-"}
                </td>

                <td className="table-cell">
                  <span className="role-pill">
                    {kyc.participant_role || "-"}
                  </span>
                </td>

                <td className="table-cell">
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        kyc.ekyc_status === "VERIFIED"
                          ? "#16a34a"
                          : kyc.ekyc_status === "FAILED"
                            ? "#dc2626"
                            : "#d97706",
                    }}
                  >
                    {kyc.ekyc_status || "PENDING"}
                  </span>
                </td>

                <td className="table-cell">{fmtDate(kyc.verified_on)}</td>

                <td className="table-cell">
                  {kyc.ekyc_document ? (
                    <a
                      href={normalizeMediaUrl(kyc.ekyc_document)}
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      View Doc
                    </a>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .section-title {
          margin-bottom: 16px;
          color: #2b4e72;
          display: flex;
          align-items: center;
          font-weight: 700;
          margin-top: 0;
        }
        .table-wrapper {
          max-height: 250px;
          overflow: auto;
          border: 1px solid #a7c6ed;
          border-radius: 8px;
          background: #fff;
        }
        .ekyc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .ekyc-table thead {
          background: #e4ecf5;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .thStyle {
          padding: 10px 12px;
          text-align: left;
          font-weight: 700;
          color: #2b4e72;
          border-bottom: 2px solid #a7c6ed;
        }
        .table-cell {
          padding: 10px 12px;
          color: #2b4e72;
          border-bottom: 1px solid #e4ecf5;
        }
        .table-cell-bold {
          font-weight: 600;
        }
        .ekyc-table tbody tr:hover {
          background: #f4f8fd;
        }
        .role-pill {
          background: #e4ecf5;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          color: #3d6ba6;
          font-weight: 600;
        }
        .doc-link {
          color: #3d6ba6;
          font-weight: 600;
          text-decoration: none;
        }
        .doc-link:hover {
          text-decoration: underline;
        }
        .training-section {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
