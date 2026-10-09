// src\pages\AdminPages\TmsPortal\CenterView.jsx
import React, { useState } from "react";
import {
  FaPrint,
  FaMapMarkerAlt,
  FaUniversity,
  FaBuilding,
  FaImages,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import { TMS_API } from "../../../api/axios";

const getLocationName = (value, fallback) =>
  value?.district_name_en ||
  value?.block_name_en ||
  value?.panchayat_name_en ||
  value?.village_name_en ||
  fallback ||
  "N/A";

const isImage = (url) => /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(url || "");

export default function CenterView({ center, onClose }) {
  const [details, setDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        const [centerResponse, roomsResponse, mediaResponse] =
          await Promise.all([
            TMS_API.trainingPartnerCentres.retrieve(center.id),
            TMS_API.trainingPartnerCentreRooms.list({ centre: center.id }),
            TMS_API.trainingPartnerSubmissions.list({ centre: center.id }),
          ]);

        if (!active) return;
        setDetails(centerResponse?.data || center);
        setRooms(roomsResponse?.data?.results || roomsResponse?.data || []);
        setMedia(mediaResponse?.data?.results || mediaResponse?.data || []);
      } catch {
        if (!active) return;
        setDetails(center);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      active = false;
    };
  }, [center]);

  const selectedCenter = details || center;

  return (
    <div
      className="center-detail-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="center-view-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(15, 23, 42, 0.62)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="center-detail-printable"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 28px 75px rgba(15, 23, 42, 0.3)",
        }}
      >
        <div
          className="center-detail-toolbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            margin: "-24px -24px 20px",
            position: "sticky",
            top: "-24px",
            zIndex: 2,
            background: "linear-gradient(135deg, #312e81, #2563eb)",
            color: "#fff",
            padding: "20px 24px",
            borderRadius: "18px 18px 0 0",
            boxShadow: "0 5px 16px rgba(37,99,235,.16)",
          }}
        >
          <div>
            <div className="center-detail-eyebrow">
              <FaUniversity /> Training Centre Profile
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <h2
                id="center-view-title"
                style={{
                  margin: "5px 0 0",
                  color: "#fff",
                  fontSize: "1.35rem",
                }}
              >
                {selectedCenter.venue_name || "Training Centre"}
              </h2>
              <span className="centre-type-badge">
                {selectedCenter.centre_type_other ||
                  selectedCenter.centre_type ||
                  "Centre"}
              </span>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,.78)",
                marginTop: "5px",
                fontSize: ".82rem",
              }}
            >
              <FaMapMarkerAlt />{" "}
              {getLocationName(
                selectedCenter.district_full,
                selectedCenter.district,
              )}{" "}
              /{" "}
              {getLocationName(selectedCenter.block_full, selectedCenter.block)}
            </div>
          </div>
          <div
            className="center-detail-actions"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => window.print()}
              className="center-action primary"
            >
              <FaPrint /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="center-action secondary"
            >
              <FaArrowLeft /> Back{" "}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="detail-loading">
            <span className="loading-spinner" /> Loading centre details...
          </div>
        ) : (
          <>
            <DetailSection title="Basic Information" icon={FaBuilding}>
              <DetailGrid
                items={[
                  ["Serial Number", selectedCenter.serial_number],
                  [
                    "Centre Type",
                    selectedCenter.centre_type_other ||
                      selectedCenter.centre_type,
                  ],
                  ["Address", selectedCenter.venue_address],
                  [
                    "Location",
                    `${getLocationName(selectedCenter.district_full, selectedCenter.district)} / ${getLocationName(selectedCenter.block_full, selectedCenter.block)} / ${getLocationName(selectedCenter.panchayat_full, selectedCenter.panchayat)} / ${getLocationName(selectedCenter.village_full, selectedCenter.village)}`,
                  ],
                ]}
              />
            </DetailSection>

            <DetailSection title="Facilities" icon={FaUniversity}>
              <DetailGrid
                items={[
                  ["Security", selectedCenter.security_arrangements],
                  ["Toilets", selectedCenter.toilets_bathrooms],
                  ["Power & Water", selectedCenter.power_water_facility],
                  ["Medical Kit", selectedCenter.medical_kit ? "Yes" : "No"],
                  ["Open Space", selectedCenter.open_space ? "Yes" : "No"],
                  [
                    "Field Visit",
                    selectedCenter.field_visit_facility ? "Yes" : "No",
                  ],
                  [
                    "Transport",
                    selectedCenter.transport_facility ? "Yes" : "No",
                  ],
                  ["Dining", selectedCenter.dining_facility ? "Yes" : "No"],
                  ["Other", selectedCenter.other_details],
                ]}
              />
            </DetailSection>

            <DetailSection
              title="Training Halls"
              icon={FaBuilding}
              meta={
                rooms.length
                  ? `${rooms.length} hall${rooms.length > 1 ? "s" : ""}`
                  : "No halls"
              }
            >
              {rooms.length ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={cellHeader}>Name</th>
                      <th style={cellHeader}>Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id || room.room_name}>
                        <td style={cell}>
                          <span className="hall-name">
                            <FaBuilding /> {room.room_name || "N/A"}
                          </span>
                        </td>
                        <td style={cell}>
                          <strong>{room.room_capacity || "N/A"}</strong> seats
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyBlock
                  icon={FaBuilding}
                  text="No training halls available."
                />
              )}
            </DetailSection>

            <DetailSection
              title="Media"
              icon={FaImages}
              meta={
                media.length
                  ? `${media.length} file${media.length > 1 ? "s" : ""}`
                  : "No files"
              }
            >
              {media.length ? (
                <div className="media-grid">
                  {media.map((item) => {
                    const url = item.file || item.existing_url;
                    return (
                      <div
                        key={item.id || item.category}
                        className="media-card"
                      >
                        {url && isImage(url) ? (
                          <img
                            src={url}
                            alt={item.category || "Centre media"}
                            className="media-image"
                          />
                        ) : (
                          <div className="media-document">
                            <FaFileAlt />
                            <span>Document</span>
                          </div>
                        )}
                        <div className="media-card-footer">
                          <strong>{item.category || "Media"}</strong>
                          {url && (
                            <a href={url} target="_blank" rel="noreferrer">
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyBlock icon={FaImages} text="No media available." />
              )}
            </DetailSection>
          </>
        )}
      </div>
      <style>{`
        .center-detail-eyebrow { display:flex; align-items:center; gap:7px; font-size:.68rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.7); }
        .center-action { display:inline-flex; align-items:center; gap:7px; border-radius:9px; padding:9px 12px; cursor:pointer; font-weight:800; font-size:.78rem; transition:.2s; }
        .center-action.primary { border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.18); color:#fff; }
        .center-action.secondary { border:1px solid rgba(255,255,255,.55); background:#fff; color:#3730a3; }
        .center-action:hover { transform:translateY(-1px); box-shadow:0 6px 14px rgba(15,23,42,.16); }
        .center-detail-printable section { margin-bottom:18px; padding:16px; border:1px solid #e8edf4; border-radius:15px; background:linear-gradient(145deg,#ffffff,#fbfdff); }
        .detail-section-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #e2e8f0; }
        .detail-section-title { display:flex; align-items:center; gap:9px; min-width:0; }
        .detail-section-title h3 { margin:0; color:#25324a; font-size:.94rem; font-weight:850; letter-spacing:.01em; }
        .detail-section-icon { width:30px; height:30px; display:grid; place-items:center; flex:none; border-radius:9px; background:linear-gradient(135deg,#eef2ff,#e0e7ff); color:#4f46e5; font-size:13px; box-shadow:inset 0 0 0 1px #dbe3ff; }
        .detail-section-meta { padding:4px 9px; border-radius:999px; background:#f1f5f9; color:#64748b; font-size:.68rem; font-weight:800; white-space:nowrap; }
        .centre-type-badge { margin-top:5px; padding:5px 9px; border:1px solid rgba(255,255,255,.34); border-radius:999px; background:rgba(255,255,255,.14); color:#fff; font-size:.67rem; font-weight:800; text-transform:uppercase; letter-spacing:.04em; }
        .hall-name { display:inline-flex; align-items:center; gap:7px; font-weight:700; color:#334155; }
        .media-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
        .media-card { overflow:hidden; border:1px solid #e2e8f0; border-radius:12px; background:#fff; box-shadow:0 4px 12px rgba(30,41,59,.04); }
        .media-image, .media-document { width:100%; height:125px; object-fit:cover; display:grid; place-items:center; background:#f1f5f9; color:#64748b; }
        .media-document { gap:7px; font-size:1.5rem; } .media-document span { font-size:.75rem; font-weight:700; }
        .media-card-footer { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:10px; font-size:.78rem; } .media-card-footer a { color:#4f46e5; font-weight:800; text-decoration:none; }
        .empty-block { display:flex; align-items:center; gap:9px; padding:14px; border-radius:10px; background:#f8fafc; color:#64748b; font-size:.82rem; }
        .detail-loading { display:flex; align-items:center; justify-content:center; gap:10px; min-height:220px; color:#64748b; font-size:.85rem; font-weight:700; } .loading-spinner { width:20px; height:20px; border:3px solid #e0e7ff; border-top-color:#4f46e5; border-radius:50%; animation:centerSpin .8s linear infinite; } @keyframes centerSpin { to { transform:rotate(360deg); } }
        .center-detail-printable table { border:1px solid #e5eaf1; border-radius:10px; overflow:hidden; }
        .center-detail-printable th { background:#f1f5f9 !important; color:#475569; font-size:.72rem; text-transform:uppercase; letter-spacing:.05em; }
        .center-detail-printable td { color:#334155; font-size:.84rem; }
        @media (max-width: 620px) { .center-detail-backdrop { padding:8px !important; } .center-detail-printable { padding:16px !important; max-height:96vh !important; } .center-detail-toolbar { margin:-16px -16px 16px !important; padding:16px !important; align-items:flex-start !important; } .center-detail-actions { flex-direction:column; } .center-action { width:100%; justify-content:center; } }
        @media print {
          @page { size: auto; margin: 12mm; }
          html, body { height: auto !important; overflow: visible !important; }
          body * { visibility: hidden !important; }
          .center-detail-backdrop,
          .center-detail-printable,
          .center-detail-printable * { visibility: visible !important; }
          .center-detail-backdrop {
            position: static !important;
            display: block !important;
            padding: 0 !important;
           
            
          }
          .center-detail-printable {
            position: static !important;
            width: 100% !important;
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .center-detail-toolbar {
            position: static !important;
            margin: 0 0 16px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .center-detail-actions { display:none !important; }
          .center-detail-printable section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .media-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

function DetailSection({ title, icon: Icon, meta, children }) {
  return (
    <section>
      <div className="detail-section-heading">
        <div className="detail-section-title">
          <span className="detail-section-icon">
            {React.createElement(Icon)}
          </span>
          <h3>{title}</h3>
        </div>
        {meta && <small className="detail-section-meta">{meta}</small>}
      </div>
      {children}
    </section>
  );
}

function EmptyBlock({ icon: Icon, text }) {
  return (
    <div className="empty-block">
      {React.createElement(Icon)}
      {text}
    </div>
  );
}

function DetailGrid({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "10px",
      }}
    >
      {items.map(([label, value]) => (
        <div
          key={label}
          style={{
            padding: "11px 12px",
            border: "1px solid #e5eaf1",
            borderRadius: "10px",
            background: "#fbfdff",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#64748b",
              fontSize: ".7rem",
              textTransform: "uppercase",
              letterSpacing: ".04em",
              marginBottom: "4px",
            }}
          >
            {label}
          </strong>
          <div style={{ color: "#1e293b", lineHeight: 1.45 }}>
            {value || "N/A"}
          </div>
        </div>
      ))}
    </div>
  );
}

const cellHeader = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #cbd5e1",
};
const cell = { padding: "8px", borderBottom: "1px solid #e2e8f0" };
