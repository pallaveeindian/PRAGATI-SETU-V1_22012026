// src/pages/TMS/TRs/training_batch_detail.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api, { TMS_API } from "../../../../api/axios";

// --- Subcomponents ---
import BatchHeadAction from "../TrainingBatch/BatchHeadAction";
import TrainingBatchHistory from "../TrainingBatch/TrainingBatchhistory";
import TrainingPlanInfoCard from "../../../TMS/TRs/BatchDetailComponents/TrainingPlanInfoCard";
import BatchMetaCard from "../../../TMS/TRs/BatchDetailComponents/BatchMetaCard";
import CentreDetailFetcherCard from "../../../TMS/TRs/BatchDetailComponents/CentreDetailFetcherCard";
import MasterTrainersCard from "../../../TMS/TRs/BatchDetailComponents/MasterTrainersCard";
import ParticipantsSummaryTable from "../../../TMS/TRs/BatchDetailComponents/ParticipantsSummaryTable";
import AttendanceViewer from "../TrainingBatch/AttendanceViewer";
import MediaGallery from "../TrainingBatch/MediaGallery";
import EkycVerification from "../TrainingBatch/EkycVerification";
import FinancialSummaryCard from "../../../TMS/TRs/BatchDetailComponents/FinancialSummaryCard";
import CertificatesTable from "../../../TMS/TRs/BatchDetailComponents/CertificatesTable";
import SharedMediaLightbox from "../../../TMS/TRs/BatchDetailComponents/SharedMediaLightbox";

export default function TrainingBatchDetail({ batchId: batchIdProp, onBack }) {
  const { id: routeBatchId } = useParams();
  const batchId = batchIdProp || routeBatchId;
  const navigate = useNavigate();

  const [loadingAll, setLoadingAll] = useState(false);
  const [batchData, setBatchData] = useState(null);

  const [closureRequest, setClosureRequest] = useState(null);
  const [loadingClosureInfo, setLoadingClosureInfo] = useState(false);

  const [mediaPreviewSrc, setMediaPreviewSrc] = useState(null);
  const [showBatchHistory, setShowBatchHistory] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const inFlightRef = useRef(false);

  async function fetchAll() {
    if (!batchId) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingAll(true);

    try {
      // 1. Comprehensive Batch Detail Fetch
      // This single API call now returns plans, partners, centres, participants,
      // daily attendance, cost breakdowns, media, ekyc, and schedules.
      const batchResp = await TMS_API.batchDetailV2(batchId);
      const responseData = batchResp?.data;
      setBatchData(responseData?.data || responseData || null);

      // 2. Closure Request Fetch (kept separate in case it runs on a different endpoint cycle)
      try {
        setLoadingClosureInfo(true);
        const crResp = await api.get(
          `/tms/batch-closure-requests/?batch=${batchId}`,
        );
        const crData = crResp?.data?.results || crResp?.data || [];
        setClosureRequest(crData[0] || null);
      } catch (e) {
        console.error("fetchClosureInfo failed:", e);
        setClosureRequest(null);
      } finally {
        setLoadingClosureInfo(false);
      }
    } catch (e) {
      console.error("fetchAll failed:", e);
    } finally {
      setLoadingAll(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId, refreshToken]);

  function handleRefresh() {
    setMediaPreviewSrc(null);
    setRefreshToken((t) => t + 1);
  }

  async function handleSaveAttendance(_attendanceId, records) {
    await Promise.all(
      records
        .filter((record) => record.id)
        .map((record) =>
          TMS_API.participantAttendance.partialUpdate(record.id, {
            present: Boolean(record.present),
          }),
        ),
    );
    handleRefresh();
  }

  const isTrainerTraining = batchData?.participant_type === "TRAINER";

  // Consolidate participants flat list from the nested comprehensive API response
  const displayedParticipants = useMemo(() => {
    if (!batchData) return [];

    const costsMap = {};
    (batchData.participant_costs || []).forEach((c) => {
      const pId = c.batch_beneficiary || c.batch_trainer;
      if (pId) costsMap[pId] = c.total_cost;
    });

    let participants = [];

    if (
      batchData.batch_type === "COMBINED" &&
      batchData.combined_batch_details
    ) {
      batchData.combined_batch_details.forEach((detail) => {
        (detail.participants || []).forEach((p) => {
          const person = p.beneficiary || p.trainer || p.staff || p;
          participants.push({
            ...person,
            attendance_summary: p.attendance_summary,
            participation_id: p.id,
            total_cost: costsMap[p.id],
          });
        });
      });
    } else if (batchData?.participant_type === "STAFF") {
      participants = (batchData.staff_participations || []).map((sp) => ({
        ...(sp.staff || {}),
        attendance_summary: sp.attendance_summary,
        participation_id: sp.id,
        total_cost: costsMap[sp.id],
      }));
    } else if (isTrainerTraining) {
      participants = (batchData.trainer_participations || []).map((tp) => ({
        ...(tp.trainer || {}),
        ...(tp.trainer?.trainer || {}), // Flatten inner trainer fields
        attendance_summary: tp.attendance_summary,
        participation_id: tp.id,
        total_cost: costsMap[tp.id],
      }));
    } else {
      participants = (batchData.beneficiary_participations || []).map((bp) => ({
        ...(bp.beneficiary || {}),
        attendance_summary: bp.attendance_summary,
        participation_id: bp.id,
        total_cost: costsMap[bp.id],
      }));
    }

    return participants;
  }, [batchData, isTrainerTraining]);

  if (loadingAll && !batchData) {
    return (
      <div className="app-shell">
        
        <div className="content-area">
         
          <div className="main-area">
            <main style={{ padding: 18 }}>
              <div style={{ maxWidth: 1200, margin: "20px auto" }}>
                <div className="table-spinner">
                  Loading comprehensive batch details...
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
     
      <div className="content-area">
       

        <div className="main-area">
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              {!showBatchHistory && (
                <BatchHeadAction
                  batchId={batchId}
                  batchCode={batchData?.code}
                  status={batchData?.status}
                  closureRequest={closureRequest}
                  loadingClosureInfo={loadingClosureInfo}
                  onRefresh={handleRefresh}
                  onHistory={() => setShowBatchHistory(true)}
                  onBack={onBack || (() => navigate(-1))}
                  onDownloadCert={() =>
                    navigate(`/tms/download-certificate/${batchId}`)
                  }
                  batchData={batchData}
                />
              )}

              {showBatchHistory ? (
                <TrainingBatchHistory
                  batchId={batchId}
                  onBack={() => setShowBatchHistory(false)}
                />
              ) : !batchData ? (
                <div className="batch-main-card">
                  <div className="muted">
                    Batch not found.
                    <button
                      className="btn-sm"
                      onClick={handleRefresh}
                      style={{ marginLeft: 8 }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="batch-main-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <TrainingPlanInfoCard batchData={batchData} />

                  <BatchMetaCard batchData={batchData} />

                  <CentreDetailFetcherCard centreId={batchData.centre?.id} />

                  <MasterTrainersCard
                    batchData={batchData}
                    masterTrainers={
                      batchData.master_trainer_participations ||
                      batchData.master_trainers ||
                      []
                    }
                    onRefresh={handleRefresh}
                  />

                  <ParticipantsSummaryTable
                    displayedParticipants={displayedParticipants}
                    isTrainerTraining={isTrainerTraining}
                    isStaffBatch={batchData.participant_type === "STAFF"}
                  />

                  <AttendanceViewer
                    attendanceList={batchData.attendances || []}
                    batchMedia={batchData.batch_pictures || []}
                    onOpenMedia={setMediaPreviewSrc}
                    onSaveAttendance={handleSaveAttendance}
                  />

                  <MediaGallery
                    batchMedia={batchData.batch_pictures || []}
                    onOpenMedia={setMediaPreviewSrc}
                  />

                  <EkycVerification
                    ekycVerifications={batchData.ekyc_verifications || []}
                    batchData={batchData}
                    onRefresh={handleRefresh}
                  />

                  <FinancialSummaryCard
                    batchCosting={batchData.batch_costing}
                  />

                  <CertificatesTable
                    batchCertificates={batchData.batch_certificates || []}
                  />
                </div>
              )}
            </div>
          </main>

         

          <SharedMediaLightbox
            mediaPreviewSrc={mediaPreviewSrc}
            onClose={() => setMediaPreviewSrc(null)}
          />
        </div>
      </div>

      <style>{`
        .content-area {
          display: flex;
          flex: 1;
          width: 100%;
        }
        .batch-main-card {
          background: white;
          border: 2px solid #a7c6ed;
          border-radius: 10px;
          padding: 24px;
        }
        .table-spinner {
          text-align: center;
          padding: 40px;
          color: #2b4e72;
          font-weight: 600;
        }
        .muted {
          color: #64748b;
          font-style: italic;
        }
        .btn-sm {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          color: #2b4e72;
        }
      `}</style>
    </div>
  );
}
