// src\pages\TMS\StaffBatchCreator\StaffTRSearch.jsx
import React, { useState, useEffect } from "react";
import { TMS_API } from "../../../api/axios";

export default function StaffTRSearch({
  baseTrDetails,
  selectedTrIds,
  onTrSelectionChange,
}) {
  const [availableTrs, setAvailableTrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const baseTrId = baseTrDetails?.id;
  const basePlanId = baseTrDetails?.training_plan;
  const baseFy = baseTrDetails?.financial_year;

  // 1. Fetch Compatible Training Requests
  useEffect(() => {
    if (!basePlanId || !baseFy) return;

    const fetchCompatibleTRs = async () => {
      setLoading(true);
      try {
        const params = {
          status: "BATCHING",
          training_type: "STAFF",
          training_plan_id: basePlanId,
          financial_year: baseFy,
          page_size: 100,
        };

        const resp = await TMS_API.trainingRequestsList.list(params);
        const results = resp?.data?.results || resp?.data || [];

        // Ensure the base TR is always in the list and selected
        const safeResults = results.some((r) => r.id === baseTrId)
          ? results
          : [baseTrDetails, ...results].filter(Boolean);

        setAvailableTrs(safeResults);

        // Auto-select the base TR if not already selected
        if (!selectedTrIds.includes(baseTrId)) {
          onTrSelectionChange([...selectedTrIds, baseTrId]);
        }
      } catch (error) {
        console.error("Failed to fetch compatible TRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibleTRs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePlanId, baseFy, baseTrId]);

  // 2. Handle Checkbox Toggle
  const handleToggleTr = (id) => {
    if (id === baseTrId) return; // Prevent unchecking the base TR

    if (selectedTrIds.includes(id)) {
      onTrSelectionChange(selectedTrIds.filter((trId) => trId !== id));
    } else {
      onTrSelectionChange([...selectedTrIds, id]);
    }
  };

  // 3. Local Search Filter
  const filteredTrs = availableTrs.filter((tr) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      String(tr.id).includes(lowerSearch) ||
      (tr.district_name || "").toLowerCase().includes(lowerSearch) ||
      (tr.partner_name || "").toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="tr-search-wrapper">
      <div className="tr-search-header">
        <div>
          <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "16px" }}>
            Pool Additional Training Requests
          </h3>
          <p
            style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}
          >
            Select other BATCHING requests with the same Training Plan to
            combine participants.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search TR ID, District, Partner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tr-search-input"
        />
      </div>

      <div className="tr-table-container">
        <table className="tr-table">
          <thead>
            <tr>
              <th style={{ width: "40px", textAlign: "center" }}>Select</th>
              <th>TR ID</th>
              <th>District</th>
              <th>Partner</th>
              <th style={{ textAlign: "center" }}>Onboarded</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  <div className="spinner"></div> Fetching compatible
                  requests...
                </td>
              </tr>
            ) : filteredTrs.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No compatible Training Requests found.
                </td>
              </tr>
            ) : (
              filteredTrs.map((tr) => {
                const isBase = tr.id === baseTrId;
                const isSelected = selectedTrIds.includes(tr.id);

                return (
                  <tr
                    key={tr.id}
                    className={isSelected ? "selected-row" : ""}
                    onClick={() => handleToggleTr(tr.id)}
                    style={{ cursor: isBase ? "not-allowed" : "pointer" }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTr(tr.id)}
                        disabled={isBase}
                        style={{
                          cursor: isBase ? "not-allowed" : "pointer",
                          transform: "scale(1.1)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>
                      <strong>#{tr.id}</strong>
                      {isBase && <span className="base-badge">Current</span>}
                    </td>
                    <td>{tr.district_name || tr.district_name_en || "-"}</td>
                    <td>{tr.partner_name || "-"}</td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#2563eb",
                      }}
                    >
                      {tr.participant_count || 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .tr-search-wrapper { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .tr-search-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 12px; }
        .tr-search-input { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; width: 250px; outline: none; transition: border-color 0.2s; }
        .tr-search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
        .tr-table-container { max-height: 220px; overflow-y: auto; }
        .tr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tr-table thead th { position: sticky; top: 0; background: #e4ecf5; color: #1e3a8a; padding: 10px 16px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; z-index: 10; }
        .tr-table tbody td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .tr-table tbody tr:hover { background: #f1f5f9; }
        .selected-row { background: #eff6ff !important; }
        .base-badge { background: #10b981; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle; }
        .empty-state { text-align: center; padding: 30px; color: #64748b; }
        .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #cbd5e1; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
