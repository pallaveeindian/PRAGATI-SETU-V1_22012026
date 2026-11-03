// src\routes\CanteenRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Canteen Models
import PrernaCanteenWrapper from "../pages/PrernaCanteen/PrernaCanteenWrapper.jsx";

export default function CanteenRoutes() {
  return (
    <Routes>
      <Route path="/form" element={<PrernaCanteenWrapper />} />
    </Routes>
  );
}
