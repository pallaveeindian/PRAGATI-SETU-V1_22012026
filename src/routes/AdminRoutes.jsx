// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminGreivancesList from "../pages/AdminPages/AdminGreivancesList";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "smmu",
              "dmmu",
              "bmmu",
              "training_partner",
              "tp_contact_person",
              "dtp",
              "crp_ld",
              "crp_ep",
              "master_trainer",
              "state_admin",
              "pmu_admin",
            ]}
          />
        }
      >
        <Route path="/grievances" element={<AdminGreivancesList />} />
      </Route>
    </Routes>
  );
}
