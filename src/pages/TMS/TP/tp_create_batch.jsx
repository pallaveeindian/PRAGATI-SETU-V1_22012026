// src/pages/TMS/TP/tp_create_batch.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios"; // shared axios instance with interceptors [web:39][web:40]

/* =========================================================
   CONSTANTS & LIMITS
========================================================= */

const PARTICIPANT_PAGE_SIZE = 10;
const MAX_BATCH_PARTICIPANTS = 50;

/* =========================================================
   HELPERS (FROM TP CENTRE LIST)
========================================================= */

function normalizeMediaUrl(url) {
  if (!url) return "";

  // If the URL already starts with a relative path like /media/, it's perfect.
  if (url.startsWith("/media/")) {
    return url;
  }

  // If it's an absolute URL (http:// or https://), strip the domain completely
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname; // Extracts ONLY the path (e.g., "/media/uploads/file.jpg")
    } catch (error) {
      console.warn("Invalid media URL:", url);
      return url;
    }
  }

  // Fallback for any weird edge cases
  return url;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function isSunday(dateStr) {
  return new Date(dateStr).getDay() === 0;
}

async function safeDelete(fn) {
  try {
    await fn();
  } catch (e) {
    if (e?.response?.status === 404) return;
    throw e;
  }
}

/* ================= IMAGE LIGHTBOX ================= */

function ImageLightbox({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={src}
        alt="Preview"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 6,
        }}
      />
    </div>
  );
}

/* ================= VIEW MODAL ================= */

function CentreViewModal({ open, data, onClose }) {
  const [zoomImg, setZoomImg] = useState(null);
  const printRef = useRef();

  if (!open || !data) return null;

  const {
    venue_name,
    serial_number,
    centre_type,
    venue_address,
    district,
    block,
    panchayat,
    village,
    security_arrangements,
    toilets_bathrooms,
    power_water_facility,
    medical_kit,
    open_space,
    field_visit_facility,
    transport_facility,
    dining_facility,
    other_details,
    training_hall_count,
    training_hall_capacity,
    rooms = [],
    submissions = [],
  } = data;

  function handlePrint() {
    const printContents = printRef.current.innerHTML;
    const w = window.open("", "", "width=1000,height=800");
    w.document.write(`
      <html>
        <head>
          <title>Centre Details</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            td, th { border: 1px solid #ccc; padding: 8px; }
            h2, h3 { margin-top: 24px; }
            img { max-width: 180px; margin: 6px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          overflow: "auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            maxWidth: 1000,
            margin: "40px auto",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>{venue_name}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" onClick={handlePrint}>
                🖨 Print / Save PDF
              </button>
              <button className="btn-outline" onClick={onClose}>
                Back
              </button>
            </div>
          </div>

          <div ref={printRef}>
            <h3>Basic Information</h3>
            <table>
              <tbody>
                <tr>
                  <td>Serial Number</td>
                  <td>{serial_number}</td>
                </tr>
                <tr>
                  <td>Centre Type</td>
                  <td>{centre_type}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{venue_address}</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>
                    {district?.district_name_en} / {block?.block_name_en}
                    <br />
                    {panchayat?.panchayat_name_en} /{" "}
                    {village?.village_name_english}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>Facilities</h3>
            <table>
              <tbody>
                <tr>
                  <td>Security</td>
                  <td>{security_arrangements}</td>
                </tr>
                <tr>
                  <td>Toilets</td>
                  <td>{toilets_bathrooms}</td>
                </tr>
                <tr>
                  <td>Power & Water</td>
                  <td>{power_water_facility}</td>
                </tr>
                <tr>
                  <td>Medical Kit</td>
                  <td>{medical_kit ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Open Space</td>
                  <td>{open_space ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Field Visit</td>
                  <td>{field_visit_facility ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Transport</td>
                  <td>{transport_facility ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Dining</td>
                  <td>{dining_facility ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Other</td>
                  <td>{other_details || "-"}</td>
                </tr>
              </tbody>
            </table>

            <h3>Training Halls</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td>{r.room_name}</td>
                    <td>{r.room_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Media</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {submissions.map((m) => {
                const src = normalizeMediaUrl(m.file);
                return (
                  <div key={m.id} style={{ textAlign: "center" }}>
                    <img
                      src={src}
                      alt={m.category}
                      style={{ height: 100, cursor: "pointer" }}
                      onClick={() => setZoomImg(src)}
                    />
                    <div style={{ fontSize: 12 }}>{m.category}</div>
                    <button
                      onClick={async () => {
                        try {
                          const response = await api.get(
                            `/tms/submissions/${m.id}/download/`,
                            { responseType: "blob" },
                          );

                          const disposition =
                            response.headers["content-disposition"];
                          let filename = "download";

                          if (disposition) {
                            const match = disposition.match(/filename="(.+)"/);
                            if (match?.[1]) {
                              filename = match[1];
                            }
                          }

                          const blob = new Blob([response.data]);
                          const url = window.URL.createObjectURL(blob);

                          const link = document.createElement("a");
                          link.href = url;
                          link.download = filename;

                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Download failed", err);
                        }
                      }}
                    >
                      Download existing file
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox src={zoomImg} onClose={() => setZoomImg(null)} />
    </>
  );
}

/* =========================================================
   OTHER UTILITIES
========================================================= */

function rand5() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out.toUpperCase();
}

function generateBatchCode(blockName, districtName) {
  const blk = (blockName || "").substring(0, 3).toUpperCase();
  const dis = (districtName || "").substring(0, 3).toUpperCase();

  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${blk}-${dis}-${mm}${yy}-${rand5()}`;
}

function calcEndDate(startDate, days) {
  if (!startDate || !days) return null;
  const d = new Date(startDate);
  d.setDate(d.getDate() + Number(days) - 1);
  return d.toISOString().split("T")[0];
}

function isParticipantFree(p, isReviewMode = false) {
  if (isReviewMode) return true;
  return !p.remarks || p.remarks.trim() === "";
}

/* =========================================================
   PARTICIPANT TABLE (PER TR)
========================================================= */

function ParticipantTable({
  trId,
  title,
  cache,
  setCache,
  selected,
  setSelected,
  trainingType,
  batchKey,
  blockNamesCache,
  setBlockNamesCache,
  markBatchTouched,
  isReviewMode,
  usedUidsAcrossBatches,
}) {
  const cacheKey = `tr-${trId}`;
  const pageData = cache[cacheKey];
  if (!pageData) return null;

  const { list, page } = pageData;
  const availableList = list.filter(
    (p) =>
      !usedUidsAcrossBatches.has(p._uid) ||
      (selected[batchKey]?.[trId] || []).some((x) => x._uid === p._uid),
  );
  const start = (page - 1) * PARTICIPANT_PAGE_SIZE;
  const slice = availableList.slice(start, start + PARTICIPANT_PAGE_SIZE);

  function toggle(p) {
    if (!isParticipantFree(p, isReviewMode)) return;

    setSelected((prev) => {
      const perBatch = prev[batchKey] || {};
      const curr = perBatch[trId] || [];
      const exists = curr.some((x) => x._uid === p._uid);

      // REMOVE from batch → ADD back to source table
      if (exists) {
        setCache((c) => {
          const key = `tr-${trId}`;
          const pageData = c[key];
          if (!pageData) return c;

          if (pageData.list.some((x) => x._uid === p._uid)) return c;

          return {
            ...c,
            [key]: {
              ...pageData,
              list: [p, ...pageData.list],
              page: 1,
            },
          };
        });

        return {
          ...prev,
          [batchKey]: {
            ...perBatch,
            [trId]: curr.filter((x) => x._uid !== p._uid),
          },
        };
      }

      const existsInOtherBatch = Object.entries(prev).some(
        ([bk, perBatch]) =>
          bk !== batchKey &&
          Object.values(perBatch || {})
            .flat()
            .some((x) => x._uid === p._uid),
      );

      if (existsInOtherBatch) return prev;

      // ADD to batch → REMOVE from source table
      // REMOVE from source ONLY if participant is from OTHER TR
      if (p.training !== trId) {
        setCache((c) => {
          const key = `tr-${trId}`;
          const pageData = c[key];
          if (!pageData) return c;

          return {
            ...c,
            [key]: {
              ...pageData,
              list: pageData.list.filter((x) => x._uid !== p._uid),
              page: 1,
            },
          };
        });
      }

      return {
        ...prev,
        [batchKey]: {
          ...perBatch,
          [trId]: [...curr, { ...p, training: trId }],
        },
      };
    });

    markBatchTouched(batchKey);
  }

  const selectedForBatch = selected[batchKey] || {};

  async function ensureBlockName(blockId) {
    if (!blockId || blockNamesCache[blockId]) return;
    try {
      const resp = await LOOKUP_API.block_detail.retrieve(blockId, {
        fields: "block_name_en",
      });
      const name = resp?.data?.block_name_en || "";
      setBlockNamesCache((prev) => ({ ...prev, [blockId]: name }));
    } catch {
      setBlockNamesCache((prev) => ({ ...prev, [blockId]: "" }));
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h4>{title}</h4>

      <table className="table table-compact">
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Mobile</th>
            <th>Block</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((p) => {
            const blockId = p.block;
            if (blockId) {
              ensureBlockName(blockId);
            }
            const blockName = blockId ? blockNamesCache[blockId] || "" : "";
            const selectedUids = new Set(
              (selectedForBatch[trId] || []).map((x) => x._uid),
            );
            return (
              <tr key={p._uid}>
                <td>
                  <input
                    type="checkbox"
                    disabled={
                      !isParticipantFree(p, isReviewMode) ||
                      (usedUidsAcrossBatches.has(p._uid) &&
                        !(selectedForBatch[trId] || []).some(
                          (x) => x._uid === p._uid,
                        ))
                    }
                    checked={selectedUids.has(p._uid)}
                    onChange={() => toggle(p)}
                  />
                </td>
                <td>{p.full_name || p.member_name}</td>
                <td>{p.mobile_no || p.mobile}</td>
                <td>{blockName || "-"}</td>
                <td>{p.remarks || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn-sm"
          disabled={page === 1}
          onClick={() =>
            setCache((c) => ({
              ...c,
              [cacheKey]: { ...pageData, page: page - 1 },
            }))
          }
        >
          ◀ Prev
        </button>
        <button
          className="btn-sm"
          disabled={start + PARTICIPANT_PAGE_SIZE >= availableList.length}
          onClick={() =>
            setCache((c) => ({
              ...c,
              [cacheKey]: { ...pageData, page: page + 1 },
            }))
          }
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   COMBINED PARTICIPANT SELECTOR
========================================================= */

function CombinedParticipantSelector({
  trainingReq,
  participantCache,
  setParticipantCache,
  selectedParticipants,
  setSelectedParticipants,
  batchKey,
  blockNamesCache,
  setBlockNamesCache,
  markBatchTouched,
  usedUidsAcrossBatches,
}) {
  const [blocks, setBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [loadingTRs, setLoadingTRs] = useState(false);
  const [blockTRs, setBlockTRs] = useState([]);
  const [loadingTRParticipants, setLoadingTRParticipants] = useState({});

  const districtId =
    trainingReq?.district?.district_id ?? trainingReq?.district;
  const baseTrainingPlanId = trainingReq?.training_plan?.id;
  const baseStatus = trainingReq?.status;
  const baseType = trainingReq?.training_type;
  const openedTRId = trainingReq?.id;

  useEffect(() => {
    if (!districtId) return;

    setLoadingBlocks(true);

    LOOKUP_API.blocksByDistrict(districtId)
      .then((r) => {
        const data = r?.data;

        if (Array.isArray(data)) {
          setBlocks(data);
        } else if (Array.isArray(data?.results)) {
          setBlocks(data.results);
        } else {
          setBlocks([]);
        }
      })
      .finally(() => setLoadingBlocks(false));
  }, [districtId]);

  async function loadTRsForBlock(blockId) {
    if (!blockId || !baseTrainingPlanId || !baseType || !baseStatus) return;
    setLoadingTRs(true);
    try {
      const resp = await api.get("/tms/training-requests/", {
        params: {
          block: blockId,
          training_plan: baseTrainingPlanId,
          status: baseStatus,
          training_type: baseType,
        },
      });
      const results = (resp?.data?.results || []).filter(
        (tr) => tr.id !== openedTRId,
      );
      setBlockTRs(results);
    } finally {
      setLoadingTRs(false);
    }
  }

  // async function loadParticipantsForTR(tr) {
  //   if (participantCache[`tr-${tr.id}`]) return;
  //   setLoadingTRParticipants((s) => ({ ...s, [tr.id]: true }));
  //   try {
  //     const resp = await api.get(`/tms/training-requests/${tr.id}/detail/`);
  //     // const list =
  //     //   baseType === "BENEFICIARY"
  //     //     ? resp.data.beneficiary_registrations.map((x) => ({
  //     //         ...x,
  //     //         id: x.beneficiary,
  //     //         tr_participation_id: x.id,
  //     //         training: tr.id,
  //     //         // _uid: `${tr.id}-${x.beneficiary}`,
  //     //         _uid: `trp-${x.id}`

  //     //       }))
  //     //     : resp.data.trainer_registrations.map((x) => ({
  //     //         ...x,
  //     //         id: x.trainer,
  //     //         tr_participation_id: x.id,
  //     //         training: tr.id,
  //     //         _uid: `${tr.id}-${x.trainer}`,
  //     //       }));

  //     const list =
  // baseType === "BENEFICIARY"
  //   ? resp.data.beneficiary_registrations.map((x) => ({
  //       ...x,
  //       id: x.beneficiary ?? x.id,   // <-- ensures id is never null
  //       tr_participation_id: x.id,
  //       training: tr.id,
  //       _uid: `trp-${x.id}`
  //     }))
  //   : resp.data.trainer_registrations.map((x) => ({
  //       ...x,
  //       id: x.trainer ?? x.id,       // <-- ensures id is never null
  //       tr_participation_id: x.id,
  //       training: tr.id,
  //       _uid: `${tr.id}-${x.trainer ?? x.id}`,
  //     }));

  //     setParticipantCache((old) => ({
  //       ...old,
  //       [`tr-${tr.id}`]: {
  //         list: list,
  //         page: 1,
  //         total: list.length,
  //       },
  //     }));
  //   } finally {
  //     setLoadingTRParticipants((s) => ({ ...s, [tr.id]: false }));
  //   }
  // }
  async function loadParticipantsForTR(tr) {
    if (participantCache[`tr-${tr.id}`]) return;
    setLoadingTRParticipants((s) => ({ ...s, [tr.id]: true }));

    try {
      const resp = await api.get(`/tms/training-requests/${tr.id}/detail/`);

      const list =
        trainingReq.training_type === "BENEFICIARY"
          ? resp.data.beneficiary_registrations.map((x) => ({
            ...x,
            // id: x.beneficiary ?? x.id,             // ✅ fallback to participation id
            // tr_participation_id: x.id,
            // training: tr.id,
            // _uid: `trp-${x.id}`,
            id: x.id, // Primary Key of TRBeneficiary
            training: tr.id,
            _uid: `trp-${x.id}`, // ✅ Standardized UID
            // _uid: `reg-${x.id}`
          }))
          : resp.data.trainer_registrations.map((x) => ({
            ...x,
            id: x.id, // Primary Key of TRTrainer
            training: tr.id,
            _uid: `trp-${x.id}`, // ✅ Standardized UID
            // _uid: `reg-${x.id}`
            // id: x.trainer ?? x.id,                 // ✅ fallback to participation id
            // tr_participation_id: x.id,
            // training: tr.id,
            // _uid: `trp-${x.id}`,
          }));

      setParticipantCache((old) => ({
        ...old,
        [`tr-${tr.id}`]: {
          list,
          page: 1,
          total: list.length,
        },
      }));
    } finally {
      setLoadingTRParticipants((s) => ({ ...s, [tr.id]: false }));
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h4>Select Participants from other Blocks</h4>
      <p>
        Use this only to fill batch size after selecting from current Training
        Request.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Block</label>
          <select
            className="input"
            value={selectedBlockId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedBlockId(val);
              setBlockTRs([]);
              if (val) loadTRsForBlock(val);
            }}
          >
            <option value="">-- Select Block --</option>
            {loadingBlocks ? (
              <option>Loading…</option>
            ) : (
              blocks.map((b) => (
                <option key={b.block_id} value={b.block_id}>
                  {b.block_name_en}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {loadingTRs ? (
        <p>Searching Training Requests…</p>
      ) : blockTRs.length === 0 ? (
        <p>No Training Requests found for this block.</p>
      ) : (
        <div style={{ marginTop: 8 }}>
          <h5>Training Requests in selected block</h5>
          <table className="table table-compact">
            <thead>
              <tr>
                <th>TR ID</th>
                <th>Block</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {blockTRs.map((tr) => (
                <tr key={tr.id}>
                  <td>{tr.id}</td>
                  <td>{tr.block_name_en}</td>
                  <td>
                    <button
                      className="btn-sm"
                      disabled={loadingTRParticipants[tr.id]}
                      onClick={() => loadParticipantsForTR(tr)}
                    >
                      {loadingTRParticipants[tr.id]
                        ? "Loading…"
                        : "Select Participants"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {blockTRs.map((tr) =>
            participantCache[`tr-${tr.id}`] ? (
              <ParticipantTable
                key={tr.id}
                trId={tr.id}
                title={`Participants of TR #${tr.id}`}
                cache={participantCache}
                setCache={setParticipantCache}
                selected={selectedParticipants}
                setSelected={setSelectedParticipants}
                trainingType={baseType}
                batchKey={batchKey}
                blockNamesCache={blockNamesCache}
                setBlockNamesCache={setBlockNamesCache}
                markBatchTouched={markBatchTouched}
                isReviewMode={false}
                usedUidsAcrossBatches={usedUidsAcrossBatches}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PREVIEW MODAL
========================================================= */

// function PreviewModal({ open, payload, onClose, onConfirm, disabled }) {
//   if (!open) return null;

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-card" style={{ maxWidth: 500 }}>
//         <h3>Confirm Proposal</h3>

//         <p style={{ marginTop: 12, fontSize: 15 }}>
//           Are you sure you want to propose this training request to <b>DMMU</b>?
//         </p>

//         <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
//           <button className="btn-outline" onClick={onClose}>
//             Back
//           </button>

//           <button
//             className="btn btn-primary"
//             disabled={disabled}
//             onClick={onConfirm}
//           >
//             Propose to DMMU
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* ================= PREVIEW MODAL (UPDATED) ================= */

function PreviewModal({ open, payload, onClose, onConfirm, disabled, trainingReq }) {
  if (!open || !payload) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
    }}>
      <div className="modal-card" style={{
        maxWidth: '800px', width: '90%', maxHeght: '90vh',
        background: '#fff', borderRadius: '12px', padding: '24px',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ borderBottom: '1px solid #eee', marginBottom: '16px', paddingBottom: '8px' }}>
          <h2 style={{ margin: 0, color: '#2b4e72' }}>Batch Proposal Summary</h2>
          <p style={{ margin: '4px 0', color: '#666' }}>Please review the batch details before proposing to DMMU.</p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
          {payload.batches.map((item, idx) => {
            const { batch, participants } = item;
            return (
              <div key={idx} style={{
                border: '1px solid #e0e7ff', borderRadius: '8px',
                padding: '16px', marginBottom: '16px', background: '#fcfdff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#3d6ba6' }}>Batch {idx + 1}: {batch.code}</h4>
                  <span className="badge" style={{ background: '#e0e7ff', color: '#3d6ba6', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                    {participants.length} Participants
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <label style={{ color: '#888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Centre</label>
                    {/* We pass the name via payload in the next step */}
                    <strong>{batch.venue_name || "Selected Centre"}</strong>
                  </div>
                  <div>
                    <label style={{ color: '#888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Batch Type</label>
                    <strong>{batch.batch_type}</strong>
                  </div>
                  <div>
                    <label style={{ color: '#888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Start Date</label>
                    <strong>{batch.start_date}</strong>
                  </div>
                  <div>
                    <label style={{ color: '#888', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>End Date</label>
                    <strong>{batch.end_date}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <button className="btn-outline" onClick={onClose} style={{ padding: '10px 20px' }}>
            ← Back to Edit
          </button>

          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={onConfirm}
            style={{ padding: '10px 24px', background: '#3d6ba6', color: '#fff', border: 'none', borderRadius: '6px' }}
          >
            {disabled ? "Processing..." : "Confirm & Propose to DMMU"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function deleteAllExistingBatchesAndParticipants(trainingReq) {
  const resp = await TMS_API.batches.list({
    request: trainingReq.id,
    page_size: 100,
    _t: Date.now(),
  });

  const batches = resp?.data?.results || [];

  for (const b of batches) {
    const { data: detail } = await api.get(`/tms/batches/${b.id}/detail`);

    // Delete batch participants FIRST
    if (trainingReq.training_type === "BENEFICIARY") {
      for (const bp of detail.beneficiary_participations || []) {
        await safeDelete(() => TMS_API.batchBeneficiaries.destroy(bp.id));
      }
    } else {
      for (const tp of detail.trainer_participations || []) {
        await safeDelete(() => TMS_API.batchTrainers.destroy(tp.id));
      }
    }

    // Then delete batch
    await safeDelete(() => TMS_API.batches.destroy(b.id));
  }
}

/* =========================================================
   SUBMIT SECTION + EXECUTION
========================================================= */

function BatchSubmitSection({
  disabled,
  trainingReq,
  batches,
  participantSelections,
  user,
  isReviewMode,
  deletedParticipantIds,
  deletedBatchIds,
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [payload, setPayload] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // function buildPayload() {
  //   const batchItems = batches.map((b) => {
  //     const perBatchSel = participantSelections[b.key] || {};
  //     const allParticipants = Object.values(perBatchSel).flat();

  //     // --------------------------
  //     // CHANGE 1: Use optional chaining (?.) and default values
  //     // Ensures that if a field is missing, the payload still gets valid default values
  //     // --------------------------
  //     return {
  //       batch: {
  //         request: trainingReq?.id || null, // safely handle missing trainingReq
  //         centre: b?.centre?.id || b?.centre || null, // safely handle missing centre
  //         batch_type: b?.batchType || "", // empty string fallback
  //         start_date: b?.startDate || "", // empty string fallback
  //         end_date: b?.endDate || "", // empty string fallback
  //         status: "PENDING",
  //         code: generateBatchCode(
  //           trainingReq?.block?.block_name_en, // optional chaining
  //           trainingReq?.district?.district_name_en, // optional chaining
  //         ),
  //         created_by: user?.id || null, // optional chaining
  //       },

  //       // --------------------------
  //       // CHANGE 2: Participants array is always an array
  //       // Handles the case when no participants are selected
  //       // --------------------------
  //       participants: allParticipants.map((p) => ({
  //         id: p?.id || null, // optional chaining
  //         tr: p?.training || null, // optional chaining
  //       })),
  //     };
  //   });

  //   return { batches: batchItems };
  // }

  // async function execute() {
  //   setSubmitting(true);

  //   try {
  //     // 🔥 REVIEW MODE = FULL RESET
  //     if (isReviewMode) {
  //       await deleteAllExistingBatchesAndParticipants(trainingReq);
  //     }

  //     const payload = buildPayload();

  //     for (const item of payload.batches) {
  //       const { batch, participants } = item;

  //       // ALWAYS CREATE NEW BATCH
  //       const created = await TMS_API.batches.create({
  //         request: trainingReq.id,
  //         centre: batch.centre,
  //         batch_type: batch.batch_type,
  //         start_date: batch.start_date,
  //         end_date: batch.end_date,
  //         code: batch.code,
  //         status: "PENDING",
  //         created_by: user.id,
  //       });

  //       const batchId = created.data.id;

  //       const ids = participants.map((p) => p.id);

  //       await api.post(
  //         `/tms/batches/${batchId}/attach-participants/`,
  //         trainingReq.training_type === "BENEFICIARY"
  //           ? { beneficiary_ids: ids }
  //           : { trainer_ids: ids },
  //       );
  //     }

  //     await api.patch(`/tms/training-requests/${trainingReq.id}/`, {
  //       status: "PENDING",
  //       updated_by: user.id,
  //     });

  //     alert("Batches submitted successfully !");
  //     window.location.href = "/tms/training-requests";
  //   } catch (e) {
  //     console.error(e);
  //     alert("Failed to update batches");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }

  // async function execute() {
  //   console.log("EXECUTE STARTED");
  //   setSubmitting(true);

  //   try {
  //     for (let i = 0; i < batches.length; i++) {
  //       const b = batches[i];
  //       const perBatchSel = participantSelections[b.key] || {};
  //       const count = Object.values(perBatchSel).flat().length;

  //       console.log(`Batch ${b.title} count:`, count);

  //       if (count < 1) {
  //         alert(`"${b.title}" must have at least 1 participant`);
  //         setSubmitting(false);
  //         return;
  //       }
  //     }

  //     if (isReviewMode) {
  //       console.log("Deleting old batches...");
  //       await deleteAllExistingBatchesAndParticipants(trainingReq);
  //     }

  //     const payload = buildPayload();
  //     console.log("Payload:", payload);

  //     for (const item of payload.batches) {
  //       const { batch, participants } = item;

  //       console.log("Creating batch:", batch);
  //       console.log("Participants:", participants);

  //       const created = await TMS_API.batches.create({
  //         request: trainingReq.id,
  //         centre: batch.centre,
  //         batch_type: batch.batch_type,
  //         start_date: batch.start_date,
  //         end_date: batch.end_date,
  //         code: batch.code,
  //         status: "PENDING",
  //         created_by: user.id,
  //       });

  //       const batchId = created.data.id;
  //       console.log("Batch created ID:", batchId);

  //       const ids = participants.map((p) => p.id);
  //       console.log("Participant IDs:", ids);

  //       await api.post(
  //         `/tms/batches/${batchId}/attach-participants/`,
  //         trainingReq.training_type === "BENEFICIARY"
  //           ? { beneficiary_ids: ids }
  //           : { trainer_ids: ids },
  //       );

  //       console.log("Participants attached");
  //     }

  //     await api.patch(`/tms/training-requests/${trainingReq.id}/`, {
  //       status: "PENDING",
  //       updated_by: user.id,
  //     });

  //     alert("SUCCESS ✅");
  //   } catch (e) {
  //     console.error("ERROR ❌:", e);
  //     alert(e?.response?.data?.detail || "Failed to update batches");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }

  // Inside BatchSubmitSection component:

  function buildPayload() {
    const batchItems = batches.map((b) => {
      const perBatchSel = participantSelections[b.key] || {};
      const allParticipants = Object.values(perBatchSel).flat();

      return {
        batch: {
          request: trainingReq?.id || null,
          centre: b?.centre?.id || b?.centre || null,
          venue_name: b?.centre?.venue_name || "N/A", // ADD THIS LINE
          batch_type: b?.batchType || "",
          start_date: b?.startDate || "",
          end_date: b?.endDate || "",
          status: "PENDING",
          code: generateBatchCode(
            trainingReq?.block?.block_name_en,
            trainingReq?.district?.district_name_en,
          ),
          created_by: user?.id || null,
        },
        participants: allParticipants.map((p) => ({
          id: p?.id || null,
          tr: p?.training || null,
        })),
      };
    });

    return { batches: batchItems };
  }

  const navigate = useNavigate();
  function validateAllBatches() {
    const totalParticipantsList =
      trainingReq.training_type === "BENEFICIARY"
        ? trainingReq?.beneficiary_registrations || []
        : trainingReq?.trainer_registrations || [];

    const totalIds = totalParticipantsList.map((p) => Number(p.id));

    let allSelectedIds = [];

    for (let i = 0; i < batches.length; i++) {
      const b = batches[i];
      const perBatchSel = participantSelections[b.key] || {};

      const selectedIds = Object.values(perBatchSel)
        .flat()
        .map((p) => Number(typeof p === "object" ? p.id : p))
        .filter(Boolean);

      console.log(`Batch ${b.title} selected IDs:`, selectedIds);

      // ❌ Batch empty
      if (selectedIds.length < 1) {
        alert(`"${b.title}" must have at least 1 participant`);
        return false;
      }

      allSelectedIds.push(...selectedIds);
    }

    const uniqueSelectedIds = [...new Set(allSelectedIds)];

    console.log("Total IDs:", totalIds);
    console.log("All Selected:", uniqueSelectedIds);

    // ❌ Missing participants
    // if (uniqueSelectedIds.length !== totalIds.length) {
    //   const missing = totalIds.filter((id) => !uniqueSelectedIds.includes(id));

    //   alert(`Missing participants: ${missing.join(", ")}`);
    //   return false;
    // }

    // return true;
    const missingCount = totalIds.filter(
      (id) => !uniqueSelectedIds.includes(id),
    ).length;

    // Only fail if there are ACTUALLY missing participants from the base TR
    if (missingCount > 0) {
      alert(
        `${missingCount} participant${missingCount > 1 ? "s" : ""
        } left to select`,
      );
      return false;
    }

    return true;
  }
  async function execute() {
    console.log("EXECUTE STARTED");
    setSubmitting(true);

    try {
      if (!validateAllBatches()) {
        setSubmitting(false);
        return;
      }

      //  REVIEW MODE CLEANUP
      if (isReviewMode) {
        console.log("Deleting old batches...");
        await deleteAllExistingBatchesAndParticipants(trainingReq);
      }

      const payload = buildPayload();
      console.log("Payload:", payload);

      // 🚀 CREATE BATCHES
      for (const item of payload.batches) {
        const { batch, participants } = item;

        console.log("Creating batch:", batch);
        console.log("Participants:", participants);

        const created = await TMS_API.batches.create({
          request: trainingReq.id,
          centre: batch.centre,
          batch_type: batch.batch_type,
          start_date: batch.start_date,
          end_date: batch.end_date,
          code: batch.code,
          status: "PENDING",
          created_by: user.id,
        });

        const batchId = created.data.id;
        console.log("Batch created ID:", batchId);
        const ids = participants.map((p) => p.id);
        console.log("Participant IDs:", ids);

        await api.post(
          `/tms/batches/${batchId}/attach-participants/`,
          trainingReq.training_type === "BENEFICIARY"
            ? { beneficiary_ids: ids }
            : { trainer_ids: ids },
        );

        console.log("Participants attached");
      }

      // ✅ UPDATE TRAINING REQUEST STATUS
      await api.patch(`/tms/training-requests/${trainingReq.id}/`, {
        status: "PENDING",
        updated_by: user.id,
      });

      alert("SUCCESS ✅");
      setTimeout(() => {
        navigate("/tms/training-requests");
      }, 500);
    } catch (e) {
      console.error("ERROR ❌:", e);
      alert(e?.response?.data?.detail || "Failed to update batches");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* <button
        className="btn btnPrimary"
        disabled={disabled}
        onClick={() => {
          // 🔒 HARD VALIDATION: each batch must have ≥ 1 participant
          // for (let i = 0; i < batches.length; i++) {
          //   const b = batches[i];
          //   const perBatchSel = participantSelections[b.key] || {};
          //   const count = Object.values(perBatchSel).flat().length;

          //   if (count < 1) {
          //     alert(`"${b.title}" must have at least 1 participant`);
          //     return;
          //   }
          // }
          for (let i = 0; i < batches.length; i++) {
            const b = batches[i];
            const perBatchSel = participantSelections[b.key] || {};
            const selectedCount = Object.values(perBatchSel).flat().length;

            const totalParticipants =
              trainingReq.training_type === "BENEFICIARY"
                ? trainingReq.beneficiary_registrations.length
                : trainingReq.trainer_registrations.length;

            console.log(`Batch ${b.title} selected:`, selectedCount);
            console.log(`Total participants:`, totalParticipants);

            if (selectedCount !== totalParticipants) {
              alert(
                `"${b.title}" must include ALL participants.\nSelected: ${selectedCount} / Total: ${totalParticipants}`,
              );
              setSubmitting(false);
              return;
            }
          }

          const p = buildPayload();
          setPayload(p);
          setPreviewOpen(true);
        }}
      >
        {isReviewMode
          ? "Resubmit Revised Batches"
          : "Preview All Created Batches"}
      </button> */}
      <button
        className="btn btnPrimary"
        disabled={disabled}
        onClick={() => {
          //  TOTAL participants in TR
          // const totalParticipants =
          //   trainingReq.training_type === "BENEFICIARY"
          //     ? trainingReq?.beneficiary_registrations?.length || 0
          //     : trainingReq?.trainer_registrations?.length || 0;

          // for (let i = 0; i < batches.length; i++) {
          //   const b = batches[i];
          //   const perBatchSel = participantSelections[b.key] || {};
          //   const selectedCount = Object.values(perBatchSel).flat().length;

          //   console.log(`Batch ${b.title} selected:`, selectedCount);
          //   console.log(`Total participants:`, totalParticipants);

          //   //  No participants
          //   if (selectedCount < 1) {
          //     alert(`"${b.title}" must have at least 1 participant`);
          //     return;
          //   }

          //   //  Not all selected
          //   if (selectedCount !== totalParticipants) {
          //     alert(
          //       `"${b.title}" must include ALL participants.\nSelected: ${selectedCount} / Total: ${totalParticipants}`,
          //     );
          //     return;
          //   }
          // }

          if (!validateAllBatches()) return;
          //  Only opens preview if validation passes
          const p = buildPayload();
          setPayload(p);
          setPreviewOpen(true);
        }}
      >
        {isReviewMode
          ? "Resubmit Revised Batches"
          : "Preview All Created Batches"}
      </button>
      {/* <PreviewModal
        open={previewOpen}
        payload={payload}
        disabled={submitting}
        onClose={() => setPreviewOpen(false)}
        onConfirm={execute}
      /> */}

      <PreviewModal
        open={previewOpen}
        payload={payload}
        disabled={submitting}
        trainingReq={trainingReq} // ADD THIS
        onClose={() => setPreviewOpen(false)}
        onConfirm={execute}
      />

    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TpCreateBatch() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const requestId = id;
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loadingTR, setLoadingTR] = useState(true);
  const [trainingReq, setTrainingReq] = useState(null);
  const [themeName, setThemeName] = useState("");
  const isReviewMode =
    trainingReq && String(trainingReq.status).toUpperCase() === "REJECTED";

  const [participantCache, setParticipantCache] = useState({});
  const [deletedBatchIds, setDeletedBatchIds] = useState([]);
  const [deletedParticipantIds, setDeletedParticipantIds] = useState([]);
  const [batches, setBatches] = useState([
    {
      key: "batch-1",
      title: "Batch 1",
      batchType: "",
      centre: null,
      startDate: "",
      endDate: "",
      expanded: true,
      errors: [],
      touched: false,
    },
  ]);
  const activeBatchKeyRef = useRef(null);
  useEffect(() => {
    // Ensure there is always an active batch
    if (!activeBatchKeyRef.current && batches.length > 0) {
      activeBatchKeyRef.current = batches[0].key;
    }
  }, [batches]);

  const [participantSelections, setParticipantSelections] = useState({});

  const usedUidsAcrossBatches = useMemo(() => {
    const set = new Set();

    Object.values(participantSelections).forEach((perBatch) => {
      Object.values(perBatch || {}).forEach((arr) => {
        arr.forEach((p) => set.add(p._uid));
      });
    });

    return set;
  }, [participantSelections]);

  const [loadingCentres, setLoadingCentres] = useState(false);
  const [centres, setCentres] = useState([]);
  const [centrePreview, setCentrePreview] = useState(null);
  const [viewLoadingId, setViewLoadingId] = useState(null);

  const [globalErrors, setGlobalErrors] = useState([]);

  const [blockNamesCache, setBlockNamesCache] = useState({});

  useEffect(() => {
    async function loadTR() {
      setLoadingTR(true);
      try {
        const r = await api.get(`/tms/training-requests/${requestId}/detail/`);
        setTrainingReq(r.data);

        if (r.data.training_plan?.theme) {
          const t = await api.get(
            `/tms/training-themes/${r.data.training_plan.theme}/`,
          );
          setThemeName(t.data.theme_name);
        }

        const seed = {};
        const list =
          r.data.training_type === "BENEFICIARY"
            ? r.data.beneficiary_registrations.map((x) => ({
              ...x,
              id: x.id, // Primary key of TRBeneficiary
              training: requestId,
              _uid: `trp-${x.id}`, // ✅ Standardized UID
              // _uid: `reg-${x.id}`
              // id: x.beneficiary,
              // tr_participation_id: x.id,
              // training: requestId,
              // // _uid: `${requestId}-${x.beneficiary}`,
              // _uid: `trp-${x.id}`
            }))
            : r.data.trainer_registrations.map((x) => ({
              ...x,
              id: x.id, // Primary key of TRTrainer
              training: requestId,
              _uid: `trp-${x.id}`, // ✅ Standardized UID
              // _uid: `reg-${x.id}`
              // id: x.trainer,
              // tr_participation_id: x.id,
              // training: requestId,
              // _uid: `${requestId}-${x.trainer}`,
            }));

        seed[`tr-${requestId}`] = {
          list,
          page: 1,
          total: list.length,
        };
        setParticipantCache(seed);
      } finally {
        setLoadingTR(false);
      }
    }

    loadTR();
  }, [requestId]);

  useEffect(() => {
    if (!trainingReq || !isReviewMode) return;

    async function loadExistingBatches() {
      try {
        const resp = await TMS_API.batches.list({
          request: trainingReq.id,
          page_size: 50,
          _t: Date.now(),
        });

        const existing = (resp?.data?.results || []).filter(
          (b) => b.is_active === true,
        );

        if (!existing.length) {
          setBatches([]);
          return;
        }
        const batchState = [];
        const participantState = {};

        for (let i = 0; i < existing.length; i++) {
          const b = existing[i];

          // IMPORTANT: use /detail serializer
          const { data: detail } = await api.get(`/tms/batches/${b.id}/detail`);

          const key = `batch-${i + 1}`;

          batchState.push({
            key,
            id: b.id,
            title: `Batch ${i + 1} (Revised)`,
            batchType: b.batch_type,
            centre:
              b.centre && typeof b.centre !== "object"
                ? { id: b.centre }
                : b.centre,
            startDate: b.start_date,
            endDate: b.end_date,
            expanded: true,
            touched: false,
            errors: [],
          });

          participantState[key] = {};

          // ---------------------------
          // BENEFICIARY PARTICIPANTS
          // ---------------------------
          if (trainingReq.training_type === "BENEFICIARY") {
            for (const ben of detail.beneficiary || []) {
              const trId = ben.training;

              if (!participantState[key][trId]) {
                participantState[key][trId] = [];
              }

              participantState[key][trId].push({
                ...ben,
                // id: ben.id,
                // training: trId,
                // tr_participation_id: ben.tr_participation_id || ben.id,
                id: ben.beneficiary ?? ben.id,
                training: trId,
                tr_participation_id: ben.tr_participation_id || ben.id,
                batch_participation_id:
                  detail.beneficiary_participations.find(
                    (x) => x.beneficiary === ben.id,
                  )?.id || null,
                // _uid: `${trId}-${ben.id}`,
                // _uid: `trp-${ben.tr_participation_id || ben.id}`,
                // _uid: `trp-${ben.tr_participation_id || ben.id}`,
                _uid: `trp-${ben.id}`, // ✅ Synchronized UID
                __selected: true,
              });
            }
          }

          // ---------------------------
          // TRAINER PARTICIPANTS
          // ---------------------------
          if (trainingReq.training_type === "TRAINER") {
            for (const tr of detail.trainer || []) {
              const trId = tr.training;

              if (!participantState[key][trId]) {
                participantState[key][trId] = [];
              }

              participantState[key][trId].push({
                ...tr,
                id: tr.id,
                training: trId,
                tr_participation_id: tr.tr_participation_id || tr.id,
                batch_participation_id:
                  detail.trainer_participations.find((x) => x.trainer === tr.id)
                    ?.id || null,
                // _uid: `${trId}-${tr.id}`,
                // _uid: `trp-${tr.tr_participation_id || tr.id}`,
                _uid: `trp-${tr.id}`, // ✅ Synchronized UID
                __selected: true,
              });
            }
          }
        }

        setBatches(batchState);
        setParticipantSelections(participantState);
        setParticipantCache((c) => {
          const key = `tr-${trainingReq.id}`;
          const pageData = c[key];
          if (!pageData) return c;

          const selectedUids = new Set(
            Object.values(participantState)
              .flatMap((perBatch) => Object.values(perBatch).flat())
              .map((p) => p._uid),
          );

          return {
            ...c,
            [key]: {
              ...pageData,
              list: pageData.list.filter((p) => !selectedUids.has(p._uid)),
              page: 1,
            },
          };
        });
      } catch (e) {
        console.error("Failed to load existing batches", e);
      }
    }

    loadExistingBatches();
  }, [trainingReq]);

  useEffect(() => {
    if (!user?.id) return;

    async function loadCentres() {
      setLoadingCentres(true);
      try {
        const tp = await TMS_API.trainingPartners.list({
          search: user.id,
          fields: "id",
        });
        const tpId = tp?.data?.results?.[0]?.id;
        if (!tpId) return;

        const c = await TMS_API.trainingPartnerCentres.list({
          partner: tpId,
          page_size: 500,
        });
        setCentres(c?.data?.results || []);
      } finally {
        setLoadingCentres(false);
      }
    }

    loadCentres();
  }, [user]);

  useEffect(() => {
    // recalc errors for each batch based on current batch fields + selections
    setBatches((prev) =>
      prev.map((b) => {
        const perBatchSel = participantSelections[b.key] || {};
        const count = Object.values(perBatchSel).flat().length;
        const errs = [];

        if (!b.batchType) errs.push("Batch Type not selected");
        if (count === 0) errs.push("No participants selected");
        if (count > MAX_BATCH_PARTICIPANTS)
          errs.push("Participant limit exceeded (50 max)");
        if (!b.centre) errs.push("Centre not selected");
        if (!b.startDate) errs.push("Start date not selected");

        return { ...b, errors: errs };
      }),
    );
  }, [
    participantSelections,
    centres.length,
    trainingReq,
    JSON.stringify(
      batches.map((b) => ({
        key: b.key,
        batchType: b.batchType,
        centreId: b.centre?.id || null,
        startDate: b.startDate,
      })),
    ),
  ]);

  useEffect(() => {
    const hasAnyErrors = batches.some((b) => b.touched && b.errors.length > 0);
    setGlobalErrors(
      hasAnyErrors ? ["Please resolve errors in all batches"] : [],
    );
  }, [batches]);

  function updateBatch(key, patch, markTouched = false) {
    setBatches((prev) =>
      prev.map((b) =>
        b.key === key
          ? { ...b, ...patch, touched: markTouched ? true : b.touched }
          : b,
      ),
    );
  }

  function markBatchTouched(key) {
    setBatches((prev) =>
      prev.map((b) => (b.key === key ? { ...b, touched: true } : b)),
    );
  }

  function addBatch() {
    const idx = batches.length + 1;
    setBatches((prev) => [
      ...prev,
      {
        key: `batch-${idx}`,
        title: `Batch ${idx}`,
        batchType: "",
        centre: null,
        startDate: "",
        endDate: "",
        expanded: true,
        errors: [],
        touched: false,
      },
    ]);
  }

  function removeBatch(key) {
    setBatches((prev) => {
      const b = prev.find((x) => x.key === key);
      if (b?.id) {
        setDeletedBatchIds((ids) => [...ids, b.id]);
      }
      return prev.filter((x) => x.key !== key);
    });

    setParticipantSelections((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function removeParticipantFromBatch(batchKey, trId, participant) {
    if (participant.batch_participation_id) {
      setDeletedParticipantIds((prev) =>
        prev.includes(participant.batch_participation_id)
          ? prev
          : [...prev, participant.batch_participation_id],
      );
    }

    setParticipantSelections((prev) => {
      const next = {};
      for (const bk of Object.keys(prev)) {
        const perBatch = prev[bk] || {};
        next[bk] = {
          ...perBatch,
          [trId]: (perBatch[trId] || []).filter(
            (p) => p._uid !== participant._uid,
          ),
        };
      }
      return next;
    });

    setParticipantCache((c) => {
      const key = `tr-${trId}`;
      const pageData = c[key];
      if (!pageData) return c;

      // prevent duplicates
      if (pageData.list.some((p) => p._uid === participant._uid)) {
        return c;
      }

      return {
        ...c,
        [key]: {
          ...pageData,
          list: [participant, ...pageData.list],
          page: 1,
        },
      };
    });

    markBatchTouched(batchKey);
  }

  async function handleViewCentre(id) {
    setViewLoadingId(id);
    try {
      const d = await api.get(`/tms/training-partner-centres/${id}/detail/`);
      setCentrePreview(d.data);
    } finally {
      setViewLoadingId(null);
    }
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav
          left={
            <div className="app-title">
              {isReviewMode ? "Review & Modify Batches" : "Create Batches"}
            </div>
          }
        /> */}

          <main
            style={{
              padding: 18,
              minHeight: "100vh", // UPDATED UI
            }}
          >
            {loadingTR ? (
              <p>Loading Training Request…</p>
            ) : !trainingReq ? (
              <p>Training Request not found</p>
            ) : (
              <>
                {/* TRAINING REQUEST SUMMARY */}
                <div
                  className="card"
                  style={{
                    background: "#fff", // UPDATED UI
                    borderRadius: 10, // UPDATED UI
                    padding: 20, // UPDATED UI
                    borderLeft: "6px solid #3d6ba6", // UPDATED UI
                    boxShadow: "0 6px 14px rgba(0,0,0,0.08)", // UPDATED UI
                  }}
                >
                  <h3 style={{ color: "#2b4e72" }}>
                    {trainingReq.training_plan.training_name}
                  </h3>

                  <p>
                    Theme: <b style={{ color: "#3d6ba6" }}>{themeName}</b>
                  </p>

                  <p>
                    Type: <b>{trainingReq.training_type}</b> | Level:{" "}
                    <b>{trainingReq.level}</b> | Status:{" "}
                    <b style={{ color: "#3d6ba6" }}>{trainingReq.status}</b>
                  </p>

                  <p>
                    Location:{" "}
                    <b>
                      {trainingReq.district?.district_name_en} /{" "}
                      {trainingReq.block?.block_name_en}
                    </b>
                  </p>
                </div>

                {/* ADD BATCH BUTTON */}
                <div style={{ marginTop: 16, marginBottom: 8 }}>
                  <button
                    className="btn btnPrimary"
                    style={{
                      background: "#3d6ba6", // UPDATED UI
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={addBatch}
                  >
                    + Add Batch
                  </button>
                </div>

                {batches.map((batch) => {
                  const perBatchSel = participantSelections[batch.key] || {};
                  const selectedList = Array.from(
                    new Map(
                      Object.values(perBatchSel)
                        .flat()
                        .map((p) => [p._uid, p]),
                    ).values(),
                  );

                  const count = selectedList.length;

                  return (
                    <div
                      key={batch.key}
                      className="card"
                      style={{
                        marginTop: 12,
                        background: "#fff", // UPDATED UI
                        borderRadius: 10,
                        padding: 18,
                        boxShadow: "0 6px 14px rgba(0,0,0,0.08)", // UPDATED UI
                        borderLeft: "6px solid #5a8cc2", // UPDATED UI
                      }}
                    >
                      {/* BATCH HEADER */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          activeBatchKeyRef.current = batch.key;
                          updateBatch(batch.key, { expanded: !batch.expanded });
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            flex: 1,
                            color: "#2b4e72", // UPDATED UI
                          }}
                        >
                          {batch.title}
                          <span style={{ fontSize: 12, color: "#5a8cc2" }}>
                            {" "}
                            ({count} participants)
                          </span>
                        </h4>

                        {batches.length > 1 && (
                          <button
                            className="btn-sm btn-outline"
                            style={{
                              borderColor: "#3d6ba6", // UPDATED UI
                              color: "#3d6ba6",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBatch(batch.key);
                            }}
                          >
                            Delete
                          </button>
                        )}

                        <span style={{ marginLeft: 8 }}>
                          {batch.expanded ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* BATCH CONTENT */}
                      {batch.expanded && (
                        <div style={{ marginTop: 12 }}>
                          {/* BATCH TYPE */}
                          <div
                            className="card"
                            style={{
                              marginTop: 8,
                              padding: 16,
                              borderRadius: 8,
                              background: "#f8fbff", // UPDATED UI
                            }}
                          >
                            <label>Batch Type</label>

                            <select
                              className="input"
                              value={batch.batchType}
                              onChange={(e) =>
                                updateBatch(
                                  batch.key,
                                  { batchType: e.target.value },
                                  true,
                                )
                              }
                            >
                              <option value="">-- Select --</option>
                              <option value="SEPARATE">Separate</option>
                              <option value="COMBINED">Combined</option>
                            </select>
                          </div>

                          {/* PARTICIPANT TABLE */}
                          <ParticipantTable
                            trId={requestId}
                            title="Participants from this Training Request"
                            cache={participantCache}
                            setCache={setParticipantCache}
                            selected={participantSelections}
                            setSelected={setParticipantSelections}
                            trainingType={trainingReq.training_type}
                            batchKey={batch.key}
                            blockNamesCache={blockNamesCache}
                            setBlockNamesCache={setBlockNamesCache}
                            markBatchTouched={markBatchTouched}
                            isReviewMode={isReviewMode}
                            usedUidsAcrossBatches={usedUidsAcrossBatches}
                          />
                          {batch.batchType === "COMBINED" && (
                            <CombinedParticipantSelector
                              trainingReq={trainingReq}
                              participantCache={participantCache}
                              setParticipantCache={setParticipantCache}
                              selectedParticipants={participantSelections}
                              setSelectedParticipants={setParticipantSelections}
                              batchKey={batch.key}
                              blockNamesCache={blockNamesCache}
                              setBlockNamesCache={setBlockNamesCache}
                              markBatchTouched={markBatchTouched}
                              usedUidsAcrossBatches={usedUidsAcrossBatches}
                            />
                          )}
                          {/* SELECTED PARTICIPANTS */}
                          {selectedList.length > 0 && (
                            <div
                              className="card"
                              style={{
                                marginTop: 12,
                                padding: 16,
                                borderRadius: 8,
                              }}
                            >
                              <h4 style={{ color: "#2b4e72" }}>
                                Selected Participants for this Batch
                              </h4>

                              <div style={{ overflowX: "auto" }}>
                                {/* UPDATED UI */}
                                <table className="table table-compact">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Mobile</th>
                                      <th>TR ID</th>
                                      <th />
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {selectedList.map((p) => (
                                      <tr key={p._uid}>
                                        <td>{p.full_name || p.member_name}</td>
                                        <td>{p.mobile_no || p.mobile}</td>
                                        <td>{p.training}</td>

                                        <td>
                                          <button
                                            className="btn-sm btn-outline"
                                            style={{
                                              borderColor: "#3d6ba6",
                                              color: "#3d6ba6",
                                            }}
                                            onClick={() =>
                                              removeParticipantFromBatch(
                                                batch.key,
                                                p.training,
                                                p,
                                              )
                                            }
                                          >
                                            Remove
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* ALLOT CENTRE */}
                          <div
                            className="card"
                            style={{
                              marginTop: 16,
                              padding: 16,
                            }}
                          >
                            <h4 style={{ color: "#2b4e72" }}>Allot Centre</h4>

                            {loadingCentres ? (
                              <p>Loading centres…</p>
                            ) : centres.length === 0 ? (
                              <p>
                                No centres found. Please register a centre first.
                              </p>
                            ) : (
                              <div style={{ overflowX: "auto" }}>
                                {/* UPDATED UI */}
                                <table className="table table-compact">
                                  <thead>
                                    <tr>
                                      <th />
                                      <th>Serial</th>
                                      <th>Centre</th>
                                      <th>Type</th>
                                      <th>Training Halls</th>
                                      <th />
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {centres.map((c) => (
                                      <tr key={c.id}>
                                        <td>
                                          <input
                                            type="radio"
                                            checked={
                                              batch.centre?.id === c.id ||
                                              batch.centre === c.id
                                            }
                                            onChange={() =>
                                              updateBatch(
                                                batch.key,
                                                { centre: c },
                                                true,
                                              )
                                            }
                                          />
                                        </td>

                                        <td>{c.serial_number}</td>

                                        <td
                                          style={{
                                            cursor: "pointer",
                                            color: "#3d6ba6",
                                          }}
                                          onClick={() => handleViewCentre(c.id)}
                                        >
                                          {c.venue_name}
                                        </td>

                                        <td>{c.centre_type}</td>

                                        <td>{c.training_hall_count}</td>

                                        <td>
                                          <button
                                            className="btn-sm btn-flat"
                                            disabled={viewLoadingId === c.id}
                                            onClick={() => handleViewCentre(c.id)}
                                          >
                                            {viewLoadingId === c.id
                                              ? "Opening…"
                                              : "View"}
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* START DATE */}
                          <div
                            className="card"
                            style={{
                              marginTop: 16,
                              padding: 16,
                            }}
                          >
                            <label>Start Date</label>

                            <input
                              type="date"
                              className="input"
                              min={todayISO()}
                              value={batch.startDate}
                              onChange={(e) => {
                                const sd = e.target.value;
                                const today = todayISO();

                                if (sd < today) {
                                  alert("Start date cannot be before today");
                                  return;
                                }

                                if (isSunday(sd)) {
                                  alert("Start date cannot be a Sunday");
                                  return;
                                }

                                const ed = trainingReq?.training_plan?.no_of_days
                                  ? calcEndDate(
                                    sd,
                                    trainingReq.training_plan.no_of_days,
                                  )
                                  : "";

                                updateBatch(
                                  batch.key,
                                  {
                                    startDate: sd,
                                    endDate: ed,
                                  },
                                  true,
                                );
                              }}
                            />

                            {batch.endDate && (
                              <p>
                                End Date: <b>{batch.endDate}</b>
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* SUBMIT */}
                <div style={{ marginTop: 16 }}>
                  <BatchSubmitSection
                    disabled={globalErrors.length > 0}
                    trainingReq={trainingReq}
                    batches={batches}
                    participantSelections={participantSelections}
                    user={user}
                    isReviewMode={isReviewMode}
                    deletedParticipantIds={deletedParticipantIds}
                    deletedBatchIds={deletedBatchIds}
                  />
                </div>
              </>
            )}
          </main>
          <Footer />
        </div>

        <CentreViewModal
          open={!!centrePreview}
          data={centrePreview}
          onClose={() => setCentrePreview(null)}
        />
        <style>{`
        .content-area {
  display: flex;
  flex: 1;              
  min-width: 0;
}
        .btnPrimary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnPrimary:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}
`}</style>
      </div>
    </div>
  );
}
