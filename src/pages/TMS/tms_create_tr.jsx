// src/pages/TMS/tms_create_tr.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import LeftNav from "./layout/tms_LeftNav";
import Header from "../../pages/TMS/layout/header";
import Footer from "../../pages/TMS/layout/footer";
import { AuthContext } from "../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../api/axios";

import { getCanonicalRole, ROLE_WELCOME_MESSAGES } from "../../utils/roleUtils";
import { useTRState } from "./CreateTR/hooks/useTRState";
import {
  loadJson,
  saveJson,
  getRoleKeyFromUser,
  resolveFinalDistrict,
} from "./CreateTR/utils/beneficiaryMappers";

import Step1PlanSelection from "./CreateTR/Step1PlanSelection";
import Step2Participants from "./CreateTR/Step2Participants";
import Step3Review from "./CreateTR/Step3Review";
import {
  PreviewConfirmModal,
  SubmissionSummaryModal,
  PreloadModal,
  PreloadErrorToast,
} from "./CreateTR/TRModals";

const TRP_SCOPE_CACHE = "tms_trp_user_scope_v1";
const TRAIN_PLAN_CACHE = "tms_training_plans_cache_v1";
const GEOSCOPE_KEY = "ps_user_geoscope";
const MASTER_TRAINERS_CACHE = "tms_master_trainers_cache_v1";
const TRAINING_THEMES_CACHE = "tms_training_themes_cache_v1";
const BLOCK_TO_DISTRICT_CACHE = "tms_block_to_district_v1";

export default function CreateTrainingRequest() {
  const { user } = useContext(AuthContext) || {};
  const roleKeyNew = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKeyNew] || "Dashboard";
  const roleKey = getRoleKeyFromUser(user);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [hover, setHover] = useState(null);

  const geoscopeCached = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(GEOSCOPE_KEY) || "null");
    } catch (e) {
      return null;
    }
  }, []);

  // Initialize State Machine Hook
  const trState = useTRState(geoscopeCached);

  // Local Controller State
  const [blockList, setBlockList] = useState([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [allowedTrainingIds, setAllowedTrainingIds] = useState([]);
  const [plans, setPlans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState({
    scopes: false,
    plans: false,
    partners: false,
  });

  const initialMasterCache = loadJson(MASTER_TRAINERS_CACHE) || {
    items: [],
    page: 1,
    hasNext: false,
    district_id: null,
  };
  const [preloadedTrainers, setPreloadedTrainers] = useState(
    initialMasterCache.items || [],
  );
  const [preloadedTrainersMeta, setPreloadedTrainersMeta] = useState({
    page: initialMasterCache.page || 1,
    hasNext: Boolean(initialMasterCache.hasNext),
    district_id:
      typeof initialMasterCache.district_id !== "undefined"
        ? initialMasterCache.district_id
        : null,
  });

  const [preloadThemes, setPreloadThemes] = useState(
    loadJson(TRAINING_THEMES_CACHE) || [],
  );
  const [preloadReloadToken, setPreloadReloadToken] = useState(0);
  const [preloading, setPreloading] = useState(false);
  const [preloadErrors, setPreloadErrors] = useState([]);

  // Fallback to API if cache missed for Geoscope
  useEffect(() => {
    if ((!trState.blockId || !trState.districtId) && user?.id) {
      const fetchGeoscope = async () => {
        try {
          const response = await LOOKUP_API.userGeoscopeByUserId(user.id);
          const data = response.data;
          const fetchedBlockId = data?.blocks?.[0] ?? data?.block_id ?? null;
          const fetchedDistrictId =
            data?.districts?.[0] ?? data?.district_id ?? null;
          if (fetchedBlockId) trState.setBlockId(fetchedBlockId);
          if (fetchedDistrictId) trState.setDistrictId(fetchedDistrictId);
        } catch (error) {
          console.error("Failed to fetch fallback user geoscope:", error);
        }
      };
      fetchGeoscope();
    }
  }, [trState.blockId, trState.districtId, user?.id]);

  async function fetchListOnce(listFn, params = {}) {
    try {
      const resp = await listFn(params);
      const payload = resp?.data ?? resp ?? {};
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.results)) return payload.results;
      if (Array.isArray(payload.data)) return payload.data;
      return [];
    } catch (e) {
      console.error("fetchListOnce error", e);
      return [];
    }
  }

  async function fetchBlocksForDistrict(rawDistrictId) {
    if (!rawDistrictId) return;
    let targetId = rawDistrictId;
    if (Array.isArray(rawDistrictId)) targetId = rawDistrictId[0];
    if (rawDistrictId && typeof rawDistrictId === "object") {
      targetId =
        rawDistrictId.id ??
        rawDistrictId.district_id ??
        rawDistrictId.districtId;
    }
    const parsedId = Number(targetId);
    if (!targetId || isNaN(parsedId) || parsedId === 0) return;

    setBlockLoading(true);
    try {
      const resp = await LOOKUP_API.blocks.list({
        district: parsedId,
        district_id: parsedId,
        limit: 500,
      });
      const payload = resp?.data ?? resp ?? {};
      setBlockList(payload.results || payload.data || []);
    } catch (e) {
      console.error("Failed to fetch blocks", e);
      setBlockList([]);
    } finally {
      setBlockLoading(false);
    }
  }

  async function fetchDistrictFromBlock(block) {
    if (!block) return null;
    try {
      const mapping = loadJson(BLOCK_TO_DISTRICT_CACHE) || {};
      if (mapping && mapping[String(block)]) return mapping[String(block)];

      let resp = null;
      try {
        resp = await LOOKUP_API.get(`/blocks/detail/${block}/`);
      } catch (err) {
        try {
          if (
            LOOKUP_API.blocks &&
            typeof LOOKUP_API.blocks.retrieve === "function"
          ) {
            resp = await LOOKUP_API.blocks.retrieve(block);
          } else if (LOOKUP_API.get) {
            resp = await LOOKUP_API.get(`/lookups/blocks/${block}/`);
          }
        } catch (err2) {
          resp = null;
        }
      }

      const payload = resp?.data ?? resp ?? null;
      let districtIdFound = null;
      if (payload) {
        if (
          payload.district &&
          (payload.district.district_id || payload.district.id)
        ) {
          districtIdFound = payload.district.district_id || payload.district.id;
        } else if (
          payload.data &&
          payload.data.district &&
          (payload.data.district.district_id || payload.data.district.id)
        ) {
          districtIdFound =
            payload.data.district.district_id || payload.data.district.id;
        } else if (payload.district_id) {
          districtIdFound = payload.district_id;
        } else if (payload.data && payload.data.district_id) {
          districtIdFound = payload.data.district_id;
        } else if (payload?.district?.district_id) {
          districtIdFound = payload.district.district_id;
        }
      }

      if (districtIdFound) {
        const mapping2 = loadJson(BLOCK_TO_DISTRICT_CACHE) || {};
        mapping2[String(block)] = districtIdFound;
        saveJson(BLOCK_TO_DISTRICT_CACHE, mapping2);
        return districtIdFound;
      }
    } catch (e) {
      console.warn("fetchDistrictFromBlock failed", e);
    }
    return null;
  }

  async function preloadAll() {
    setPreloading(true);
    setPreloadErrors([]);
    setPreloadReloadToken((f) => f + 1);
    const errors = [];

    try {
      let scopes = [];
      try {
        scopes = await fetchListOnce(
          (p) => TMS_API.trpUserScopes.list({ ...p }),
          { user_role_id: user?.role_id ?? user?.role, limit: 500 },
        );
        saveJson(TRP_SCOPE_CACHE, {
          ts: Date.now(),
          roleId: user?.role_id ?? user?.role,
          allowedTrainingIds: scopes.map((r) => r.training_id),
        });
        setAllowedTrainingIds(
          Array.from(new Set(scopes.map((r) => r.training_id).filter(Boolean))),
        );
      } catch (e) {
        errors.push("trp-user-scopes failed");
      }

      try {
        const allPlans = await fetchListOnce(
          (p) => TMS_API.trainingPlans.list(p),
          { limit: 500 },
        );
        const allowedSet = new Set(
          (scopes || []).map((r) => r.training_id).filter(Boolean),
        );
        const plansCollected =
          allowedSet.size > 0
            ? allPlans.filter((p) => allowedSet.has(p.id))
            : [];
        plansCollected.sort((a, b) => {
          const na = (a.training_name || a.name || "").toString().toLowerCase();
          const nb = (b.training_name || b.name || "").toString().toLowerCase();
          if (na < nb) return -1;
          if (na > nb) return 1;
          return (a.id || 0) - (b.id || 0);
        });
        setPlans(plansCollected);
        saveJson(TRAIN_PLAN_CACHE, {
          ts: Date.now(),
          ids: Array.from(allowedSet),
          plans: plansCollected,
        });
      } catch (e) {
        errors.push("training-plans fetch failed");
        setPlans([]);
      }

      try {
        const list = await fetchListOnce(
          (p) => TMS_API.trainingThemes.list(p),
          { limit: 500 },
        );
        setPreloadThemes(list || []);
        saveJson(TRAINING_THEMES_CACHE, list || []);
      } catch (e) {
        setPreloadThemes([]);
      }
    } catch (e) {
      errors.push("unexpected preload error");
    } finally {
      setPreloadErrors(errors);
      setPreloading(false);
      setPreloadReloadToken((t) => t + 1);
    }
  }

  async function fetchMasterTrainersByDistrict(force = false) {
    const cached = loadJson(MASTER_TRAINERS_CACHE);
    const cachedItems =
      cached && Array.isArray(cached.items) ? cached.items : null;
    const cachedDistrictId =
      cached && typeof cached.district_id !== "undefined"
        ? cached.district_id
        : null;
    const desiredDistrict = trState.districtId ?? null;

    if (!force && cachedItems) {
      if (
        (desiredDistrict === null && cachedDistrictId === null) ||
        (desiredDistrict !== null &&
          String(cachedDistrictId) === String(desiredDistrict))
      ) {
        setPreloadedTrainers(cachedItems || []);
        setPreloadedTrainersMeta({
          page: cached.page || 1,
          hasNext: Boolean(cached.hasNext),
          district_id: cachedDistrictId,
        });
        return;
      }
    }

    let effectiveDistrict = trState.districtId ?? null;
    if (!effectiveDistrict && trState.blockId) {
      try {
        const resolved = await fetchDistrictFromBlock(trState.blockId);
        if (resolved) {
          effectiveDistrict = resolved;
          trState.setDistrictId(resolved);
        } else {
          effectiveDistrict = null;
        }
      } catch (e) {
        effectiveDistrict = null;
      }
    }

    setPreloading(true);
    try {
      const baseParams = { page_size: 5000 };
      let resp;
      try {
        resp = await TMS_API.masterTrainers.list({ ...baseParams });
      } catch (err) {
        if (effectiveDistrict) {
          try {
            resp = await TMS_API.masterTrainers.list(baseParams);
            effectiveDistrict = null;
          } catch (err2) {
            resp = null;
          }
        } else {
          resp = null;
        }
      }

      const payload = resp?.data ?? resp ?? {};
      const items = Array.isArray(payload.results)
        ? payload.results
        : Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
      setPreloadedTrainers(items || []);
      setPreloadedTrainersMeta({
        page: 1,
        hasNext: false,
        district_id: effectiveDistrict ?? null,
      });
      saveJson(MASTER_TRAINERS_CACHE, {
        ts: Date.now(),
        items: items || [],
        page: 1,
        hasNext: false,
        district_id: effectiveDistrict ?? null,
      });
    } catch (e) {
      const cachedItems2 = loadJson(MASTER_TRAINERS_CACHE)?.items || null;
      if (cachedItems2) {
        setPreloadedTrainers(cachedItems2 || []);
        const c = loadJson(MASTER_TRAINERS_CACHE) || {};
        setPreloadedTrainersMeta({
          page: c.page || 1,
          hasNext: Boolean(c.hasNext),
          district_id: c.district_id,
        });
      } else {
        setPreloadedTrainers([]);
        setPreloadedTrainersMeta({
          page: 1,
          hasNext: false,
          district_id: null,
        });
      }
    } finally {
      setPreloading(false);
    }
  }

  async function fetchPartnersIfNeeded() {
    if (Array.isArray(partners) && partners.length > 0) return;
    try {
      setLoading((s) => ({ ...s, partners: true }));
      const resp = await TMS_API.trainingPartners.list({ limit: 500 });
      const payload = resp?.data ?? resp ?? {};
      const list = payload.results || payload.data || [];
      setPartners(list);
    } catch (e) {
      setPartners([]);
    } finally {
      setLoading((s) => ({ ...s, partners: false }));
    }
  }

  useEffect(() => {
    preloadAll();
  }, []);

  useEffect(() => {
    if (trState.step === 2) {
      if (trState.form.training_type === "TRAINER") {
        fetchMasterTrainersByDistrict(false);
      }
    }
  }, [
    trState.step,
    trState.form.training_type,
    trState.districtId,
    trState.blockId,
  ]);

  useEffect(() => {
    if (
      trState.step === 2 &&
      trState.form.training_type === "BENEFICIARY" &&
      roleKey === "dmmu"
    ) {
      const canonicalDistrictId =
        trState.districtId ??
        geoscopeCached?.districts?.[0] ??
        geoscopeCached?.district_id ??
        user?.district_id ??
        user?.districtId ??
        (user?.district && typeof user.district === "object"
          ? (user.district.id ?? user.district.district_id)
          : user?.district) ??
        null;
      if (canonicalDistrictId) {
        fetchBlocksForDistrict(canonicalDistrictId);
        let targetStateId = canonicalDistrictId;
        if (Array.isArray(targetStateId)) targetStateId = targetStateId[0];
        if (targetStateId && typeof targetStateId === "object")
          targetStateId =
            targetStateId.id ??
            targetStateId.district_id ??
            targetStateId.districtId;
        if (
          targetStateId &&
          !isNaN(Number(targetStateId)) &&
          !trState.districtId
        )
          trState.setDistrictId(Number(targetStateId));
      }
      trState.setParticipantSubStep(0);
    }
  }, [
    trState.step,
    trState.form.training_type,
    roleKey,
    trState.districtId,
    geoscopeCached,
    user,
  ]);

  useEffect(() => {
    if (trState.step === 3) fetchPartnersIfNeeded();
  }, [trState.step]);

  function buildPreviewPayload() {
    const userBlock =
      user?.block_id ??
      user?.blockId ??
      geoscopeCached?.blocks?.[0] ??
      geoscopeCached?.block_id ??
      trState.blockId ??
      null;
    const previewDistrict =
      trState.districtId ??
      geoscopeCached?.districts?.[0] ??
      geoscopeCached?.district_id ??
      user?.district_id ??
      null;
    return {
      financial_year: trState.form.financial_year,
      training_plan: trState.selectedPlan?.training_name ?? null,
      partner: trState.form.partner ? Number(trState.form.partner) : null,
      training_type: trState.form.training_type,
      level: trState.form.level,
      notes: trState.form.notes || null,
      created_by: user?.id ?? user?.user_id ?? null,
      beneficiaries_count:
        trState.form.training_type === "BENEFICIARY"
          ? trState.selectedBeneficiaries.length
          : 0,
      trainers_count:
        trState.form.training_type === "TRAINER"
          ? trState.selectedTrainersMap.size
          : 0,
      block: userBlock ?? null,
      district: previewDistrict ?? null,
    };
  }

  function openPreview() {
    if (!trState.form.financial_year)
      return alert("Select a financial year first.");
    if (!trState.selectedPlan) return alert("Select a training plan first.");
    if (
      !trState.form.partner &&
      !(roleKey === "bmmu" && trState.autoPartnerAssigned)
    )
      return alert("Select partner.");
    if (
      trState.form.training_type === "BENEFICIARY" &&
      trState.selectedBeneficiaries.length === 0
    )
      return alert("Select beneficiaries.");
    if (
      trState.form.training_type === "TRAINER" &&
      trState.selectedTrainersMap.size === 0
    )
      return alert("Select trainers.");

    trState.setEngagementStatus("idle");
    trState.setEngagedParticipants([]);
    trState.setPreviewOpen(true);
  }

  async function checkEngagementBeforeSubmit() {
    trState.setEngagementStatus("checking");
    try {
      let ids = [];
      if (trState.form.training_type === "BENEFICIARY") {
        ids = trState.selectedBeneficiaries
          .map((b) => b.lokos_member_code)
          .filter(Boolean);
      } else {
        ids = Array.from(trState.selectedTrainersMap.keys()).map(String);
      }
      if (ids.length === 0) {
        trState.setEngagementStatus("all_clear");
        return;
      }

      const resp = await api.post("/tms/check-training-engagement/", {
        participant_type: trState.form.training_type,
        ids: ids,
      });
      const engagedIds = resp?.data?.engaged_ids || [];

      if (engagedIds.length === 0) {
        trState.setEngagementStatus("all_clear");
      } else {
        let engagedList = [];
        if (trState.form.training_type === "BENEFICIARY") {
          engagedList = trState.selectedBeneficiaries.filter((b) =>
            engagedIds.includes(b.lokos_member_code),
          );
        } else {
          engagedList = Array.from(trState.selectedTrainersMap.values()).filter(
            (t) => engagedIds.includes(String(t.id)),
          );
        }
        trState.setEngagedParticipants(engagedList);
        trState.setEngagementStatus("has_engaged");
      }
    } catch (e) {
      console.error("Engagement check failed", e);
      alert("Failed to verify participant eligibility. Please try again.");
      trState.setEngagementStatus("idle");
    }
  }

  async function confirmAndSubmit() {
    trState.setSubmitting(true);
    trState.setSubmitSummary(null);

    try {
      const userBlockRaw =
        user?.block_id ??
        user?.blockId ??
        geoscopeCached?.blocks?.[0] ??
        geoscopeCached?.block_id ??
        trState.blockId ??
        null;
      const userBlock =
        typeof userBlockRaw === "string" && userBlockRaw.trim() === ""
          ? null
          : userBlockRaw;

      const resolvedDistrict = await resolveFinalDistrict({
        districtId: trState.districtId,
        geoscopeCached,
        user,
        userBlock,
        fetchDistrictFromBlock,
        setDistrictId: trState.setDistrictId,
      });

      if (resolvedDistrict == null) {
        alert("District could not be resolved.");
        trState.setSubmitting(false);
        return;
      }

      const trPayload = {
        financial_year: trState.form.financial_year,
        training_plan: trState.selectedPlan.id,
        partner: trState.form.partner ? Number(trState.form.partner) : null,
        training_type: trState.form.training_type,
        level: trState.form.level,
        notes: trState.form.notes || null,
        created_by: user?.id ?? user?.user_id ?? null,
        block: userBlock
          ? isNaN(Number(userBlock))
            ? userBlock
            : Number(userBlock)
          : null,
        district:
          resolvedDistrict === undefined || resolvedDistrict === null
            ? null
            : Number(resolvedDistrict),
      };

      const trResp = await TMS_API.trainingRequests.create(trPayload);
      const trObj = trResp?.data ?? trResp;
      const trId = trObj?.id;
      if (!trId) throw new Error("Training request created but id missing");

      const successes = [];
      const failures = [];

      if (trState.form.training_type === "BENEFICIARY") {
        for (const b of trState.selectedBeneficiaries) {
          const key = `${b.lokos_shg_code}|${b.lokos_member_code}`;
          const raw = trState.savedMemberResponses.current.get(key) || {};
          const rawAddr = Array.isArray(raw.__raw_upsrlm?.member_addresses)
            ? raw.__raw_upsrlm.member_addresses[0]
            : Array.isArray(raw.member_addresses)
              ? raw.member_addresses[0]
              : {};

          const bPayload = {
            training: trId,
            lokos_shg_code: b.lokos_shg_code,
            lokos_member_code: b.lokos_member_code,
            member_name: raw.member_name || b.member_name,
            age: raw.age ?? b.age,
            gender: raw.gender || b.gender,
            designation: raw.designation || b.designation || "",
            pld_status: b.pld_status ? String(b.pld_status) : "NO",
            social_category: raw.social_category || b.social_category || "",
            religion: raw.religion || b.religion || "",
            mobile: raw.mobile || b.mobile || "",
            email: raw.email || "",
            education: raw.education || "",
            address: raw.address || b.address || "",
            district:
              raw.district_id ||
              raw.district ||
              b.district_id ||
              rawAddr.district_id ||
              null,
            block:
              raw.block_id ||
              raw.block ||
              b.block_id ||
              rawAddr.block_id ||
              null,
            panchayat:
              raw.panchayat_id ||
              raw.panchayat ||
              b.panchayat_id ||
              rawAddr.panchayat_id ||
              null,
            village:
              raw.village_id ||
              raw.village ||
              b.village_id ||
              rawAddr.village_id ||
              null,
            remarks: raw.remarks || "",
            created_by: user?.id ?? user?.user_id ?? null,
          };
          try {
            const resp =
              await TMS_API.trainingRequestBeneficiaries.create(bPayload);
            successes.push({
              type: "beneficiary",
              row: b,
              resp: resp?.data ?? resp,
            });
          } catch (e) {
            const msg =
              (e?.response?.data && JSON.stringify(e.response.data)) ||
              e?.message ||
              String(e);
            failures.push({ type: "beneficiary", row: b, error: msg });
          }
        }
      } else {
        for (const [tid, detail] of trState.selectedTrainersMap.entries()) {
          const tPayload = {
            training: trId,
            trainer: tid,
            full_name: detail.full_name || detail.name || "",
            mobile_no: detail.mobile_no || detail.mobile || "",
            aadhaar_no: detail.aadhaar_no || detail.aadhaar || "",
            district: detail.empanel_district || null,
            block: detail.empanel_block || null,
            remarks: "",
            created_by: user?.id ?? user?.user_id ?? null,
          };
          try {
            const resp = await TMS_API.trainingRequestTrainers.create(tPayload);
            successes.push({
              type: "trainer",
              row: detail,
              resp: resp?.data ?? resp,
            });
          } catch (e) {
            const msg =
              (e?.response?.data && JSON.stringify(e.response.data)) ||
              e?.message ||
              String(e);
            failures.push({ type: "trainer", row: detail, error: msg });
          }
        }
      }
      trState.setSubmitSummary({ trId, successes, failures });
    } catch (e) {
      trState.setSubmitSummary({
        trId: null,
        successes: [],
        failures: [
          {
            type: "training_request",
            error:
              (e?.response?.data && JSON.stringify(e.response.data)) ||
              e?.message ||
              String(e),
          },
        ],
      });
    } finally {
      trState.setSubmitting(false);
    }
  }

  const selectedPlanTitle =
    trState.selectedPlan &&
    (trState.selectedPlan.training_name ||
      trState.selectedPlan.training_plan_name ||
      trState.selectedPlan.trainingTitle ||
      trState.selectedPlan.name ||
      `Plan ${trState.selectedPlan.id}`);
  const hasParticipants =
    trState.form.training_type === "BENEFICIARY"
      ? trState.selectedBeneficiaries.length > 0
      : trState.selectedTrainersMap.size > 0;

  const cardStyle = {
    background: "#fff",
    padding: 18,
    borderRadius: 10,
    border: "2px solid #3d6ba6",
    boxShadow: "0 4px 10px #a7c6ed",
  };
  const btnPrimary = {
    background: "linear-gradient(20deg, #e4ecf5, #5a8cc2)",
    border: "2px solid #3d6ba6",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };
  const headerGradient = {
    background: "linear-gradient(90deg, #e4ecf5, #a7c6ed)",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    border: "2px solid #3d6ba6",
  };
  const stepActive = {
    background: "linear-gradient(90deg, #e4ecf5, #a7c6ed)",
    color: "#111827",
    fontWeight: 700,
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };
  const stepInactive = {
    background: "#f5f7fa",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    border: "2px solid #3d6ba6",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };
  const steps = [
    { id: 1, title: "Choose Plan" },
    { id: 2, title: "Select Participants" },
    { id: 3, title: "Review & Submit" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18, flex: 1 }}>
            <div style={{ width: "100%", margin: "20px 0", padding: "0 12px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <div className="dashboard-header">
                    <h2 className="dashboard-title">{roleMessage}</h2>
                  </div>
                  <h2 style={{ margin: 0, color: "#0369a1" }}>
                    Create Training Request
                  </h2>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button
                    className="btnPrimaryHover"
                    style={{ ...btnPrimary, color: "#111827" }}
                    onClick={() => {
                      localStorage.removeItem(TRP_SCOPE_CACHE);
                      localStorage.removeItem(TRAIN_PLAN_CACHE);
                      localStorage.removeItem(MASTER_TRAINERS_CACHE);
                      localStorage.removeItem(TRAINING_THEMES_CACHE);
                      preloadAll();
                    }}
                  >
                    Refresh & Reload
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  alignItems: "center",
                }}
              >
                {steps.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => trState.jumpToStep(s.id)}
                    style={s.id === trState.step ? stepActive : stepInactive}
                    className="btnPrimaryHover"
                  >
                    {s.title}
                  </div>
                ))}
              </div>

              <div
                className="training-content"
                style={{ display: "grid", gap: 20, width: "100%" }}
              >
                <div style={cardStyle}>
                  {trState.step === 1 && (
                    <Step1PlanSelection
                      plans={plans}
                      selectedPlan={trState.selectedPlan}
                      setSelectedPlan={trState.setSelectedPlan}
                      setSelectedTheme={trState.setSelectedTheme}
                      setAutoPartnerAssigned={trState.setAutoPartnerAssigned}
                      setForm={trState.setForm}
                      form={trState.form}
                      districtId={trState.districtId}
                      user={user}
                      geoscopeCached={geoscopeCached}
                      preloadThemes={preloadThemes}
                      partners={partners}
                      goToNext={trState.goToNext}
                    />
                  )}
                  {trState.step === 2 && (
                    <Step2Participants
                      form={trState.form}
                      setForm={trState.setForm}
                      roleKey={roleKey}
                      blockId={trState.blockId}
                      setBlockId={trState.setBlockId}
                      blockList={blockList}
                      blockLoading={blockLoading}
                      participantSubStep={trState.participantSubStep}
                      setParticipantSubStep={trState.setParticipantSubStep}
                      selectedBlockForShg={trState.selectedBlockForShg}
                      setSelectedBlockForShg={trState.setSelectedBlockForShg}
                      selectedShgForMembers={trState.selectedShgForMembers}
                      setSelectedShgForMembers={
                        trState.setSelectedShgForMembers
                      }
                      selectedShgLoading={trState.selectedShgLoading}
                      setSelectedShgLoading={trState.setSelectedShgLoading}
                      memberListReloadToken={trState.memberListReloadToken}
                      setMemberListReloadToken={
                        trState.setMemberListReloadToken
                      }
                      selectedMemberCodesSet={trState.selectedMemberCodesSet}
                      selectedBeneficiaries={trState.selectedBeneficiaries}
                      addSelectedMember={trState.addSelectedMember}
                      hover={hover}
                      setHover={setHover}
                      goToPrev={trState.goToPrev}
                      goToNext={trState.goToNext}
                      fetchMasterTrainersByDistrict={
                        fetchMasterTrainersByDistrict
                      }
                      preloadedTrainers={preloadedTrainers}
                      preloadReloadToken={preloadReloadToken}
                      selectedTrainerIds={trState.selectedTrainerIds}
                      onToggleTrainer={trState.onToggleTrainer}
                    />
                  )}
                  {trState.step === 3 && (
                    <Step3Review
                      selectedPlan={trState.selectedPlan}
                      selectedPlanTitle={selectedPlanTitle}
                      form={trState.form}
                      roleKey={roleKey}
                      autoPartnerAssigned={trState.autoPartnerAssigned}
                      partners={partners}
                      selectedBeneficiaries={trState.selectedBeneficiaries}
                      selectedTrainerList={trState.selectedTrainerList}
                      goToPrev={trState.goToPrev}
                      openPreview={openPreview}
                      removeSelectedBeneficiary={
                        trState.removeSelectedBeneficiary
                      }
                      removeSelectedTrainer={trState.removeSelectedTrainer}
                    />
                  )}
                </div>

                <aside
                  style={{ ...cardStyle, width: "100%", maxHeight: "350px" }}
                >
                  <h3 style={headerGradient}>Request Summary</h3>
                  <div
                    style={{ fontSize: 13, color: "#6c757d", marginBottom: 8 }}
                  >
                    Quick summary and actions.
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Financial Year:</strong>
                    <div
                      style={{
                        padding: 8,
                        background: "#fbfdff",
                        borderRadius: 6,
                      }}
                    >
                      {trState.form.financial_year || "—"}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Plan:</strong>
                    <div
                      style={{
                        padding: 8,
                        background: "#fbfdff",
                        borderRadius: 6,
                      }}
                    >
                      {trState.selectedPlan ? selectedPlanTitle : "—"}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Type:</strong> {trState.form.training_type}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Participants:</strong>{" "}
                    {trState.form.training_type === "BENEFICIARY"
                      ? `${trState.selectedBeneficiaries.length} beneficiaries`
                      : `${trState.selectedTrainersMap.size} trainers`}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btnPrimaryHover"
                      style={btnPrimary}
                      onClick={openPreview}
                    >
                      Preview & Confirm
                    </button>
                    <button
                      className="btnPrimaryHover"
                      style={btnPrimary}
                      onClick={() => {
                        trState.setSelectedBeneficiaries([]);
                        trState.setSelectedTrainersMap(new Map());
                      }}
                    >
                      Clear Selections
                    </button>
                  </div>
                  {trState.submitSummary && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid #f1f3f5",
                        background: "#fff",
                      }}
                    >
                      <h4 style={{ margin: "6px 0" }}>Last submission</h4>
                      {trState.submitSummary.trId ? (
                        <div>
                          Training Request ID:{" "}
                          <strong>{trState.submitSummary.trId}</strong>
                        </div>
                      ) : (
                        <div style={{ color: "#b03a2e" }}>
                          Failed to create training request.
                        </div>
                      )}
                      <div>
                        Successes:{" "}
                        {trState.submitSummary.successes?.length ?? 0}
                      </div>
                      <div>
                        Failures: {trState.submitSummary.failures?.length ?? 0}
                      </div>
                      {trState.submitSummary.failures?.length > 0 && (
                        <details style={{ marginTop: 6 }}>
                          <summary style={{ cursor: "pointer" }}>
                            Show errors
                          </summary>
                          <ul>
                            {trState.submitSummary.failures.map((f, i) => (
                              <li key={i}>
                                <strong>{f.type}</strong>:{" "}
                                {f.error || JSON.stringify(f.row)}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </main>
          <Footer />
        </div>

        <PreviewConfirmModal
          isOpen={trState.previewOpen}
          onClose={() => trState.setPreviewOpen(false)}
          onConfirm={async () => {
            await confirmAndSubmit();
            trState.setPreviewOpen(false);
          }}
          onCheckEngagement={checkEngagementBeforeSubmit}
          engagementStatus={trState.engagementStatus}
          hasParticipants={hasParticipants}
          submitting={trState.submitting}
          previewPayload={buildPreviewPayload()}
          selectedPlanTitle={selectedPlanTitle}
          partnerName={
            partners.find((p) => String(p.id) === String(trState.form.partner))
              ?.name
          }
          engagedParticipants={trState.engagedParticipants}
          trainingType={trState.form.training_type}
          removeIneligibleParticipants={trState.removeIneligibleParticipants}
        />
        <SubmissionSummaryModal
          summary={trState.submitSummary}
          onClose={() => trState.setSubmitSummary(null)}
        />
        <PreloadModal
          isOpen={preloading}
          onCancel={() => setPreloading(false)}
        />
        <PreloadErrorToast
          errors={preloadErrors}
          onDismiss={() => setPreloadErrors([])}
        />

        <style>{`
        .no-action .table thead th:last-child, .no-action .table tbody td:last-child { display: none; }
        .btnPrimaryHover:hover { transform: translateY(-6px); box-shadow: 0 10px 18px rgba(0,0,0,0.15); }
        .training-content{ grid-template-columns: minmax(0,1fr) 360px; }
        .content-area { display: flex; flex: 1; min-width: 0; }
        @media (max-width: 900px){ .training-content{ grid-template-columns: 1fr; } }
        .dashboard-header { display: flex; align-items: center; }
        .dashboard-title { color: #2b4e72; }
        `}</style>
      </div>
    </div>
  );
}
