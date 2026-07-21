// src/pages/EPSMS/RecordForm/FormComponents/PanchayatsList.jsx
import React, { useEffect, useState, useContext } from "react"; //kushwaha changes
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
import { AuthContext } from "../../../../contexts/AuthContext" //kushwaha changes
export default function PanchayatsList({ crpData, blockId }) {
  const { user } = useContext(AuthContext); //kushwaha changes
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
          } catch (e) { }
        }),
      );

      setAlreadyAssigned(assignedMap);
      setLoading(false);
    }

    load();
  }, [blockId, crpData]);

  function toggle(p) {
    const id = p.id || p.panchayat_id;
    const isCrpHome = String(id) === String(crpData.crp.panchayat.panchayat_id);

    if (isCrpHome) {
      alert("Cannot assign CRP's home panchayat.");
      return;
    }

    if (alreadyAssigned[id]) return;

    const exists = selected.find((x) => (x.id || x.panchayat_id) === id);

    // ❌ Block if already 5
    if (!exists && selected.length >= 5) {
      alert("❌ Maximum 5 Panchayats allowed");
      return;
    }

    if (!exists) {
      setSelected((prev) => [...prev, p]);
    } else {
      setSelected((prev) =>
        prev.filter((x) => (x.id || x.panchayat_id) !== id),
      );
    }
  }

  function remove(id) {
    setSelected((prev) => prev.filter((x) => (x.id || x.panchayat_id) !== id));
  }

  async function assign() {
    // ❌ MIN validation
    if (selected.length < 2) {
      alert("⚠️ Please select at least 2 Panchayats");
      return;
    }

    // ❌ MAX safety (extra safety)
    if (selected.length > 5) {
      alert("❌ Maximum 5 Panchayats allowed");
      return;
    }

    setShowModal(true);
    setModalState("loading");
    setAssigning(true);

    try {
      const payload = {
        crp_id: crpData.crp.master_user_id || crpData.crp.master_user?.id,
        allocated_panchayats: selected.map((x) => x.id || x.panchayat_id),
      };
      // Kushwaha changes
      await EPSAKHI_API.crpPanchayatBulk({ ...payload, created_by: user?.id });
      //
      setModalState("success");
    } catch (err) {
      console.error(err);
      setModalState("error");
    } finally {
      setAssigning(false);
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
        {filteredPanchayats.map((p) => {
          const id = p.id || p.panchayat_id;
          const crpHomeId = crpData.crp.panchayat.panchayat_id;

          const isCrpHome = String(id) === String(crpHomeId);
          const isAssigned = alreadyAssigned[id];
          const isSelected = selected.find(
            (x) => (x.id || x.panchayat_id) === id,
          );

          const isDisabled =
            isCrpHome || isAssigned || (selected.length >= 5 && !isSelected);

          return (
            <div
              key={id || p.panchayat_name_en}
              className={`panchayat-item 
                                ${isCrpHome ? "crp-home" : ""} 
                                ${isAssigned && !isCrpHome ? "assigned" : ""} 
                                ${isDisabled && !isCrpHome && !isAssigned ? "disabled" : ""}
                                ${isSelected ? "selected" : ""}
                            `}
              onClick={() => {
                if (isDisabled) return;
                toggle(p);
              }}
              title={
                isCrpHome
                  ? "CRP cannot be assigned to their home panchayat"
                  : isAssigned
                    ? "Already assigned to another CRP"
                    : isDisabled
                      ? "Maximum 5 Panchayats allowed"
                      : ""
              }
            >
              {p.panchayat_name_en}

              {isCrpHome && <span className="crp-tag">CRP</span>}
              {isAssigned && !isCrpHome && (
                <span className="assigned-tag">Assigned</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "10px", fontWeight: "600" }}>
        Selected: {selected.length} / 5 (Min 2 required)
      </div>

      {/* SECTION 4 SELECTED */}
      <h3>Assigned Panchayats</h3>

      <div className="selected-badges">
        {selected.length === 0 && (
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            No panchayats selected yet. Select 2 to 5 panchayats.
          </div>
        )}
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
        disabled={assigning || selected.length < 2}
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

            {modalState === "error" && (
              <>
                <FaTimes className="big-loader" />
                <h3>Assignment Failed</h3>
                <p>There was an error saving the assignment.</p>

                <button
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .panchayat-card h3{
          margin-top:16px;
          padding-bottom:10px;
          padding-top:10px;
        }

        .crp-account{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:16px;
          margin-top:16px;
        }

        .crp-account > div{
          display:flex;
          align-items:center;
          gap:12px;
          padding:16px 18px;
          background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);
          border:1px solid #e2e8f0;
          border-radius:12px;
          color:#334155;
          font-size:15px;
          font-weight:500;
          transition:all .25s ease;
          box-shadow:0 4px 12px rgba(15,23,42,.04);
        }

        .crp-account > div svg{
          flex-shrink:0;
          width:18px;
          height:18px;
          color:var(--epsms-red);
        }

        .crp-account > div:hover{
          transform:translateY(-3px);
          border-color:var(--epsms-red);
          box-shadow:0 10px 24px rgba(15,23,42,.08);
        }

        .crp-profile{
          margin-top:16px;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:16px;
        }

        .crp-profile > div{
          position:relative;
          padding:18px 18px 16px;
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:12px;
          transition:all .25s ease;
          box-shadow:0 4px 12px rgba(0, 0, 0, 0.04);
          overflow:hidden;
          color:#0f172a;
          font-size:15px;
          font-weight:600;
          line-height:1.5;
        }

        .crp-profile > div::before{
          content:"";
          position:absolute;
          left:0;
          top:0;
          width:4px;
          height:100%;
          background:linear-gradient(
            to bottom,
            var(--epsms-red),
            #f59e0b
          );
        }

        .crp-profile > div:hover{
          transform:translateY(-3px);
          border-color:var(--epsms-red);
          box-shadow:0 12px 24px rgba(15,23,42,.08);
        }

        .crp-profile > div::first-line{
          color:#000000;
          font-size:14px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.08em;
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

        .loading {
          margin-top: 16px;
          font-size: 14px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panchayat-list{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:10px;
          margin-top:10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .panchayat-item{
          padding:10px;
          border:1px solid var(--epsms-muted);
          border-radius:6px;
          cursor:pointer;
          transition:.2s;
          background:#fafafa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #334155;
        }

        .panchayat-item:hover{
          border-color:var(--epsms-red);
          transform:translateY(-2px);
        }

        /* CRP Home Panchayat Highlights */
        .panchayat-item.crp-home {
          background: #f3e8ff; 
          border-color: #d8b4fe; 
          color: #6b21a8; 
          cursor: not-allowed;
        }

        .panchayat-item.crp-home:hover {
          transform: none;
        }

        .crp-tag {
          margin-left: 6px;
          font-size: 11px;
          background: #9333ea; 
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .panchayat-item.assigned{
          background:#f3f4f6;
          border-color:#d1d5db;
          cursor:not-allowed;
          opacity:.6;
        }

        .panchayat-item.assigned:hover {
          transform: none;
        }

        .assigned-tag{
          margin-left:6px;
          font-size:11px;
          background:#dc2626;
          color:white;
          padding:2px 6px;
          border-radius:4px;
        }

        .panchayat-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .panchayat-item.selected {
          background: #d1fae5; 
          border-color: var(--epsms-green);
          box-shadow: 0 0 0 1px var(--epsms-green);
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
          font-size: 13px;
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
          font-weight: 600;
        }

        .assign-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          
          .crp-account, .crp-profile {
            flex-direction: column;
            gap: 6px;
          }
          
          .crp-profile {
            grid-template-columns: 1fr;
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
