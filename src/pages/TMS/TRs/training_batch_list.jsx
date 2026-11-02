// src/pages/TMS/TRs/TrainingBatchList.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import {
  getCanonicalRole,
  ROLE_WELCOME_MESSAGES,
} from "../../../utils/roleUtils";
import BatchListExport from "./BatchListExport";
import BatchRescheduleModal from "./BatchRescheduleModal";
import ExcelJS from "exceljs";

const CACHE_KEY = "tms_training_batches_cache_v1";
const GEOSCOPE_KEY = "ps_user_geoscope";

function getTpPartnerCacheKey(userId) {
  return `tp_self_partner_id_${userId}`;
}

function getCacheKey(scope) {
  return `${CACHE_KEY}_${scope || "default"}`;
}

function saveCache(scope, payload) {
  try {
    localStorage.setItem(
      getCacheKey(scope),
      JSON.stringify({ ts: Date.now(), payload }),
    );
  } catch {}
}

function loadCache(scope) {
  try {
    const raw = localStorage.getItem(getCacheKey(scope));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;
  const cacheKey = `tp_self_partner_id_${userId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return Number(cached);
  } catch {}
  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });
    const pid = resp?.data?.results?.[0]?.id || null;
    if (pid) localStorage.setItem(cacheKey, String(pid));
    return pid;
  } catch {
    return null;
  }
}

export default function TrainingBatchList() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";
  const role = getCanonicalRole(user || {});
  const { id: requestId } = useParams();
  const isRequestScoped = Boolean(requestId);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  // SURGICAL ADDITION: Reschedule Modal States
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleBatchId, setRescheduleBatchId] = useState(null);

  const [tpPartnerId, setTpPartnerId] = useState(null);
  const [tpPartnerName, setTpPartnerName] = useState(null);
  const [dtpDistrictId, setDtpDistrictId] = useState(null);
  const [dtpPartnerId, setDtpPartnerId] = useState(null);
  const [dtpPartnerName, setDtpPartnerName] = useState("");
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get("status") || "";

  const [filters, setFilters] = useState({
    mandal_id: "",
    district_category_id: "",
    district_id: "",
    block_id: "",
    aspirational_only: false,
    centre_id: "",
    partner: "",
    level: "",
    status: initialStatus,
    training_type: "",
    batch_type: "",
    theme: "",
    training_plan: "",
    type_of_training: "",
    financial_year: "2026-27",
  });

  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [centres, setCentres] = useState([]);
  const [partners, setPartners] = useState([]);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);

  const didInitRef = useRef(false);

  async function ensureUserGeoscope(userId) {
    if (!userId) return null;

    try {
      const cached = JSON.parse(
        localStorage.getItem("ps_user_geoscope") || "null",
      );

      if (cached) return cached;
    } catch {}

    try {
      const resp = await LOOKUP_API.userGeoscopeByUserId(userId);

      if (resp?.data) {
        localStorage.setItem("ps_user_geoscope", JSON.stringify(resp.data));
        return resp.data;
      }
    } catch (error) {
      console.error("Failed to load user geoscope:", error);
    }

    return null;
  }

  function safeFirst(arr) {
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  }

  async function getDefaultScopeParams() {
    if (requestId) return { request: requestId };

    const geo = (await ensureUserGeoscope(user?.id)) || {};

    const blockId = geo.block_id || safeFirst(geo.blocks);

    const districtId = geo.district_id || safeFirst(geo.districts);

    if (role === "bmmu" && blockId) {
      return { block_id: blockId };
    }

    if (role === "dmmu" && districtId) {
      return { district_id: districtId };
    }

    if (role === "training_partner") {
      return { partner: tpPartnerId };
    }

    if (role === "dtp") {
      return {
        district_id: dtpDistrictId,
        partner: dtpPartnerId,
      };
    }

    if (role === "smmu" && filters.theme) {
      return { theme_id: filters.theme };
    }

    return {};
  }

  function getScopeKey() {
    if (requestId) return `req_${requestId}`;
    if (role === "training_partner") return `tp_${user?.id}`;
    if (role === "dtp") return `dtp_${user?.id}`;
    if (role === "bmmu") return "bmmu";
    if (role === "dmmu") return "dmmu";
    return role || "global";
  }

  useEffect(() => {
    (async () => {
      try {
        const [dRes, tRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 100 }),
          TMS_API.trainingThemes.list({ page_size: 100 }),
        ]);

        const allThemes = tRes?.data?.results || [];
        setDistricts(dRes?.data?.results || []);

        if (role === "smmu") {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );

          if (myTheme) {
            // dropdown me sirf meri theme dikhegi
            setThemes([myTheme]);

            // theme auto select
            setFilters((prev) => ({
              ...prev,
              theme: String(myTheme.id),
              training_plan: "",
            }));
          } else {
            setThemes([]);
          }
        } else {
          setThemes(allThemes);
        }
        if (role === "smmu") {
          const [mRes, dcRes] = await Promise.all([
            LOOKUP_API.mandals.list({ page_size: 100 }),
            LOOKUP_API.district_categories.list(),
          ]);
          setMandals(mRes?.data?.results || []);
          setDistrictCategories(dcRes?.data?.results || []);
        }

        if (role !== "training_partner" && role !== "tpcp") {
          const pRes = await TMS_API.trainingPartners.list({ page_size: 100 });
          setPartners(pRes?.data?.results || []);
        }

        if (role === "training_partner") {
          const pid = await resolveTrainingPartnerIdForUser(user.id);
          if (pid) {
            setTpPartnerId(pid);
            try {
              const pRes = await TMS_API.trainingPartners.retrieve(pid);
              setTpPartnerName(pRes?.data?.name || "Your Organisation");
            } catch {
              setTpPartnerName("Your Organisation");
            }
            const cRes = await TMS_API.trainingPartnerCentres.list({
              partner: pid,
            });
            setCentres(cRes?.data?.results || []);
            setFilters((f) => ({ ...f, partner: String(pid), centre_id: "" }));
          }
        }

        if (role === "dtp") {
          let districtId = null;
          try {
            const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
            districtId =
              geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;
            if (districtId) {
              setDtpDistrictId(String(districtId));
              setFilters((f) => ({
                ...f,
                district_id: String(districtId),
                block_id: "",
                aspirational_only: false,
              }));
            }
          } catch (err) {
            console.error("Failed to load DTP geoscope", err);
          }

          try {
            const partnerRes = await TMS_API.parentPartner();
            const partnerId = partnerRes?.data?.partner_id;
            if (partnerId) {
              setDtpPartnerId(String(partnerId));
              setFilters((f) => ({ ...f, partner: String(partnerId) }));
              try {
                const pRes = await TMS_API.trainingPartners.retrieve(partnerId);
                setDtpPartnerName(pRes?.data?.name || "");
              } catch (err) {}
            }
          } catch (err) {}
        }
      } catch (e) {
        console.error("Lookup load failed", e);
      }
    })();
  }, [role, user]);

  useEffect(() => {
    if (role !== "dmmu" || !user?.id) return;

    (async () => {
      const geo = (await ensureUserGeoscope(user.id)) || {};

      const dmmuDistrictId = geo.district_id || safeFirst(geo.districts);

      if (!dmmuDistrictId) return;

      setFilters((f) => {
        if (f.district_id) return f;

        return {
          ...f,
          district_id: String(dmmuDistrictId),
          block_id: "",
          aspirational_only: false,
        };
      });
    })();
  }, [role, user?.id]);

  useEffect(() => {
    if (role === "bmmu") return;
    if (!filters.district_id) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocks
      .list({ district_id: filters.district_id, page_size: 100 })
      .then((r) => {
        let data = r?.data?.results || [];
        if (filters.aspirational_only) {
          data = data.filter((b) => Number(b.is_aspirational) === 1);
        }
        setBlocks(data);
      })
      .catch(() => setBlocks([]));
  }, [filters.district_id, filters.aspirational_only]);

  useEffect(() => {
    if (!filters.theme) {
      setPlans([]);
      return;
    }
    TMS_API.trainingPlans
      .list({ theme: filters.theme })
      .then((r) => setPlans(r?.data?.results || []))
      .catch(() => setPlans([]));
  }, [filters.theme]);

  // SURGICAL ADDITION: Dynamic Export Handler
  const [isExporting, setIsExporting] = useState(false);
  const handleExportBatches = async () => {
    if (!user?.id) return;

    setIsExporting(true);

    try {
      let finalParams = {};

      if (isRequestScoped) {
        finalParams = { request_id: requestId, page_size: "MAX" };
      } else {
        const baseParams = await getDefaultScopeParams();
        let effectiveFilters = filters;

        if (role === "bmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([key]) =>
                ![
                  "district_id",
                  "block_id",
                  "mandal_id",
                  "district_category_id",
                ].includes(key),
            ),
          );
        }

        if (role === "dmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([key]) => key !== "district_id"),
          );
        }

        if (role === "training_partner") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([key]) => key !== "partner"),
          );
        }

        if (role === "dtp") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([key]) => !["district_id", "partner"].includes(key),
            ),
          );
        }

        finalParams = {
          ...baseParams,
          search,
          ...Object.fromEntries(
            Object.entries(effectiveFilters).filter(
              ([, value]) => value !== "" && value !== false,
            ),
          ),
          page_size: "MAX",
          exclude_status: role !== "dtp" ? "DRAFT" : undefined,
        };
      }

      const query = new URLSearchParams(
        Object.entries(finalParams)
          .filter(([, value]) => value != null)
          .map(([key, value]) => [key, String(value)]),
      ).toString();

      const response = await api.get(`/tms/batches-list/?${query}`);
      const exportItems = response?.data?.results || [];

      if (!exportItems.length) {
        alert("No batches found matching the current filters.");
        return;
      }

      const colors = {
        navy: "FF153E75",
        blue: "FF2563A6",
        lightBlue: "FFEAF3FC",
        paleBlue: "FFF4F8FD",
        white: "FFFFFFFF",
        text: "FF24364B",
        muted: "FF66788A",
        border: "FFD8E4F0",
        green: "FFE8F5EC",
        orange: "FFFFF2DB",
        red: "FFFCE9E9",
        gray: "FFF0F3F6",
      };

      const displayText = (value) =>
        value === null || value === undefined || value === ""
          ? "—"
          : String(value);

      const toExcelDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : date;
      };

      const participantCount = (batch) => {
        const value = Number(batch.pax_count ?? 0);
        return Number.isFinite(value) ? value : 0;
      };

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Training Management System";
      workbook.created = new Date();
      workbook.subject = "Batch export";

      const columns = [
        { header: "S.No", key: "serial", width: 9 },
        { header: "Financial Year", key: "financialYear", width: 16 },
        { header: "Batch Code", key: "code", width: 18 },
        { header: "Status", key: "status", width: 16 },
        { header: "Start Date", key: "startDate", width: 16 },
        { header: "End Date", key: "endDate", width: 16 },
        { header: "Level", key: "level", width: 14 },
        { header: "Type", key: "type", width: 18 },
        { header: "Theme", key: "theme", width: 24 },
        { header: "Training Plan", key: "trainingPlan", width: 28 },
        { header: "Partner", key: "partner", width: 24 },
        { header: "Block", key: "block", width: 20 },
        { header: "District", key: "district", width: 22 },
        { header: "Assigned Trainers", key: "trainers", width: 32 },
        { header: "Pendency Status", key: "pendency", width: 20 },
        { header: "Participant Count", key: "participants", width: 20 },
      ];

      const batchSheet = workbook.addWorksheet("TMS-Batch List");
      batchSheet.properties.tabColor = { argb: colors.blue };
      batchSheet.views = [
        {
          state: "frozen",
          ySplit: 4,
          topLeftCell: "A5",
          showGridLines: false,
        },
      ];
      batchSheet.columns = columns.map(({ key, width }) => ({ key, width }));

      const lastColumn = columns.length;
      const lastColumnLetter = "P";

      batchSheet.mergeCells(1, 1, 1, lastColumn);
      batchSheet.getCell("A1").value = "PRAGATI SETU TMS - BATCH LIST";
      batchSheet.getCell("A1").font = {
        name: "Aptos Display",
        size: 20,
        bold: true,
        color: { argb: colors.white },
      };
      batchSheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "left",
        indent: 1,
      };
      batchSheet.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.navy },
      };
      batchSheet.getRow(1).height = 38;

      batchSheet.mergeCells(2, 1, 2, lastColumn);
      batchSheet.getCell("A2").value =
        `Filtered batch export  •  ${exportItems.length} records  •  Generated ${new Date().toLocaleDateString()}`;
      batchSheet.getCell("A2").font = {
        name: "Aptos",
        size: 10,
        color: { argb: colors.muted },
      };
      batchSheet.getCell("A2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.lightBlue },
      };
      batchSheet.getCell("A2").alignment = {
        vertical: "middle",
        indent: 1,
      };
      batchSheet.getRow(2).height = 24;

      batchSheet.mergeCells(3, 1, 3, lastColumn);
      batchSheet.getCell("A3").value =
        "Use the header filters to sort and narrow the exported records.";
      batchSheet.getCell("A3").font = {
        name: "Aptos",
        size: 9,
        italic: true,
        color: { argb: colors.muted },
      };
      batchSheet.getCell("A3").alignment = {
        vertical: "middle",
        indent: 1,
      };
      batchSheet.getRow(3).height = 20;

      const headerRow = batchSheet.getRow(4);
      headerRow.values = columns.map(({ header }) => header);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.font = {
          name: "Aptos",
          bold: true,
          color: { argb: colors.white },
          size: 10,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.blue },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          bottom: { style: "medium", color: { argb: colors.navy } },
        };
      });

      const batchRows = exportItems.map((batch, index) => [
        index + 1,
        displayText(batch.financial_year),
        displayText(batch.code),
        displayText(batch.status),
        toExcelDate(batch.start_date),
        toExcelDate(batch.end_date),
        displayText(batch.level),
        displayText(batch.batch_type),
        displayText(batch.training_plan?.theme?.theme_name),
        displayText(batch.training_plan?.training_name),
        displayText(batch.centre?.partner?.name),
        displayText(batch.block?.block_name_en),
        displayText(batch.district?.district_name_en),
        Array.isArray(batch.master_trainers) && batch.master_trainers.length > 0
          ? batch.master_trainers
              .map((trainer) =>
                [
                  trainer.full_name,
                  `${trainer.designation || "—"} (${trainer.mobile_no || "—"})`,
                ]
                  .filter(Boolean)
                  .join("\n"),
              )
              .join("\n\n")
          : "—",
        displayText(batch.pendency_status),
        participantCount(batch),
      ]);

      batchRows.forEach((values, index) => {
        const row = batchSheet.addRow(values);
        row.height = 25;

        row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
          cell.font = { name: "Aptos", size: 10, color: { argb: colors.text } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: index % 2 === 0 ? colors.white : colors.paleBlue,
            },
          };
          cell.border = {
            bottom: { style: "hair", color: { argb: colors.border } },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal:
              columnNumber === 1 || columnNumber === 16 ? "center" : "left",
            wrapText: columnNumber === 14,
          };
        });

        row.getCell(5).numFmt = "dd mmm yyyy";
        row.getCell(6).numFmt = "dd mmm yyyy";
        row.getCell(16).numFmt = "#,##0";
      });

      const finalDataRow = Math.max(4, batchSheet.rowCount);
      batchSheet.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: finalDataRow, column: lastColumn },
      };

      const overview = workbook.addWorksheet("Overview");
      overview.properties.tabColor = { argb: colors.navy };
      overview.views = [{ showGridLines: false }];
      overview.columns = Array.from({ length: 8 }, () => ({ width: 19 }));

      overview.mergeCells("A1:H1");
      overview.getCell("A1").value = "BATCH EXPORT OVERVIEW";
      overview.getCell("A1").font = {
        name: "Aptos Display",
        size: 22,
        bold: true,
        color: { argb: colors.white },
      };
      overview.getCell("A1").alignment = {
        vertical: "middle",
        indent: 1,
      };
      overview.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.navy },
      };
      overview.getRow(1).height = 44;

      overview.mergeCells("A2:H2");
      overview.getCell("A2").value =
        `Exported ${new Date().toLocaleString()}  •  Based on the current batch filters`;
      overview.getCell("A2").font = {
        name: "Aptos",
        size: 10,
        color: { argb: colors.muted },
      };
      overview.getCell("A2").alignment = {
        vertical: "middle",
        indent: 1,
      };
      overview.getRow(2).height = 24;

      const uniqueCount = (selector) =>
        new Set(
          exportItems.map(selector).filter((value) => value && value !== "—"),
        ).size;

      const totalParticipants = exportItems.reduce(
        (sum, batch) => sum + participantCount(batch),
        0,
      );

      const cards = [
        { start: 1, end: 2, label: "TOTAL BATCHES", value: exportItems.length },
        {
          start: 3,
          end: 4,
          label: "TOTAL PARTICIPANTS",
          value: totalParticipants,
        },
        {
          start: 5,
          end: 6,
          label: "DISTRICTS",
          value: uniqueCount((batch) => batch.district?.district_name_en),
        },
        {
          start: 7,
          end: 8,
          label: "TRAINING PARTNERS",
          value: uniqueCount((batch) => batch.centre?.partner?.name),
        },
      ];

      cards.forEach(({ start, end, label, value }) => {
        overview.mergeCells(4, start, 4, end);
        overview.mergeCells(5, start, 6, end);

        const labelCell = overview.getCell(4, start);
        labelCell.value = label;
        labelCell.font = {
          name: "Aptos",
          size: 9,
          bold: true,
          color: { argb: colors.blue },
        };
        labelCell.alignment = { horizontal: "center", vertical: "middle" };
        labelCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.lightBlue },
        };

        const valueCell = overview.getCell(5, start);
        valueCell.value = value;
        valueCell.font = {
          name: "Aptos Display",
          size: 23,
          bold: true,
          color: { argb: colors.navy },
        };
        valueCell.alignment = { horizontal: "center", vertical: "middle" };
        valueCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.paleBlue },
        };
        valueCell.numFmt = "#,##0";
      });

      overview.getRow(4).height = 25;
      overview.getRow(5).height = 32;
      overview.getRow(6).height = 20;

      const groupBy = (selector) => {
        const groups = new Map();

        exportItems.forEach((batch) => {
          const label = displayText(selector(batch));
          const current = groups.get(label) || { batches: 0, participants: 0 };
          current.batches += 1;
          current.participants += participantCount(batch);
          groups.set(label, current);
        });

        return [...groups.entries()]
          .map(([label, totals]) => ({ label, ...totals }))
          .sort(
            (a, b) => b.batches - a.batches || a.label.localeCompare(b.label),
          );
      };

      const addBreakdown = (startColumn, title, heading, entries) => {
        overview.mergeCells(8, startColumn, 8, startColumn + 3);

        const titleCell = overview.getCell(8, startColumn);
        titleCell.value = title;
        titleCell.font = {
          name: "Aptos",
          size: 12,
          bold: true,
          color: { argb: colors.white },
        };
        titleCell.alignment = { vertical: "middle", indent: 1 };
        titleCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.blue },
        };

        heading.forEach((text, index) => {
          const cell = overview.getCell(9, startColumn + index);
          cell.value = text;
          cell.font = {
            name: "Aptos",
            bold: true,
            color: { argb: colors.navy },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colors.lightBlue },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        entries.forEach((entry, index) => {
          const rowNumber = 10 + index;
          const values = [
            entry.label,
            entry.batches,
            entry.participants,
            exportItems.length ? entry.batches / exportItems.length : 0,
          ];

          values.forEach((value, columnIndex) => {
            const cell = overview.getCell(rowNumber, startColumn + columnIndex);
            cell.value = value;
            cell.font = {
              name: "Aptos",
              size: 10,
              color: { argb: colors.text },
            };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: index % 2 === 0 ? colors.white : colors.paleBlue,
              },
            };
            cell.border = {
              bottom: { style: "hair", color: { argb: colors.border } },
            };
            cell.alignment = {
              vertical: "middle",
              horizontal: columnIndex === 0 ? "left" : "center",
            };
          });

          overview.getCell(rowNumber, startColumn + 2).numFmt = "#,##0";
          overview.getCell(rowNumber, startColumn + 3).numFmt = "0%";
        });

        overview.getRow(8).height = 28;
        overview.getRow(9).height = 24;
      };

      addBreakdown(
        1,
        "BATCHES BY STATUS",
        ["Status", "Batches", "Participants", "Share"],
        groupBy((batch) => batch.status),
      );

      addBreakdown(
        5,
        "BATCHES BY LEVEL",
        ["Level", "Batches", "Participants", "Share"],
        groupBy((batch) => batch.level),
      );

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Batches_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export Failed", error);
      alert("Failed to export batches. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // SURGICAL FIX: Restored strict role-scoped parameter builder & Server-Side Pagination
  async function fetchBatches(pageToFetch = 1, sizeToFetch = pageSize) {
    if (!user?.id) return;
    setLoading(true);
    try {
      let finalParams = {};
      if (isRequestScoped) {
        finalParams = {
          request_id: requestId,
          page: pageToFetch,
          page_size: sizeToFetch,
        };
      } else {
        const baseParams = await getDefaultScopeParams();
        let effectiveFilters = filters;

        if (role === "bmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([k]) =>
                ![
                  "district_id",
                  "block_id",
                  "mandal_id",
                  "district_category_id",
                ].includes(k),
            ),
          );
        }
        if (role === "dmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "district_id"),
          );
        }
        if (role === "training_partner") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "partner"),
          );
        }
        if (role === "dtp") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([k]) => !["district_id", "partner"].includes(k),
            ),
          );
        }

        finalParams = {
          ...baseParams,
          search,
          ...Object.fromEntries(
            Object.entries(effectiveFilters).filter(
              ([, v]) => v !== "" && v !== false && v != null,
            ),
          ),
          page: pageToFetch,
          page_size: sizeToFetch,
          exclude_status: role !== "dtp" ? "DRAFT" : undefined,
        };
      }

      // Clean out undefined or null parameters safely
      const cleanParams = Object.fromEntries(
        Object.entries(finalParams).filter(
          ([, v]) => v !== undefined && v !== null && v !== "",
        ),
      );

      const qs = new URLSearchParams(cleanParams).toString();
      const resp = await api.get(`/tms/batches-list/?${qs}`);
      // SURGICAL FIX: Extract paginated DRF response (results + count)
      setBatches(resp?.data?.results || []);
      setTotalCount(resp?.data?.count || 0);
      setCurrentPage(pageToFetch);

      // Note: Client caching removed as it breaks server-side pagination synchronicity.
    } catch (e) {
      setBatches([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }

  // SURGICAL ADDITION: Handle Page Size Change (Resets to page 1)
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    fetchBatches(1, newSize);
  };

  const handleDeleteBatch = async (batchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?",
    );
    if (!confirmed) return;
    try {
      await TMS_API.batchCreator.delete(batchId);
      alert("Batch deleted successfully.");
      fetchBatches();
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete batch.",
      );
    }
  };

  const handleViewBatch = async (batchId) => {
    try {
      const response = await TMS_API.batchDetailV2(batchId);
      navigate(`/tms/batch-detail/${batchId}`, {
        state: { batchData: response.data },
      });
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to fetch batch details.",
      );
    }
  };

  useEffect(() => {
    if (role === "bmmu") fetchBatches();
  }, [role]);

  useEffect(() => {
    if (role === "training_partner" && tpPartnerId) fetchBatches();
  }, [role, tpPartnerId]);

  useEffect(() => {
    if (role === "dtp" && dtpDistrictId && dtpPartnerId) fetchBatches();
  }, [role, dtpDistrictId, dtpPartnerId]);

  useEffect(() => {
    if (!user?.id || didInitRef.current || isRequestScoped) return;
    if (role === "bmmu" || role === "training_partner" || role === "dtp")
      return;

    if (role === "smmu" && !filters.theme) return;

    didInitRef.current = true;
    fetchBatches(1, pageSize);
  }, [user?.id, role, requestId, filters.theme]);

  useEffect(() => {
    if (!requestId || !user?.id) return;
    fetchBatches();
  }, [requestId, user?.id]);

  const renderCentreName = (c) => c?.venue_name || c?.partner?.name || "-";

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div style={{ width: "100%", margin: "10px 0" }}>
              {!isRequestScoped && (
                <div
                  style={{
                    background: "#e4ecf5",
                    padding: 16,
                    borderRadius: 10,
                    marginBottom: 14,
                    border: "2px solid #3d6ba6",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="filter-row"
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: 12,
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "auto",
                    }}
                  >
                    {role === "smmu" && (
                      <>
                        <select
                          className="filter-input"
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              mandal_id: e.target.value,
                            }))
                          }
                        >
                          <option value="">Mandal</option>
                          {mandals.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="filter-input"
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              district_category_id: e.target.value,
                            }))
                          }
                        >
                          <option value="">District Category</option>
                          {districtCategories.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {role !== "bmmu" && (
                      <select
                        className="filter-input"
                        value={filters.district_id}
                        disabled={role === "dmmu" || role === "dtp"}
                        onChange={(e) => {
                          if (role === "dmmu" || role === "dtp") return;
                          setBlocks([]);
                          setFilters((f) => ({
                            ...f,
                            district_id: e.target.value,
                            block_id: "",
                            aspirational_only: false,
                          }));
                        }}
                      >
                        <option value="">District</option>
                        {districts.map((d) => (
                          <option key={d.district_id} value={d.district_id}>
                            {d.district_name_en}
                          </option>
                        ))}
                      </select>
                    )}

                    {role !== "bmmu" && (
                      <label
                        className="aspirational-box"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 14,
                          color: "#2b4e72",
                          background: "#fff",
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #a7c6ed",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.aspirational_only}
                          disabled={role === "dtp"}
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              aspirational_only: e.target.checked,
                              block_id: "",
                            }))
                          }
                        />
                        Aspirational
                      </label>
                    )}

                    {role !== "bmmu" && filters.district_id && (
                      <select
                        key={filters.district_id}
                        className="filter-input"
                        value={filters.block_id}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            block_id: e.target.value,
                          }))
                        }
                      >
                        <option value="">Block</option>
                        {blocks.map((b) => (
                          <option key={b.block_id} value={b.block_id}>
                            {b.block_name_en}
                          </option>
                        ))}
                      </select>
                    )}

                    {role === "training_partner" && (
                      <select
                        className="filter-input"
                        value={filters.centre_id}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            centre_id: e.target.value,
                          }))
                        }
                      >
                        <option value="">Centre</option>
                        {centres.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.venue_name}
                          </option>
                        ))}
                      </select>
                    )}

                    {role !== "training_partner" &&
                      role !== "dtp" &&
                      role !== "tpcp" && (
                        <select
                          className="filter-input"
                          value={filters.partner}
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              partner: e.target.value,
                            }))
                          }
                        >
                          <option value="">Training Partner</option>
                          {partners.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      )}

                    {role === "dtp" && (
                      <select
                        className="filter-input"
                        value={filters.partner}
                        disabled
                      >
                        <option value={filters.partner}>
                          {dtpPartnerName}
                        </option>
                      </select>
                    )}

                    <select
                      className="filter-input"
                      value={filters.theme}
                      disabled={role === "smmu"}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          theme: e.target.value,
                          training_plan: "",
                        }))
                      }
                    >
                      <option value="">Training Theme</option>
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.theme_name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="filter-input"
                      value={filters.financial_year}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          financial_year: e.target.value,
                        }))
                      }
                    >
                      <option value="">Financial Year</option>
                      {["2025-26", "2026-27"].map((fy) => (
                        <option key={fy} value={fy}>
                          {fy}
                        </option>
                      ))}
                    </select>

                    {plans.length > 0 && (
                      <select
                        className="filter-input"
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            training_plan: e.target.value,
                          }))
                        }
                      >
                        <option value="">Training Plan</option>
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.training_name}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* ===== Training Type (Residential / Non-residential) ===== */}
                    <select
                      className="filter-input"
                      value={filters.type_of_training}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          type_of_training: e.target.value,
                        }))
                      }
                    >
                      <option value="">Type of Training</option>
                      <option value="RES">Residential</option>
                      <option value="NON RES">Non-residential</option>
                      <option value="OTHER">Other</option>
                    </select>

                    <select
                      className="filter-input"
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, level: e.target.value }))
                      }
                    >
                      <option value="">Level</option>
                      {["BLOCK", "DISTRICT", "STATE"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      className="filter-input"
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      <option value="">Status</option>
                      {[
                        "DRAFT",
                        "PENDING",
                        "REJECTED",
                        "ONGOING",
                        "SCHEDULED",
                        "COMPLETED",
                        "REVIEW",
                        "CLOSED",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      className="filter-input"
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          training_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Participant</option>
                      <option value="BENEFICIARY">Beneficiary</option>
                      <option value="TRAINER">Trainer</option>
                      <option value="STAFF">Staff</option>
                    </select>

                    <select
                      className="filter-input"
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          batch_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Batch Type</option>
                      <option value="SEPARATE">Separate</option>
                      <option value="COMBINED">Combined</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Search Batch Code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="..."
                  />

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 16,
                    }}
                  >
                    <button
                      className="fetch-btn"
                      onClick={() => fetchBatches(1, pageSize)}
                    >
                      Fetch Batches
                    </button>
                  </div>
                </div>
              )}

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72" }}>
                  Training Batches
                </h2>
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
                  {/* SURGICAL FIX: Independent Max-Record Export Button */}
                  <button
                    className="btnPrimary"
                    style={{
                      backgroundColor: "#16a34a",
                      border: "1px solid #15803d",
                      opacity: isExporting ? 0.7 : 1,
                      cursor: isExporting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={handleExportBatches}
                    disabled={isExporting}
                  >
                    {isExporting ? "Exporting Data..." : "Export All (CSV)"}
                  </button>
                </div>
              </div>

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 14,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ maxHeight: "100%", overflow: "auto" }}>
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>FY</th>
                        <th>Batch Code</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Level</th>
                        <th>Type</th>
                        <th>Theme</th>
                        <th>Training Plan</th>
                        <th>Partner</th>
                        <th>Block</th>
                        <th>District</th>
                        <th>Assigned Trainers</th>
                        <th>Pendency Status</th>
                        <th>Count</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={14}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            Loading data...
                          </td>
                        </tr>
                      ) : batches.length === 0 ? (
                        <tr>
                          <td
                            colSpan={14}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No batches found
                          </td>
                        </tr>
                      ) : (
                        batches.map((b, i) => (
                          <tr key={b.id}>
                            <td>{(currentPage - 1) * pageSize + i + 1}</td>
                            <td style={{ fontWeight: "600" }}>
                              {b.financial_year}
                            </td>
                            <td style={{ fontWeight: "600", color: "#2563eb" }}>
                              {b.code}
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${String(b.status).toLowerCase()}`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td>{formatDate(b.start_date)}</td>
                            <td>{formatDate(b.end_date)}</td>
                            <td>{b.level}</td>
                            <td>{b.batch_type}</td>
                            <td>{b.training_plan.theme.theme_name}</td>
                            <td>{b.training_plan.training_name}</td>
                            <td>{b.centre?.partner?.name || "-"}</td>
                            <td>{b.block?.block_name_en || "-"}</td>
                            <td>{b.district?.district_name_en || "-"}</td>
                            <td>
                              {Array.isArray(b.master_trainers) &&
                              b.master_trainers.length > 0
                                ? b.master_trainers.map((trainer) => (
                                    <div
                                      key={trainer.id}
                                      style={{ marginBottom: 4 }}
                                    >
                                      <strong>{trainer.full_name}</strong>
                                      <br />
                                      <span>
                                        {trainer.designation} (
                                        {trainer.mobile_no})
                                      </span>
                                    </div>
                                  ))
                                : "-"}
                            </td>
                            <td
                              style={{ textAlign: "center", fontWeight: "600" }}
                            >
                              {b.pendency_status || "-"}
                            </td>
                            <td
                              style={{ textAlign: "center", fontWeight: "600" }}
                            >
                              {b.pax_count || 0}
                            </td>

                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  className="btnView"
                                  onClick={() => handleViewBatch(b.id)}
                                >
                                  View
                                </button>

                                {/* SURGICAL ADDITION: Reschedule Button logic */}
                                {((role === "dmmu" &&
                                  String(b.level).toUpperCase() !== "STATE") ||
                                  (role === "smmu" &&
                                    String(b.level).toUpperCase() ===
                                      "STATE")) &&
                                  ["ONGOING", "SCHEDULED", "PENDING"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnView"
                                      style={{ background: "#f59e0b" }}
                                      onClick={() => {
                                        setRescheduleBatchId(b.id);
                                        setRescheduleModalOpen(true);
                                      }}
                                    >
                                      Reschedule
                                    </button>
                                  )}

                                {role === "dtp" &&
                                  (String(b.status).toUpperCase() === "DRAFT" ||
                                    (String(b.status).toUpperCase() ===
                                      "REJECTED" &&
                                      String(b.batch_type).toUpperCase() ===
                                        "SEPARATE")) && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate("/tms/batch-creator/", {
                                          state: {
                                            resume: true,
                                            batchId: b.id,
                                          },
                                        })
                                      }
                                    >
                                      Resume
                                    </button>
                                  )}
                                {((role === "dmmu" &&
                                  String(b.level).toUpperCase() !== "STATE") ||
                                  (role === "smmu" &&
                                    String(b.level).toUpperCase() ===
                                      "STATE")) &&
                                  String(b.status).toUpperCase() ===
                                    "PENDING" && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate(
                                          `/tms/dmmu/batch-review/${b.id}`,
                                        )
                                      }
                                    >
                                      Review
                                    </button>
                                  )}
                                {role === "dtp" &&
                                  ["DRAFT", "REJECTED"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnDelete"
                                      onClick={() => handleDeleteBatch(b.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                {role === "training_partner" &&
                                  ["DRAFT", "REJECTED"].includes(
                                    String(b.status).toUpperCase(),
                                  ) &&
                                  String(b.level).toUpperCase() === "STATE" && (
                                    <button
                                      className="btnDelete"
                                      onClick={() => handleDeleteBatch(b.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                {role === "smmu" &&
                                  ["ONGOING"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnDelete"
                                      onClick={() => handleDeleteBatch(b.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                {(role === "training_partner" ||
                                  (role === "dtp" &&
                                    String(b.participant_type).toUpperCase() !==
                                      "STAFF")) &&
                                  ["COMPLETED", "REVIEW"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate(`/tms/tp/tr-closure/${b.id}`)
                                      }
                                    >
                                      Closure
                                    </button>
                                  )}
                                {["bmmu", "dmmu", "smmu"].includes(role) && (
                                  <>
                                    {(role === "dmmu" &&
                                      String(b.level).toUpperCase() !==
                                        "STATE") ||
                                    (role === "smmu" &&
                                      String(b.level).toUpperCase() ===
                                        "STATE" &&
                                      String(b.status).toUpperCase() ===
                                        "REVIEW") ? (
                                      <button
                                        className="btnView"
                                        onClick={() =>
                                          role === "dmmu" || role === "smmu"
                                            ? navigate(
                                                `/tms/dmmu/tr-closure/${b.id}`,
                                              )
                                            : navigate(
                                                `/tms/batch-certificate/${b.id}`,
                                              )
                                        }
                                      >
                                        {role === "dmmu" || role === "smmu"
                                          ? "Closure"
                                          : "Certificate"}
                                      </button>
                                    ) : null}
                                    {String(b.status).toUpperCase() ===
                                      "CLOSED" && (
                                      <button
                                        className="btnView"
                                        onClick={() =>
                                          navigate(
                                            `/tms/batch-certificate/${b.id}`,
                                          )
                                        }
                                      >
                                        Certificate
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* SERVER-SIDE PAGINATION CONTROLS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    padding: "14px 20px",
                    backgroundColor: "#f8fafc",
                    borderTop: "1px solid #e2e8f0",
                    borderRadius: "0 0 10px 10px",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{ color: "#475569", fontSize: 14, fontWeight: 500 }}
                  >
                    Showing{" "}
                    <strong>
                      {(currentPage - 1) * pageSize +
                        (batches.length > 0 ? 1 : 0)}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(currentPage * pageSize, totalCount)}
                    </strong>{" "}
                    of{" "}
                    <strong style={{ color: "#0f172a" }}>{totalCount}</strong>{" "}
                    total batches
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Page Size Selector */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        Rows per page:
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) =>
                          handlePageSizeChange(Number(e.target.value))
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          outline: "none",
                          cursor: "pointer",
                          background: "#fff",
                          color: "#334155",
                          fontWeight: 600,
                        }}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                      </select>
                    </div>

                    {/* Navigation Buttons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#475569",
                          fontWeight: 600,
                          marginRight: "8px",
                        }}
                      >
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btnPage"
                        disabled={currentPage === 1}
                        onClick={() => fetchBatches(currentPage - 1, pageSize)}
                      >
                        Prev
                      </button>
                      <button
                        className="btnPage"
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        onClick={() => fetchBatches(currentPage + 1, pageSize)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BatchRescheduleModal
              isOpen={rescheduleModalOpen}
              batchId={rescheduleBatchId}
              onClose={() => {
                setRescheduleModalOpen(false);
                setRescheduleBatchId(null);
              }}
              onSuccess={() => fetchBatches()}
            />

            <style>{`
              /* LAYOUT FIXES */
              .content-area {
                display: flex;
                flex: 1;
                width: 100%;
              }
              .main-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0; /* Critical: Prevents table from stretching off-screen */
                background-color: #f8fafc;
              }

              /* BUTTON */
              .btnPrimary{
                background:#3d6ba6;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:6px 14px;
                cursor:pointer;
                transition:all .25s ease;
              }

              .btnPrimary:hover{
                transform:translateY(-3px);
                box-shadow:0 6px 12px rgba(0,0,0,0.15);
              }

              /* VIEW BUTTON */
              .btnView{
                background:#5a8cc2;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:5px 12px;
                cursor:pointer;
                  transition:all .25s ease;
              }

              .btnView:hover{
                transform: translateY(-6px);
                box-shadow: 0 10px 18px rgba(0,0,0,0.15);
              }

              /* TABLE */
              .training-table{
                width:100%;
                border-collapse:collapse;
                font-size:14px;
              }

              /* HEADER */
              .training-table thead{
                background:#3d6ba6;
                color:white;
              }

              .training-table th{
                padding:10px;
                text-align:left;
                font-weight:600;
                text-align:center;
                justify-content:center;  
              }

              /* BODY */
              .training-table td{
                padding:10px;
                border-bottom:1px solid #e4ecf5;
                text-align:center;
                justify-content:center;  
              }

              /* ROW BACKGROUND */
              .training-table tbody tr{
                background:#f8fbff;
              }

              /* ALTERNATE ROW */
              .training-table tbody tr:nth-child(even){
                background:#edf4fb;
              }

              /* HOVER */
              .training-table tbody tr:hover{
                background:#a7c6ed;
                transition:background .2s;
              }

              /* LOADING / EMPTY */
              .training-table tbody td{
                color:#1f2937;
              }

              /* DELETE BUTTON */
              .btnDelete{
                background:#ef4444;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:5px 12px;
                cursor:pointer;
                transition:all .25s ease;
              }

              .btnDelete:hover{
                transform: translateY(-3px);
                box-shadow: 0 6px 12px rgba(239, 68, 68, 0.25);
              }

              /* PAGINATION BUTTON */
              .btnPage{
                background:#e4ecf5;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
                color:#2b4e72;
                transition:all .2s ease;
              }

              .btnPage:hover:not(:disabled){
                background:#a7c6ed;
              }

              .btnPage:disabled{
                opacity:0.5;
                cursor:not-allowed;
              }

              /* ACTIVE PAGE */
              .activePage{
                background:#3d6ba6 !important;
                color:#fff !important;
              }

              .status-badge{
                display:inline-block;
                padding:6px 12px;
                border-radius:999px;
                font-size:12px;
                font-weight:700;
                letter-spacing:.3px;
                text-transform:uppercase;
                min-width:95px;
                text-align:center;
                border:1px solid transparent;
              }

              /* DRAFT */
              .status-draft{
                background:#f3f4f6;
                color:#4b5563;
                border-color:#d1d5db;
              }

              /* PENDING */
              .status-pending{
                background:#fef3c7;
                color:#92400e;
                border-color:#fcd34d;
              }

              /* REJECTED */
              .status-rejected{
                background:#fee2e2;
                color:#b91c1c;
                border-color:#fca5a5;
              }

              /* ONGOING */
              .status-ongoing{
                background:#D0E3CC;
                color:#1C881B;
                border-color:#1C881B;
              }

              /* SCHEDULED */
              .status-scheduled{
                background:#ede9fe;
                color:#6d28d9;
                border-color:#c4b5fd;
              }

              /* COMPLETED */
              .status-completed{
                background:#dcfce7;
                color:#166534;
                border-color:#86efac;
              }

              /* REVIEW */
              .status-review{
                background:#ffedd5;
                color:#c2410c;
                border-color:#fdba74;
              }

              /* CLOSED */
              .status-closed{
                background:#cffafe;
                color:#155e75;
                border-color:#67e8f9;
              }

              /* FILTER STYLES */
              .filter-input{
                border:1px solid #3d6ba6;
                border-radius:6px;
                padding:7px 10px;
                background:#fff;
                outline:none;
                font-size:14px;
                min-width:160px;
                transition:all .2s ease;
              }

              .filter-input:focus{
                border-color:#5a8cc2;
                box-shadow:0 0 0 2px rgba(61,107,166,0.2);
              }

              .filter-input:disabled {
                background-color: #f1f5f9;
                color: #64748b;
                cursor: not-allowed;
                border-color: #cbd5e1;
              }

              .fetch-btn{
                background:#3d6ba6;
                color:#fff;
                border:none;
                padding:8px 18px;
                border-radius:6px;
                font-weight:500;
                cursor:pointer;
                transition:all .25s ease;
                white-space: nowrap;
              }

              .fetch-btn:hover{
                background:#5a8cc2;
                transform:translateY(-2px);
                box-shadow:0 6px 14px rgba(0,0,0,0.12);
              }

              @media (max-width: 1200px){
                .filter-row{
                  flex-wrap: wrap !important;
                  white-space: normal !important;
                }
              }

              @media (max-width: 768px){
                .filter-input{
                  min-width: 140px;
                  flex: 1 1 45%; 
                }
                .aspirational-box{
                  flex: 1 1 45%;
                  justify-content: center;
                }
              }

              @media (max-width: 480px){
                .filter-input{
                  flex: 1 1 100%;
                  min-width: unset;
                }
                .aspirational-box{
                  flex: 1 1 100%;
                }
                .fetch-btn{
                  width: 100%;
                }
              }
          `}</style>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
