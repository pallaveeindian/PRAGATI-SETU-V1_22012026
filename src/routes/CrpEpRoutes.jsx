// src/routes/CrpEpRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Aliasing the layout to remove the old terminology
import CrpEpLayout from "../pages/EPSMS/EpsmsLayout";
import CRPForm from "../pages/EPSMS/RecordForm/CRPForm";
import ViewRecCRPs from "../pages/EPSMS/ViewRecordedCRPs/ViewRecCRPs";

export default function CrpEpRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["crp_record", "dmmu"]} />}>
        <Route path="" element={<CrpEpLayout />}>
          <Route path="crp-form" element={<CRPForm />} />
          <Route path="recorded-crps" element={<ViewRecCRPs />} />
        </Route>
      </Route>
    </Routes>
  );
}
