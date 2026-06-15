// src/routes/MouRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import MOULayout from "../pages/EPSMS/MOUForm/MOULayout";
import MOUDashboard from "../pages/EPSMS/MOUForm/MOUDashboard";

export default function MouRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["bmmu"]} />}>
        <Route path="" element={<MOULayout />}>
          <Route path="dashboard" element={<MOUDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
