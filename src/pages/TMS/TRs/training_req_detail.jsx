// src/pages/TMS/TRs/training_req_detail.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

const DETAIL_CACHE_PREFIX = "tms_tr_detail_cache_v1::";

function loadCache(id) {
  try {
    const raw = localStorage.getItem(DETAIL_CACHE_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function saveCache(id, payload) {
  try {
    localStorage.setItem(
      DETAIL_CACHE_PREFIX + id,
      JSON.stringify({ ts: Date.now(), payload }),
    );
  } catch (e) { }
}

/* Small, reusable Modal used to show participant/trainer details */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.35)",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 96%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 8,
          padding: 18,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
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

/* Helper to format ISO timestamp to readable */
function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso || "-";
  }
}

export default function TrainingRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});
  const isTP = role === "training_partner" || role === "4";
  const isDmmu = role === "dmmu" || role === "2";
  const [navCollapsed, setNavCollapsed] = useState(false);
  // overall loading for "load ALL apis"
  const [loadingAll, setLoadingAll] = useState(false);

  // training request object
  const [tr, setTr] = useState(() => {
    const c = loadCache(id);
    return c?.payload?.tr || null;
  });

  // partner details
  const [partner, setPartner] = useState(() => {
    const c = loadCache(id);
    return c?.payload?.partner || null;
  });

  // training plan name object
  const [trainingPlanObj, setTrainingPlanObj] = useState(() => {
    const c = loadCache(id);
    return c?.payload?.training_plan_obj || null;
  });

  // participants list and loading
  const [participants, setParticipants] = useState(() => {
    const c = loadCache(id);
    return c?.payload?.participants || [];
  });
  const [participantLoading, setParticipantLoading] = useState(false);

  // modal state for viewing participant details
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalPayload, setModalPayload] = useState(null);

  // filters
  const [pldFilter, setPldFilter] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // simple refresh token to trigger useEffect
  const [refreshToken, setRefreshToken] = useState(0);

  // guard against concurrent fetchAll calls (prevents duplicate network calls in StrictMode)
  const inFlightRef = useRef(false);

  /* ----------------- training plan fetch (fast path: list with fields) ----------------- */
  async function fetchTrainingPlan(planId) {
    if (!planId) return null;
    try {
      // Use list with id+fields as requested (faster than retrieve)
      const r = await TMS_API.trainingPlans.list({
        id: planId,
        fields: "training_name",
      });
      const results = r?.data?.results || r?.data || [];
      return results[0] || null;
    } catch (err) {
      console.warn("training plan fetch failed", err);
      return null;
    }
  }

  /* ----------------- location name lookups (use LOOKUP_API.*.retrieve) ----------------- */
  async function fetchDistrictNameSafe(districtId) {
    if (!districtId) return null;
    try {
      const resp = await LOOKUP_API.districts.retrieve(districtId, {
        fields: "district_name_en",
      });
      return resp?.data?.district_name_en || null;
    } catch (e) {
      return null;
    }
  }
  async function fetchBlockNameSafe(blockId) {
    if (!blockId) return null;
    try {
      // prefer standard retrieve
      const resp = await LOOKUP_API.blocks_detail.retrieve(blockId, {
        fields: "block_name_en",
      });
      return resp?.data?.block_name_en || null;
    } catch (e) {
      // fallback: try calling detail route if backend exposes it
      try {
        const resp2 = await LOOKUP_API.blocks_detail.list({
          id: blockId,
          fields: "block_name_en",
        });
        const results = resp2?.data?.results || resp2?.data || [];
        return (results[0] && results[0].block_name_en) || null;
      } catch (err) {
        return null;
      }
    }
  }
  async function fetchPanchayatNameSafe(panchayatId) {
    if (!panchayatId) return null;
    try {
      const resp = await LOOKUP_API.panchayats_detail.retrieve(panchayatId, {
        fields: "panchayat_name_en",
      });
      return resp?.data?.panchayat_name_en || null;
    } catch (e) {
      try {
        const resp2 = await LOOKUP_API.panchayats_detail.list({
          id: panchayatId,
          fields: "panchayat_name_en",
        });
        const results = resp2?.data?.results || resp2?.data || [];
        return (results[0] && results[0].panchayat_name_en) || null;
      } catch (err) {
        return null;
      }
    }
  }
  async function fetchVillageNameSafe(villageId) {
    if (!villageId) return null;
    try {
      const resp = await LOOKUP_API.villages_detail.retrieve(villageId, {
        fields: "village_name_english",
      });
      return resp?.data?.village_name_english || null;
    } catch (e) {
      try {
        const resp2 = await LOOKUP_API.villages_detail.list({
          id: villageId,
          fields: "village_name_english",
        });
        const results = resp2?.data?.results || resp2?.data || [];
        return (results[0] && results[0].village_name_english) || null;
      } catch (err) {
        return null;
      }
    }
  }

  /* Convenience wrapper to fetch all location names in parallel */
  async function fetchLocationNames({ district, block, panchayat, village }) {
    const promises = [
      fetchDistrictNameSafe(district),
      fetchBlockNameSafe(block),
      fetchPanchayatNameSafe(panchayat),
      fetchVillageNameSafe(village),
    ];
    const [districtName, blockName, panchayatName, villageName] =
      await Promise.all(promises);
    return { districtName, blockName, panchayatName, villageName };
  }

  /* ----------------- main orchestration ----------------- */
  async function fetchAll(force = false) {
    if (!id) return;
    // avoid concurrent fetches unless forced
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingAll(true);

    try {
      if (!force) {
        const cached = loadCache(id);
        if (cached && cached.payload && cached.payload.tr) {
          setTr(cached.payload.tr);
          setParticipants(cached.payload.participants || []);
          setPartner(cached.payload.partner || null);
          setTrainingPlanObj(cached.payload.training_plan_obj || null);
          setLoadingAll(false);
          inFlightRef.current = false;
          return;
        }
      }

      // 1) fetch training request
      const trResp = await TMS_API.trainingRequests.retrieve(id);
      const trObj = trResp?.data ?? trResp ?? null;
      setTr(trObj);

      // 1.a) fetch training plan name (fast list)
      let trainingPlanObjLocal = null;
      try {
        if (trObj?.training_plan) {
          trainingPlanObjLocal = await fetchTrainingPlan(trObj.training_plan);
          setTrainingPlanObj(trainingPlanObjLocal);
        }
      } catch (e) {
        console.warn("Failed to fetch training plan", e);
      }

      // 2) fetch partner details if present
      let partnerObj = null;
      try {
        if (trObj?.partner) {
          if (TMS_API.trainingPartners && TMS_API.trainingPartners.retrieve) {
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
          setPartner(partnerObj);
        }
      } catch (e) {
        console.warn("Failed to fetch partner", e);
      }

      // 3) participants
      setParticipantLoading(true);
      let parts = [];
      try {
        if ((trObj?.training_type || "").toUpperCase() === "BENEFICIARY") {
          const pResp = await TMS_API.trainingRequestBeneficiaries.list({
            training: id,
            page_size: 500,
          });
          parts = pResp?.data?.results || pResp?.data || pResp || [];
        } else {
          const pResp = await TMS_API.trainingRequestTrainers.list({
            training: id,
            page_size: 500,
          });
          parts = pResp?.data?.results || pResp?.data || pResp || [];
        }
      } catch (e) {
        console.warn("Failed to fetch participants", e);
        parts = [];
      } finally {
        setParticipantLoading(false);
        setParticipants(parts || []);
      }

      // 4) cache
      saveCache(id, {
        tr: trObj,
        partner: partnerObj,
        participants: parts || [],
        training_plan_obj: trainingPlanObjLocal,
      });
    } catch (e) {
      console.error("fetch detail failed", e);
      setTr(null);
      setParticipants([]);
      setPartner(null);
      setTrainingPlanObj(null);
    } finally {
      setParticipantLoading(false);
      setLoadingAll(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    fetchAll(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshToken]);

  const visibleParticipants = useMemo(() => {
    if (!participants) return [];
    return participants.filter((p) => {
      if (!pldFilter) return true;
      return (
        String((p.pld_status || "").toLowerCase()) ===
        String(pldFilter).toLowerCase()
      );
    });
  }, [participants, pldFilter]);

  const totalPages = Math.ceil(visibleParticipants.length / rowsPerPage);

  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return visibleParticipants.slice(start, end);
  }, [visibleParticipants, currentPage]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === "visible" && !inFlightRef.current) {
        fetchAll(true);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [id]);

  /* ----------------- status message with highlighted status & partner ----------------- */
  function statusMessage(trObj, partnerObj) {
    if (!trObj) return null;
    const partnerName =
      partnerObj?.name ||
      trObj.partner_name ||
      `Partner ID ${trObj.partner || "-"}`;
    const rej = trObj.rejection_reason || "";
    const statusText = (trObj.status || "—").toUpperCase();

    const boldStatus = (
      <strong style={{ color: "#0b5cff", padding: "2px 6px", borderRadius: 4 }}>
        {statusText}
      </strong>
    );
    const boldPartner = (
      <strong style={{ color: "#0b8a3e", padding: "2px 6px", borderRadius: 4 }}>
        {partnerName}
      </strong>
    );

    switch (statusText) {
      case "BATCHING":
        return (
          <span>
            Training Request is in {boldStatus} status, Please wait for Training
            Partner {boldPartner} to create batches for this Request.
          </span>
        );
      case "PENDING":
        return (
          <span>
            Training Request is in {boldStatus} status, Please wait for
            appropriate authority to approve this Training Request.
          </span>
        );
      case "ONGOING":
        return (
          <span>
            Training Request is {boldStatus}, Stats are visible below.
          </span>
        );
      case "REVIEW":
        return (
          <span>
            Training Request is under {boldStatus}, Please wait for appropriate
            authority to close this Training Request.
          </span>
        );
      case "COMPLETED":
        return <span>Training is {boldStatus}, Stats are visible below.</span>;
      case "REJECTED":
        return (
          <span>
            Training Request is REVERTED due to{" "}
            <strong style={{ color: "#c93b3b" }}>
              {rej || "unspecified reason"}
            </strong>
            , Please wait for Training Partner {boldPartner} to resolve the
            issue.
          </span>
        );
      default:
        return <span>Status: {boldStatus}</span>;
    }
  }

  /* ----------------- open modal handlers ----------------- */

  async function openParticipantModal(title, payload) {
    setModalTitle(title || "Detail");
    setModalPayload(null); // show loading until enriched
    setModalOpen(true);

    // If beneficiary, enrich with location names and show only requested fields
    if (
      payload &&
      (payload.lokos_shg_code ||
        payload.member_name ||
        payload.lokos_member_code)
    ) {
      // fetch names for district/block/panchayat/village
      const locs = await fetchLocationNames({
        district: payload.district,
        block: payload.block,
        panchayat: payload.panchayat,
        village: payload.village,
      });

      // build display object with logical labels
      const disp = {
        "SHG Code": payload.lokos_shg_code || "-",
        "Member Code": payload.lokos_member_code || "-",
        Name: payload.member_name || "-",
        Age: payload.age ?? "-",
        Gender: payload.gender || "-",
        Designation: payload.designation || "-",
        "PLD Status": payload.pld_status || "-",
        "Social Category": payload.social_category || "-",
        Religion: payload.religion || "-",
        Mobile: payload.mobile || "-",
        Email: payload.email || "-",
        Education: payload.education || "-",
        Address: payload.address || "-",
        Remarks: payload.remarks || "-",
        "Registered On": fmtDate(payload.registered_on),
        District: locs.districtName || payload.district || "-",
        Block: locs.blockName || payload.block || "-",
        Panchayat: locs.panchayatName || payload.panchayat || "-",
        Village: locs.villageName || payload.village || "-",
      };

      setModalPayload(disp);
      return;
    }

    // For other payloads (trainer fallback etc.), just show key-values
    setModalPayload(payload || {});
  }

  function closeModal() {
    setModalOpen(false);
    setModalPayload(null);
    setModalTitle("");
  }

  async function onViewBeneficiary(p) {
    await openParticipantModal("Beneficiary Detail", p);
  }

  async function onViewTrainer(p) {
    const trainerId = p.trainer || p.id;
    try {
      const resp = await TMS_API.masterTrainers.retrieve(trainerId);
      const payload = resp?.data ?? resp ?? null;

      // Format trainer display fields: id, full_name, mobile_no, aadhaar_no, remarks, registered_on
      const disp = {
        "Trainer ID": payload?.id ?? trainerId,
        "Full Name": payload?.full_name ?? payload?.name ?? "-",
        Mobile: payload?.mobile_no ?? "-",
        Aadhaar: payload?.aadhaar_no ?? "-",
        Remarks: payload?.remarks ?? "-",
        "Registered On": fmtDate(payload?.registered_on),
      };
      openParticipantModal("Trainer Detail", disp);
    } catch (e) {
      // fallback to showing the row data
      const disp = {
        "Trainer ID": p.trainer || p.id,
        "Full Name": p.full_name || "-",
        Mobile: p.mobile_no || "-",
        "Registered On": fmtDate(p.registered_on),
      };
      openParticipantModal("Trainer Detail", disp);
    }
  }

  function handleRefresh() {
    try {
      localStorage.removeItem(DETAIL_CACHE_PREFIX + id);
    } catch (e) { }
    setRefreshToken((t) => t + 1);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [pldFilter]);

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
              Pragati Setu — Training Request Detail
            </div>
          }
        /> */}
          <main
            style={{
              padding: 20,
              minHeight: "100vh",
            }}
          >
            <div style={{ maxWidth: 1100, margin: "20px auto" }}>
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 16,
                  alignItems: "center",
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 10,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72", fontWeight: 700 }}>
                  Training Request #{id}
                </h2>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button className="btn-primary" onClick={handleRefresh}>
                    Refresh
                  </button>

                  <button className="btn-outline" onClick={() => navigate(-1)}>
                    Back
                  </button>
                </div>
              </div>

              {/* MAIN CARD */}
              <div className="card-ui">
                {loadingAll ? (
                  <div className="table-message">Loading all details…</div>
                ) : !tr ? (
                  <div className="table-message">Training request not found.</div>
                ) : (
                  <>
                    {/* SUMMARY */}
                    <div className="summary-box">
                      <div>
                        <strong>Plan:</strong>{" "}
                        {trainingPlanObj?.training_name ||
                          tr.training_plan ||
                          "-"}
                      </div>

                      <div>
                        <strong>Type:</strong> {tr.training_type || "-"}
                      </div>

                      <div>
                        <strong>Level:</strong> {tr.level || "-"}
                      </div>

                      <div>
                        <strong>Status:</strong>{" "}
                        <span className="status-badge">{tr.status || "-"}</span>
                      </div>
                    </div>

                    {/* STATUS PANEL */}
                    <div className="status-panel">
                      {statusMessage(tr, partner)}
                    </div>

                    {/* PARTICIPANTS */}
                    <div style={{ marginBottom: 14 }}>
                      <h4 style={{ color: "#2b4e72", marginBottom: 8 }}>
                        Participants
                      </h4>

                      <div className="participant-toolbar">
                        {(tr.training_type || "").toUpperCase() ===
                          "BENEFICIARY" && (
                            <>
                              <label style={{ fontWeight: 600 }}>PLD Filter</label>

                              <select
                                value={pldFilter}
                                onChange={(e) => setPldFilter(e.target.value)}
                                className="input-filter"
                              >
                                <option value="">All</option>
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                              </select>
                            </>
                          )}

                        <div style={{ marginLeft: "auto", color: "#2b4e72" }}>
                          {participantLoading
                            ? "Loading participants…"
                            : `${paginatedParticipants.length} shown`}
                        </div>
                      </div>

                      {participantLoading ? (
                        <div className="table-message">
                          Fetching participants…
                        </div>
                      ) : visibleParticipants.length === 0 ? (
                        <div className="table-message">
                          No participants found.
                        </div>
                      ) : (tr.training_type || "").toUpperCase() ===
                        "BENEFICIARY" ? (
                        <div className="table-container">
                          <table className="training-table">
                            <thead>
                              <tr>
                                <th>SHG Code</th>
                                <th>Member Code</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Social Category</th>
                                <th>PLD</th>
                                <th>View</th>
                              </tr>
                            </thead>

                            <tbody>
                              {paginatedParticipants.map((p) => (
                                <tr key={p.id}>
                                  <td>{p.lokos_shg_code}</td>
                                  <td>{p.lokos_member_code}</td>
                                  <td>{p.member_name}</td>
                                  <td>{p.age ?? "-"}</td>
                                  <td>{p.gender}</td>
                                  <td>{p.social_category}</td>
                                  <td>{p.pld_status}</td>
                                  <td>
                                    <button
                                      className="view-btn"
                                      onClick={() => onViewBeneficiary(p)}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="table-container">
                          <table className="training-table">
                            <thead>
                              <tr>
                                <th>Trainer ID</th>
                                <th>Full Name</th>
                                <th>Mobile</th>
                                <th>View</th>
                              </tr>
                            </thead>

                            <tbody>
                              {visibleParticipants.map((p) => (
                                <tr key={p.id}>
                                  <td>{p.trainer || p.id}</td>
                                  <td>{p.full_name}</td>
                                  <td>{p.mobile_no}</td>
                                  <td>
                                    <button
                                      className="view-btn"
                                      onClick={() => onViewTrainer(p)}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        <button
                          className="btn-outline"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Prev
                        </button>

                        <span style={{ fontWeight: 600 }}>
                          Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                          className="btn-outline"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ marginTop: 12 }}>
                      {isDmmu &&
                        (tr.status || "").toUpperCase() === "PENDING" && (
                          <div className="action-box">
                            <strong>Note:</strong> Request is PENDING. Appropriate
                            authority action required.
                            <button
                              className="btn-primary"
                              onClick={() =>
                                navigate(`/tms/dmmu/tr-review/${id}`)
                              }
                            >
                              Go to DMMU Review
                            </button>
                          </div>
                        )}

                      {isTP && (tr.status || "").toUpperCase() === "REJECTED" && (
                        <div className="action-box">
                          <strong>Note:</strong> Request is REJECTED.
                          <button
                            className="btn-primary"
                            onClick={() =>
                              navigate(`/tms/tp/batches/create/${id}`)
                            }
                          >
                            Review Batches
                          </button>
                        </div>
                      )}

                      {isTP && (tr.status || "").toUpperCase() === "BATCHING" && (
                        <button
                          className="btn-primary"
                          onClick={() => navigate(`/tms/tp/batches/create/${id}`)}
                        >
                          Create Batches
                        </button>
                      )}

                      {["ONGOING", "PENDING", "COMPLETED", "REJECTED"].includes(
                        (tr.status || "").toUpperCase(),
                      ) && (
                          <button
                            className="btn-outline"
                            onClick={() => navigate(`/tms/batches-list/${id}`)}
                          >
                            View Batches in this Training Request
                          </button>
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Participant / Trainer modal */}
      <Modal open={modalOpen} onClose={closeModal} title={modalTitle}>
        {modalPayload ? (
          <div className="modal-grid">
            {Object.keys(modalPayload).map((label) => (
              <div key={label} className="modal-row">
                <div className="modal-label">{label}</div>
                <div className="modal-value">{modalPayload[label] ?? "-"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 12 }}>Loading details…</div>
        )}
      </Modal>

      {/* STYLES */}
      <style>{`
.content-area {
  display: flex;
  flex: 1;
  width: 100%;
}

.card-ui{
  background:#fff;
  padding:16px;
  border-radius:10px;
  border:2px solid #3d6ba6;
  box-shadow:0 4px 10px rgba(0,0,0,0.05);
}

.summary-box{
  display:flex;
  flex-wrap:wrap;
  gap:20px;
  margin-bottom:12px;
  color:#2b4e72;
}

.status-badge{
  background:#a7c6ed;
  color:#2b4e72;
  padding:4px 10px;
  border-radius:6px;
  font-weight:700;
}

.status-panel{
  padding:12px;
  border-radius:6px;
  background:#f4f8fd;
  border-left:4px solid #3d6ba6;
  margin-bottom:14px;
}

.participant-toolbar{
  display:flex;
  gap:8px;
  align-items:center;
  margin-bottom:10px;
}

.input-filter{
  border:1px solid #3d6ba6;
  padding:6px 10px;
  border-radius:6px;
  outline:"none"
}

.table-container{
  max-height:420px;
  overflow:auto;
  border:1px solid #e4ecf5;
  border-radius:8px;
}

.training-table{
  width:100%;
  border-collapse:collapse;
  font-size:14px;
}

.training-table thead{
  background:#3d6ba6;
  color:white;
  position:sticky;
  top:0;
}

.training-table th{
  padding:10px;
  text-align:left;
  border-right:1px solid rgba(255,255,255,0.2);
}

.training-table th:last-child{
  border-right:none;
}

.training-table td{
  padding:10px;
  border-bottom:1px solid #e4ecf5;
  border-right:1px solid #e4ecf5;
}

.training-table td:last-child{
  border-right:none;
}

.training-table tbody tr{
  transition:background 0.2s ease;
}

.training-table tbody tr:nth-child(even){
  background:#f7fbff;
}

.training-table tbody tr:hover{
  background:#e4ecf5;
}

.view-btn{
  background:#5a8cc2;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
  transition:all .25s ease;
}

.view-btn:hover{
  transform:translateY(-4px);
  box-shadow:0 8px 14px rgba(0,0,0,0.15);
}

.btn-primary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btn-primary:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

.btn-outline{
  background:#5a8cc2;
  color:#fff;
  border:none;
  padding:7px 16px;
  border-radius:6px;
  cursor:pointer;
  transition:all .25s ease;
}

.btn-outline:hover{
  transform:translateY(-4px);
  box-shadow:0 8px 14px rgba(0,0,0,0.15);
}

.action-box{
  background:#f4f8fd;
  border-left:4px solid #5a8cc2;
  padding:10px;
  margin-bottom:10px;
}

.modal-grid{
  display:grid;
  gap:10px;
}

.modal-row{
  display:flex;
  gap:12px;
  padding:6px 0;
  border-bottom:1px solid #e4ecf5;
}

.modal-label{
  min-width:160px;
  font-weight:700;
  color:#2b4e72;
}

.modal-value{
  color:#111;
}

.table-message{
  padding:20px;
  text-align:center;
  color:#2b4e72;
}

`}</style>
    </div>
  );
}
