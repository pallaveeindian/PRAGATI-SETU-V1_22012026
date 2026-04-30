// src/pages/ViewRecordedCRPs/ViewRecCRPs.jsx
import React, { useState } from "react";
import CRPFilters from "./VRCComponents/CRPFilters";
import CRPTable from "./VRCComponents/CRPTable";
// import ExportButton from "./VRCComponents/ExportButton";
import { FaFilter, FaTable } from "react-icons/fa";

export default function ViewRecCRPs() {
    const [filters, setFilters] = React.useState({});

    return (
        <div className="crpform-epsms-dashboard">
            {/* Row 1 */}
            <div className="epsms-grid-row one-col">
                <div className="epsms-card">
                    <h3>
                        <FaFilter className="epsms-icon" /> Filters / Constraints
                    </h3>

                    <CRPFilters onFetch={setFilters} />
                </div>
            </div>

            {/* Row 2 */}
            <div className="epsms-grid-row one-col">
                <div className="epsms-card">
                    <h3>
                        <FaTable className="epsms-icon" /> CRP Table
                    </h3>

                    <CRPTable filters={filters} />
                </div>

                {/* Export */}
                <div className="epsms-export-row">
                    {/* <ExportButton filters={filters} /> */}
                </div>
            </div>

            <style>{`

        .crpform-epsms-dashboard {
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeIn 0.35s ease;
        }

        /* GRID SYSTEM */

        .epsms-grid-row {
          display: grid;
          gap: 18px;
          width: 100%;
        }

        .epsms-grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .epsms-grid-row.one-col {
          grid-template-columns: 1fr;
        }

        /* CARD */

        .epsms-card {
          background: #ffffff;
          border: 1px solid #f0d6d6;
          border-radius: 12px;
          padding: 16px;
          min-height: 200px;
          overflow-x: auto;
          transition: all 0.25s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,0.04);
        }

        .epsms-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        /* HEADINGS */

        .epsms-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px 0;
          font-size: 19px;
          font-weight: 700;
          color: #7a0c0c;
        }

        .epsms-icon {
          color: #b91c1c;
          font-size: 16px;
        }

        /* EXPORT AREA */

        .epsms-export-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
          animation: slideUp 0.35s ease;
        }

        /* TABLE SCROLL SAFETY */

        .epsms-card table {
          min-width: 700px;
        }

        /* TABLET */

        @media (max-width: 1024px) {

          .epsms-grid-row.two-col {
            grid-template-columns: 1fr;
          }

          .epsms-card {
            padding: 14px;
          }

          .epsms-card h3 {
            font-size: 18px;
          }

        }

        /* MOBILE */

        @media (max-width: 640px) {

          .crpform-epsms-dashboard {
            gap: 14px;
          }

          .epsms-card {
            padding: 12px;
            border-radius: 10px;
          }

          .epsms-card h3 {
            font-size: 16px;
          }

          .epsms-export-row {
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