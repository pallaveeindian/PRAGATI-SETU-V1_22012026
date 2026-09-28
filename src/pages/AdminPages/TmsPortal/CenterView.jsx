import React, { useState } from "react";
import { FaPrint, FaTimes } from "react-icons/fa";
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
        const [centerResponse, roomsResponse, mediaResponse] = await Promise.all([
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
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(15, 23, 42, 0.45)" }}
    >
      <div
        className="center-detail-printable"
        onClick={(event) => event.stopPropagation()}
        style={{ width: "min(900px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "8px", padding: "22px", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.2)" }}
      >
        <div className="center-detail-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "16px", position: "sticky", top: 0, zIndex: 2, background: "#fff", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
          <div>
            <h2 id="center-view-title" style={{ margin: 0, color: "#2f629e" }}>{selectedCenter.venue_name || "Training Centre"}</h2>
            <div style={{ color: "#64748b", marginTop: "4px" }}>
              {getLocationName(selectedCenter.district_full, selectedCenter.district)} / {getLocationName(selectedCenter.block_full, selectedCenter.block)}
            </div>
          </div>
          <div className="center-detail-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end", flexShrink: 0 }}>
            <button type="button" onClick={() => window.print()} style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #2f629e", borderRadius: "4px", padding: "7px 10px", background: "#2f629e", color: "#fff", cursor: "pointer" }}><FaPrint /> Print / Save PDF</button>
            <button type="button" onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #2f629e", borderRadius: "4px", padding: "7px 12px", background: "#fff", color: "#2f629e", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}><FaTimes /> Back </button>
          </div>
        </div>

        {loading ? <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading centre details...</div> : <>
          <DetailSection title="Basic Information">
            <DetailGrid items={[
              ["Serial Number", selectedCenter.serial_number],
              ["Centre Type", selectedCenter.centre_type_other || selectedCenter.centre_type],
              ["Address", selectedCenter.venue_address],
              ["Location", `${getLocationName(selectedCenter.district_full, selectedCenter.district)} / ${getLocationName(selectedCenter.block_full, selectedCenter.block)} / ${getLocationName(selectedCenter.panchayat_full, selectedCenter.panchayat)} / ${getLocationName(selectedCenter.village_full, selectedCenter.village)}`],
            ]} />
          </DetailSection>

          <DetailSection title="Facilities">
            <DetailGrid items={[
              ["Security", selectedCenter.security_arrangements],
              ["Toilets", selectedCenter.toilets_bathrooms],
              ["Power & Water", selectedCenter.power_water_facility],
              ["Medical Kit", selectedCenter.medical_kit ? "Yes" : "No"],
              ["Open Space", selectedCenter.open_space ? "Yes" : "No"],
              ["Field Visit", selectedCenter.field_visit_facility ? "Yes" : "No"],
              ["Transport", selectedCenter.transport_facility ? "Yes" : "No"],
              ["Dining", selectedCenter.dining_facility ? "Yes" : "No"],
              ["Other", selectedCenter.other_details],
            ]} />
          </DetailSection>

          <DetailSection title="Training Halls">
            {rooms.length ? <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={cellHeader}>Name</th><th style={cellHeader}>Capacity</th></tr></thead><tbody>{rooms.map((room) => <tr key={room.id || room.room_name}><td style={cell}>{room.room_name || "N/A"}</td><td style={cell}>{room.room_capacity || "N/A"}</td></tr>)}</tbody></table> : <div>No training halls available.</div>}
          </DetailSection>

          <DetailSection title="Media">
            {media.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>{media.map((item) => { const url = item.file || item.existing_url; return <div key={item.id || item.category} style={{ border: "1px solid #e2e8f0", padding: "8px" }}>{url && isImage(url) ? <img src={url} alt={item.category || "Centre media"} style={{ width: "100%", height: "130px", objectFit: "cover" }} /> : <div style={{ height: "130px", display: "grid", placeItems: "center", background: "#f8fafc" }}>Document</div>}<strong style={{ display: "block", margin: "7px 0" }}>{item.category || "Media"}</strong>{url && <a href={url} target="_blank" rel="noreferrer">Download</a>}</div>; })}</div> : <div>No media available.</div>}
          </DetailSection>
        </>}
      </div>
      <style>{`@media print { body * { visibility: hidden !important; } .center-detail-printable, .center-detail-printable * { visibility: visible !important; } .center-detail-printable { position: absolute !important; inset: 0 !important; width: 100% !important; max-height: none !important; overflow: visible !important; box-shadow: none !important; } .center-detail-actions { display: none !important; } }`}</style>
    </div>
  );
}

function DetailSection({ title, children }) {
  return <section><h3 style={{ color: "#2f629e", borderBottom: "2px solid #2f629e", paddingBottom: "6px" }}>{title}</h3>{children}</section>;
}

function DetailGrid({ items }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>{items.map(([label, value]) => <div key={label} style={{ padding: "9px", borderBottom: "1px solid #e2e8f0" }}><strong>{label}</strong><div>{value || "N/A"}</div></div>)}</div>;
}

const cellHeader = { textAlign: "left", padding: "8px", borderBottom: "1px solid #cbd5e1" };
const cell = { padding: "8px", borderBottom: "1px solid #e2e8f0" };
