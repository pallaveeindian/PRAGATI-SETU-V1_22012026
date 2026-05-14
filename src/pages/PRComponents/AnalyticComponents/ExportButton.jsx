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
      Export CSV
    </button>
  );
}