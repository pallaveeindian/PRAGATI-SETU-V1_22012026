// src/pages/TMS/TP/tp_create_batch.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
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
  if (url.startsWith("http://72.61.255.170/")) {
    return url.replace("http://72.61.255.170/", "http://72.61.255.170:8080/");
  }
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
    LOOKUP_API.blocks
      .retrieve(districtId, { page_size: 100 })
      .then((r) => setBlocks(r?.data?.results || []))
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
                <th>Participants</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {blockTRs.map((tr) => (
                <tr key={tr.id}>
                  <td>{tr.id}</td>
                  <td>{tr.block?.block_name_en}</td>
                  <td>
                    {baseType === "BENEFICIARY"
                      ? tr.beneficiary_count
                      : tr.trainer_count}
                  </td>
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

function PreviewModal({ open, payload, onClose, onConfirm, disabled }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 900 }}>
        <h3>Preview Batch Creation Payload</h3>

        <pre
          style={{
            maxHeight: 400,
            overflow: "auto",
            background: "#111",
            color: "#0f0",
            padding: 12,
            fontSize: 12,
          }}
        >
          {JSON.stringify(payload, null, 2)}
        </pre>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn-outline" onClick={onClose}>
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={onConfirm}
          >
            Propose to DMMU
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
  function buildPayload() {
    const batchItems = batches.map((b) => {
      const perBatchSel = participantSelections[b.key] || {};
      const allParticipants = Object.values(perBatchSel).flat();

      // --------------------------
      // CHANGE 1: Use optional chaining (?.) and default values
      // Ensures that if a field is missing, the payload still gets valid default values
      // --------------------------
      return {
        batch: {
          request: trainingReq?.id || null, // safely handle missing trainingReq
          centre: b?.centre?.id || null, // safely handle missing centre
          batch_type: b?.batchType || "", // empty string fallback
          start_date: b?.startDate || "", // empty string fallback
          end_date: b?.endDate || "", // empty string fallback
          status: "PENDING",
          code: generateBatchCode(
            trainingReq?.block?.block_name_en, // optional chaining
            trainingReq?.district?.district_name_en, // optional chaining
          ),
          created_by: user?.id || null, // optional chaining
        },

        // --------------------------
        // CHANGE 2: Participants array is always an array
        // Handles the case when no participants are selected
        // --------------------------
        participants: allParticipants.map((p) => ({
          id: p?.id || null, // optional chaining
          tr: p?.training || null, // optional chaining
        })),
      };
    });

    return { batches: batchItems };
  }

  async function execute() {
    setSubmitting(true);

    try {
      // 🔥 REVIEW MODE = FULL RESET
      if (isReviewMode) {
        await deleteAllExistingBatchesAndParticipants(trainingReq);
      }

      const payload = buildPayload();

      for (const item of payload.batches) {
        const { batch, participants } = item;

        // ALWAYS CREATE NEW BATCH
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

        const ids = participants.map((p) => p.id);

        await api.post(
          `/tms/batches/${batchId}/attach-participants/`,
          trainingReq.training_type === "BENEFICIARY"
            ? { beneficiary_ids: ids }
            : { trainer_ids: ids },
        );
      }

      await api.patch(`/tms/training-requests/${trainingReq.id}/`, {
        status: "PENDING",
        updated_by: user.id,
      });

      alert("Batches submitted successfully !");
      window.location.href = "/tms/training-requests";
    } catch (e) {
      console.error(e);
      alert("Failed to update batches");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={disabled}
        onClick={() => {
          // 🔒 HARD VALIDATION: each batch must have ≥ 1 participant
          for (let i = 0; i < batches.length; i++) {
            const b = batches[i];
            const perBatchSel = participantSelections[b.key] || {};
            const count = Object.values(perBatchSel).flat().length;

            if (count < 1) {
              alert(`"${b.title}" must have at least 1 participant`);
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
      </button>

      <PreviewModal
        open={previewOpen}
        payload={payload}
        disabled={submitting}
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
        });

        const existing = resp?.data?.results || [];
        if (!existing.length) return;

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
            centre: b.centre,
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
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        <TopNav
          left={
            <div className="app-title">
              {isReviewMode ? "Review & Modify Batches" : "Create Batches"}
            </div>
          }
        />

        <main style={{ padding: 18 }}>
          {loadingTR ? (
            <p>Loading Training Request…</p>
          ) : !trainingReq ? (
            <p>Training Request not found</p>
          ) : (
            <>
              <div className="card">
                <h3>{trainingReq.training_plan.training_name}</h3>
                <p>
                  Theme: <b>{themeName}</b>
                </p>
                <p>
                  Type: <b>{trainingReq.training_type}</b> | Level:{" "}
                  <b>{trainingReq.level}</b> | Status:{" "}
                  <b>{trainingReq.status}</b>
                </p>
                <p>
                  Location:{" "}
                  <b>
                    {trainingReq.district?.district_name_en} /{" "}
                    {trainingReq.block?.block_name_en}
                  </b>
                </p>
              </div>

              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <button className="btn" onClick={addBatch}>
                  + Add Batch
                </button>
              </div>

              {batches.map((batch) => {
                const perBatchSel = participantSelections[batch.key] || {};
                const selectedList = Array.from(
                  new Map(
                    Object.values(perBatchSel)
                      .flat()
                      // .map((p) => [`${p.training}-${p.id}`, p]),
                      .map((p) => [p._uid, p]),
                  ).values(),
                );
                const count = selectedList.length;

                return (
                  <div
                    key={batch.key}
                    className="card"
                    style={{ marginTop: 12 }}
                  >
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
                      <h4 style={{ margin: 0, flex: 1 }}>
                        {batch.title}{" "}
                        <span style={{ fontSize: 12 }}>
                          ({count} participants)
                        </span>
                      </h4>
                      {batches.length > 1 && (
                        <button
                          className="btn-sm btn-outline"
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

                    {batch.expanded && (
                      <div style={{ marginTop: 12 }}>
                        <div className="card" style={{ marginTop: 8 }}>
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

                        {selectedList.length > 0 && (
                          <div className="card" style={{ marginTop: 12 }}>
                            <h4>Selected Participants for this Batch</h4>

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
                        )}

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

                        <div className="card" style={{ marginTop: 16 }}>
                          <h4>Allot Centre</h4>

                          {loadingCentres ? (
                            <p>Loading centres…</p>
                          ) : centres.length === 0 ? (
                            <p>
                              No centres found. Please register a centre first.
                            </p>
                          ) : (
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
                                        checked={batch.centre?.id === c.id}
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
                                      style={{ cursor: "pointer" }}
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
                          )}
                        </div>

                        <div className="card" style={{ marginTop: 16 }}>
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

                        {batch.touched && batch.errors.length > 0 && (
                          <div className="card" style={{ marginTop: 16 }}>
                            <h4>Cannot proceed for this batch</h4>
                            <ul>
                              {batch.errors.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {globalErrors.length > 0 && (
                <div className="card" style={{ marginTop: 16 }}>
                  <h4>Overall issues</h4>
                  <ul>
                    {globalErrors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

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
      </div>

      <CentreViewModal
        open={!!centrePreview}
        data={centrePreview}
        onClose={() => setCentrePreview(null)}
      />
    </div>
  );
}
