// src/routes/LdmsRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// LDMS Layout & Pages
import LdmsLayout from "../pages/LDMS/Layout/LdmsLayout";
import BmmuLdmsDashboard from "../pages/LDMS/BMMU/bmmu_ldms_dashboard";
import BlockMap from "../pages/LDMS/BMMU/bmmu_dashboard_blk_map";
import DmmuLdmsDashboard from "../pages/LDMS/DMMU/dmmu_ldms_dashboard";
import DmmuBlockMap from "../pages/LDMS/DMMU/dmmu_dashboard_blk_map";
import SmmuLdmsDashboard from "../pages/LDMS/SMMU/smmu_ldms_dashboard";
import SupportCapture from "../pages/LDMS/Support Map/ldms_support_capture";
import DemandAnalytics from "../pages/LDMS/Demand Analytics/da_container";
import BLCCMeetings from "../pages/LDMS/BMMU/bmmu_BLCC_meetings";
import SchemeDictionary from "../pages/LDMS/scheme_dict";
import SupPLDList from "../pages/LDMS/Support Map/SupPLDList";
import SupPLDDetail from "../pages/LDMS/Support Map/SupPLDDetail";
import SupportBucketList from "../pages/LDMS/Support Map/record_support_list";
import RecordSupportDetail from "../pages/LDMS/Support Map/record_support_detail";
import DmmuLdmsApprove from "../pages/LDMS/DMMU/dmmu_ldms_approve";
import LdmsReports from "../pages/LDMS/Reports/ldms_reports";

export default function LdmsRoutes() {
  return (
    <Routes>
      <Route path="" element={<LdmsLayout />}>
        {/* BMMU Routes */}
        <Route path="bmmu/dashboard" element={<BmmuLdmsDashboard />} />
        <Route path="bmmu/blcc-meetings" element={<BLCCMeetings />} />

        {/* DMMU Routes */}
        <Route path="dmmu/dashboard" element={<DmmuLdmsDashboard />} />
        <Route path="dmmu/approve-support/:id" element={<DmmuLdmsApprove />} />

        {/* SMMU Routes */}
        <Route path="smmu/dashboard" element={<SmmuLdmsDashboard />} />

        {/* Global / Mapping Routes */}
        <Route path="support-capture" element={<SupportCapture />} />
        <Route
          path="support-map/edit/:supportApprovalId"
          element={<SupportCapture />}
        />
        <Route path="scheme-dictionary" element={<SchemeDictionary />} />
        <Route path="demand-analytics" element={<DemandAnalytics />} />
        <Route path="support-map-list" element={<SupportBucketList />} />
        <Route
          path="support-map-detail/:id"
          element={<RecordSupportDetail />}
        />
        <Route path="supported-pld-list" element={<SupPLDList />} />
        <Route
          path="supported-pld-list/detail/:pldId"
          element={<SupPLDDetail />}
        />
        <Route path="reports" element={<LdmsReports />} />
        <Route path="dash-block/:blockId" element={<BlockMap />} />
        <Route path="dash-district/:districtId" element={<DmmuBlockMap />} />
      </Route>
    </Routes>
  );
}
