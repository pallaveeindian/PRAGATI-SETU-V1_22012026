// src\pages\TMS\BatchCreator\TraineesDisplayTable.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import ParticipantTableFilters from "./ParticipantsTableFilter"; // Restored original import name
import { TMS_API } from "../../../api/axios";

const ParticipantTable = ({
  filters = {},
  handleChange = () => {},
  onSelectionChange,
  batchId,
  resumeSelectedIds = [],
  onTraineesLoaded,
  isResumeMode,
}) => {
  const [traineesData, setTraineesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // API Call Engine: ट्रिगर होने पर ही कॉल होगा
  const fetchTraineesFromAPI = useCallback(async () => {
    if (
      !filters.financialYear ||
      !filters.trainingPlan ||
      !filters.participantType
    ) {
      alert(
        "Please ensure Financial Year, Training Plan, and Participant Type are selected.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        financial_year: filters.financialYear,
        training_plan_id: filters.trainingPlan,
        participant_type: filters.participantType.toLowerCase(),
      };

      if (batchId) {
        params.batch_id = batchId;
      }

      // 1. Deep Location Filtering (Block + Panchayat + Village)
      if (filters.block && !Array.isArray(filters.block)) {
        params.block_id = filters.block;
      }
      if (filters.panchayat) {
        params.panchayat_id = filters.panchayat;
      }
      if (filters.village) {
        params.village_id = filters.village;
      }

      // 2. Gender Mapping
      if (filters.gender) {
        params.gender = filters.gender.toUpperCase(); // FEMALE, MALE etc.
      }

      // 3. Age Range Breakdown (from_age & to_age)
      if (filters.ageRange) {
        if (filters.ageRange === "18-35") {
          params.from_age = 18;
          params.to_age = 35;
        } else if (filters.ageRange === "36-50") {
          params.from_age = 36;
          params.to_age = 50;
        } else if (filters.ageRange === "50+") {
          params.from_age = 51;
          params.to_age = 100;
        }
      }

      // 4. Search Bar Mapping (Member Code / SHG Code)
      if (filters.searchValue) {
        params.search = filters.searchValue;
      }

      // 5. PLD, Social Category, and Religion
      if (filters.pldStatus) {
        params.pld_status = filters.pldStatus.toUpperCase(); // YES / NO
      }
      if (filters.socialCategory) {
        params.social_category = filters.socialCategory;
      }
      if (filters.religion) {
        params.religion = filters.religion;
      }

      const response = await TMS_API.batchCreator.trainees(params);

      let traineesResp = [];

      if (response?.data?.results) {
        traineesResp = response.data.results;
      } else if (Array.isArray(response?.data)) {
        traineesResp = response.data;
      }

      setTraineesData(traineesResp);

      // SURGICAL FIX: Auto-lock the block_id when a search yields results
      if (filters.searchValue && traineesResp.length > 0) {
        const firstTrainee = traineesResp[0];
        const rawBlock =
          firstTrainee?.block_id ||
          firstTrainee?.blockId ||
          firstTrainee?.block ||
          firstTrainee?.block_code;

        const fetchedBlockId =
          rawBlock && typeof rawBlock === "object"
            ? rawBlock.id || rawBlock.block_id
            : rawBlock;

        if (fetchedBlockId) {
          const blockToSet = String(fetchedBlockId);
          const isCombined = filters.batchType === "Combined";
          const currentBlock = Array.isArray(filters.block)
            ? String(filters.block[0] || "")
            : String(filters.block || "");

          // Only trigger state update if the block actually needs to change to avoid infinite loops
          if (currentBlock !== blockToSet) {
            handleChange("block", isCombined ? [blockToSet] : blockToSet);
          }
        }
      }

      // Parent ko response bhej do (Resume mode ke liye)
      if (typeof onTraineesLoaded === "function") {
        onTraineesLoaded(traineesResp);
      }
    } catch (err) {
      console.error("Error fetching eligible trainees:", err);
      setTraineesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial Load Security Check
  useEffect(() => {
    if (
      filters.financialYear &&
      filters.trainingPlan &&
      filters.participantType
    ) {
      fetchTraineesFromAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.block]);

  // Dropdown Lists Extraction
  const genders = useMemo(
    () => [
      ...new Set(traineesData.map((i) => i.gender || i.sex).filter(Boolean)),
    ],
    [traineesData],
  );
  const designations = useMemo(
    () => [...new Set(traineesData.map((i) => i.designation).filter(Boolean))],
    [traineesData],
  );
  const pldStatusList = useMemo(
    () => [
      ...new Set(
        traineesData.map((i) => i.pldStatus || i.pld_status).filter(Boolean),
      ),
    ],
    [traineesData],
  );
  const socialCategories = useMemo(
    () => [
      ...new Set(
        traineesData
          .map((i) => i.socialCategory || i.social_category)
          .filter(Boolean),
      ),
    ],
    [traineesData],
  );
  const religions = useMemo(
    () => [...new Set(traineesData.map((i) => i.religion).filter(Boolean))],
    [traineesData],
  );
  const ageRanges = ["18-35", "36-50", "50+"];

  // Selection Counters Update
  useEffect(() => {
    if (onSelectionChange) {
      // onSelectionChange(selectedRows.length);
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);

  // Reset Table Selection on Layout Changes
  useEffect(() => {
    setSelectedRows([]);
  }, [filters.participantType, filters.block]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(traineesData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (!batchId) return;
    if (!traineesData.length) return;

    setSelectedRows((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(resumeSelectedIds)) {
        return prev;
      }
      return resumeSelectedIds;
    });
  }, [batchId, traineesData]); //

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* FILTER PANEL COMPONENT WITH ONFETCH INJECTION */}
      <ParticipantTableFilters
        filters={filters}
        handleChange={handleChange}
        onFetch={fetchTraineesFromAPI}
        isLoading={isLoading}
        genders={genders}
        designations={designations}
        pldStatus={pldStatusList}
        socialCategories={socialCategories}
        religions={religions}
        ageRanges={ageRanges}
        isResumeMode={isResumeMode}
      />

      <div
        style={{
          maxHeight: "380px",
          overflowY: "auto",
          overflowX: "auto",
          position: "relative",
        }}
      >
        {isLoading ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#4b5563" }}
          >
            <div
              style={{
                display: "inline-block",
                width: "24px",
                height: "24px",
                border: "2px solid #e5e7eb",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "8px",
              }}
            ></div>
            <p style={{ margin: 0, fontSize: "13px" }}>
              Fetching live participants from server database...
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      traineesData.length > 0 &&
                      selectedRows.length === traineesData.length
                    }
                  />
                </th>

                <th style={thStyle}>S.No</th>

                {filters.participantType?.toUpperCase() === "TRAINER" ? (
                  <>
                    <th style={thStyle}>Trainer Name</th>
                    <th style={thStyle}>Mobile Number</th>
                    <th style={thStyle}>District</th>
                  </>
                ) : (
                  <>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>LokOS Member ID</th>
                    <th style={thStyle}>LokOS SHG ID</th>
                    <th style={thStyle}>Mobile</th>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>District</th>
                    <th style={thStyle}>Block</th>
                    <th style={thStyle}>Panchayat</th>
                    <th style={thStyle}>Village</th>
                    <th style={thStyle}>Training Request ID</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {traineesData.length > 0 ? (
                traineesData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    style={{
                      background: selectedRows.includes(row.id)
                        ? "#f8fafc"
                        : "transparent",
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </td>

                    <td style={tdStyle}>{index + 1}</td>

                    {filters.participantType?.toUpperCase() === "TRAINER" ? (
                      <>
                        <td style={tdStyle}>{row.full_name || "-"}</td>
                        <td style={tdStyle}>{row.mobile_no || "-"}</td>
                        <td style={tdStyle}>{row.district_name_en || "-"}</td>
                      </>
                    ) : (
                      <>
                        <td style={tdStyle}>
                          {row.member_name ||
                            row.name ||
                            row.participant_name ||
                            "-"}
                        </td>
                        <td style={tdStyle}>{row.lokos_member_code || "-"}</td>
                        <td style={tdStyle}>{row.lokos_shg_code || "-"}</td>
                        <td style={tdStyle}>
                          {row.mobile || row.mobile_number || "-"}
                        </td>

                        <td style={tdStyle}>{row.gender || "-"}</td>

                        <td style={tdStyle}>
                          {row.social_category ||
                            row.socialCategory ||
                            row.category ||
                            "-"}
                        </td>
                        <td style={tdStyle}>
                          {row.district_name_en ||
                            row.district ||
                            row.district_name ||
                            "-"}
                        </td>
                        <td style={tdStyle}>
                          {row.block_name_en ||
                            row.block ||
                            row.block_name ||
                            "-"}
                        </td>
                        <td style={tdStyle}>
                          {row.panchayat_name_en ||
                            row.panchayat ||
                            row.panchayat_name ||
                            "-"}
                        </td>
                        <td style={tdStyle}>
                          {row.village_name_english ||
                            row.village ||
                            row.village_name ||
                            "-"}
                        </td>
                        <td style={tdStyle}>
                          {row.training || row.training_request || "-"}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      filters.participantType?.toUpperCase() === "TRAINER"
                        ? 6
                        : 11
                    }
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    No Records Found. Click "Fetch Trainees" to load data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 600,
  position: "sticky",
  top: 0,
  backgroundColor: "#f3f4f6",
  zIndex: 20,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #f1f1f1",
  fontSize: "13px",
};

export default ParticipantTable;
