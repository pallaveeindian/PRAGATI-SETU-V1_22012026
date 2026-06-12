// src/routes/TmsRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// TMS Dashboards
import BmmuTmsDashboard from "../pages/TMS/BMMU/bmmu_tms_dashboard";
import DmmuTmsDashboard from "../pages/TMS/DMMU/dmmu_tms_dashboard";
import SmmuTmsDashboard from "../pages/TMS/SMMU/smmu_tms_dashboard";
import SmmuCreateTrainingPlan from "../pages/TMS/SMMU/smmu_create_training_plan";
import SmmuListTrainingPlan from "../pages/TMS/SMMU/smmu_list_training_plan";
import SmmuCreatePartnerTargets from "../pages/TMS/SMMU/smmu_create_tp_targets";
import SmmuBulkUploadTargets from "../pages/TMS/SMMU/smmu_bulk_upload_targets";
import TpDashboard from "../pages/TMS/TP/tp_dashboard";
import MtDashboard from "../pages/TMS/MT/mt_dashboard";
import CpDashboard from "../pages/TMS/TP_CP/cp_dashboard";
import CpBatchList from "../pages/TMS/TP_CP/cp_batch_list";
import CpBatchDetail from "../pages/TMS/TP_CP/cp_batch_detail";
import CpAdPerBatchEkyc from "../pages/TMS/TP_CP/attendance/cpad_per_batch_ekyc";
import CpAdPerBatch from "../pages/TMS/TP_CP/attendance/cpad_per_batch";
import CpBatchClosure from "../pages/TMS/TP_CP/cp_batch_closure";

// Training Partner screens
import TpCentreList from "../pages/TMS/TP/tp_centre_list";
import TpCentreRegistration from "../pages/TMS/TP/tp_centre_registration";
import TpListCP from "../pages/TMS/TP/tp_list_cp";
import TpCreateCP from "../pages/TMS/TP/tp_create_cp";
import TpCpAssignment from "../pages/TMS/TP/tp_cp_assignment";
import TpTrainingRequestClosure from "../pages/TMS/TP/tp_tr_closure";
import TpCreateBatch from "../pages/TMS/TP/tp_create_batch";

// TMS workflow screens
import CreateTrainingRequest from "../pages/TMS/tms_create_tr";
import TrainingRequestList from "../pages/TMS/TRs/training_req_list";
import TrainingRequestDetail from "../pages/TMS/TRs/training_req_detail";
import TrainingBatchList from "../pages/TMS/TRs/training_batch_list";
import TrainingBatchDetail from "../pages/TMS/TRs/training_batch_detail";
import BatchCertificate from "../pages/TMS/TRs/batch_certificate";
import BmmuCreateTrainingPlan from "../pages/TMS/BMMU/bmmu_create_training_plan";
import DmmuTrReview from "../pages/TMS/DMMU/dmmu_tr_review";
import DmmuRequestClosure from "../pages/TMS/DMMU/dmmu_request_closure";
import UserMgmnt from "../pages/TMS/UserMgmnt/UserMgmnt";
import TrainingReport from "../pages/TMS/TrainingReport/TrainingReport";
import SmmuTargetAchievement from "../pages/TMS/SMMU/smmu_tp_tva";
import BmmuTargetAchievement from "../pages/TMS/BMMU/bmmu_tp_tvs";
import DmmuTargetAchievement from "../pages/TMS/DMMU/dmmu_tp_tvs";

export default function TmsRoutes() {
  return (
    <Routes>
      <Route path="training-report" element={<TrainingReport />} />

      {/* SMMU Routes */}
      <Route element={<ProtectedRoute allowedRoles="smmu" />}>
        <Route path="smmu/dashboard" element={<SmmuTmsDashboard />} />
        <Route
          path="smmu/partner-targets"
          element={<SmmuCreatePartnerTargets />}
        />
        <Route
          path="smmu/bulk-assign-targets"
          element={<SmmuBulkUploadTargets />}
        />
        <Route path="smmu/tp-TvA" element={<SmmuTargetAchievement />} />
        <Route
          path="smmu/create-training-plan"
          element={<SmmuCreateTrainingPlan />}
        />
        <Route
          path="smmu/list-training-plans"
          element={<SmmuListTrainingPlan />}
        />
        <Route
          path="smmu/dmmu-users"
          element={<UserMgmnt targetRole="dmmu" />}
        />
      </Route>

      {/* DMMU Routes */}
      <Route element={<ProtectedRoute allowedRoles="dmmu" />}>
        <Route path="dmmu/dashboard" element={<DmmuTmsDashboard />} />
        <Route path="dmmu/tr-review/:id" element={<DmmuTrReview />} />
        <Route path="dmmu/tr-closure/:id" element={<DmmuRequestClosure />} />
        <Route path="dmmu/tp-TvA" element={<DmmuTargetAchievement />} />
        <Route
          path="dmmu/bmmu-users"
          element={<UserMgmnt targetRole="bmmu" />}
        />
      </Route>

      {/* BMMU Routes */}
      <Route element={<ProtectedRoute allowedRoles="bmmu" />}>
        <Route path="bmmu/dashboard" element={<BmmuTmsDashboard />} />
        <Route
          path="bmmu/create-training-plan"
          element={<BmmuCreateTrainingPlan />}
        />
        <Route path="bmmu/tp-TvA" element={<BmmuTargetAchievement />} />
      </Route>

      {/* Training Partner Routes */}
      <Route element={<ProtectedRoute allowedRoles="training_partner" />}>
        <Route path="tp/dashboard" element={<TpDashboard />} />
        <Route path="tp/centre-list" element={<TpCentreList />} />
        <Route path="tp/centre/new" element={<TpCentreRegistration />} />
        <Route path="tp/centre/:centreId" element={<TpCentreRegistration />} />
        <Route
          path="tp/tr-closure/:id"
          element={<TpTrainingRequestClosure />}
        />
        <Route path="tp/batches/create/:id" element={<TpCreateBatch />} />
        <Route path="tp/cp-list" element={<TpListCP />} />
        <Route path="tp/cp/create" element={<TpCreateCP />} />
        <Route path="tp/cp/edit/:cpId" element={<TpCreateCP />} />
        <Route path="tp/cp/assign" element={<TpCpAssignment />} />
      </Route>

      {/* TPCP Routes */}
      <Route element={<ProtectedRoute allowedRoles="tp_contact_person" />}>
        <Route path="cp/dashboard" element={<CpDashboard />} />
        <Route path="cp/batch-detail/:id" element={<CpBatchDetail />} />
        <Route
          path="cp/batch-attendance-ekyc/:id"
          element={<CpAdPerBatchEkyc />}
        />
        <Route path="cp/batch-attendance/:id" element={<CpAdPerBatch />} />
        <Route path="cp/batch-list" element={<CpBatchList />} />
        <Route path="cp/batch-closure/:id" element={<CpBatchClosure />} />
      </Route>

      {/* Master Trainer Routes */}
      <Route element={<ProtectedRoute allowedRoles="master_trainer" />}>
        <Route path="mt/dashboard" element={<MtDashboard />} />
      </Route>

      {/* Cross-Role Training Requests */}
      <Route
        element={<ProtectedRoute allowedRoles={["smmu", "dmmu", "bmmu"]} />}
      >
        <Route
          path="create-training-request"
          element={<CreateTrainingRequest />}
        />
        <Route path="batch-certificate/:id" element={<BatchCertificate />} />
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["smmu", "dmmu", "bmmu", "training_partner"]}
          />
        }
      >
        <Route path="training-requests" element={<TrainingRequestList />} />
        <Route path="tr-detail/:id" element={<TrainingRequestDetail />} />
        <Route path="batches-list/" element={<TrainingBatchList />} />
        <Route path="batches-list/:id/" element={<TrainingBatchList />} />
      </Route>

      {/* Batch Detail Permissions */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "smmu",
              "dmmu",
              "bmmu",
              "training_partner",
              "tp_contact_person",
            ]}
          />
        }
      >
        <Route path="batch-detail/:id" element={<TrainingBatchDetail />} />
      </Route>
    </Routes>
  );
}
