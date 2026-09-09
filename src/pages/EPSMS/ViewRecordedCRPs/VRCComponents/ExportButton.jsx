// src/pages/EPSMS/ViewRecordedCRPs/VRCComponents/ExportButton.jsx
import React, { useContext, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { FaFileExcel } from "react-icons/fa";
import { EPSAKHI_API, LOOKUP_API } from "../../../../api/axios";
import { AuthContext } from "../../../../contexts/AuthContext";

export default function ExportButton({ filters }) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext) || {};

  const normalizeValue = (value) =>
    value == null ? "" : String(value).trim().toLowerCase();

  const getCurrentUserMatchSet = () => {
    const matchValues = new Set();
    const candidates = [
      user?.id,
      user?.pk,
      user?.user_id,
      user?.userId,
      user?.master_user_id,
      user?.masterUserId,
      user?.login_id,
      user?.loginId,
      user?.username,
      user?.email,
    ];

    candidates.forEach((candidate) => {
      const normalized = normalizeValue(candidate);
      if (normalized) matchValues.add(normalized);
    });

    return matchValues;
  };

  const filterRowsForLoggedInUser = (rows = []) => {
    const matchSet = getCurrentUserMatchSet();
    if (!matchSet.size) return rows;

    return rows.filter((item) => {
      const rowValues = [
        item?.master_user_id,
        item?.master_user,
        item?.masterUser,
        item?.user_id,
        item?.userId,
        item?.login_id,
        item?.loginId,
        item?.username,
        item?.email,
        item?.user?.id,
        item?.user?.user_id,
        item?.user?.username,
      ];

      return rowValues.some((value) => matchSet.has(normalizeValue(value)));
    });
  };

  const handleExport = async () => {
    if (!filters || !filters.district) {
      alert("Please select a District first before exporting.");
      return;
    }

    const userMatchSet = getCurrentUserMatchSet();
    if (!userMatchSet.size) {
      alert("Logged-in user details not available. Please login again and try export.");
      return;
    }

    setLoading(true);
    try {
      let lookupUser = null;
      const lookupCandidates = [
        user?.username,
        user?.login_id,
        user?.loginId,
        user?.user_id,
        user?.userId,
        user?.id,
      ].filter((value) => value !== null && value !== undefined && String(value).trim() !== "");

      for (const candidate of lookupCandidates) {
        try {
          const response = await LOOKUP_API.users.list({
            ...(typeof candidate === "number" ? { id: candidate } : {}),
            ...(typeof candidate === "string" ? { username: candidate } : {}),
            ...(typeof candidate === "string" && String(candidate).includes("@") ? { email: candidate } : {}),
          });

          const list = response?.data?.results || response?.data || [];
          const matched = Array.isArray(list)
            ? list.find((entry) => {
                const idsMatch = String(entry?.id ?? "") === String(candidate) || String(entry?.user_id ?? "") === String(candidate);
                const usernameMatch = String(entry?.username ?? "") === String(candidate);
                const loginMatch = String(entry?.login_id ?? "") === String(candidate);
                return idsMatch || usernameMatch || loginMatch;
              })
            : null;

          if (matched) {
            lookupUser = matched;
            break;
          }
        } catch (error) {
          console.warn("Lookup user resolution failed for candidate:", candidate, error);
        }
      }

      if (!lookupUser) {
        alert("No matching lookup user record found for the current login. Please login with the CRP account and try again.");
        setLoading(false);
        return;
      }

      const apiQuery = {
        ...filters,
        limit: 5000,
        page_size: 5000,
      };

      const exactIds = [
        lookupUser?.id,
        lookupUser?.user_id,
        lookupUser?.master_user_id,
        user?.id,
        user?.user_id,
        user?.master_user_id,
      ].filter((value) => value !== null && value !== undefined && String(value).trim() !== "");

      if (exactIds.length) {
        apiQuery.master_user_id = exactIds[0];
        apiQuery.user_id = exactIds[0];
      }

      const res = await EPSAKHI_API.crpPanchList(apiQuery);

      const payload = res.data?.data ? res.data.data : res.data;
      const apiData = Array.isArray(payload) ? payload : payload?.results || [];
      const filteredApiData = apiData.filter((item) => {
        const rowValues = [
          item?.master_user_id,
          item?.master_user,
          item?.masterUser,
          item?.user_id,
          item?.userId,
          item?.login_id,
          item?.loginId,
          item?.username,
          item?.email,
          item?.user?.id,
          item?.user?.user_id,
          item?.user?.username,
        ];

        const lookupValues = [
          lookupUser?.id,
          lookupUser?.user_id,
          lookupUser?.username,
          lookupUser?.login_id,
          lookupUser?.loginId,
          lookupUser?.email,
        ];

        return rowValues.some((rowValue) =>
          lookupValues.some((lookupValue) =>
            String(rowValue ?? "").trim().toLowerCase() === String(lookupValue ?? "").trim().toLowerCase(),
          ),
        );
      });

      if (!filteredApiData || filteredApiData.length === 0) {
        alert("No CRP Panchayat record found for the logged-in user to export.");
        setLoading(false);
        return;
      }

      const rowsWithCredentials = await Promise.all(
        filteredApiData.map(async (item, index) => {
          const masterUserId =
            item?.master_user_id ||
            item?.master_user ||
            item?.masterUser ||
            item?.user_id ||
            item?.userId ||
            null;

          let userId =
            item?.username ||
            item?.login_id ||
            item?.user_id ||
            item?.userId ||
            "N/A";

          let password = item?.password || item?.new_password || "N/A";

          if (masterUserId) {
            try {
              const userRes = await LOOKUP_API.users.retrieve(masterUserId);
              const userData = userRes?.data || {};

              userId =
                item?.username ||
                item?.login_id ||
                item?.user_id ||
                item?.userId ||
                userData?.username ||
                userData?.login_id ||
                userData?.user_id ||
                userData?.userId ||
                userId;

              password =
                item?.password ||
                item?.new_password ||
                userData?.password ||
                userData?.default_password ||
                userData?.new_password ||
                password;
            } catch (err) {
              console.warn("User credential fetch failed for CRP:", item?.id, err);
            }
          }

          return {
            index,
            item,
            userId,
            password,
          };
        }),
      );

      const excelData = rowsWithCredentials.map(({ index, item, userId, password }) => ({
        "S.No.": index + 1,
        "CRP Name": item.name,
        "Mobile Number": item.mobile_number,
        "User ID": userId || "N/A",
        "Password": password || "N/A",
        "LokOS SHG Code": item.lokos_shg_code || "-",
        "LokOS Member Code": item.lokos_member_code || "-",
        "District": item.district_name_en,
        "Block": item.block_name_en,
        "Panchayat": item.panchayat_name_en,
      }));

      // 3. Excel Workbook aur Worksheet banana
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);

      // 4. Main Title "Pargati Setu" add karna
      XLSX.utils.sheet_add_aoa(ws, [["Pargati Setu - CRP Report"]], { origin: "A1" });
      
      ws["A1"].s = {
        font: { name: "Arial", sz: 16, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "7A0C0C" } },
        alignment: { horizontal: "center", vertical: "center" }
      };

      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }]; // Merge across 10 cols

      // 5. Data aur Headers add karna Row 2 se
      XLSX.utils.sheet_add_json(ws, excelData, { origin: "A2" });

      // 6. Headers ko style karna (Red BG, White Text)
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

      // 7. Column widths set karna
      ws["!cols"] = [
        { wch: 8 },  
        { wch: 25 }, 
        { wch: 15 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 20 }  
      ];

      XLSX.utils.book_append_sheet(wb, ws, "CRP Data");

      // 8. File Download karna
      XLSX.writeFile(wb, "Pargati_Setu_CRP_Report.xlsx");
      
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
      onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = "#15803d")}
      onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = "#16a34a")}
    >
      <FaFileExcel /> {loading ? "Downloading..." : "Export to Excel"}
    </button>
  );
}