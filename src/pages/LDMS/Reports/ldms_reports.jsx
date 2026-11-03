// src/pages/LDMS/Report/ldms_reports.jsx
import React, { useState } from "react";
import ReportHeader from "./report_header";
import ReportBody from "./report_body";
import ExportReport from "./export_report";
import { FaFilter, FaTable } from "react-icons/fa";

export default function LdmsReports() {
  const [filters, setFilters] = React.useState({});

  return (
    <div className="bmmu-ldms-dashboard">
      {/* Row 1 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <h3>
            <FaFilter className="ldms-icon" /> Report Filters / Constraints
          </h3>

          <ReportHeader onFetch={setFilters} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <h3>
            <FaTable className="ldms-icon" /> Report Table
          </h3>

          <ReportBody filters={filters} />
        </div>

        {/* Export */}
        <div className="ldms-export-row">
          <ExportReport filters={filters} />
        </div>
      </div>

      <style>{`

        .bmmu-ldms-dashboard {
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeIn 0.35s ease;
        }

        /* GRID SYSTEM */

        .ldms-grid-row {
          display: grid;
          gap: 18px;
          width: 100%;
        }

        .ldms-grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .ldms-grid-row.one-col {
          grid-template-columns: 1fr;
        }

        /* CARD */

        .ldms-card {
          background: #ffffff;
          border: 1px solid #f0d6d6;
          border-radius: 12px;
          padding: 16px;
          min-height: 200px;
          overflow-x: auto;
          transition: all 0.25s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,0.04);
        }

        .ldms-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        /* HEADINGS */

        .ldms-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px 0;
          font-size: 19px;
          font-weight: 700;
          color: #7a0c0c;
        }

        .ldms-icon {
          color: #b91c1c;
          font-size: 16px;
        }

        /* EXPORT AREA */

        .ldms-export-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
          animation: slideUp 0.35s ease;
        }

        /* TABLE SCROLL SAFETY */

        .ldms-card table {
          min-width: 700px;
        }

        /* TABLET */

        @media (max-width: 1024px) {

          .ldms-grid-row.two-col {
            grid-template-columns: 1fr;
          }

          .ldms-card {
            padding: 14px;
          }

          .ldms-card h3 {
            font-size: 18px;
          }

        }

        /* MOBILE */

        @media (max-width: 640px) {

          .bmmu-ldms-dashboard {
            gap: 14px;
          }

          .ldms-card {
            padding: 12px;
            border-radius: 10px;
          }

          .ldms-card h3 {
            font-size: 16px;
          }

          .ldms-export-row {
            justify-content: center;
          }

        }

        /* ANIMATIONS */

        @keyframes fadeIn {
          from { opacity:0; transform: translateY(6px); }
          to { opacity:1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity:0; transform: translateY(12px); }
          to { opacity:1; transform: translateY(0); }
        }

      `}</style>
    </div>
  );
}
