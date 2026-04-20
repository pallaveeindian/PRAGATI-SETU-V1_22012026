// src/pages/TMS/DMMU/dmmu_tr_review.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

/* ---------------- cache keys ---------------- */

const TR_DETAIL_CACHE_KEY = "tms_tr_detail_cache_v1::";
const BATCHES_CACHE_KEY = "tms_training_batches_cache_v1";
const MASTER_TRAINER_PAGE_CACHE = "tms_master_trainer_page_cache_v1";

/* ---------------- helpers ---------------- */

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

function getBatchesCacheKey(requestId) {
  return `${BATCHES_CACHE_KEY}_${requestId}`;
}

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

function invalidateCaches(requestId) {
  try {
    localStorage.removeItem(TR_DETAIL_CACHE_KEY + requestId);
    localStorage.removeItem(getBatchesCacheKey(requestId));
  } catch { }
}

/* ---------------- simple modal ---------------- */

function Modal({ open, title, onClose, children, width = 800 }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `min(${width}px, 96%)`,
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 10,
          padding: 18,
          boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------------- main component ---------------- */

export default function DmmuTrReview() {
  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});
  const isDmmu = role === "dmmu" || role === "2";

  const [tr, setTr] = useState(null);
  const [trainingPlanObj, setTrainingPlanObj] = useState(null);
  const [partner, setPartner] = useState(null);
  const [loadingTR, setLoadingTR] = useState(false);

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  // master trainer modal state
  const [mtModalOpen, setMtModalOpen] = useState(false);
  const [mtModalBatch, setMtModalBatch] = useState(null);
  const [mtLoadingList, setMtLoadingList] = useState(false);
  const [mtPage, setMtPage] = useState(1);
  const [mtPageSize] = useState(10);
  const [mtTotal, setMtTotal] = useState(0);
  const [mtList, setMtList] = useState([]);
  const [mtCheckingId, setMtCheckingId] = useState(null);
  const [mtSelections, setMtSelections] = useState({}); // { batchId: Set(masterTrainerId) }

  // approve / revert
  const [savingApprove, setSavingApprove] = useState(false);
  const [savingRevert, setSavingRevert] = useState(false);
  const [revertReason, setRevertReason] = useState("");
  const [revertModalOpen, setRevertModalOpen] = useState(false);

  const trInFlightRef = useRef(false);
  const batchesInFlightRef = useRef(false);
  const mtInFlightRef = useRef(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Master Trainer Search
  const [mtSearch, setMtSearch] = useState("");

  /* ---------------- TR detail fetch (reusing training_req_detail cache style) ---------------- */

  function loadTrCache(id) {
    return loadJson(TR_DETAIL_CACHE_KEY + id);
  }

  function saveTrCache(id, payload) {
    saveJson(TR_DETAIL_CACHE_KEY + id, { ts: Date.now(), payload });
  }

  async function fetchTrainingPlan(planId) {
    if (!planId) return null;
    try {
      const r = await TMS_API.trainingPlans.list({
        id: planId,
        fields: "training_name",
      });
      const results = r?.data?.results || r?.data || [];
      return results[0] || null;
    } catch (err) {
      return null;
    }
  }

  async function fetchTrDetail(force = false) {
    if (!requestId) return;
    if (trInFlightRef.current && !force) return;
    trInFlightRef.current = true;
    setLoadingTR(true);
    try {
      if (!force) {
        const cached = loadTrCache(requestId);
        if (cached?.payload?.tr) {
          setTr(cached.payload.tr);
          setPartner(cached.payload.partner || null);
          setTrainingPlanObj(cached.payload.training_plan_obj || null);
          setLoadingTR(false);
          trInFlightRef.current = false;
          return;
        }
      }

      const trResp = await TMS_API.trainingRequests.retrieve(requestId);
      const trObj = trResp?.data ?? trResp ?? null;
      setTr(trObj);

      let tpObj = null;
      if (trObj?.training_plan) {
        tpObj = await fetchTrainingPlan(trObj.training_plan);
        setTrainingPlanObj(tpObj);
      }

      let partnerObj = null;
      if (trObj?.partner) {
        try {
          if (TMS_API.trainingPartners?.retrieve) {
            const pResp = await TMS_API.trainingPartners.retrieve(
              trObj.partner,
            );
            partnerObj = pResp?.data ?? pResp ?? null;
          } else {
            const pResp = await TMS_API.trainingPartners.list({
              id: trObj.partner,
              fields: "name",
            });
            partnerObj = (pResp?.data?.results || pResp?.data || [])[0] || null;
          }
        } catch {
          partnerObj = null;
        }
      }
      setPartner(partnerObj);

      saveTrCache(requestId, {
        tr: trObj,
        partner: partnerObj,
        training_plan_obj: tpObj,
        participants: [], // not needed here
      });
    } catch (e) {
      setTr(null);
      setPartner(null);
      setTrainingPlanObj(null);
    } finally {
      setLoadingTR(false);
      trInFlightRef.current = false;
    }
  }

  /* ---------------- batches fetch (reusing training_batch_list style) ---------------- */

  function loadBatchesCache(requestId) {
    const cached = loadJson(getBatchesCacheKey(requestId));
    if (!cached) return null;
    if (Date.now() - (cached.ts || 0) > 5 * 60 * 1000) return null; // expired
    return cached;
  }

  function saveBatchesCache(requestId, payload) {
    saveJson(getBatchesCacheKey(requestId), {
      ts: Date.now(),
      payload,
      meta: {},
    });
  }

  async function fetchBatches(force = false) {
    if (!requestId) return;
    if (batchesInFlightRef.current && !force) return;
    batchesInFlightRef.current = true;
    setLoadingBatches(true);
    try {
      if (!force) {
        const cached = loadBatchesCache(requestId);
        if (cached?.payload) {
          setBatches(cached.payload || []);
          setLoadingBatches(false);
          batchesInFlightRef.current = false;
          return;
        }
      }
      const resp = await TMS_API.batches.list({
        request: requestId,
        page_size: 500,
      });
      const items = (resp?.data?.results || []).filter(
        (b) => b.is_active !== false,
      );
      setBatches(items);
      saveBatchesCache(requestId, items);
    } catch (e) {
      setBatches([]);
    } finally {
      setLoadingBatches(false);
      batchesInFlightRef.current = false;
    }
  }

  /* ---------------- master trainer list ---------------- */

  function loadMtPageCache(page, pageSize) {
    const key = `${MASTER_TRAINER_PAGE_CACHE}_${page}_${pageSize}`;
    return loadJson(key);
  }

  function saveMtPageCache(page, pageSize, payload) {
    const key = `${MASTER_TRAINER_PAGE_CACHE}_${page}_${pageSize}`;
    saveJson(key, { ts: Date.now(), payload });
  }

  async function fetchMasterTrainers(page = 1, pageSize = 10, force = false) {
    if (mtInFlightRef.current && !force) return;
    mtInFlightRef.current = true;
    setMtLoadingList(true);
    try {
      if (!force) {
        const cached = loadMtPageCache(page, pageSize);
        if (cached?.payload) {
          const data = cached.payload;
          setMtList(data.results || []);
          setMtTotal(data.count || 0);
          setMtLoadingList(false);
          mtInFlightRef.current = false;
          return;
        }
      }
      const params = { page, page_size: pageSize };
      const resp = await TMS_API.masterTrainers.list(params);
      const data = resp?.data ?? resp ?? {};
      setMtList(data.results || []);
      setMtTotal(data.count || 0);
      saveMtPageCache(page, pageSize, data);
    } catch {
      setMtList([]);
      setMtTotal(0);
    } finally {
      setMtLoadingList(false);
      mtInFlightRef.current = false;
    }
  }

  /* ---------------- availability check + selection ---------------- */
  async function handleToggleMasterTrainer(batchId, trainer) {
    const currentArr = mtSelections[batchId] || [];
    const exists = currentArr.some((t) => t.id === trainer.id);

    // 🔁 Deselect
    if (exists) {
      setMtSelections((prev) => ({
        ...prev,
        [batchId]: currentArr.filter((t) => t.id !== trainer.id),
      }));
      return;
    }

    // ➕ Select → check availability
    setMtCheckingId(trainer.id);
    try {
      const resp = await TMS_API.batchMasterTrainers.list({
        master_trainer: trainer.id,
        status: "UNAVAILABLE",
      });
      const trResp = await TMS_API.trTrainers.list({
        trainer: trainer.id,
      });

      const busy =
        (resp?.data?.results || []).length > 0 ||
        (trResp?.data?.results || []).length > 0;

      if (busy) {
        alert("This Master Trainer is not available at the moment.");
        return;
      }

      // ✅ Add trainer
      setMtSelections((prev) => ({
        ...prev,
        [batchId]: [
          ...currentArr,
          {
            id: trainer.id,
            name: trainer.full_name || `Trainer #${trainer.id}`,
          },
        ],
      }));
    } catch {
      alert("Unable to verify trainer availability. Please try again.");
    } finally {
      setMtCheckingId(null);
    }
  }

  const mtTotalPages = useMemo(
    () => Math.max(1, Math.ceil(mtTotal / mtPageSize)),
    [mtTotal, mtPageSize],
  );

  const filteredMtList = useMemo(() => {
    if (!mtSearch.trim()) return mtList;

    const q = mtSearch.toLowerCase();

    return mtList.filter((mt) => {
      const name = (mt.full_name || "").toLowerCase();
      const mobile = (mt.mobile_no || "").toLowerCase();

      return name.includes(q) || mobile.includes(q);
    });
  }, [mtList, mtSearch]);

  /* ---------------- approve / revert logic ---------------- */

  function isSameDate(dateStr, refDate) {
    if (!dateStr) return false;
    try {
      const d = new Date(dateStr);
      return (
        d.getFullYear() === refDate.getFullYear() &&
        d.getMonth() === refDate.getMonth() &&
        d.getDate() === refDate.getDate()
      );
    } catch {
      return false;
    }
  }

  async function handleApprove() {
    if (!requestId || !tr) return;
    // 🚫 NEW: every batch must have at least one master trainer
    const unassignedBatches = batches.filter(
      (b) => !(mtSelections[b.id] && mtSelections[b.id].length > 0),
    );

    if (unassignedBatches.length > 0) {
      const batchCodes = unassignedBatches.map((b) => b.code).join(", ");

      alert(
        `Please assign at least one Master Trainer for all batches.\n\nMissing assignment for batch(es): ${batchCodes}`,
      );
      return;
    }

    if (!batches || batches.length === 0) {
      alert("No batches found for this training request.");
      return;
    }
    setSavingApprove(true);
    try {
      const today = new Date();

      // 1) For each batch, create BatchMasterTrainer rows for selected trainers
      for (const batch of batches) {
        const selectedTrainerIds = mtSelections[batch.id] || [];
        for (const t of selectedTrainerIds) {
          try {
            await TMS_API.batchMasterTrainers.create({
              batch: batch.id,
              master_trainer: t.id,
              participated: false,
              status: "UNAVAILABLE",
              remarks: "",
            });
          } catch (e) {
            console.error("BatchMasterTrainer create failed", e);
          }
        }
      }

      // 2) Update training request status → COMPLETED
      await TMS_API.trainingRequests.partialUpdate(requestId, {
        status: "COMPLETED",
      });

      // 3) Update each batch status based on start_date
      for (const batch of batches) {
        let newStatus = "SCHEDULED";
        if (isSameDate(batch.start_date, today)) {
          newStatus = "ONGOING";
        } else {
          const ds = new Date(batch.start_date);
          if (ds < today) {
            // if start_date is past, treat as ONGOING too
            newStatus = "ONGOING";
          }
        }
        try {
          await TMS_API.batches.partialUpdate(batch.id, {
            status: newStatus,
          });
        } catch (e) {
          console.error("Batch status update failed", e);
        }
      }

      alert("Training Request approved and batches updated successfully.");

      // 🔥 invalidate caches
      invalidateCaches(requestId);

      // 🔄 refresh current data (important if user stays)
      await fetchTrDetail(true);
      await fetchBatches(true);

      // ⏪ go back (list page will now refetch fresh data)
      navigate(-1);
    } catch (e) {
      console.error("Approve failed", e);
      alert("Failed to approve. Please try again.");
    } finally {
      setSavingApprove(false);
    }
  }

  async function handleConfirmRevert() {
    if (!requestId || !tr) return;
    if (!revertReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    setSavingRevert(true);
    try {
      // 1) Update training request status → REJECTED with reason
      await TMS_API.trainingRequests.partialUpdate(requestId, {
        status: "REJECTED",
        rejection_reason: revertReason.trim(),
      });

      // 2) Update all batches → REJECTED
      for (const batch of batches) {
        try {
          await TMS_API.batches.partialUpdate(batch.id, {
            status: "REJECTED",
          });
        } catch (e) {
          console.error("Batch reject update failed", e);
        }
      }

      alert("Training Request reverted and all batches marked REJECTED.");

      //  invalidate caches
      invalidateCaches(requestId);

      // 🔄 refresh
      await fetchTrDetail(true);
      await fetchBatches(true);

      // ⏪ go back
      navigate(-1);
    } catch (e) {
      console.error("Revert failed", e);
      alert("Failed to revert. Please try again.");
    } finally {
      setSavingRevert(false);
    }
  }

  /* ---------------- effects ---------------- */

  useEffect(() => {
    if (!requestId) return;
    fetchTrDetail(false);
    fetchBatches(false);
  }, [requestId]);

  useEffect(() => {
    if (!mtModalOpen) return;
    fetchMasterTrainers(mtPage, mtPageSize, false);
  }, [mtModalOpen, mtPage, mtPageSize]);

  /* ---------------- render helpers ---------------- */

  function statusMessage(trObj) {
    if (!trObj) return null;
    const statusText = (trObj.status || "—").toUpperCase();
    const boldStatus = (
      <strong style={{ color: "#0b5cff", padding: "2px 6px", borderRadius: 4 }}>
        {statusText}
      </strong>
    );

    switch (statusText) {
      case "PENDING":
        return (
          <span>
            Training Request is in {boldStatus} status. DMMU can review batches,
            assign Master Trainers, and either Approve or Revert.
          </span>
        );
      case "BATCHING":
        return (
          <span>
            Training Request is in {boldStatus} status. Wait for Training
            Partner to finish batching.
          </span>
        );
      case "REVIEW":
        return (
          <span>
            Training Request is under {boldStatus}. Please verify batches and
            finalize the decision.
          </span>
        );
      default:
        return <span>Status: {boldStatus}</span>;
    }
  }

  function getSelectedTrainerNames(batchId) {
    return (mtSelections[batchId] || []).map((t) => t.name);
  }

  function renderTrSummary() {
    if (loadingTR) {
      return (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: "#f5f8ff",
            marginBottom: 12,
          }}
        >
          <div className="table-spinner">Loading training request details…</div>
        </div>
      );
    }
    if (!tr) {
      return (
        <div className="muted" style={{ marginBottom: 12 }}>
          Training Request could not be loaded.
        </div>
      );
    }
    return (
      <>
        <div style={{ marginBottom: 8 }}>
          <strong>Plan:</strong>{" "}
          {trainingPlanObj?.training_name || tr.training_plan || "-"}{" "}
          &nbsp;&nbsp;
          <strong>Type:</strong> {tr.training_type || "-"} &nbsp;&nbsp;
          <strong>Level:</strong> {tr.level || "-"} &nbsp;&nbsp;
          <strong>Status:</strong>{" "}
          <span style={{ fontWeight: 700 }}>{tr.status || "-"}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Partner:</strong>{" "}
          {partner?.name ||
            tr.partner_name ||
            (tr.partner ? `Partner ID ${tr.partner}` : "-")}
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#fbfdff",
            marginBottom: 12,
          }}
        >
          {statusMessage(tr)}
        </div>
      </>
    );
  }

  /* ---------------- master trainer modal UI ---------------- */

  function renderMtModal() {
    if (!mtModalBatch) return null;
    const batchId = mtModalBatch.id;
    const selectedForBatch = mtSelections[batchId] || [];

    return (
      <Modal
        open={mtModalOpen}
        onClose={() => setMtModalOpen(false)}
        title={`Assign Master Trainer(s) — Batch ${mtModalBatch.code}`}
        width={900}
      >
        <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
          <div style={{ fontSize: 13, color: "#6c757d" }}>
            Select Master Trainers to attach with this batch. Availability will
            be checked before selection.
          </div>
          <button
            className="btn btn-outline"
            style={{ marginLeft: "auto" }}
            onClick={() => fetchMasterTrainers(mtPage, mtPageSize, true)}
          >
            Refresh list
          </button>
        </div>

        <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            className="input"
            value={mtSearch}
            onChange={(e) => setMtSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {mtLoadingList ? (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              color: "#6c757d",
            }}
          >
            Loading master trainers…
          </div>
        ) : filteredMtList.length === 0 ? (
          <div style={{ padding: 12 }}>No matching master trainers found.</div>
        ) : (
          <div style={{ maxHeight: 360, overflow: "auto" }}>
            <table className="table table-compact">
              <thead>
                <tr>
                  <th />
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Mobile</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {filteredMtList.map((mt) => {
                  const isSelected = selectedForBatch.some(
                    (t) => t.id === mt.id,
                  );
                  const isChecking = mtCheckingId === mt.id;
                  return (
                    <tr key={mt.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isChecking}
                          onChange={() =>
                            handleToggleMasterTrainer(batchId, mt)
                          }
                        />
                      </td>
                      <td>{mt.id}</td>
                      <td>{mt.full_name || "-"}</td>
                      <td>{mt.mobile_no || "-"}</td>
                      <td>{mt.designation || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            gap: 10,
          }}
        >
          <button
            className="btn"
            disabled={mtPage <= 1 || mtLoadingList}
            onClick={() => setMtPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <div style={{ fontSize: 13, color: "#6c757d" }}>
            Page {mtPage} / {mtTotalPages}
          </div>
          <button
            className="btn"
            disabled={mtPage >= mtTotalPages || mtLoadingList}
            onClick={() => setMtPage((p) => Math.min(mtTotalPages, p + 1))}
          >
            Next
          </button>
          {mtCheckingId && (
            <div
              style={{
                marginLeft: "auto",
                fontSize: 13,
                color: "#2563eb",
                fontStyle: "italic",
              }}
            >
              Checking availability…
            </div>
          )}
        </div>
      </Modal>
    );
  }

  /* ---------------- main render ---------------- */

  const canActOnRequest =
    isDmmu &&
    tr &&
    ["PENDING", "REVIEW"].includes((tr.status || "").toUpperCase());

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
              Pragati Setu — DMMU Training Request Review
            </div>
          }
        /> */}
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                {/* <h2 style={{ margin: 0 }}>
                  DMMU Review — Training Request #{requestId}
                </h2> */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button
                    className="btn"
                    onClick={() => {
                      localStorage.removeItem(TR_DETAIL_CACHE_KEY + requestId);
                      fetchTrDetail(true);
                    }}
                  >
                    Refresh request
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      localStorage.removeItem(getBatchesCacheKey(requestId));
                      fetchBatches(true);
                    }}
                  >
                    Refresh batches
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
                {/* Training Request summary */}
                {renderTrSummary()}

                {/* Batches list */}
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ marginTop: 0 }}>
                    Batches in this Training Request
                  </h3>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#6c757d",
                      marginBottom: 8,
                    }}
                  >
                    Review each batch and assign master trainer(s) where required.
                  </div>

                  {loadingBatches ? (
                    <div
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#6c757d",
                      }}
                    >
                      <div className="table-spinner">
                        Loading batches for this training request…
                      </div>
                    </div>
                  ) : batches.length === 0 ? (
                    <div className="muted">
                      No batches found for this training request.
                    </div>
                  ) : (
                    <div style={{ maxHeight: 480, overflow: "auto" }}>
                      <table className="table table-compact">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Batch Code</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Batch Type</th>
                            <th>Master Trainer(s)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batches.map((b, idx) => (
                            <tr key={b.id}>
                              <td>{idx + 1}</td>
                              <td>{b.code}</td>
                              <td>{b.status}</td>
                              <td>{fmtDate(b.start_date)}</td>
                              <td>{fmtDate(b.end_date)}</td>
                              <td>{b.batch_type}</td>
                              <td>
                                {(() => {
                                  const names = getSelectedTrainerNames(b.id);
                                  if (!names.length) {
                                    return (
                                      <span className="muted">Not assigned</span>
                                    );
                                  }
                                  return (
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {names.map((n, i) => (
                                        <li key={i}>{n}</li>
                                      ))}
                                    </ul>
                                  );
                                })()}
                              </td>
                              <td>
                                <button
                                  className="btn-sm btn-flat"
                                  onClick={() =>
                                    navigate(`/tms/batch-detail/${b.id}`)
                                  }
                                >
                                  View
                                </button>{" "}
                                {canActOnRequest && (
                                  <button
                                    className="btn-sm btn-flat"
                                    onClick={() => {
                                      setMtModalBatch(b);
                                      setMtModalOpen(true);
                                    }}
                                  >
                                    Add Master Trainer
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Approve / Revert */}
                {canActOnRequest && (
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                    }}
                  >
                    <button
                      className="btn btn-outline"
                      style={{
                        borderColor: "#ef4444",
                        color: "#ffff",
                        fontWeight: 600,
                      }}
                      onClick={() => setRevertModalOpen(true)}
                      disabled={savingApprove || savingRevert}
                    >
                      {savingRevert ? "Reverting…" : "Revert Request"}
                    </button>
                    <button
                      className="btn"
                      style={{
                        border: "2px solid #16a34a",
                        background: "#16a34a",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                      onClick={handleApprove}
                      disabled={
                        savingApprove ||
                        savingRevert ||
                        !Object.values(mtSelections).some((arr) => arr?.length)
                      }
                    >
                      {savingApprove ? "Approving…" : "Approve Request"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>

        {/* Master Trainer assignment modal */}
        {renderMtModal()}

        {/* Revert reason modal */}
        <Modal
          open={revertModalOpen}
          onClose={() => {
            if (!savingRevert) setRevertModalOpen(false);
          }}
          title="Revert Training Request"
          width={600}
        >
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            Please provide a rejection reason. This will be stored in{" "}
            <strong>rejection_reason</strong> and the Training Request along with
            all its batches will be marked as <strong>REJECTED</strong>.
          </div>
          <textarea
            className="input"
            rows={4}
            placeholder="Rejection Reason…"
            value={revertReason}
            onChange={(e) => setRevertReason(e.target.value)}
            disabled={savingRevert}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              className="btn btn-outline"
              onClick={() => setRevertModalOpen(false)}
              disabled={savingRevert}
            >
              Cancel
            </button>
            <button
              className="btn"
              style={{
                borderColor: "#ef4444",
                background: "#ef4444",
                color: "#fff",
              }}
              onClick={handleConfirmRevert}
              disabled={savingRevert}
            >
              {savingRevert ? "Submitting…" : "Confirm Revert"}
            </button>
          </div>
        </Modal>
      </div>
      <style>{`
      .content-area {
  display: flex;
  flex: 1;
  min-width: 0;
}

.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: #f5f7fb;
}

main {
  flex: 1;
  padding: 18px;
}

/*  Sticky Footer */
footer {
  margin-top: auto;
  flex-shrink: 0;
  background: #2b4e72; /* theme color */
  color: #fff;
  padding: 12px 20px;
  text-align: center;
}


/* ===== Card UI ===== */
.card-ui {
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #3d6ba6;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}


/* ===== Summary Section ===== */
.summary-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 12px;
  color: #2b4e72;
}

.status-badge {
  background: #a7c6ed;
  color: #2b4e72;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
}

.status-panel {
  padding: 12px;
  border-radius: 6px;
  background: #f4f8fd;
  border-left: 4px solid #3d6ba6;
  margin-bottom: 14px;
}


/* ===== Toolbar ===== */
.participant-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.input-filter {
  border: 1px solid #3d6ba6;
  padding: 6px 10px;
  border-radius: 6px;
  outline: none;
}


/* ===== Table ===== */
.table-container {
  max-height: 420px;
  overflow: auto;
  border: 1px solid #e4ecf5;
  border-radius: 8px;
}

.training-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.training-table thead {
  background: #3d6ba6;
  color: white;
  position: sticky;
  top: 0;
}

.training-table th {
  padding: 10px;
  text-align: left;
  border-right: 1px solid rgba(255,255,255,0.2);
}

.training-table td {
  padding: 10px;
  border-bottom: 1px solid #e4ecf5;
  border-right: 1px solid #e4ecf5;
}

.training-table tbody tr:nth-child(even) {
  background: #f7fbff;
}

.training-table tbody tr:hover {
  background: #e4ecf5;
}


/* ===== Buttons ===== */
.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #3d6ba6;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.btn-outline {
  background: #5a8cc2;
  color: #fff;
  border: none;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-flat {
  background: transparent;
  border: none;
  color: #3d6ba6;
  cursor: pointer;
}

.btn-flat:hover {
  text-decoration: underline;
}


/* ===== Action Box ===== */
.action-box {
  background: #f4f8fd;
  border-left: 4px solid #5a8cc2;
  padding: 10px;
  margin-bottom: 10px;
}


/* ===== Modal ===== */
.modal-grid {
  display: grid;
  gap: 10px;
}

.modal-row {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #e4ecf5;
}

.modal-label {
  min-width: 160px;
  font-weight: 700;
  color: #2b4e72;
}

.modal-value {
  color: #111;
}


/* ===== Misc ===== */
.table-message {
  padding: 20px;
  text-align: center;
  color: #2b4e72;
}

.muted {
  color: #6c757d;
}

`}</style>
    </div>
  );
}
