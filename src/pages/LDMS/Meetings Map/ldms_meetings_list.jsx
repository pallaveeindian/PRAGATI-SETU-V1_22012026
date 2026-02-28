// src/pages/LDMS/Meetings Map/ldms_meetings_list.jsx
import React from "react";
import MeetHeader from "./MeetComponents/ldms_meet_header";
// import MeetFilters from "./MeetComponents/ldms_meet_filters";
// import MeetTable from "./MeetComponents/ldms_meet_table";

export default function MeetingsList() {
  return (
    <div className="bmmu-ldms-dashboard">
      {/* Row 1 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <MeetHeader />
        </div>
      </div>

      {/* Row 2 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <h3>Meetings List Filters</h3>
          {/* <MeetFilters /> */}
        </div>
      </div>

      {/* Row 3 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <h3>Meetings Table</h3>
          {/* <MeetTable /> */}
        </div>
      </div>

      {/* ---- styles ---- */}
      <style>{`
        .bmmu-ldms-dashboard {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ldms-grid-row {
          display: grid;
          gap: 16px;
        }

        .ldms-grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .ldms-grid-row.one-col {
          grid-template-columns: 1fr;
        }

        .ldms-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .ldms-card h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: #400b0b;
        }

        @media (max-width: 1024px) {
          .ldms-grid-row.two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
