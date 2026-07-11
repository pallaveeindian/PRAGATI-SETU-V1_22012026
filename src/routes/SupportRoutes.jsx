// src/routes/SupportRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import GrievancesList from "../pages/Dashboard/GreivancesList";

export default function SupportRoutes() {
  return (
    <Routes>
      <Route path="/grievances" element={<GrievancesList />} />
    </Routes>
  );
}
