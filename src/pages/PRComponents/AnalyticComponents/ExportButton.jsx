// src/pages/PRComponents/AnalyticComponents/ExportButton.jsx
import React from "react";

export default function ExportButton({ data, headers, filename }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // 1. Create CSV header row
    const csvRows = [headers.map((h) => `"${h.label}"`).join(",")];

    // 2. Create CSV data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header.key];
        // Escape quotes to prevent CSV breaking
        const escaped = ("" + (val ?? "")).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    // 3. Generate Blob and trigger download
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "export_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn-export" onClick={handleExport}>
      <div className="btn-export-content">
        {/* ICON LAYER */}
        <div className="btn-export-icon-wrap">
          <svg
            className="btn-export-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z" />
          </svg>
        </div>

        {/* TEXT LAYER */}
        <div className="btn-export-text-wrap">
          <span className="btn-export-text">Export CSV</span>
        </div>
      </div>
    </button>
  );
}
