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
              <th className="thStyle">Issued to</th>
              <th className="thStyle">Issued On</th>
              <th className="thStyle">Issue Code</th>
              <th className="thStyle">District</th>
              <th className="thStyle">Block</th>
            </tr>
          </thead>
          <tbody>
            {batchCertificates.map((cert) => (
              <tr
                key={cert.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open(
                    `/api/v1/public/tms-certificate/download/?issue_code=${encodeURIComponent(
                      cert.issue_code,
                    )}`,
                    "_blank",
                  )
                }
              >
                <td className="table-cell">
                  {cert.tr_beneficiary?.member_name ||
                    cert.tr_trainer?.full_name ||
                    "-"}
                </td>
                <td className="table-cell">{fmtDate(cert.issued_on)}</td>
                <td className="table-cell table-cell-bold highlight">
                  {cert.issue_code || "-"}
                </td>
                <td className="table-cell">
                  {cert.tr_beneficiary?.district_name_en ||
                    cert.tr_trainer?.district_name_en ||
                    "-"}
                </td>
                <td className="table-cell">
                  {" "}
                  {cert.tr_beneficiary?.block_name_en ||
                    cert.tr_trainer?.block_name_en ||
                    "-"}
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
        .cert-table tbody tr {
          cursor: pointer;
          transition: background 0.2s ease;
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
