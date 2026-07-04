// src/pages/TMS/TRs/BatchDetailComponents/CertificatesTable.jsx
import React from "react";
import { FaCertificate } from "react-icons/fa";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

export default function CertificatesTable({ batchCertificates = [] }) {
  if (!batchCertificates || batchCertificates.length === 0) {
    return null;
  }

  return (
    <div className="training-section" style={{ marginTop: 24 }}>
      <h3 className="section-title">
        <FaCertificate style={{ marginRight: "8px" }} /> Generated Certificates
      </h3>

      <div className="table-wrapper">
        <table className="table table-compact cert-table">
          <thead>
            <tr>
              <th className="thStyle">Issue Code</th>
              <th className="thStyle">Issued On</th>
              <th className="thStyle">Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            {batchCertificates.map((cert) => (
              <tr key={cert.id}>
                <td className="table-cell table-cell-bold highlight">
                  {cert.issue_code || "-"}
                </td>
                <td className="table-cell">{fmtDate(cert.issued_on)}</td>
                <td className="table-cell">{cert.attendance_rate || "-"}</td>
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
        .cert-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .cert-table thead {
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
        .highlight {
          color: #1e40af;
        }
        .cert-table tbody tr:hover {
          background: #f4f8fd;
        }
        .training-section {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
