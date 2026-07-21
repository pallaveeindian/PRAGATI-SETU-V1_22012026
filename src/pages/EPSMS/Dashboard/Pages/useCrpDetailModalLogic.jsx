import { useEffect, useMemo, useState, useContext } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { EPSAKHI_API, LOOKUP_API } from "../../../../api/axios.js";


import {
  createInitialAssignmentModal,
  extractListFromPayload,
  formatCellValue,
  getBlockIdFromItem,
  getBlockNameFromItem,
  getMappingId,
  getPanchayatId,
  getPanchayatName,
  normalizeRows,
  renderCellText,
  resolveCrpId,
  resolveCrpMemberCode,
  toArray,
} from "./crpDetailModalUtils.jsx";
import { AuthContext } from "../../../../contexts/AuthContext";

export const useCrpDetailModalLogic = ({ data = [], selectedDistrict = null, onPanchayatSaved = null }) => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenu, setActionMenu] = useState({ open: false, position: null, crp: null });
  const [localRows, setLocalRows] = useState([]);
  const [assignmentModal, setAssignmentModal] = useState(createInitialAssignmentModal());
  const pageSize = 10;

  useEffect(() => {
    setLocalRows(normalizeRows(data));
  }, [data]);

  const rows = useMemo(() => {
    return (Array.isArray(localRows) ? localRows : [])
      .map((item, index) => {
        try {
          const crp = item?.crpep_details?.[0] || {};
          const allocatedPanchayatsValue = item?.allocated_panchayats || crp?.allocated_panchayats || item?.allocated_panchayat || crp?.allocated_panchayat || [];
          const crpId = resolveCrpId(item);
          const blockId =
            item?.block_id ||
            item?.block?.id ||
            item?.block?.block_id ||
            item?.blockId ||
            crp?.block_id ||
            crp?.blockId;

          return {
            srno: index + 1,
            name: crp.name || "-",
            district_name: crp.district_name || "-",
            block_name: crp.block_name || "-",
            panchayat_name: crp.panchayat_name || "-",
            nodal_clf: crp.nodal_clf_name || crp.nodal_clf || "-",
            category: crp.category || "-",
            subcategory: crp.subcategory || "-",
            allocated_panchayats: formatCellValue(allocatedPanchayatsValue),
            rawItem: item,
            crp_id: crpId,
            block_id: blockId,
          };
        } catch (error) {
          console.warn("Unable to render a CRP row safely", error, item);
          return {
            srno: index + 1,
            name: "-",
            district_name: "-",
            block_name: "-",
            panchayat_name: "-",
            nodal_clf: "-",
            category: "-",
            subcategory: "-",
            allocated_panchayats: "-",
            rawItem: item,
            crp_id: null,
            block_id: null,
          };
        }
      })
      .filter(Boolean);
  }, [localRows]);

  const columns = useMemo(
    () => [
      { key: "srno", label: "Sr. No." },
      { key: "name", label: "CRP Name" },
      { key: "district_name", label: "District Name" },
      { key: "block_name", label: "Block Name" },
      { key: "panchayat_name", label: "Panchayat Name" },
      { key: "nodal_clf", label: "Nodal CLF" },
      { key: "category", label: "Category" },
      { key: "subcategory", label: "Sub Category" },
      { key: "allocated_panchayats", label: "Allocated Panchayat" },
    ],
    [],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);

  const exportToExcel = () => {
    const excelData = rows.map((row, index) => ({
      "Sr No": index + 1,
      "CRP Name": row.name,
      "District Name": row.district_name,
      "Block Name": row.block_name,
      "Panchayat Name": row.panchayat_name,
      "Nodal CLF": row.nodal_clf,
      Category: row.category,
      "Sub Category": row.subcategory,
      "Allocated Panchayat": row.allocated_panchayats,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CRP Details");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    saveAs(file, `CRP_Details_${selectedDistrict?.name || "District"}.xlsx`);
  };

  const handleRowCellClick = (event, row) => {
    event.stopPropagation();

    const clickX = event.clientX;
    const clickY = event.clientY;
    const menuWidth = 240;
    const menuHeight = 120;
    const pagePadding = 16;

    const target = event.currentTarget instanceof HTMLElement ? event.currentTarget : event.target;
    const rowElement = target.closest?.("tr") || target;
    const rect = rowElement && typeof rowElement.getBoundingClientRect === "function" ? rowElement.getBoundingClientRect() : null;

    const left = Math.min(Math.max(clickX + 8, pagePadding), window.innerWidth - menuWidth - pagePadding);
    const top = rect
      ? Math.min(rect.bottom + 8, window.innerHeight - menuHeight - pagePadding)
      : Math.min(clickY + 8, window.innerHeight - menuHeight - pagePadding);

    setActionMenu({ open: true, position: { top, left }, crp: row });
  };

  const loadAssignedPanchayats = async (crpId) => {
    if (!crpId) return [];

    try {
      const response = await EPSAKHI_API.panchayatsUnderCrp(crpId);
      return extractListFromPayload(response?.data ?? response ?? []);
    } catch (error) {
      console.warn("Primary assigned-panchayat lookup failed", error);
      try {
        const fallbackResponse = await EPSAKHI_API.crpPanchayats(crpId);
        return extractListFromPayload(fallbackResponse?.data ?? fallbackResponse ?? []);
      } catch (fallbackError) {
        console.warn("Fallback assigned-panchayat lookup failed", fallbackError);
        return [];
      }
    }
  };

  const openAddPanchayatModal = async (row) => {
    setAssignmentModal({ open: true, mode: "add", crp: row, loading: true, panchayats: [], selectedIds: [], currentAssignedIds: [], saving: false, manualName: "" });

    try {
      const crpId = resolveCrpId(row?.rawItem || row);
      const blockId =
        row?.block_id ||
        row?.rawItem?.block_id ||
        row?.rawItem?.block?.id ||
        row?.rawItem?.block?.block_id ||
        row?.rawItem?.blockId ||
        row?.rawItem?.block?.blockId ||
        row?.rawItem?.crpep_details?.[0]?.block_id ||
        row?.rawItem?.crpep_details?.[0]?.block?.id ||
        row?.rawItem?.crpep_details?.[0]?.blockId;
      const blockName =
        row?.block_name ||
        row?.rawItem?.block_name ||
        row?.rawItem?.block?.block_name_en ||
        row?.rawItem?.block?.block_name ||
        row?.rawItem?.crpep_details?.[0]?.block_name ||
        row?.rawItem?.crpep_details?.[0]?.block?.block_name_en ||
        row?.rawItem?.crpep_details?.[0]?.block?.block_name ||
        "";

      // The backend does not consistently expose the assigned-panchayats lookup endpoint
      // for this modal, so skip it in the add flow and let the user continue with the list.
      const currentAssignedIds = [];

      const responseCandidates = [];
      if (blockId) {
        responseCandidates.push(
          LOOKUP_API.panchayatsByBlock(blockId, { params: { page_size: 10000 } }),
          LOOKUP_API.panchayats.list({ block_id: blockId, page_size: 10000 }),
          LOOKUP_API.panchayats.list({ blockId, page_size: 10000 }),
          LOOKUP_API.panchayats.list({ block: blockId, page_size: 10000 }),
        );
      }
      responseCandidates.push(LOOKUP_API.panchayats.list({ page_size: 10000 }));
      if (blockName) {
        responseCandidates.push(
          LOOKUP_API.panchayats.list({ search: blockName, page_size: 10000 }),
          LOOKUP_API.panchayats.list({ block_name: blockName, page_size: 10000 }),
          LOOKUP_API.panchayats.list({ block_name_en: blockName, page_size: 10000 }),
        );
      }

      let panchayats = [];
      for (const candidate of responseCandidates) {
        try {
          const response = await candidate;
          const payload = response?.data ?? response ?? [];
          const nestedList = extractListFromPayload(payload);
          if (Array.isArray(nestedList) && nestedList.length) {
            panchayats = nestedList;
            break;
          }
        } catch (error) {
          console.warn("Lookup candidate failed", error);
        }
      }

      if (!panchayats.length && blockId) {
        try {
          const districtResponse = await LOOKUP_API.blocks.list({ page_size: 10000 });
          const blocks = extractListFromPayload(districtResponse?.data ?? districtResponse ?? []);
          const matchedBlock = (Array.isArray(blocks) ? blocks : []).find((item) => {
            const id = item?.id || item?.block_id || item?.blockId || item?.value;
            return String(id) === String(blockId);
          });
          const fallbackBlockName = matchedBlock?.block_name_en || matchedBlock?.block_name || matchedBlock?.name || matchedBlock?.label || blockName;
          if (fallbackBlockName) {
            const fallbackResponse = await LOOKUP_API.panchayats.list({ page_size: 10000, search: fallbackBlockName });
            const fallbackList = extractListFromPayload(fallbackResponse?.data ?? fallbackResponse ?? []);
            if (fallbackList.length) {
              panchayats = fallbackList;
            }
          }
        } catch (fallbackError) {
          console.warn("Fallback panchayat lookup failed", fallbackError);
        }
      }

      let filteredPanchayats = panchayats;
      if (blockId && panchayats.length) {
        const normalizedBlockId = String(blockId);
        const normalizedBlockName = (blockName || "").toLowerCase();
        const blockMatched = panchayats.filter((item) => {
          const itemBlockId = getBlockIdFromItem(item);
          const itemBlockName = (getBlockNameFromItem(item) || "").toLowerCase();
          const matchesBlockId = itemBlockId !== null && String(itemBlockId) === normalizedBlockId;
          const matchesBlockName = normalizedBlockName && itemBlockName && itemBlockName.includes(normalizedBlockName);
          return matchesBlockId || matchesBlockName || !itemBlockId;
        });
        filteredPanchayats = blockMatched.length ? blockMatched : panchayats;
      }

      const availablePanchayats = filteredPanchayats.filter((item) => {
        const id = getPanchayatId(item);
        return id && !currentAssignedIds.includes(id);
      });

      setAssignmentModal({ open: true, mode: "add", crp: row, loading: false, panchayats: availablePanchayats, selectedIds: [], currentAssignedIds, saving: false, manualName: "" });
    } catch (error) {
      console.error("Failed to load panchayats for add action", error);
      setAssignmentModal({ open: true, mode: "add", crp: row, loading: false, panchayats: [], selectedIds: [], currentAssignedIds: [], saving: false, manualName: "" });
    }
  };

  const openDeletePanchayatModal = async (row) => {
    setAssignmentModal({ open: true, mode: "delete", crp: row, loading: true, panchayats: [], selectedIds: [], currentAssignedIds: [], saving: false, manualName: "" });

    try {
      const crpId = resolveCrpId(row?.rawItem || row);
      if (!crpId) {
        console.warn("CRP ID not available; falling back to local allocated_panchayats for delete modal");
      }

      let items = [];
      if ((row?.rawItem || row) && ((row?.rawItem?.allocated_panchayats || row?.allocated_panchayats || []).length)) {
        const localAllocated = row?.rawItem?.allocated_panchayats || row?.allocated_panchayats || [];
        items = (Array.isArray(localAllocated) ? localAllocated : [localAllocated]).map((p) => ({
          ...p,
          id: getPanchayatId(p) || getPanchayatId({ panchayat: p }) || null,
          panchayat_name: getPanchayatName(p),
        }));
      }

      if ((!items || !items.length) && (row?.rawItem || row)) {
        const localAllocated = row?.rawItem?.allocated_panchayats || row?.allocated_panchayats || [];
        if (localAllocated && localAllocated.length) {
          items = (Array.isArray(localAllocated) ? localAllocated : [localAllocated]).map((p) => ({
            ...p,
            id: getPanchayatId(p) || getPanchayatId({ panchayat: p }) || null,
            panchayat_name: getPanchayatName(p),
          }));
        }
      }

      setAssignmentModal({ open: true, mode: "delete", crp: row, loading: false, panchayats: Array.isArray(items) ? items : [], selectedIds: [], currentAssignedIds: [], saving: false, manualName: "" });
    } catch (error) {
      console.error("Failed to load assigned panchayats for delete action", error);
      setAssignmentModal({ open: true, mode: "delete", crp: row, loading: false, panchayats: [], selectedIds: [], currentAssignedIds: [], saving: false, manualName: "" });
      window.alert(error?.message || error?.response?.data?.detail || "Unable to load assigned panchayats.");
    }
  };

  const toggleAssignmentSelection = (itemId) => {
    const normalizedId = String(itemId || "");
    setAssignmentModal((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(normalizedId)
        ? prev.selectedIds.filter((id) => id !== normalizedId)
        : [...prev.selectedIds, normalizedId],
    }));
  };

  const clearSelection = () => {
    setAssignmentModal((prev) => ({ ...prev, selectedIds: [], manualName: "" }));
  };

  const updateLocalRowsAfterSave = (crpId, selectedPanchayats) => {
    setLocalRows((prevRows) =>
      prevRows.map((item) => {
        const currentCrpId = resolveCrpId(item);
        if (String(currentCrpId) !== String(crpId)) return item;

        const existingItems = Array.isArray(item.allocated_panchayats) ? item.allocated_panchayats : [];
        const existingIds = existingItems.map((entry) => String(getPanchayatId(entry))).filter(Boolean);
        const additionalItems = (selectedPanchayats || []).filter((entry) => {
          const entryId = getPanchayatId(entry);
          return entryId && !existingIds.includes(String(entryId));
        });

        if (!additionalItems.length) return item;

        return { ...item, allocated_panchayats: [...existingItems, ...additionalItems] };
      }),
    );
  };

  const isAuthorizationError = (error) => {
    const detail = String(error?.response?.data?.detail || error?.message || "");
    return (
      error?.response?.status === 403 ||
      error?.response?.status === 401 ||
      /not authorized|unauthorized|only crp recorder/i.test(detail)
    );
  };

  const saveAssignment = async () => {
    const crpId = resolveCrpId(assignmentModal.crp?.rawItem || assignmentModal.crp);
    
    
    if (!crpId) {
      window.alert("CRP ID is not available for this row.");
      return;
    }

    if (assignmentModal.mode === "add") {
      if (!assignmentModal.selectedIds.length) {
        window.alert("Please select at least two panchayat to add.");
        return;
      }
      if (assignmentModal.selectedIds.length < 2) {
        window.alert("Please select at least 2 Panchayats to add.");
        return;
      }

      if (assignmentModal.selectedIds.length > 5) {
        window.alert("Maximum 5 Panchayats allowed.");
        return;
      }

      setAssignmentModal((prev) => ({ ...prev, saving: true }));
      try {
        const selectedIds = Array.from(new Set(assignmentModal.selectedIds || []));
        const payload = {
          crp_id: crpId,
          crpep_id: crpId,
          panchayat_ids: selectedIds,
          allocated_panchayats: selectedIds,
          created_by: user?.id,
        };

        let usedFallback = false;

        try {
          await EPSAKHI_API.crpPanchayatBulk(payload);
        } catch (bulkError) {
          if (isAuthorizationError(bulkError)) {
            await EPSAKHI_API.crpLinkPanchayats(crpId, payload);
            usedFallback = true;
          } else {
            throw bulkError;
          }
        }

        const savedPanchayats = (assignmentModal.panchayats || []).filter((p) => selectedIds.includes(String(getPanchayatId(p) || "")));
        updateLocalRowsAfterSave(crpId, savedPanchayats);
        onPanchayatSaved?.();
        window.alert(usedFallback ? "Panchayat added successfully." : "Panchayat added successfully.");
        setAssignmentModal(createInitialAssignmentModal());
      } catch (error) {
        console.error("Failed to add panchayat", error);
        window.alert(error?.response?.data?.detail || error?.message || "Unable to add panchayat right now.");
        setAssignmentModal((prev) => ({ ...prev, saving: false }));
      }
      return;
    }

    if (assignmentModal.mode === "delete") {
      if (!assignmentModal.selectedIds.length) {
        window.alert("Please select at least one panchayat to delete.");
        return;
      }

      setAssignmentModal((prev) => ({ ...prev, saving: true }));

      try {
        let assigned = [];
        if (Array.isArray(assignmentModal.panchayats) && assignmentModal.panchayats.length) {
          assigned = assignmentModal.panchayats;
        } else if (assignmentModal.crp?.rawItem || assignmentModal.crp) {
          const localAllocated = assignmentModal.crp?.rawItem?.allocated_panchayats || assignmentModal.crp?.allocated_panchayats || [];
          assigned = (Array.isArray(localAllocated) ? localAllocated : [localAllocated]).map((p) => ({
            ...p,
            id: getPanchayatId(p) || getPanchayatId({ panchayat: p }) || null,
            panchayat_name: getPanchayatName(p),
          }));
        }

        const mappingByPanchayat = {};
        const panchayatIdByMappingId = {};
        (Array.isArray(assigned) ? assigned : []).forEach((item) => {
          const pId = String(getPanchayatId(item) || "");
          const mId = String(getMappingId(item) || "");
          if (pId && mId && mId !== pId) {
            mappingByPanchayat[pId] = mId;
            panchayatIdByMappingId[mId] = pId;
          }
          if (mId && !panchayatIdByMappingId[mId]) {
            panchayatIdByMappingId[mId] = pId || mId;
          }
        });

        const selected = Array.from(new Set(assignmentModal.selectedIds.map((s) => String(s))));
        const panchayatIdsToRemove = [];

        selected.forEach((sel) => {
          if (mappingByPanchayat[sel] || panchayatIdByMappingId[sel]) {
            const panchayatId = panchayatIdByMappingId[sel] || sel;
            if (panchayatId) {
              panchayatIdsToRemove.push(panchayatId);
            }
          } else {
            panchayatIdsToRemove.push(sel);
          }
        });

        const deletePayload = { crpep_id: crpId, panchayat_ids: Array.from(new Set(panchayatIdsToRemove)).join(","), deleted_by: user?.id };

        if (deletePayload.panchayat_ids) {
          try {
            await EPSAKHI_API.deletePanchayats(deletePayload);
          } catch (deleteErr) {
            console.error("Delete panchayats request failed", deleteErr);
            window.alert(deleteErr?.response?.data?.detail || deleteErr?.message || "Unable to delete panchayat right now.");
            setAssignmentModal((prev) => ({ ...prev, saving: false }));
            return;
          }
        }

        onPanchayatSaved?.();
        window.alert("Selected panchayats deleted successfully.");
        setAssignmentModal(createInitialAssignmentModal());
        return;
      } catch (error) {
        console.error("Failed to delete panchayat assignment", error);
        window.alert(error?.response?.data?.detail || error?.message || "Unable to delete panchayat right now.");
        setAssignmentModal((prev) => ({ ...prev, saving: false }));
      }
      return;
    }

    const finalIds = Array.from(new Set([...(assignmentModal.currentAssignedIds || []), ...(assignmentModal.selectedIds || [])]));
    const count = finalIds.length;

    if (count === 0) {
      window.alert("Please select at least one panchayat to add.");
      return;
    }

    if (count < 2) {
      window.alert("Minimum 2 Panchayats allowed.");
      return;
    }

    if (count > 5) {
      window.alert("Maximum 5 Panchayats allowed.");
      return;
    }

    setAssignmentModal((prev) => ({ ...prev, saving: true }));

    try {
      await EPSAKHI_API.crpPanchayatBulk({
        crp_id: crpId,
        allocated_panchayats: finalIds,
      });

      const savedPanchayats = (assignmentModal.panchayats || []).filter((p) => finalIds.includes(String(getPanchayatId(p) || "")));
      updateLocalRowsAfterSave(crpId, savedPanchayats);
      onPanchayatSaved?.();
      window.alert("Panchayat added successfully.");
      setAssignmentModal(createInitialAssignmentModal());
    } catch (error) {
      console.error("Failed to save panchayat assignment", error);
      if (isAuthorizationError(error)) {
        try {
          await EPSAKHI_API.crpLinkPanchayats(crpId, {
            panchayat_ids: finalIds,
          });
          const savedPanchayats = (assignmentModal.panchayats || []).filter((p) => finalIds.includes(String(getPanchayatId(p) || "")));
          updateLocalRowsAfterSave(crpId, savedPanchayats);
          onPanchayatSaved?.();
          window.alert("Panchayat added successfully.");
          setAssignmentModal(createInitialAssignmentModal());
          return;
        } catch (linkError) {
          console.error("Fallback save panchayat link failed", linkError);
        }
      }
      window.alert(error?.response?.data?.detail || error?.message || "Unable to add panchayat right now.");
      setAssignmentModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleAction = (actionType, crp) => {
    setActionMenu({ open: false, position: null, crp: null });
    if (actionType === "add") {
      openAddPanchayatModal(crp);
    } else if (actionType === "delete") {
      openDeletePanchayatModal(crp);
    }
  };

  const isAddSelectionValid = assignmentModal.mode === "add" ? assignmentModal.selectedIds.length > 0 : true;

  return {
    currentPage,
    setCurrentPage,
    actionMenu,
    setActionMenu,
    assignmentModal,
    setAssignmentModal,
    pageSize,
    rows,
    columns,
    totalPages,
    effectivePage,
    startIndex,
    paginatedRows,
    exportToExcel,
    handleRowCellClick,
    renderCellText,
    toggleAssignmentSelection,
    clearSelection,
    saveAssignment,
    handleAction,
    isAddSelectionValid,
    resetAssignmentModal: () => setAssignmentModal(createInitialAssignmentModal()),
  };
};
