// src/pages/EPSMS/RecordForm/FormComponents/PanchayatsList.jsx
import React, { useEffect, useState } from "react";
import { LOOKUP_API, EPSAKHI_API } from "../../../../api/axios";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaTimes,
  FaSpinner,
  FaUser,
  FaLock,
  FaIdCard,
  FaSyncAlt,
} from "react-icons/fa";

export default function PanchayatsList({ crpData, blockId }) {
  const [panchayats, setPanchayats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [done, setDone] = useState(false);
  const [search, setSearch] = useState("");
  const [alreadyAssigned, setAlreadyAssigned] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("loading");

  const filteredPanchayats = panchayats.filter((p) =>
    (p.panchayat_name_en || "").toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!blockId || !crpData) return;

    async function load() {
      setLoading(true);

      const res = await LOOKUP_API.panchayats.list({
        block_id: blockId,
        page_size: 10000,
      });

      const list = res.data?.results || res.data || [];
      setPanchayats(list);

      /* Check if already assigned */

      const assignedMap = {};

      await Promise.all(
        list.map(async (p) => {
          try {
            const r = await EPSAKHI_API.crpPanchayatMap.list({
              panchayat_id: p.id || p.panchayat_id,
            });

            const exists = (r.data?.results || r.data || []).length > 0;

            if (exists) assignedMap[p.id || p.panchayat_id] = true;
          } catch (e) {}
        }),
      );

      setAlreadyAssigned(assignedMap);
      setLoading(false);
    }

    load();
  }, [blockId, crpData]);

  function toggle(p) {
    const id = p.id || p.panchayat_id;

    if (alreadyAssigned[id]) return;

    if (selected.find((x) => (x.id || x.panchayat_id) === id)) return;

    setSelected((prev) => [...prev, p]);
  }

  function remove(id) {
    setSelected((prev) => prev.filter((x) => (x.id || x.panchayat_id) !== id));
  }

  async function assign() {
    if (!selected.length) return;

    setShowModal(true);
    setModalState("loading");

    try {
      const payload = {
        crp_id: crpData.crp.master_user.id,
        allocated_panchayats: selected.map((x) => x.panchayat_id),
      };

      console.log("CRP Panchayat Payload:", payload);

      await EPSAKHI_API.crpPanchayatBulk(payload);

      setModalState("success");
    } catch (err) {
      console.error(err);
      setModalState("error");
    }
  }

  if (!crpData) return null;

  return (
    <div className="epsms-card panchayat-card">
      {/* SECTION 1 USER ACCOUNT */}
      <h3>
        <FaUser /> CRP User Account
      </h3>

      <div className="crp-account">
        <div>
          <FaIdCard /> Username: {crpData.username}
        </div>
        <div>
          <FaLock /> Password: {crpData.password}
        </div>
      </div>

      {/* SECTION 2 PROFILE */}
      <h3>
        <FaUser /> CRP Profile
      </h3>

      <div className="crp-profile">
        <div>Name: {crpData.crp.name}</div>
        <div>Mobile: {crpData.crp.mobile_number}</div>
        <div>Category: {crpData.crp.category}</div>
        <div>SHG: {crpData.crp.lokos_shg_code}</div>
      </div>

      {/* SECTION 3 ALL PANCHAYATS */}
      <h3>
        <FaMapMarkerAlt /> Panchayats in Block
      </h3>

      <div className="panchayat-search">
        <input
          type="text"
          placeholder="Search Panchayat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loading">
          <FaSpinner className="spin" /> Loading Panchayats...
        </div>
      )}

      <div className="panchayat-list">
        {filteredPanchayats.map((p) => (
          <div
            key={p.id || p.panchayat_id || p.panchayat_name_en}
            className={`panchayat-item ${alreadyAssigned[p.id || p.panchayat_id] ? "assigned" : ""}`}
            onClick={() => toggle(p)}
            title={
              alreadyAssigned[p.id || p.panchayat_id]
                ? "Already assigned to another CRP"
                : ""
            }
          >
            {p.panchayat_name_en}

            {alreadyAssigned[p.id || p.panchayat_id] && (
              <span className="assigned-tag">Assigned</span>
            )}
          </div>
        ))}
      </div>

      {/* SECTION 4 SELECTED */}
      <h3>Assigned Panchayats</h3>

      <div className="selected-badges">
        {selected.map((p) => (
          <div
            key={p.id || p.panchayat_id || p.panchayat_name_en}
            className="badge"
          >
            {p.panchayat_name_en}
            <FaTimes onClick={() => remove(p.id || p.panchayat_id)} />
          </div>
        ))}
      </div>

      {/* ASSIGN BUTTON */}
      <button
        className="assign-btn"
        onClick={assign}
        disabled={assigning || !selected.length}
      >
        {assigning ? (
          <>
            <FaSpinner className="spin" /> Assigning...
          </>
        ) : (
          <>
            <FaCheckCircle /> Assign Panchayats
          </>
        )}
      </button>

      {showModal && (
        <div className="assign-modal-overlay">
          <div className="assign-modal-card">
            {modalState === "loading" && (
              <>
                <FaSpinner className="spin big-loader" />
                <h3>Assigning Panchayats</h3>
                <p>Please wait while we map panchayats to CRP...</p>
              </>
            )}

            {modalState === "success" && (
              <>
                <FaCheckCircle className="success-icon" />
                <h3>Panchayats Assigned Successfully</h3>

                <button
                  className="modal-close-btn"
                  onClick={() => window.location.reload()}
                >
                  <FaSyncAlt /> Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .panchayat-card h3{
          margin-top:16px;
        }

        .panchayat-search{
        margin-top:10px;
        }

        .panchayat-search input{
        width:100%;
        padding:10px;
        border-radius:6px;
        border:1px solid var(--epsms-border);
        font-size:14px;
        transition:all .25s ease;
        }

        .panchayat-search input:focus{
        outline:none;
        border-color:var(--epsms-red);
        box-shadow:0 0 0 2px rgba(201,88,53,.15);
        }

        .panchayat-list{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:10px;
          margin-top:10px;
        }

        .panchayat-item{
          padding:10px;
          border:1px solid var(--epsms-muted);
          border-radius:6px;
          cursor:pointer;
          transition:.2s;
          background:#fafafa;
        }

        .panchayat-item:hover{
          border-color:var(--epsms-red);
          transform:translateY(-2px);
        }

        .panchayat-item.assigned{
        background:#f3f4f6;
        border-color:#d1d5db;
        cursor:not-allowed;
        opacity:.6;
        }

        .assigned-tag{
        margin-left:6px;
        font-size:11px;
        background:#dc2626;
        color:white;
        padding:2px 6px;
        border-radius:4px;
        }

        .selected-badges{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:10px;
        }

        .badge{
          background:var(--epsms-green);
          color:white;
          padding:6px 10px;
          border-radius:20px;
          display:flex;
          align-items:center;
          gap:6px;
        }

        .badge svg{
          cursor:pointer;
        }

        .assign-btn{
          margin-top:16px;
          background:var(--epsms-red);
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:6px;
          cursor:pointer;
          display:flex;
          gap:8px;
          align-items:center;
        }

        .assign-success{
          margin-top:12px;
          color:var(--epsms-green);
          font-weight:600;
        }

        .spin{
          animation:spin 1s linear infinite;
        }

        @keyframes spin{
          from{transform:rotate(0)}
          to{transform:rotate(360deg)}
        }

        /* -------------------------------
          MODAL OVERLAY
        --------------------------------*/

        .assign-modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.55);
          backdrop-filter:blur(3px);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:9999;
          animation:fadeIn .25s ease;
        }

        /* CARD */

        .assign-modal-card{
          background:white;
          border-radius:12px;
          padding:32px 28px;
          width:min(420px,90vw);
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          gap:14px;
          animation:modalPop .3s ease;
          border:1px solid var(--epsms-muted);
        }

        /* ICONS */

        .success-icon{
          font-size:56px;
          color:var(--epsms-green);
        }

        .big-loader{
          font-size:52px;
          color:var(--epsms-red);
        }

        /* BUTTON */

        .modal-close-btn{
          margin-top:16px;
          background:var(--epsms-red);
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:6px;
          font-weight:600;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:8px;
          transition:all .25s ease;
        }

        .modal-close-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 8px 18px rgba(0,0,0,.2);
        }

        /* ANIMATIONS */

        @keyframes fadeIn{
          from{opacity:0}
          to{opacity:1}
        }

        @keyframes modalPop{
          from{
            opacity:0;
            transform:translateY(30px) scale(.95);
          }
          to{
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }

        /* RESPONSIVE */

        @media (max-width:768px){

          .assign-modal-card{
            padding:26px 20px;
          }

          .success-icon{
            font-size:46px;
          }

          .big-loader{
            font-size:44px;
          }

        }

        @media (max-width:480px){

          .assign-modal-card{
            width:92vw;
            padding:22px 16px;
          }

          .modal-close-btn{
            width:100%;
            justify-content:center;
          }

        }

      `}</style>
    </div>
  );
}
