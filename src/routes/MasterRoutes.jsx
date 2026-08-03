// src/routes/MasterRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Dashboard
import StateLoginDashboard from "../pages/StateLoginPortal/StateLoginDashboard";

export default function MasterRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles="state_admin" />}>
        <Route path="state-dashboard/" element={<StateLoginDashboard />} />
      </Route>
    </Routes>
  );
}
