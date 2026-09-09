import React, { useEffect, useState } from "react";
import { LOOKUP_API, TMS_API } from "../../../../api/axios";

const value = (item, fallback = "-") => item ?? fallback;

function getLocationName(location, fields) {
  if (!location) return "";
  if (typeof location === "string" || typeof location === "number") {
    return String(location);
  }
  return fields.map((field) => location?.[field]).find(Boolean) || "";
}

function getBatchLocation(batch, type) {
  const nestedDetails = batch?.combined_batch_details?.[0] || {};
  const location = batch?.[type] || nestedDetails?.[type];
  const fields =
    type === "district"
      ? ["district_name_en", "district_name", "name", "title"]
      : ["block_name_en", "block_name_local", "block_name", "name", "title"];
  const directFields =
    type === "district"
      ? ["district_name_en", "district_name"]
      : ["block_name_en", "block_name_local", "block_name"];
  const directLocationName =
    typeof location === "object"
      ? getLocationName(location, fields)
      : location && Number.isNaN(Number(location))
        ? String(location)
        : "";

  return (
    directLocationName ||
    getLocationName(batch, directFields) ||
    getLocationName(nestedDetails, directFields) ||
    ""
  );
}

function getBatchLocationId(batch, type) {
  const nestedDetails = batch?.combined_batch_details?.[0] || {};
  const location = batch?.[type] || nestedDetails?.[type];
  return (
    batch?.[`${type}_id`] ||
    nestedDetails?.[`${type}_id`] ||
    (typeof location === "object" ? location?.id || location?.[`${type}_id`] : location) ||
    ""
  );
}




export default function TrainingBatchDetail({ batchId, onBack }) {
  const [batch, setBatch] = useState(null);
  const [locationNames, setLocationNames] = useState({ district: "", block: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError("");
      try {
        const response = await TMS_API.batchDetailV2(batchId);
        const data = response?.data;
        if (!data) throw new Error("Batch details were not returned by the server.");
        if (active) setBatch(data);
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.detail ||
              err?.response?.data?.message ||
              err.message ||
              "Unable to load batch details.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (batchId) loadDetail();
    return () => {
      active = false;
    };
  }, [batchId]);

  useEffect(() => {
    if (!batch) return;
    let active = true;
    const districtId = getBatchLocationId(batch, "district");
    const blockId = getBatchLocationId(batch, "block");

    async function loadLocationNames() {
      const names = { district: getBatchLocation(batch, "district"), block: getBatchLocation(batch, "block") };
      try {
        if (!names.district && districtId) {
          const response = await LOOKUP_API.districts.retrieve(districtId, {
            fields: "district_name_en",
          });
          names.district = response?.data?.district_name_en || response?.data?.district_name || "";
        }
      } catch {
        names.district = names.district || "";
      }

      try {
        if (!names.block && blockId) {
          const response = await LOOKUP_API.blocks.list({ id: blockId, fields: "block_name_en" });
          const block = response?.data?.results?.[0] || response?.data;
          names.block = block?.block_name_en || block?.block_name || "";
        }
      } catch {
        names.block = names.block || "";
      }

      if (active) setLocationNames(names);
    }

    loadLocationNames();
    return () => {
      active = false;
    };
  }, [batch]);

  if (loading) {
    return <div className="admin-detail-card">Loading batch details...</div>;
  }

  if (error) {
    return (
      <div className="admin-detail-card admin-detail-error" role="alert">
        <h2>Unable to load batch details</h2>
        <p>{error}</p>
        <button className="admin-detail-button" onClick={onBack}>Back to list</button>
      </div>
    );
  }

  const centre = batch?.centre || {};
  const partner = batch?.partner || centre?.partner || {};
  const participants =
    batch?.beneficiary_participations ||
    batch?.trainer_participations ||
    batch?.participants ||
    [];
  const batchCode = batch?.code || batch?.batch_code || `Batch #${batchId}`;
  const batchDate = batch?.end_date || batch?.start_date;

  return (
    <section className="admin-detail-page">
      <div className="admin-detail-toolbar">
        <div>
          <p className="admin-detail-eyebrow">Training Batch Details</p>
          <h1>{value(batch?.code || batch?.batch_code, `Batch #${batchId}`)}</h1>
        </div>
        <button className="admin-detail-button" onClick={onBack}>Back to list</button>
      </div>

      <div className="admin-detail-grid">
        <DetailItem label="Status" value={batch?.status} />
        <DetailItem label="Participant Type" value={batch?.participant_type} />
        <DetailItem label="Batch Type" value={batch?.batch_type} />
        <DetailItem label="Level" value={batch?.level} />
        <DetailItem label="Start Date" value={batch?.start_date} />
        <DetailItem label="End Date" value={batch?.end_date} />
        <DetailItem label="Training Partner" value={partner?.name} />
        <DetailItem label="Centre" value={centre?.venue_name} />
        <DetailItem label="Block" value={locationNames.block} />
        <DetailItem label="District" value={locationNames.district} />
        <DetailItem label="Participant Count" value={batch?.pax_count ?? participants.length} />
      </div>

      <div className="admin-detail-section">
        <div className="admin-participants-heading">
          <div>
            <h2>Participants</h2>
            <p>Employees assigned to this training batch</p>
          </div>
          <span className="admin-participants-count">{participants.length} Employees</span>
        </div>
        {participants.length === 0 ? (
          <p className="admin-detail-muted">No participant details available.</p>
        ) : (
          <div className="admin-detail-table-wrap">
            <table className="admin-detail-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                 
                  <th>Batch Code</th>
                  <th>Batch Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((entry, index) => {
                  const person = entry?.beneficiary || entry?.trainer || entry;
                  const participant = person?.trainer || person;
                  const employeeId =
                    participant?.employee_id ||
                    participant?.employee_code ||
                    participant?.emp_id ||
                    participant?.member_code ||
                    participant?.lokos_member_code;
                  const name =
                    participant?.full_name ||
                    participant?.member_name ||
                    participant?.name ||
                    [participant?.first_name, participant?.last_name].filter(Boolean).join(" ");
                  const participationDate =
                    entry?.date ||
                    entry?.training_date ||
                    entry?.completed_on ||
                    batchDate;
                  return (
                    <tr key={entry?.id || index}>
                      <td>{index + 1}</td>
                      <td><span className="admin-employee-id">{value(employeeId)}</span></td>
                      <td className="admin-name-cell">{value(name)}</td>
                      
                      <td>{batchCode}</td>
                      <td><span className={`admin-status-badge admin-status-${String(batch?.status || "").toLowerCase()}`}>{value(batch?.status)}</span></td>
                      <td>{formatDate(participationDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-detail-page { background:#f8fafc; min-height:100%; }
        .admin-detail-toolbar { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:20px 24px; background:#fff; border:1px solid #e2e8f0; border-left:5px solid #1d4ed8; border-radius:10px; }
        .admin-detail-eyebrow { margin:0; color:#1d4ed8; font-size:12px; font-weight:700; text-transform:uppercase; }
        .admin-detail-toolbar h1 { margin:5px 0 0; color:#1e293b; font-size:24px; }
        .admin-detail-button { border:1px solid #1d4ed8; border-radius:6px; padding:9px 14px; background:#fff; color:#1d4ed8; font-weight:700; cursor:pointer; }
        .admin-detail-grid { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:12px; margin:18px 0; }
        .admin-detail-item, .admin-detail-section, .admin-detail-card { padding:18px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; }
        .admin-detail-label { display:block; color:#64748b; font-size:12px; margin-bottom:5px; }
        .admin-detail-value { color:#1e293b; font-weight:600; word-break:break-word; }
        .admin-detail-section h2 { margin:0 0 14px; color:#1e293b; font-size:18px; }
        .admin-detail-table-wrap { overflow:auto; }
        .admin-detail-table { width:100%; border-collapse:collapse; }
        .admin-detail-table th, .admin-detail-table td { padding:12px 14px; border-bottom:1px solid #e2e8f0; text-align:left; white-space:nowrap; }
        .admin-detail-table th { color:#475569; background:#f8fafc; font-size:12px; text-transform:uppercase; letter-spacing:.03em; }
        .admin-detail-table tbody tr:hover { background:#f8fbff; }
        .admin-participants-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; }
        .admin-participants-heading h2 { margin:0; }
        .admin-participants-heading p { margin:4px 0 0; color:#64748b; font-size:13px; }
        .admin-participants-count { padding:6px 10px; border-radius:999px; background:#eff6ff; color:#1d4ed8; font-size:12px; font-weight:700; white-space:nowrap; }
        .admin-employee-id { color:#1d4ed8; font-weight:700; }
        .admin-name-cell { color:#1e293b; font-weight:600; }
        .admin-status-badge { display:inline-block; padding:5px 9px; border-radius:999px; background:#e2e8f0; color:#475569; font-size:11px; font-weight:700; }
        .admin-status-closed, .admin-status-completed { background:#dcfce7; color:#166534; }
        .admin-status-ongoing, .admin-status-scheduled { background:#dbeafe; color:#1d4ed8; }
        .admin-status-pending, .admin-status-rejected { background:#fef3c7; color:#92400e; }
        .admin-detail-muted { color:#64748b; }
        .admin-detail-error { color:#991b1b; }
        .admin-detail-error h2 { margin-top:0; }
        @media (max-width:800px) { .admin-detail-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
        @media (max-width:520px) { .admin-detail-toolbar { flex-direction:column; } .admin-detail-grid { grid-template-columns:1fr; } .admin-participants-heading { align-items:flex-start; flex-direction:column; } }
      `}</style>
    </section>
  );
}

function DetailItem({ label, value: itemValue }) {
  return <div className="admin-detail-item"><span className="admin-detail-label">{label}</span><span className="admin-detail-value">{value(itemValue)}</span></div>;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
