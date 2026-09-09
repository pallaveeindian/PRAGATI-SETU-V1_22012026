// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminGreivancesList from "../pages/AdminPages/GreivancesList/AdminGreivancesList";
import TrainingRequestDetail from "../pages/AdminPages/TmsPortal/TrainingRequest/TraningRequestDetail";
import AdminLayout from "../pages/AdminPages/AdminLayout";

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
        <Route path="/dashboard" element={<AdminLayout />} />
        <Route
          path="/trainingrequestdetail/:id"
          element={<TrainingRequestDetail />}
        />
      </Route>
    </Routes>
  );
}
