// src\pages\TMS\BatchCreator\ParticipantsTableFilter.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { LOOKUP_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

const ParticipantTableFilters = ({
  filters = {},
  handleChange,
  onFetch, // Parent से Fetch function
  isLoading = false,
  // genders = [],
  // designations = [],
  pldStatus = [],
  socialCategories = [],
  // religions = [],
  ageRanges = [],
  blocks: initialBlocks = [],
  isResumeMode = false,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  // Custom Dropdown states for Panchayat
  const [isPanchayatOpen, setIsPanchayatOpen] = useState(false);
  const [panchayatPageSize, setPanchayatPageSize] = useState(5000);
  const panchayatRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panchayatRef.current &&
        !panchayatRef.current.contains(event.target)
      ) {
        setIsPanchayatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchedBlocksRef = useRef(false);

  useEffect(() => {
    if (fetchedBlocksRef.current) return;
    fetchedBlocksRef.current = true;

    const fetchScopedLocationData = async () => {
      try {
        const userRoleId = user.role_id;
        const userId = user.id;
        let districtId = null;

        if (userId) {
          const response = await LOOKUP_API.userGeoscopeByUserId(userId);

          districtId =
            response?.data?.districts?.[0] ?? response?.data?.district ?? null;

          if (districtId) {
            handleValueChange("districtId", districtId);
          }
        }
        if (
          String(userRoleId) === "13" &&
          districtId &&
          typeof LOOKUP_API.blocksByDistrict === "function"
        ) {
          const response = await LOOKUP_API.blocksByDistrict(districtId);
          const rawData = response?.data?.results || response?.data || [];

          setBlocks(rawData);
          return;
        }

        if (Array.isArray(initialBlocks) && initialBlocks.length) {
          setBlocks(initialBlocks);
          return;
        }

        if (typeof LOOKUP_API.blocks?.list === "function") {
          const response = await LOOKUP_API.blocks.list();
          setBlocks(response?.data?.results || response?.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchScopedLocationData();
  }, []);

  // 2. Cascade Chain: Block select hone par Panchayats load karna
  useEffect(() => {
    const fetchPanchayats = async () => {
      if (
        !filters.block ||
        Array.isArray(filters.block) ||
        filters.batchType === "Combined"
      ) {
        if (panchayats.length) setPanchayats([]);
        if (villages.length) setVillages([]);
        return;
      }

      try {
        const response = await LOOKUP_API.panchayatsByBlock(filters.block, {
          params: { page_size: 500 },
        });
        setPanchayats(response?.data?.results || response?.data || []);
        setVillages([]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPanchayats();
  }, [filters.block, filters.batchType]);

  // 3. Cascade Chain: Panchayat select hone par Villages load karna
  useEffect(() => {
    const fetchVillages = async () => {
      if (!filters.panchayat) {
        if (villages.length) setVillages([]);
        return;
      }

      try {
        const response = await LOOKUP_API.villagesByPanchayat(
          filters.panchayat,
        );
        setVillages(response?.data?.results || response?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVillages();
  }, [filters.panchayat]);

  const handleValueChange = (key, value) => {
    if (typeof handleChange === "function") {
      handleChange(key, value);
    }
  };

  const handleMultipleSelectChange = (key, options) => {
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    handleValueChange(key, selectedValues);
  };

  const getMinStartDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split("T")[0];
  };

  const getMaxStartDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split("T")[0];
  };

  const handleStartDateChange = (dateValue) => {
    handleValueChange("startDate", dateValue);

    if (!dateValue) {
      handleValueChange("endDate", "");
      return;
    }

    if (filters.trainingPlanDays) {
      const start = new Date(dateValue);
      start.setDate(start.getDate() + Number(filters.trainingPlanDays) - 1);

      handleValueChange("endDate", start.toISOString().split("T")[0]);
    }
  };

  const calculateAndSetEndDate = (startDateStr, days) => {
    const start = new Date(startDateStr);
    start.setDate(start.getDate() + (Number(days) - 1));
    const endDateStr = start.toISOString().split("T")[0];
    handleValueChange("endDate", endDateStr);
  };

  const containerStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  };
  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#374151",
  };
  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
  };
  const buttonStyle = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const isCombined = filters.batchType === "Combined";

  const getBlockValue = (b) =>
    typeof b === "object" ? (b.id ?? b.block_id ?? b.block_code ?? b.value) : b;
  const getBlockLabel = (b) =>
    typeof b === "object" ? b.block_name_en || b.block_name || b.name : b;

  const getPanchayatValue = (p) =>
    typeof p === "object"
      ? (p.id ?? p.panchayat_id ?? p.panchayat_code ?? p.value)
      : p;
  const getPanchayatLabel = (p) =>
    typeof p === "object"
      ? p.panchayat_name || p.panchayat_name_en || p.name
      : p;

  const getVillageValue = (v) =>
    typeof v === "object"
      ? (v.id ?? v.village_id ?? v.village_code ?? v.value)
      : v;
  const getVillageLabel = (v) =>
    typeof v === "object"
      ? v.village_name || v.village_name_english || v.name
      : v;

  const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
  const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
  const verifiedVillages = Array.isArray(villages) ? villages : [];

  const paginatedPanchayats = verifiedPanchayats.slice(0, panchayatPageSize);
  const currentSelectedPanchayatObj = verifiedPanchayats.find(
    (p) => String(getPanchayatValue(p)) === String(filters.panchayat),
  );
  const selectedPanchayatLabel = currentSelectedPanchayatObj
    ? getPanchayatLabel(currentSelectedPanchayatObj)
    : "All";

  return (
    <div style={containerStyle}>
      {/* ============================================== */}
      {/* SECTION 1: BATCH STRUCTURAL SELECTABLES        */}
      {/* ============================================== */}
      <h4
        style={{
          margin: "0 0 16px 0",
          color: "#2563eb",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Batch Configuration
      </h4>
      <div style={{ ...gridStyle, marginBottom: "32px" }}>
        <div>
          <label style={labelStyle}>Batch Type</label>
          <select
            value={isResumeMode ? "Separate" : filters.batchType || "Separate"}
            disabled={isResumeMode}
            style={{
              ...selectStyle,
              background: isResumeMode ? "#f3f4f6" : "#fff",
              cursor: isResumeMode ? "not-allowed" : "pointer",
              opacity: isResumeMode ? 0.6 : 1,
            }}
            onChange={(e) => {
              handleValueChange(
                "block",
                e.target.value === "Combined" ? [] : "",
              );
              handleValueChange("panchayat", "");
              handleValueChange("village", "");
              handleValueChange("batchType", e.target.value);
            }}
          >
            <option value="Separate">Separate Batch (Single Block)</option>
            {!isResumeMode && (
              <option value="Combined">Combined Batch (Multiple Blocks)</option>
            )}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            style={inputStyle}
            min={getMinStartDate()}
            max={getMaxStartDate()}
            value={filters.startDate || ""}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Calculated End Date</label>
          <input
            type="date"
            style={{
              ...inputStyle,
              background: "#f3f4f6",
              cursor: "not-allowed",
            }}
            value={filters.endDate || ""}
            disabled
            placeholder="Auto calculated"
          />
        </div>
      </div>

      {/* ============================================== */}
      {/* SECTION 2: PARTICIPANT QUERY FILTERS           */}
      {/* ============================================== */}
      <h4
        style={{
          margin: "0 0 16px 0",
          color: "#2563eb",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Participant Trainee Filters
      </h4>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>
            Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
          </label>
          {isCombined ? (
            <select
              multiple
              style={{ ...selectStyle, height: "80px", padding: "4px" }}
              value={Array.isArray(filters.block) ? filters.block : []}
              onChange={(e) =>
                handleMultipleSelectChange("block", e.target.options)
              }
            >
              {verifiedBlocks.map((b, idx) => (
                <option key={idx} value={getBlockValue(b)}>
                  {getBlockLabel(b)}
                </option>
              ))}
            </select>
          ) : (
            <select
              style={selectStyle}
              value={typeof filters.block === "string" ? filters.block : ""}
              onChange={(e) => {
                handleValueChange("block", e.target.value);
                handleValueChange("panchayat", "");
                handleValueChange("village", "");
              }}
            >
              <option value="">All Blocks</option>
              {verifiedBlocks.map((b, idx) => (
                <option key={idx} value={getBlockValue(b)}>
                  {getBlockLabel(b)}
                </option>
              ))}
            </select>
          )}
        </div>

        {filters.participantType === "Beneficiary" && (
          <>
            <div ref={panchayatRef} style={{ position: "relative" }}>
              <label style={labelStyle}>
                Panchayat ({verifiedPanchayats.length})
              </label>
              <div
                style={{
                  ...selectStyle,
                  background: isCombined ? "#f3f4f6" : "#fff",
                  cursor: isCombined ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() =>
                  !isCombined && setIsPanchayatOpen(!isPanchayatOpen)
                }
              >
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isCombined
                    ? "Not Available for Combined Batch"
                    : selectedPanchayatLabel}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    marginLeft: "4px",
                  }}
                >
                  ▼
                </span>
              </div>

              {isPanchayatOpen && !isCombined && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginTop: "4px",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      background: !filters.panchayat
                        ? "#f3f4f6"
                        : "transparent",
                    }}
                    onClick={() => {
                      handleValueChange("panchayat", "");
                      handleValueChange("village", "");
                      setIsPanchayatOpen(false);
                    }}
                  >
                    All
                  </div>
                  {paginatedPanchayats.map((item, idx) => {
                    const val = getPanchayatValue(item);
                    const label = getPanchayatLabel(item);
                    const isSelected =
                      String(filters.panchayat) === String(val);
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "14px",
                          background: isSelected ? "#2563eb" : "transparent",
                          color: isSelected ? "#fff" : "#000",
                        }}
                        onClick={() => {
                          handleValueChange("panchayat", val);
                          handleValueChange("village", "");
                          setIsPanchayatOpen(false);
                        }}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Village</label>
              <select
                style={selectStyle}
                value={filters.village || ""}
                onChange={(e) => handleValueChange("village", e.target.value)}
              >
                <option value="">All</option>
                {verifiedVillages.map((item, idx) => (
                  <option key={idx} value={getVillageValue(item)}>
                    {getVillageLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Age Range</label>
              <select
                style={selectStyle}
                value={filters.ageRange || ""}
                onChange={(e) => handleValueChange("ageRange", e.target.value)}
              >
                <option value="">All</option>
                {ageRanges.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* ============================================== */}
      {/* SECTION 3: PARTICIPANT SEARCH                  */}
      {/* ============================================== */}

      <h4
        style={{
          margin: "32px 0 16px 0",
          color: "#2563eb",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Search by Training Request ID
      </h4>

      <div style={gridStyle}>
        {filters.participantType === "Beneficiary" && (
          <div>
            <label style={labelStyle}>
              Available searches : SHG Code / Member Code / Member Name
            </label>
            <input
              style={inputStyle}
              placeholder="Search..."
              value={filters.searchValue || ""}
              onChange={(e) => handleValueChange("searchValue", e.target.value)}
            />
          </div>
        )}

        {filters.participantType === "Trainer" && (
          <div>
            <label style={labelStyle}>
              Available searches : Mobile No / Full Name / Aadhaar
            </label>
            <input
              style={inputStyle}
              placeholder="Search..."
              value={filters.searchValue || ""}
              onChange={(e) => handleValueChange("searchValue", e.target.value)}
            />
          </div>
        )}
      </div>
      {/* FETCH ACTION CONTAINER */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          borderTop: "1px solid #f3f4f6",
          paddingTop: "15px",
        }}
      >
        <button
          type="button"
          style={{
            ...buttonStyle,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onClick={onFetch}
          disabled={isLoading}
        >
          {isLoading ? "Fetching..." : "Fetch Trainees"}
        </button>
      </div>
    </div>
  );
};

export default ParticipantTableFilters;
