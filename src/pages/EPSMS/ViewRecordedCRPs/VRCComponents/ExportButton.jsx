// src/pages/EPSMS/ViewRecordedCRPs/VRCComponents/ExportButton.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx-js-style";
import { FaFileExcel } from "react-icons/fa";
import { EPSAKHI_API } from "../../../../api/axios";

export default function ExportButton({ filters }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!filters || !filters.district) {
      alert("Please select a District first before exporting.");
      return;
    }

    setLoading(true);
    try {
      const res = await EPSAKHI_API.crpPanchList({
        ...filters,
        limit: 5000, 
        page_size: 5000,
      });

      const payload = res.data?.data ? res.data.data : res.data;
      const apiData = Array.isArray(payload) ? payload : payload?.results || [];

      if (!apiData || apiData.length === 0) {
        alert("No data available to export for selected filters.");
        setLoading(false);
        return;
      }

      // Mapping Data with User ID and Password
      const excelData = apiData.map((item, index) => ({
        "S.No.": index + 1,
        "CRP Name": item.name || "",
        "Mobile Number": item.mobile_number || "",
        "User ID": item.login_id || "N/A",      
        "Password": item.password || "N/A",      
        "LokOS SHG Code": item.lokos_shg_code || "-",
        "LokOS Member Code": item.lokos_member_code || "-",
        "District": item.district_name_en || "",
        "Block": item.block_name_en || "",
        "Panchayat": item.panchayat_name_en || "",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);

      // Title Row
      XLSX.utils.sheet_add_aoa(ws, [["Pargati Setu - CRP Credentials & Details Report"]], { origin: "A1" });
      
      ws["A1"].s = {
        font: { name: "Arial", sz: 14, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "7A0C0C" } },
        alignment: { horizontal: "center", vertical: "center" }
      };

      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];

      // Data Rows
      XLSX.utils.sheet_add_json(ws, excelData, { origin: "A2" });

      // Table Header Style
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 1, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "B91C1C" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Column Widths
      ws["!cols"] = [
        { wch: 8 },  
        { wch: 22 }, 
        { wch: 15 }, 
        { wch: 22 }, 
        { wch: 18 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 18 }, 
        { wch: 18 }, 
        { wch: 18 }  
      ];

      XLSX.utils.book_append_sheet(wb, ws, "CRP Credentials");
      XLSX.writeFile(wb, "Pargati_Setu_CRP_Credentials_Report.xlsx");
      
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Export failed. Please check network tab for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "background 0.2s"
      }}
    >
      <FaFileExcel /> {loading ? "Downloading..." : "Export to Excel"}
    </button>
  );
}