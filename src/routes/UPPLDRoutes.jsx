// src/routes/UPPLDRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import PDULayout from "../pages/PlanningDeptUpdate/PDULayout";

// Dashboard
import PDUDashboard from "../pages/PlanningDeptUpdate/Pages/Dashboard/PDUDashboard";
import SHGPointer from "../pages/PlanningDeptUpdate/Pages/SHGPointer/SHGPointer";

export default function UPPLDRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles="smm_uppld" />}>
        <Route path="state/" element={<PDULayout />}>
          <Route path="dashboard" element={<PDUDashboard />} />
          <Route path="shg-pointer" element={<SHGPointer />} />
        </Route>
      </Route>
    </Routes>
  );
}
