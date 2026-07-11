// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminGreivancesList from "../pages/AdminPages/AdminGreivancesList";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[9]} />}>
        <Route path="/grievances" element={<AdminGreivancesList />} />
      </Route>
    </Routes>
  );
}
