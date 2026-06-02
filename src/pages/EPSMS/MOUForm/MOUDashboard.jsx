import React, { useState, useEffect } from "react";
import { LOOKUP_API } from "../../../api/axios";
import { useAuth } from "../../../contexts/AuthContext";

// ✅ IMPORT MOU FORM
import MOUFormCreate from "./MOUFormFields";
import MOUFormList from "./MOUFormList";

// ✅ IMPORT REUSABLE SHG LIST (Adjust path if necessary based on your folder structure)
import SHGList from "../../../pages/EPSMS/RecordForm/FormComponents/SHGList";
import { FaArrowLeft, FaFileSignature, FaUserCheck } from "react-icons/fa";

const safeFirst = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : null);

const MOUDashboard = () => {
  const { user } = useAuth();

  const [showSurvey, setShowSurvey] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const [loadingBlock, setLoadingBlock] = useState(false);
  const [error, setError] = useState("");

  const [blockId, setBlockId] = useState(null);

  // Replaced individual member/SHG states with the normalized payload from SHGMembers
  const [selectedMemberPayload, setSelectedMemberPayload] = useState(null);
  const [clfName, setClfName] = useState("-");
  const [clfCode, setClfCode] = useState("-");

  /* ================= INIT ================= */

  useEffect(() => {
    resolveBlockId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= BLOCK ================= */

  const resolveBlockId = async () => {
    try {
      setLoadingBlock(true);
      const userId = user?.id || user?.user_id;

      const res = await LOOKUP_API.userGeoscopeByUserId(userId);
      const geo = res?.data || {};

      const block =
        geo?.block_id ||
        geo?.blockId ||
        geo?.block ||
        geo?.data?.block_id ||
        safeFirst(geo?.blocks);

      setBlockId(block);
      return block;
    } catch {
      setError("Unable to resolve block location for the current user.");
      return null;
    } finally {
      setLoadingBlock(false);
    }
  };

  /* ================= MEMBER SELECT (From Reusable Component) ================= */

  const handleSelectMemberFromList = async (payload) => {
    setSelectedMemberPayload(payload);
    console.log("Selected Member Payload:", payload);
    setClfName("-"); // Reset CLF name while fetching

    try {
      // Fetch CLF based on the selected member's code
      const clf = await LOOKUP_API.upsrlmFindClf({
        block_id: blockId,
        member_code: payload.member_code,
      });

      const clfData = clf?.data || {};
      setClfName(clfData?.clf_name || clfData?.name || "-");
      setClfCode(clfData?.clf_code || "-");
    } catch {
      setClfName("-");
      setClfCode("-");
    }
  };

  const resetSelection = () => {
    setSelectedMemberPayload(null);
    setClfName("-");
  };

  return (
    <div className="mou-dashboard-shell">
      <div className="mou-wrapper">
        <div className="mou-card">
          {/* Header Section */}
          <div className="mou-header">
            <div className="mou-icon-wrapper">
              <FaFileSignature className="mou-header-icon" />
            </div>
            <div>
              <h1 className="mou-title">MOU Dashboard</h1>
              <p className="mou-subtitle">
                Manage and create Memorandums of Understanding
              </p>
            </div>
          </div>

          <hr className="mou-divider" />

          {/* Action Controls */}
          <div className="mou-controls">
            <button
              className={`mou-main-btn ${showSurvey ? "active" : ""}`}
              onClick={() => setShowSurvey(!showSurvey)}
            >
              MOU Survey Workspace
            </button>
          </div>

          {showSurvey && (
            <div className="mou-tabs-container">
              <div className="mou-tabs">
                <button
                  className={`mou-tab ${activeTab === "list" ? "active-tab" : ""}`}
                  onClick={() => setActiveTab("list")}
                >
                  List Active MOUs
                </button>
                <button
                  className={`mou-tab ${activeTab === "create" ? "active-tab" : ""}`}
                  onClick={() => {
                    setActiveTab("create");
                    resetSelection();
                  }}
                >
                  Create New MOU
                </button>
              </div>
            </div>
          )}

          {loadingBlock && (
            <p className="mou-loading">Resolving user geography...</p>
          )}
          {!!error && <p className="mou-error">{error}</p>}

          {/* ================= CREATE FLOW ================= */}

          {showSurvey && activeTab === "create" && !loadingBlock && (
            <div className="mou-workspace">
              {!selectedMemberPayload ? (
                /* Reusable SHG List & Members Component */
                <div className="mou-shg-container">
                  {blockId ? (
                    <SHGList
                      blockId={blockId}
                      onSelectMember={handleSelectMemberFromList}
                    />
                  ) : (
                    <div className="mou-muted-box">
                      Valid Block ID is required to fetch SHGs.
                    </div>
                  )}
                </div>
              ) : (
                /* Member Detail & Form Component */
                <div className="mou-form-container fade-in">
                  <div className="mou-detail-header">
                    <button className="mou-back-btn" onClick={resetSelection}>
                      <FaArrowLeft /> Back to SHG Search
                    </button>
                    <h2>
                      <FaUserCheck
                        style={{ color: "#16a34a", marginRight: 8 }}
                      />{" "}
                      Selected Beneficiary
                    </h2>
                  </div>

                  <div className="mou-detail-grid">
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">Member Name</span>
                      <span className="mou-detail-value">
                        {selectedMemberPayload.member_name}
                      </span>
                    </div>
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">Mobile Number</span>
                      <span className="mou-detail-value">
                        {selectedMemberPayload.mobile_number || "N/A"}
                      </span>
                    </div>
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">Member Code</span>
                      <span className="mou-detail-value">
                        {selectedMemberPayload.member_code}
                      </span>
                    </div>
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">SHG Name</span>
                      <span className="mou-detail-value highlight-green">
                        {selectedMemberPayload.shg_name}
                      </span>
                    </div>
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">SHG Code</span>
                      <span className="mou-detail-value">
                        {selectedMemberPayload.shg_code}
                      </span>
                    </div>
                    <div className="mou-detail-item">
                      <span className="mou-detail-label">Social Category</span>
                      <span className="mou-detail-value">
                        {selectedMemberPayload.social_category || "-"}
                      </span>
                    </div>
                  </div>

                  {/* ================= MOU FORM OPEN ================= */}
                  <div className="mou-form-wrapper">
                    <MOUFormCreate
                      selectedMember={selectedMemberPayload}
                      // Pass down an object mimicking standard SHG if form strictly expects an object with a code
                      selectedShg={{ code: selectedMemberPayload.shg_code }}
                      clfName={clfName}
                      clfCode={clfCode}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LIST FLOW ================= */}
          {showSurvey && activeTab === "list" && (
            <div className="mou-workspace fade-in">
              <div className="mou-muted-box">
                <MOUFormList />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ================= STYLES ================= */}
      <style>{`
        .mou-dashboard-shell {
          min-height: 100vh;
          background: #f4f7f6;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .mou-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 30px 20px;
        }

        .mou-card {
          width: 100%;
          max-width: 100%;
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          border-top: 5px solid var(--epsms-red, #ea580c);
        }

        .mou-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .mou-icon-wrapper {
          background: rgba(234, 88, 12, 0.1);
          padding: 16px;
          border-radius: 12px;
        }

        .mou-header-icon {
          font-size: 32px;
          color: var(--epsms-red, #ea580c);
        }

        .mou-title {
          font-size: 28px;
          color: #1f2937;
          margin: 0 0 6px 0;
          font-weight: 700;
        }

        .mou-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 15px;
        }

        .mou-divider {
          border: none;
          height: 1px;
          background: #e5e7eb;
          margin: 24px 0;
        }

        .mou-controls {
          margin-bottom: 24px;
        }

        .mou-main-btn {
          padding: 12px 28px;
          background: #ffffff;
          color: var(--epsms-red, #ea580c);
          border: 2px solid var(--epsms-red, #ea580c);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .mou-main-btn:hover, .mou-main-btn.active {
          background: var(--epsms-red, #ea580c);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
        }

        .mou-tabs-container {
          background: #f9fafb;
          padding: 8px;
          border-radius: 10px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
        }

        .mou-tabs {
          display: flex;
          gap: 10px;
        }

        .mou-tab {
          padding: 10px 24px;
          background: transparent;
          color: #4b5563;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .mou-tab:hover {
          color: var(--epsms-red, #ea580c);
          background: rgba(234, 88, 12, 0.05);
        }

        .mou-tab.active-tab {
          background: #ffffff;
          color: var(--epsms-red, #ea580c);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .mou-workspace {
          margin-top: 10px;
        }

        .mou-shg-container {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .mou-form-container {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .mou-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .mou-detail-header h2 {
          margin: 0;
          font-size: 20px;
          color: #1f2937;
          display: flex;
          align-items: center;
        }

        .mou-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .mou-back-btn:hover {
          background: #e5e7eb;
          color: #111827;
        }

        .mou-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          background: #f8fafc;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }

        .mou-detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mou-detail-label {
          font-size: 13px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .mou-detail-value {
          font-size: 16px;
          color: #0f172a;
          font-weight: 500;
        }

        .highlight-green {
          color: var(--epsms-green, #16a34a);
          font-weight: 600;
        }

        .mou-form-wrapper {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px dashed #e2e8f0;
        }

        .mou-muted-box {
          padding: 40px;
          text-align: center;
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-weight: 500;
        }

        .mou-loading {
          color: #2563eb;
          font-weight: 500;
        }

        .mou-error {
          color: #dc2626;
          background: #fef2f2;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fca5a5;
          font-weight: 500;
        }

        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive adjustments */
        @media(max-width: 768px) {
          .mou-header {
            flex-direction: column;
            text-align: center;
          }
          .mou-detail-header {
            flex-direction: column-reverse;
            gap: 16px;
            align-items: stretch;
          }
          .mou-back-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MOUDashboard;
