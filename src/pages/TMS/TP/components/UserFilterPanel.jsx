// src/pages/TMS/TP/components/UserFilterPanel.jsx

import React from "react";
import { FaSearch } from "react-icons/fa";

export default function UserFilterPanel({ filters, setFilters, isTP }) {
  return (
    <div
      style={{
        padding: "16px",
        background: "#ffffff",
        marginBottom: "16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Only show User Type toggles if logged in user is a Training Partner */}
      {isTP && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #1e3a8a",
              background: filters.type === "tpcp" ? "#1e3a8a" : "#ffffff",
              color: filters.type === "tpcp" ? "#ffffff" : "#1e3a8a",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onClick={() => setFilters((f) => ({ ...f, type: "tpcp" }))}
          >
            Contact Persons (TPCP)
          </button>

          <button
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #1e3a8a",
              background: filters.type === "dtp" ? "#1e3a8a" : "#ffffff",
              color: filters.type === "dtp" ? "#ffffff" : "#1e3a8a",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onClick={() => setFilters((f) => ({ ...f, type: "dtp" }))}
          >
            District TPs (DTP)
          </button>
        </div>
      )}

      {/* Global Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          padding: "8px 12px",
          flex: 1,
          maxWidth: "350px",
          marginLeft: isTP ? "auto" : "0",
          background: "#f8fafc",
        }}
      >
        <FaSearch style={{ color: "#94a3b8", marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search by name, username or district..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            background: "transparent",
            fontSize: "14px",
            color: "#1e293b",
          }}
        />
      </div>
    </div>
  );
}
