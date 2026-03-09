// src/pages/EPSMS/RecordForm/CRPForm.jsx
import React , {useState} from "react";
import GeoFilters from "./FormComponents/GeoFilters";
import SHGList from "./FormComponents/SHGList";
import AssignedCRPs from "./FormComponents/AssignedCRPs";
// import PanchayatsList from "./FormComponents/PanchayatsList";

export default function CRPForm() {
  const [geoFilters, setGeoFilters] = useState({
    district_id: null,
    block_id: null,
  });

  return (
    <div className="crpform-epsms-dashboard">
      {/* Row 1 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card">
          <GeoFilters onChange={setGeoFilters} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="epsms-grid-row three-col">
        <div className="epsms-card">
          <SHGList
            blockId={geoFilters.block_id}
            onSelectMember={(memberData) => {
              console.log("Selected Member:", memberData);
            }}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card">
          <AssignedCRPs />
        </div>
      </div>

      {/* Row 4 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card">
          <h1>Panchayats List</h1>
          {/* <PanchayatsList /> */}
          </div>
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
