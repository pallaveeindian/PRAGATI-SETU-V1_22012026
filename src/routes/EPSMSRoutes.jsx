// src/routes/EPSMSRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/EPSMS/Dashboard/Pages/Dashboard";

export default function EPSMSRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["smmu"]} />}>
                {/* Dashboard */}
                <Route path="smm/dashboard" element={<Dashboard />} />
            </Route>
        </Routes >
    );
}