// src/pages/LDMS/Meetings Map/MeetComponents/ldms_meet_header.jsx

import React, { useContext, useEffect, useState } from "react";
import {
  FaUsers,
  FaExchangeAlt,
  FaMapMarkedAlt,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";
import { LOOKUP_API } from "../../../../api/axios";

export default function MeetHeader({ filters, setFilters }) {
  const { user } = useContext(AuthContext) || {};
  const role = user?.role_id;

  const isBMMU = role == 1;
  const isDMMU = role == 2;
  const isSMMU = role == 3;

  // Extract from parent's global filter state
  const meetingType = filters?.meetingType || "DLCC";
  const districtId = filters?.districtId || "";
  const blockId = filters?.blockId || "";
  const onlyAspirational = filters?.onlyAspirational || false;

  // Helper to safely update parent filters
  const updateFilter = (key, value) => {
    if (setFilters) {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  /* ---------- Resolve District for DMMU ---------- */
  useEffect(() => {
    if (!isDMMU || !user?.id) return;

    LOOKUP_API.userGeoscopeByUserId(user.id)
      .then((res) => {
        const dist = res?.data?.districts?.[0];
        if (dist) updateFilter("districtId", dist);
      })
      .catch(console.error);
  }, [isDMMU, user?.id]);

  /* ---------- Resolve Block for BMMU ---------- */
  useEffect(() => {
    if (!isBMMU || !user?.id) return;

    LOOKUP_API.userGeoscopeByUserId(user.id)
      .then((res) => {
        const blk = res?.data?.blocks?.[0];
        if (blk) {
          updateFilter("blockId", blk);
          updateFilter("meetingType", "BLCC"); // Auto-force BLCC for BMMU
        }
      })
      .catch(console.error);
  }, [isBMMU, user?.id]);

  /* ------------------ Load Districts for SMMU ------------------ */
  useEffect(() => {
    if (!isSMMU) return;

    LOOKUP_API.districts
      .list({ page_size: 80 })
      .then((res) => setDistricts(res?.data?.results || []))
      .catch(console.error);
  }, [isSMMU]);

  /* ------------------ Load Blocks ------------------ */
  useEffect(() => {
    if (!districtId) return;

    LOOKUP_API.blocks
      .retrieve(districtId)
      .then((res) => {
        let data = res?.data?.results || [];
        if (onlyAspirational) {
          data = data.filter((b) => b.is_aspirational === 1);
        }
        setBlocks(data);
      })
      .catch(console.error);
  }, [districtId, onlyAspirational]);

  /* ------------------ Title Logic ------------------ */
  const getTitle = () => {
    if (isBMMU) return "BLCC Meetings List";
    if (isDMMU)
      return meetingType === "DLCC"
        ? "DLCC Meetings List"
        : "BLCC Meetings List";
    if (isSMMU) return "All DLCC / BLCC Meetings";
    return "Meetings List";
  };

  return (
    <div className="meet-header-container">
      {/* -------- Title Section -------- */}
      <div className="meet-title-row">
        <div className="title-left">
          <FaUsers className="title-icon" />
          <h2 className="title-text">{getTitle()}</h2>
        </div>

        {/* -------- Toggle for DMMU -------- */}
        {isDMMU && (
          <div className="toggle-group">
            <button
              className={`toggle-btn ${meetingType === "DLCC" ? "active" : ""}`}
              onClick={() => {
                updateFilter("meetingType", "DLCC");
                updateFilter("blockId", "");
              }}
            >
              <FaBuilding /> DLCC Meetings
            </button>
            <button
              className={`toggle-btn ${meetingType === "BLCC" ? "active" : ""}`}
              onClick={() => updateFilter("meetingType", "BLCC")}
            >
              <FaMapMarkedAlt /> BLCC Meetings
            </button>
          </div>
        )}
      </div>

      {/* -------- Filters -------- */}
      <div className="meet-filters">
        {/* SMMU District Selector */}
        {isSMMU && (
          <div className="filter-item">
            <label>District</label>
            <select
              value={districtId}
              onChange={(e) => {
                updateFilter("districtId", e.target.value);
                updateFilter("blockId", "");
                updateFilter("meetingType", "DLCC"); // Reset to DLCC when district changes
              }}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name_en}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Block Selector Logic */}
        {(isSMMU || (isDMMU && meetingType === "BLCC") || isBMMU) && (
          <div className="filter-item">
            <label>Block</label>
            <select
              value={blockId}
              disabled={isBMMU}
              onChange={(e) => {
                const val = e.target.value;
                updateFilter("blockId", val);
                if (val) {
                  updateFilter("meetingType", "BLCC"); // Auto-switch to BLCC if block is picked
                } else {
                  updateFilter("meetingType", "DLCC"); // Switch back to DLCC if block is cleared
                }
              }}
            >
              <option value="">Select Block</option>
              {blocks.map((b) => (
                <option key={b.block_id} value={b.block_id}>
                  {b.block_name_en}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Aspirational Filter */}
        {(isSMMU || (isDMMU && meetingType === "BLCC") || isBMMU) && (
          <div className="aspirational-filter">
            <input
              type="checkbox"
              disabled={isBMMU}
              checked={onlyAspirational}
              onChange={(e) =>
                updateFilter("onlyAspirational", e.target.checked)
              }
            />
            <span>Aspirational Blocks</span>
          </div>
        )}
      </div>

      {/* -------- Styles -------- */}
      <style>{`
        .meet-header-container {
          display:flex;
          flex-direction:column;
          gap:16px;
        }

        .meet-title-row {
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:10px;
        text-align:center;
        }

        .title-left {
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
        }

        .title-icon {
          font-size:22px;
          color:#7a0c0c;
        }

        .title-text {
        margin:0;
        font-size:24px;
        font-weight:900;
        color:#400b0b;
        letter-spacing:0.5px;
        }

        .toggle-group {
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .toggle-btn {
          display:flex;
          align-items:center;
          gap:6px;
          padding:8px 14px;
          border-radius:8px;
          border:1px solid #7a0c0c;
          background:#fff;
          color:#7a0c0c;
          font-weight:600;
          cursor:pointer;
          transition:all 0.2s ease;
        }

        .toggle-btn:hover {
          background:#7a0c0c;
          color:#fff;
        }

        .toggle-btn.active {
          background:#7a0c0c;
          color:#fff;
          box-shadow:0 4px 12px rgba(122,12,12,0.25);
        }

        .meet-filters {
          display:flex;
          flex-wrap:wrap;
          gap:16px;
          align-items:end;
        }

        .filter-item {
          display:flex;
          flex-direction:column;
          gap:4px;
        }

        .filter-item label {
          font-weight:700;
          color:#400b0b;
          font-size:13px;
        }

        select {
          padding:8px 12px;
          border-radius:8px;
          border:1px solid #e5e7eb;
          min-width:180px;
          font-weight:500;
        }

        select:focus {
          outline:none;
          border-color:#7a0c0c;
        }

        .aspirational-filter {
          display:flex;
          align-items:center;
          gap:6px;
          font-weight:600;
          color:#166534;
          cursor:pointer;
        }

        .aspirational-filter input {
          accent-color:#7a0c0c;
          width:16px;
          height:16px;
        }

        @media(max-width:768px){
          .meet-title-row{
            flex-direction:column;
            align-items:flex-start;
          }

          .toggle-group{
            width:100%;
          }

          .toggle-btn{
            flex:1;
            justify-content:center;
          }

          .meet-filters{
            flex-direction:column;
            align-items:flex-start;
          }

          select{
            width:100%;
          }
        }
      `}</style>
    </div>
  );
}
