// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminGreivancesList from "../pages/AdminPages/AdminGreivancesList";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/grievances" element={<AdminGreivancesList />} />
      </Route>
    </Routes>
  );
}
