// src/pages/EPSMS/RecordForm/FormComponents/CRPFilters.jsx
import React, { useEffect, useState, useContext } from "react";
import { LOOKUP_API } from "../../../../api/axios";
import {
  FaMapMarkedAlt,
  FaMap,
  FaLocationArrow,
  FaSearch,
  FaLock,
} from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";

export default function CRPFilters({ onFetch }) {
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [panchayat, setPanchayat] = useState("");

  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);

  const { user } = useContext(AuthContext) || {};
  const [isDistrictLocked, setIsDistrictLocked] = useState(false);

  // Auto set District if DMMU
  useEffect(() => {
    if (!user?.id) return;

    async function resolveUserDistrict() {
      try {
        const res = await LOOKUP_API.userGeoscopeByUserId(user.id);

        const districts = res?.data?.districts || [];

        if (districts.length === 1) {
          setDistrict(districts[0]);
          setIsDistrictLocked(true);
        }
      } catch (err) {
        console.error("Failed to resolve user district", err);
      }
    }

    resolveUserDistrict();
  }, [user?.id]);

  /* LOAD DISTRICTS */

  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await LOOKUP_API.districts.list({
          page_size: 1000,
        });

        setDistricts(res.data?.results || res.data || []);
      } catch (e) {
        console.error(e);
      }
    }

    loadDistricts();
  }, []);

  /* LOAD BLOCKS */

  useEffect(() => {
    if (!district) return;

    async function loadBlocks() {
      setLoadingBlocks(true);

      try {
        const res = await LOOKUP_API.blocks.list({
          district_id: district,
          page_size: 500,
        });

        setBlocks(res.data?.results || res.data || []);
      } catch (e) {
        console.error(e);
      }

      setLoadingBlocks(false);
    }

    loadBlocks();

    setBlock("");
    setPanchayat("");
    setPanchayats([]);
  }, [district]);

  /* LOAD PANCHAYATS */

  useEffect(() => {
    if (!block) return;

    async function loadPanchayats() {
      setLoadingPanchayats(true);

      try {
        const res = await LOOKUP_API.panchayats.list({
          block_id: block,
          page_size: 10000,
        });

        setPanchayats(res.data?.results || res.data || []);
      } catch (e) {
        console.error(e);
      }

      setLoadingPanchayats(false);
    }

    loadPanchayats();

    setPanchayat("");
  }, [block]);

  /* FETCH */

  function handleFetch() {
    // SURGICAL FIX: Strip nulls so Axios builds a clean URL (e.g., ?district=31012)
    const validFilters = {};
    if (district) validFilters.district = district;
    if (block) validFilters.block = block;
    if (panchayat) validFilters.panchayat = panchayat;

    if (onFetch) onFetch(validFilters);
  }

  useEffect(() => {
    // Don't fetch until a district is selected
    if (!district) return;

    handleFetch();
  }, [district, block, panchayat]);

  return (
    <div className="crp-filter-wrapper">
      {/* DISTRICT */}

      <div className="filter-group">
        <label>
          <FaMapMarkedAlt /> District{" "}
          {isDistrictLocked && (
            <FaLock
              className="lock-icon"
              title="Locked to your assigned district"
            />
          )}
        </label>

        <select
          value={district}
          disabled={isDistrictLocked}
          onChange={(e) => {
            if (isDistrictLocked) return;
            setDistrict(e.target.value);
          }}
        >
          <option value="">Select District</option>

          {districts.map((d) => (
            <option key={d.id || d.district_id} value={d.id || d.district_id}>
              {d.district_name_en}
            </option>
          ))}
        </select>
      </div>

      {/* BLOCK */}

      <div className="filter-group">
        <label>
          <FaMap /> Block
        </label>

        <select
          disabled={!district || loadingBlocks}
          value={block}
          onChange={(e) => setBlock(e.target.value)}
        >
          <option value="">
            {loadingBlocks ? "Loading Blocks..." : "Select Block"}
          </option>

          {blocks.map((b) => (
            <option key={b.id || b.block_id} value={b.id || b.block_id}>
              {b.block_name_en}
            </option>
          ))}
        </select>
      </div>

      {/* PANCHAYAT */}

      <div className="filter-group">
        <label>
          <FaLocationArrow /> Panchayat
        </label>

        <select
          disabled={!block || loadingPanchayats}
          value={panchayat}
          onChange={(e) => setPanchayat(e.target.value)}
        >
          <option value="">
            {loadingPanchayats ? "Loading Panchayats..." : "Select Panchayat"}
          </option>

          {panchayats.map((p) => (
            <option key={p.id || p.panchayat_id} value={p.id || p.panchayat_id}>
              {p.panchayat_name_en}
            </option>
          ))}
        </select>
      </div>

      {/* FETCH BUTTON */}

      <div className="filter-btn-wrapper">
        <button id="btn" onClick={handleFetch}>
          <FaSearch /> Fetch CRPs
        </button>
      </div>

      <style>{`

      /* WRAPPER */

      .crp-filter-wrapper{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:18px;
        align-items:end;
        animation:fadeIn .35s ease;
      }


      /* FILTER GROUP */

      .filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
      }

      .filter-group label{
        font-size:13px;
        font-weight:600;
        color:var(--epsms-text-dark);
        display:flex;
        align-items:center;
        gap:6px;
      }

      .filter-group svg{
        color:var(--epsms-red);
      }
      
      .lock-icon {
        font-size: 11px !important;
        margin-left: 2px;
      }

      /* SELECT */

      .filter-group select{
        padding:10px;
        border-radius:6px;
        border:1px solid var(--epsms-border);
        font-size:14px;
        background:white;
        transition:all .25s ease;
      }

      .filter-group select:hover{
        border-color:var(--epsms-red);
      }

      .filter-group select:focus{
        outline:none;
        border-color:var(--epsms-red);
        box-shadow:0 0 0 2px rgba(201,88,53,.15);
      }

      .filter-group select:disabled{
        background:#f3f4f6;
        cursor:not-allowed;
        opacity:.7;
      }


      /* BUTTON WRAPPER */

      .filter-btn-wrapper{
        display:flex;
        align-items:flex-end;
      }


      /* CUSTOM BUTTON */

      #btn{
        padding:10px 20px;
        text-transform:uppercase;
        border-radius:8px;
        font-size:15px;
        font-weight:600;
        color:var(--epsms-white);
        text-shadow:none;
        background:var(--epsms-green);
        cursor:pointer;
        border:1px solid var(--epsms-green);
        transition:.5s ease;
        user-select:none;
        display:flex;
        align-items:center;
        gap:8px;
      }

      #btn:hover,
      #btn:focus{
        color:#ffffff;
        background:var(--epsms-red);
        border:1px solid var(--epsms-red);
        text-shadow:0 0 5px #ffffff,
                    0 0 10px #ffffff,
                    0 0 20px #ffffff;

        box-shadow:0 0 5px #ff5e00,
                   0 0 20px #ffa600,
                   0 0 50px #ff7b00,
                   0 0 100px #ff5e00;
      }


      /* TABLET */

      @media(max-width:1024px){
        .crp-filter-wrapper{
          grid-template-columns:1fr 1fr;
        }
      }


      /* MOBILE */

      @media(max-width:640px){
        .crp-filter-wrapper{
          grid-template-columns:1fr;
        }

        #btn{
          width:100%;
          justify-content:center;
        }
      }


      /* ANIMATION */

      @keyframes fadeIn{
        from{
          opacity:0;
          transform:translateY(6px);
        }
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      `}</style>
    </div>
  );
}
