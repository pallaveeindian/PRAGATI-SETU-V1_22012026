// src/pages/EPSMS/RecordForm/FormComponents/CRPDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { LOOKUP_API, EPSAKHI_API } from "../../../../api/axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaLock,
  FaSyncAlt,
  FaTrashAlt,
} from "react-icons/fa";

export default function CRPDetails({ crpData, onClose, onRefresh }) {
  const { user } = useContext(AuthContext) || {};

  // Geoscope & Location State (Filters)
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");
  const [isDistrictLocked, setIsDistrictLocked] = useState(false);

  // Panchayat Data State
  const [panchayats, setPanchayats] = useState([]);
  const [alreadyAssigned, setAlreadyAssigned] = useState({});
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  // Loading & Action States
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionModal, setActionModal] = useState(null); // 'loading', 'success', 'error', 'delete_confirm'
  const [showAddSection, setShowAddSection] = useState(false);

  const [hasRemovedPanchayat, setHasRemovedPanchayat] = useState(false);

  const filteredPanchayats = panchayats.filter((p) =>
    (p.panchayat_name_en || "").toLowerCase().includes(search.toLowerCase()),
  );

  const currentCrpId = crpData?.master_user_id;

  // console.log(crpData);
  // Use JSON stringify to prevent infinite loops if parent passes a new object reference on every render
  const allocatedPanchayatsStr = JSON.stringify(
    crpData?.allocated_panchayats || [],
  );

  // 0. Initialize already allocated panchayats on load
  useEffect(() => {
    if (crpData?.allocated_panchayats) {
      setSelected(crpData.allocated_panchayats);
    } else {
      setSelected([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocatedPanchayatsStr]);

  // 1. Resolve User District (DMMU Lock) & Load Districts
  useEffect(() => {
    async function initLocations() {
      setLoadingLocations(true);
      try {
        const distRes = await LOOKUP_API.districts.list({ page_size: 1000 });
        setDistricts(distRes.data?.results || distRes.data || []);

        if (user?.id) {
          const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
          const userDistricts = geoRes?.data?.districts || [];

          if (userDistricts.length === 1) {
            setDistrictId(userDistricts[0]);
            setIsDistrictLocked(true);
          }
        }
      } catch (err) {
        console.error("Failed to init locations", err);
      } finally {
        setLoadingLocations(false);
      }
    }
    initLocations();
  }, [user?.id]);

  // 2. Load Blocks when District changes
  useEffect(() => {
    if (!districtId) {
      setBlocks([]);
      setBlockId("");
      return;
    }
    async function loadBlocks() {
      setLoadingLocations(true);
      try {
        const res = await LOOKUP_API.blocks.list({
          district_id: districtId,
          page_size: 500,
        });
        setBlocks(res.data?.results || res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingLocations(false);
      }
    }
    loadBlocks();
    setBlockId("");
  }, [districtId]);

  // 3. Load Panchayats & Check Assignment Status when Block changes
  useEffect(() => {
    // Fix: Removed `!crpData` and relied purely on `!currentCrpId` to prevent the infinite loop
    if (!blockId || !currentCrpId) {
      setPanchayats([]);
      return;
    }

    async function loadPanchayats() {
      setAlreadyAssigned({});
      setLoadingPanchayats(true);
      try {
        const res = await LOOKUP_API.panchayats.list({
          block_id: blockId,
          page_size: 10000,
        });
        const list = res.data?.results || res.data || [];
        setPanchayats(list);

        const assignedMap = {};
        const selectedPanchayats = [];

        await Promise.all(
          list.map(async (p) => {
            try {
              const r = await EPSAKHI_API.crpPanchayatMap.list({
                panchayat_id: p.id || p.panchayat_id,
              });

              const exists = (r.data?.results || r.data || []).length > 0;

              if (!exists) return;

              const mapData = r.data?.results?.[0] || r.data?.[0];

              if (String(mapData?.crp_id) === String(currentCrpId)) {
                selectedPanchayats.push(p);
              } else {
                assignedMap[p.id || p.panchayat_id] = {
                  assigned: true,
                  crpId: mapData?.crp_id,
                  crpName: mapData?.crp_name || "",
                };
              }
            } catch (e) {}
          }),
        );

        setAlreadyAssigned(assignedMap);
        if (selected.length === 0) {
          setSelected(selectedPanchayats);
        }
      } catch (err) {
        console.error("Failed to load panchayats", err);
      } finally {
        setLoadingPanchayats(false);
      }
    }
    loadPanchayats();

    // Fix: Removed `crpData` from dependencies. React handles primitive currentCrpId fine.
  }, [blockId, currentCrpId]);

  // Toggle selection
  function toggle(p) {
    const id = p.id || p.panchayat_id;
    const crpHomeId =
      crpData?.crp?.panchayat?.panchayat_id || crpData?.panchayat_id;
    const isCrpHome = String(id) === String(crpHomeId);

    if (isCrpHome) {
      alert("Cannot assign CRP's home panchayat.");
      return;
    }

    const assignment = alreadyAssigned[id];

    if (assignment && String(assignment.crpId) !== String(currentCrpId)) {
      return; // Already assigned to someone else
    }

    const exists = selected.find(
      (x) => String(x.id || x.panchayat_id) === String(id),
    );

    if (!exists) {
      setSelected((prev) => [...prev, p]);
    } else {
      setSelected((prev) =>
        prev.filter((x) => String(x.id || x.panchayat_id) !== String(id)),
      );
    }
  }

  function remove(id) {
    // Only update the local state. Do NOT call the API here.
    setSelected((prev) =>
      prev.filter((x) => String(x.id || x.panchayat_id) !== String(id)),
    );
    setHasRemovedPanchayat(true);
  }
  // Update logic
  async function handleUpdate() {
    setAssigning(true);

    const payload = {
      crp_id: currentCrpId,
      created_by: user?.id,
      allocated_panchayats: selected.map((p) => p.id || p.panchayat_id),
    };

    try {
      await EPSAKHI_API.crpPanchayatBulk(payload);
      setActionModal("success");
      onRefresh?.();
    } catch (err) {
      console.error("Error:", err.response?.data);
      setActionModal("error");
    } finally {
      setAssigning(false);
    }
  }

  // Delete logic
  async function handleDelete() {
    setActionModal("loading");
    setDeleting(true);

    try {
      await EPSAKHI_API.mappedCrpBulkDelete({
        crp_id: currentCrpId,
        panchayat_ids: selected.map((p) => p.id || p.panchayat_id),
      });

      setActionModal("delete_success");
    } catch (err) {
      console.error(err);
      setActionModal("error");
    } finally {
      setDeleting(false);
    }
  }
  if (!crpData) return null;
  async function handleDeletePanchayat() {
    // 1. Validation: Don't do anything if there's nothing to delete
    if (selected.length === 0) {
      setActionModal(null);
      return;
    }

    setDeleting(true);
    setActionModal("loading");

    // 2. Map all selected IDs to be sent in one bulk request
    const panchayatIdsToRemove = selected.map((p) => p.id || p.panchayat_id);

    const deletePayload = {
      crpep_id: currentCrpId,
      // Send as a comma-separated string if your API expects that,
      // or an array depending on your backend requirements
      panchayat_ids: panchayatIdsToRemove.join(","),
      deleted_by: user?.id,
    };

    try {
      await EPSAKHI_API.mappedCrpBulkDelete(deletePayload);

      // 3. Clear the UI state after the API confirms success
      setSelected([]);
      setHasRemovedPanchayat(true);
      setActionModal("delete_success");
      onRefresh?.();
    } catch (err) {
      console.error("Bulk delete failed:", err);
      setActionModal("error");
      window.alert(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to delete panchayat(s).",
      );
    } finally {
      setDeleting(false);
    }
  }
  return (
    <div className="crp-modal-overlay">
      <div className="crp-modal-container">
        {/* HEADER */}
        <div className="crp-modal-header">
          <h2>CRP Details</h2>
          <button className="btn-close-green" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* CRP DETAILS INFO */}
        <div className="crp-details-body">
          <div className="info-grid">
            <div className="info-label">Name</div>
            <div className="info-value uppercase">{crpData.name}</div>

            <div className="info-label">Mobile</div>
            <div className="info-value">{crpData.mobile_number}</div>

            <div className="info-label">District</div>
            <div className="info-value uppercase">
              {crpData?.crp?.district?.district_name_en ||
                crpData.district_name_en ||
                "N/A"}
            </div>

            <div className="info-label">Block</div>
            <div className="info-value uppercase">
              {crpData?.crp?.block?.block_name_en ||
                crpData.block_name_en ||
                "N/A"}
            </div>

            <div className="info-label">Panchayat</div>
            <div className="info-value uppercase">
              {crpData?.crp?.panchayat?.panchayat_name_en ||
                crpData.panchayat_name_en ||
                "N/A"}
            </div>

            <div className="info-label" style={{ marginTop: "8px" }}>
              Allocated
              <br />
              Panchayats
            </div>
            <div className="info-value">
              <div className="allocated-badges">
                {selected.length === 0 && (
                  <span className="text-muted">None Selected</span>
                )}
                {selected.map((p) => (
                  <div key={p.id || p.panchayat_id} className="green-badge">
                    {p.panchayat_name_en}
                    {/* <FaTimes className="remove-icon"  onClick={() => remove(p.id || p.panchayat_id)} title="Remove" /> */}
                    <FaTimes
                      className="remove-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // <--- ADD THIS
                        remove(p.id || p.panchayat_id);
                      }}
                      title="Remove"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* FILTERS & ASSIGNMENT SECTION */}
          <h3 className="section-title">Update Allocation</h3>

          <div className="filters-row">
            <div className="filter-group">
              <label>
                District {isDistrictLocked && <FaLock className="lock-icon" />}
              </label>
              <select
                value={districtId}
                disabled={isDistrictLocked || loadingLocations}
                onChange={(e) => setDistrictId(e.target.value)}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option
                    key={d.id || d.district_id}
                    value={d.id || d.district_id}
                  >
                    {d.district_name_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Block</label>
              <select
                value={blockId}
                disabled={!districtId || loadingLocations}
                onChange={(e) => setBlockId(e.target.value)}
              >
                <option value="">
                  {loadingLocations ? "Loading..." : "Select Block"}
                </option>
                {blocks.map((b) => (
                  <option key={b.id || b.block_id} value={b.id || b.block_id}>
                    {b.block_name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="panchayat-selection-area">
            <input
              type="text"
              className="search-input"
              placeholder="Search Panchayat to assign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!blockId}
            />

            <div className="panchayat-list-box">
              {loadingPanchayats ? (
                <div className="text-muted">
                  <FaSpinner className="spin" /> Loading...
                </div>
              ) : !blockId ? (
                <div className="text-muted">
                  Select a block to view available panchayats.
                </div>
              ) : (
                <div className="panchayat-grid">
                  {filteredPanchayats.map((p) => {
                    const id = p.id || p.panchayat_id;
                    const crpHomeId =
                      crpData?.crp?.panchayat?.panchayat_id ||
                      crpData?.panchayat_id;

                    const isCrpHome = String(id) === String(crpHomeId);

                    const assignment = alreadyAssigned[id];
                    const isAssignedToOther =
                      assignment &&
                      String(assignment.crpId) !== String(currentCrpId);

                    const isSelected = selected.some(
                      (x) => String(x.id || x.panchayat_id) === String(id),
                    );

                    const isDisabled = isCrpHome || isAssignedToOther;

                    return (
                      <div
                        key={id}
                        className={`p-item
                                ${isCrpHome ? "is-home" : ""}
                                ${isAssignedToOther ? "is-assigned" : ""}
                                ${isDisabled && !isSelected ? "is-disabled" : ""}
                                ${isSelected ? "is-selected" : ""}
                            `}
                        onClick={() => !isDisabled && toggle(p)}
                      >
                        <span className="p-name">{p.panchayat_name_en}</span>

                        {isSelected && <FaCheckCircle className="check-icon" />}

                        {isCrpHome && (
                          <span className="status-tag tag-home">Home</span>
                        )}

                        {isAssignedToOther && (
                          <span className="status-tag tag-invalid">
                            Assigned
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="selection-count">Selected: {selected.length}</div>
          </div>

          <hr className="divider" />

          {/* ACTIONS */}
          <div className="modal-actions-footer">
            <div className="left-actions">
              {!showAddSection && !hasRemovedPanchayat && (
                <button
                  className="btn-add"
                  onClick={() => setShowAddSection(true)}
                >
                  + Add Panchayat
                </button>
              )}
              {!showAddSection && (
                <button
                  className="btn-delete"
                  onClick={() => setActionModal("delete_panchayat_confirm")}
                  disabled={selected.length === 0}
                >
                  Delete Panchayat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {actionModal && (
        <div className="crp-modal-overlay nested">
          <div className="action-card">
            {/* Loading */}
            {actionModal === "loading" && (
              <>
                <FaSpinner className="spin big-icon text-blue" />
                <h3>Processing...</h3>
              </>
            )}

            {/* Update Success */}
            {actionModal === "success" && (
              <>
                <FaCheckCircle className="big-icon text-green" />
                <h3>Successfully Updated</h3>

                <button
                  className="btn-primary"
                  onClick={() => {
                    setActionModal(null);
                    onRefresh?.();
                  }}
                >
                  Continue
                </button>
              </>
            )}

            {/* Delete Selected Panchayat */}
            {actionModal === "delete_panchayat_confirm" && (
              <>
                <FaTrashAlt className="big-icon text-red" />

                <h3>Delete Selected Panchayat?</h3>

                <p>
                  {selected.length} selected panchayat(s) will be removed from
                  this CRP.
                </p>

                <div className="flex-row mt-3">
                  <button
                    className="btn-delete"
                    onClick={handleDeletePanchayat}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => setActionModal(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Delete Success */}
            {actionModal === "delete_success" && (
              <>
                <FaCheckCircle className="big-icon text-green" />

                <h3>Panchayat Deleted Successfully</h3>

                <button
                  className="btn-primary"
                  onClick={() => {
                    setActionModal(null);
                    onRefresh?.();
                  }}
                >
                  Continue
                </button>
              </>
            )}

            {/* Error */}
            {actionModal === "error" && (
              <>
                <FaTimes className="big-icon text-red" />

                <h3>Action Failed</h3>

                <button
                  className="btn-secondary"
                  onClick={() => setActionModal(null)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
  /* OVERLAY & CONTAINER */
  .crp-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
    padding: 20px;
    pointer-events: auto;
  }
  .crp-modal-overlay.nested { z-index: 1010; backdrop-filter: blur(2px); }
  
  .crp-modal-container {
    background: #fff;
    width: 100%; max-width: 750px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
    max-height: 90vh;
    cursor: default; /* Prevents cursor jump */
  }

  /* HEADER - Explicitly stabilized */
 /* HEADER - Fixed Stability */
  .crp-modal-header {
    background-color: #d15829; 
    padding: 16px 20px;
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    /* Force this area to be a solid block */
    cursor: default !important; 
    user-select: none;
    position: relative;
    z-index: 10;
    /* This prevents the browser from thinking the mouse is leaving the header */
    pointer-events: auto; 
  }

  .crp-modal-header h2 {
    color: #fff; 
    margin: 0; 
    font-size: 18px; 
    font-weight: 600;
    cursor: default !important;
    user-select: none;
    /* Prevent the text from being treated as an interactive element */
    pointer-events: none; 
  }

  /* Ensure no child element overrides header cursor */
  .crp-modal-header * {
    cursor: default !important;
  }

  .btn-close-green {
    background-color: #1a9e22; 
    color: white; border: none; border-radius: 6px;
    width: 32px; height: 32px;
    display: flex; justify-content: center; align-items: center;
    font-size: 16px; 
    cursor: pointer !important; /* Only button is pointer */
    transition: 0.2s;
    outline: none;
  }
  .btn-close-green:hover { background-color: #15801c; }

  /* BODY */
  .crp-details-body { padding: 20px; overflow-y: auto; }

  .info-grid {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 16px 10px;
    align-items: start;
  }
  .info-label { color: #d15829; font-weight: 700; font-size: 15px; }
  .info-value { color: #333; font-size: 15px; font-weight: 500; }
  .uppercase { text-transform: uppercase; }

  .allocated-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .green-badge {
    background-color: #1a9e22; color: white;
    padding: 4px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
    text-transform: uppercase;
  }
  .green-badge .remove-icon { cursor: pointer; font-size: 14px; }
  .green-badge .remove-icon:hover { color: #fca5a5; }

  /* FILTERS */
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .section-title { font-size: 16px; color: #374151; margin-bottom: 16px; font-weight: 600; }
  .filters-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .filter-group label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 6px; }
  .filter-group select, .search-input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; font-size: 14px; }
  .filter-group select:focus, .search-input:focus { border-color: #d15829; }
  
  .panchayat-selection-area { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
  .panchayat-list-box { max-height: 200px; overflow-y: auto; margin-top: 12px; padding-right: 6px; }
  .panchayat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .p-item {
    background: #fff; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px;
    cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: 0.2s; position: relative;
  }
  .p-item:hover:not(.is-disabled):not(.is-home):not(.is-assigned) { border-color: #1a9e22; }
  .p-name { font-size: 13px; font-weight: 600; color: #111827; pointer-events: none; }
  .is-selected { border-color: #1a9e22; background: #f0fdf4; }
  .check-icon { position: absolute; top: 10px; right: 10px; color: #1a9e22; }
  .is-disabled { opacity: 0.6; cursor: not-allowed; }
  .is-home { background: #fef2f2; border-color: #fca5a5; }
  .is-assigned { background: #fee2e2; border-color: #ef4444; }
  
  /* FOOTER ACTIONS */
  .modal-actions-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; }
  .btn-update, .btn-delete, .btn-primary, .btn-secondary, .btn-add {
    padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; border: none;
  }
  .btn-update { background: #d15829; color: #fff; }
  .btn-delete { background: #ef4444; color: #fff; }
  .btn-add { background: #10b981; color: white; }
  
  /* NESTED MODAL */
  .action-card { background: white; padding: 32px; border-radius: 12px; text-align: center; width: 320px; }
  .big-icon { font-size: 48px; margin-bottom: 16px; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`}</style>
    </div>
  );
}
