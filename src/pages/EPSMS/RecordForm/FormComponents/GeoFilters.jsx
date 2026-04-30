// src/pages/EPSMS/RecordForm/FormComponents/GeoFilters.jsx
import React, { useEffect, useState } from "react";
import { LOOKUP_API } from "../../../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { FaLock } from "react-icons/fa";

export default function GeoFilters({ onChange }) {
    const [districts, setDistricts] = useState([]);
    const [blocks, setBlocks] = useState([]);

    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");

    const [loadingBlocks, setLoadingBlocks] = useState(false);

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

    // ---------------------------
    // Load Districts
    // ---------------------------
    useEffect(() => {
        async function loadDistricts() {
            try {
                const res = await LOOKUP_API.districts.list({ page_size: 100 });
                const rows = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || res.data?.results || [];

                setDistricts(rows);
            } catch (err) {
                console.error("Failed to load districts", err);
            }
        }

        loadDistricts();
    }, []);

    // ---------------------------
    // Load Blocks when district changes
    // ---------------------------
    useEffect(() => {
        if (!district) {
            setBlocks([]);
            setBlock("");
            return;
        }

        async function loadBlocks() {
            setLoadingBlocks(true);
            try {
                const res = await LOOKUP_API.blocksByDistrict(district, {
                    page_size: 1000,
                });
                const rows = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || res.data?.results || [];

                setBlocks(rows);
            } catch (err) {
                console.error("Failed to load blocks", err);
            } finally {
                setLoadingBlocks(false);
            }
        }

        loadBlocks();
    }, [district]);

    // ---------------------------
    // Send filters to parent
    // ---------------------------
    useEffect(() => {
        if (!onChange) return;

        onChange({
            district_id: district || null,
            block_id: block || null,
        });
    }, [district, block]);

    return (
        <div className="geo-filter-container">
            {/* District */}
            <div className="geo-field">
                <label>
                    District {isDistrictLocked && <FaLock className="lock-icon" />}
                </label>

                <select
                    value={district}
                    disabled={isDistrictLocked}
                    onChange={(e) => {
                        if (isDistrictLocked) return;
                        setDistrict(e.target.value);
                        setBlock("");
                    }}
                >
                    <option value="">Select District</option>

                    {Array.isArray(districts) &&
                        districts.map((d) => (
                            <option key={d.district_id} value={d.district_id}>
                                {d.district_name_en}
                            </option>
                        ))}
                </select>
            </div>

            {/* Block */}
            <div className="geo-field">
                <label>Block</label>

                <select
                    value={block}
                    disabled={!district || loadingBlocks}
                    onChange={(e) => setBlock(e.target.value)}
                >
                    <option value="">
                        {loadingBlocks ? "Loading..." : "Select Block"}
                    </option>

                    {Array.isArray(blocks) &&
                        blocks.map((b) => (
                            <option key={b.block_id} value={b.block_id}>
                                {b.block_name_en}
                            </option>
                        ))}
                </select>
            </div>

            <style>{`
        :root {
          --epsms-red: #c95835;
          --epsms-red-light: #ffffff;
          --epsms-border: #c47744;
          --epsms-text-dark: #1f2937;
          --epsms-text-muted: #6b7280;
          --epsms-green: #189218;
          --epsms-white: #ffffff;
          --epsms-muted: #e5e7eb;
        }

        .geo-filter-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          animation: fadeIn 0.35s ease;
        }

        .geo-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .geo-field label {
          font-size: 20px;
          font-weight: 600;
          color: var(--epsms-text-dark);
        }

        .geo-field select {
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid var(--epsms-border);
          background: var(--epsms-white);
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .geo-field select:hover {
          border-color: var(--epsms-red);
        }

        .geo-field select:focus {
          outline: none;
          border-color: var(--epsms-red);
          box-shadow: 0 0 0 2px rgba(201,88,53,0.15);
        }

        .geo-field select:disabled {
          background: var(--epsms-muted);
          cursor: not-allowed;
        }

        .lock-icon {
          margin-left: 6px;
          font-size: 12px;
          color: var(--epsms-red);
        }

        /* Locked dropdown */
        .geo-field select:disabled {
          background: #f3f4f6;
          color: #374151;
          border-style: dashed;
        }

        /* Optional badge */
        .locked-badge {
          font-size: 11px;
          color: var(--epsms-red);
          margin-top: 2px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tablet */
        @media (max-width: 900px) {
          .geo-filter-container {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile */
        @media (max-width: 500px) {
          .geo-field select {
            font-size: 12px;
            padding: 7px 8px;
          }
        }
      `}</style>
        </div>
    );
}