// src/pages/EPSMS/RecordForm/CRPForm.jsx
import React from "react";
// import GeoFilters from "./FormComponents/GeoFilters";
// import SHGListMem from "./FormComponents/SHGListMem";
// import AssignedCRPs from "./FormComponents/AssignedCRPs";
// import PanchayatsList from "./FormComponents/PanchayatsList";

export default function MeetingsList() {
  return (
    <div className="crpform-epsms-dashboard">
      {/* Row 1 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card">{/* <GeoFilters /> */}</div>
      </div>

      {/* Row 2 */}
      <div className="epsms-grid-row three-col">
        <div className="epsms-card">{/* <SHGListMem /> */}</div>
        <div className="epsms-card">{/* <AssignedCRPs /> */}</div>
        <div className="epsms-card">{/* <PanchayatsList /> */}</div>
      </div>

      {/* ---- styles ---- */}
      <style>{`
        .crpform-epsms-dashboard {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .epsms-grid-row {
          display: grid;
          gap: 16px;
        }

        .epsms-grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .epsms-grid-row.one-col {
          grid-template-columns: 1fr;
        }

        .epsms-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .epsms-card h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: #400b0b;
        }

        @media (max-width: 1024px) {
          .epsms-grid-row.two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
