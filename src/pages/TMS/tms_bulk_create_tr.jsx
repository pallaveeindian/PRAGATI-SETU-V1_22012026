// src\pages\TMS\tms_bulk_create_tr.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import api, { LOOKUP_API, TMS_API } from "../../api/axios";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "./layout/header";
import Footer from "./layout/footer";
import LeftNav from "./layout/tms_LeftNav";
import { useTRState } from "./CreateTR/hooks/useTRState";
import BulkStep1PlanSelection from "./BulkCreateTR/BulkStep1PlanSelection";
import BulkStep2Participants from "./BulkCreateTR/BulkStep2Participants";
import BulkRequestList from "./BulkCreateTR/BulkRequestList";
import { useBulkTRState } from "./BulkCreateTR/hooks/useBulkTRState";
// -----------------------------------------
// Helpers
// -----------------------------------------
const toList = (response) => {
  const data = response?.data ?? response ?? [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.data)) return data.data;
  return [];
};
const pk = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "object") {
    return value.block_id ?? value.district_id ?? value.id ?? null;
  }
  return value;
};
const idText = (value) => String(pk(value) ?? "");
const planLabel = (plan) =>
  plan?.training_name ||
  plan?.training_plan_name ||
  plan?.name ||
  `Plan ${plan?.id ?? ""}`;
const typeLabel = (type) =>
  ({
    BENEFICIARY: "Beneficiaries (SHG)",
    TRAINER: "Master Trainers",
    STAFF: "Staff",
  })[type] ||
  type ||
  "—";
const participantId = (request, participant) => {
  if (request.training_type === "BENEFICIARY") {
    return participant.lokos_member_code;
  }
  if (request.training_type === "TRAINER") {
    return pk(participant.trainer ?? participant.trainer_id);
  }
  return pk(participant.staff ?? participant.staff_id);
};
// -----------------------------------------
// Main Component
// -----------------------------------------
export default function BulkCreateTrainingRequest() {
  const { user } = useContext(AuthContext) || {};
  const state = useTRState(null);
  const bulk = useBulkTRState();
  const {
    requests,
    editingId,
    saveDraft,
    updateDraft,
    removeDraft,
    startEditing,
    cancelEditing,
    clearDrafts,
    lockedTrainingType,
    lockedFinancialYear,
    lockedTrainingPlan,
    isDistrictReserved,
    isBlockReserved,
    validateDraft,
    bulkSummary,
  } = bulk;
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [themes, setThemes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [trainersReloadToken, setTrainersReloadToken] = useState(0);
  const [checkStatus, setCheckStatus] = useState("idle");
  const [conflicts, setConflicts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const formRef = useRef(null);
  const listRef = useRef(null);
  // Bulk TR always uses STATE level for every participant type.
  useEffect(() => {
    if (state.form.level !== "STATE") {
      state.setForm((previous) =>
        previous.level === "STATE" ? previous : { ...previous, level: "STATE" },
      );
    }
  }, [state.form.level, state.setForm]);
  // =========================================
  // LOAD MASTER DATA
  // =========================================
  useEffect(() => {
    LOOKUP_API.districts
      .list({ page_size: 200 })
      .then((response) => setDistricts(toList(response)))
      .catch((error) => console.error("Unable to load districts", error));
    TMS_API.trainingThemes
      .list({ limit: 500 })
      .then((response) => setThemes(toList(response)))
      .catch((error) => console.error("Unable to load themes", error));
    TMS_API.trainingPartners
      .list({ limit: 500 })
      .then((response) => setPartners(toList(response)))
      .catch((error) => console.error("Unable to load partners", error));
  }, []);
  // Invalidate previous engagement checks whenever
  // any saved draft changes.
  useEffect(() => {
    setCheckStatus("idle");
    setConflicts([]);
    setConfirmOpen(false);
  }, [requests]);
  // =========================================
  // LOAD DISTRICT BLOCKS
  // =========================================
  useEffect(() => {
    if (state.form.training_type !== "BENEFICIARY" || !state.districtId) {
      setBlockList([]);
      return;
    }
    let alive = true;
    setBlockLoading(true);
    LOOKUP_API.blocks
      .list({
        district: state.districtId,
        district_id: state.districtId,
        limit: 500,
      })
      .then((response) => {
        if (alive) setBlockList(toList(response));
      })
      .catch((error) => {
        if (!alive) return;
        console.error("Unable to load blocks", error);
        setBlockList([]);
      })
      .finally(() => {
        if (alive) setBlockLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [state.districtId, state.form.training_type]);
  // =========================================
  // LOAD MASTER TRAINERS
  // =========================================
  const fetchMasterTrainersByDistrict = useCallback(async () => {
    try {
      const response = await TMS_API.masterTrainers.list({
        page_size: 5000,
      });
      setTrainers(toList(response));
      setTrainersReloadToken((value) => value + 1);
    } catch (error) {
      console.error("Unable to load Master Trainers", error);
      setTrainers([]);
    }
  }, []);
  useEffect(() => {
    if (state.form.training_type === "TRAINER") {
      fetchMasterTrainersByDistrict();
    }
  }, [state.form.training_type, fetchMasterTrainersByDistrict]);
  // =========================================
  // DISTRICT NAME HELPER
  // =========================================
  const districtNameFor = (id) => {
    const district = districts.find(
      (item) => idText(item.district_id ?? item.id) === idText(id),
    );
    return (
      district?.district_name_en ||
      district?.district_name ||
      district?.name ||
      (id ? `District ${id}` : "—")
    );
  };
  // =========================================
  // CURRENT PARTICIPANT COUNT
  // =========================================
  const selectedCount =
    state.form.training_type === "BENEFICIARY"
      ? state.selectedBeneficiaries.length
      : state.form.training_type === "TRAINER"
        ? state.selectedTrainersMap.size
        : state.selectedStaffMap.size;
  // =========================================
  // PREVENT REUSING TRAINERS / STAFF
  // ACROSS SAVED BULK DRAFTS
  // =========================================
  const reservedTrainerIds = useMemo(() => {
    return new Set(
      requests
        .filter(
          (request) =>
            request.training_type === "TRAINER" &&
            String(request.id) !== String(editingId),
        )
        .flatMap((request) =>
          (request.participants || []).map((person) =>
            idText(person.trainer ?? person.trainer_id),
          ),
        )
        .filter(Boolean),
    );
  }, [requests, editingId]);
  const reservedStaffIds = useMemo(() => {
    return new Set(
      requests
        .filter(
          (request) =>
            request.training_type === "STAFF" &&
            String(request.id) !== String(editingId),
        )
        .flatMap((request) =>
          (request.participants || []).map((person) =>
            idText(person.staff ?? person.staff_id),
          ),
        )
        .filter(Boolean),
    );
  }, [requests, editingId]);
  const handleTrainerToggle = (trainer, checked) => {
    const trainerId = idText(trainer?.id);
    if (checked && !trainerId) {
      setNotice("Master Trainer ID is missing; cannot select this trainer.");
      return;
    }
    if (checked && reservedTrainerIds.has(trainerId)) {
      setNotice(
        "This Master Trainer is already selected in another Bulk Training Request.",
      );
      return;
    }
    state.onToggleTrainer(trainer, checked);
  };
  const handleStaffToggle = (staff, checked) => {
    const staffId = idText(staff?.id);
    if (checked && !staffId) {
      setNotice("Staff ID is missing; cannot select this staff member.");
      return;
    }
    if (checked && reservedStaffIds.has(staffId)) {
      setNotice(
        "This Staff member is already selected in another Bulk Training Request.",
      );
      return;
    }
    state.onToggleStaff(staff, checked);
  };
  // =========================================
  // BUILD PARTICIPANTS PAYLOAD
  // =========================================
  const buildParticipants = () => {
    if (state.form.training_type === "TRAINER") {
      return [...state.selectedTrainersMap.entries()].map(([id, detail]) => ({
        trainer: pk(id),
        full_name: detail?.full_name || detail?.name || "",
        mobile_no: detail?.mobile_no || detail?.mobile || "",
        aadhaar_no: detail?.aadhaar_no || detail?.aadhaar || "",
        district: pk(detail?.empanel_district ?? detail?.district),
        block: pk(detail?.empanel_block ?? detail?.block),
        remarks: "",
      }));
    }
    if (state.form.training_type === "STAFF") {
      return [...state.selectedStaffMap.entries()].map(([id, detail]) => ({
        staff: pk(id),
        full_name: detail?.full_name || detail?.name || "",
        designation:
          typeof detail?.designation === "string"
            ? detail.designation
            : detail?.designation?.name || "",
        theme: pk(detail?.theme),
        district: pk(detail?.district) ?? pk(state.districtId),
        block: pk(detail?.block),
        remarks: "",
      }));
    }
    return state.selectedBeneficiaries.map((person) => {
      const key = `${person.lokos_shg_code}|${person.lokos_member_code}`;
      const saved = state.savedMemberResponses.current.get(key) || {};
      const raw = Array.isArray(saved?.__raw_upsrlm?.data)
        ? saved.__raw_upsrlm.data[0] || {}
        : saved?.__raw_upsrlm || saved;
      const address = Array.isArray(raw?.member_addresses)
        ? raw.member_addresses[0] || {}
        : {};
      const value = (field) => saved[field] ?? person[field] ?? raw[field];
      return {
        lokos_shg_code: person.lokos_shg_code,
        lokos_shg_name: value("lokos_shg_name") || "",
        lokos_member_code: person.lokos_member_code,
        member_name: value("member_name") || value("name") || "",
        age: value("age") ?? null,
        gender: value("gender") || "",
        designation: value("designation") || "",
        pld_status: value("pld_status") || "NO",
        social_category: value("social_category") || "",
        religion: value("religion") || "",
        mobile: value("mobile") || "",
        email: value("email") || "",
        education: value("education") || "",
        address: value("address") || "",
        district: pk(
          person.district_id ??
            raw.district_id ??
            address.district_id ??
            state.districtId,
        ),
        block: pk(
          person.block_id ?? raw.block_id ?? address.block_id ?? state.blockId,
        ),
        panchayat: pk(
          person.panchayat_id ?? raw.panchayat_id ?? address.panchayat_id,
        ),
        village: pk(person.village_id ?? raw.village_id ?? address.village_id),
        remarks: value("remarks") || "",
      };
    });
  };
  // =========================================
  // CLEAR CURRENT PARTICIPANTS
  // =========================================
  const clearParticipants = () => {
    state.setBlockId(null);
    state.setSelectedBlockForShg(null);
    state.setSelectedShgForMembers(null);
    state.setSelectedShgLoading(false);
    state.setSelectedBeneficiaries([]);
    state.setSelectedTrainersMap(new Map());
    state.setSelectedStaffMap(new Map());
    state.savedMemberResponses.current.clear();
    state.savedTrainerResponses.current.clear();
    state.savedStaffResponses.current.clear();
    state.setMemberListReloadToken((value) => value + 1);
  };
  // =========================================
  // RESET FORM FOR NEXT REQUEST
  // =========================================
  const resetCurrent = () => {
    cancelEditing();
    // Preserve the chosen type for subsequent requests.
    const trainingType = lockedTrainingType || state.form.training_type;
    // Financial Year and Plan remain selected.
    state.setForm((previous) => ({
      ...previous,
      training_type: trainingType,
      level: "STATE",
      partner: "",
      notes: "",
    }));
    state.setAutoPartnerAssigned(false);
    state.setDistrictId(null);
    clearParticipants();
    setNotice("");
  };
  // =========================================
  // SAVE CURRENT REQUEST AS DRAFT
  // =========================================
  const saveCurrent = () => {
    if (submitting || checkStatus === "checking") return;
    if (
      !state.form.financial_year ||
      !state.selectedPlan?.id ||
      !state.districtId ||
      !state.form.partner
    ) {
      setNotice(
        "Choose Financial Year, Training Plan, Target District and assigned Training Partner.",
      );
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    if (!selectedCount) {
      setNotice("Select at least one participant before adding the request.");
      return;
    }
    const participants = buildParticipants();
    // Check duplicates before saving the draft.
    if (
      state.form.training_type === "TRAINER" ||
      state.form.training_type === "STAFF"
    ) {
      const isTrainer = state.form.training_type === "TRAINER";
      const reservedIds = isTrainer ? reservedTrainerIds : reservedStaffIds;
      const duplicateId = participants
        .map((person) => idText(isTrainer ? person.trainer : person.staff))
        .find((id) => reservedIds.has(id));
      if (duplicateId) {
        setNotice(
          `${
            isTrainer ? "Master Trainer" : "Staff member"
          } ${duplicateId} is already selected in another Bulk Training Request.`,
        );
        return;
      }
    }
    // Snapshot preserves selections for editing.
    const snapshot = {
      selectedPlan: state.selectedPlan,
      form: { ...state.form },
      districtId: state.districtId,
      blockId: state.blockId,
      selectedBlockForShg: state.selectedBlockForShg,
      selectedBeneficiaries: [...state.selectedBeneficiaries],
      selectedTrainersMap: new Map(state.selectedTrainersMap),
      selectedStaffMap: new Map(state.selectedStaffMap),
      savedMemberResponses: new Map(state.savedMemberResponses.current),
      savedTrainerResponses: new Map(state.savedTrainerResponses.current),
      savedStaffResponses: new Map(state.savedStaffResponses.current),
    };
    const chosenBlockId = pk(state.selectedBlockForShg) ?? pk(state.blockId);
    const chosenBlock = blockList.find(
      (block) => idText(block.block_id ?? block.id) === idText(chosenBlockId),
    );
    const draft = {
      financial_year: state.form.financial_year,
      training_plan: pk(state.selectedPlan.id),
      planTitle: planLabel(state.selectedPlan),
      partner: pk(state.form.partner),
      partnerName:
        partners.find((p) => idText(p.id) === idText(state.form.partner))
          ?.name || "",
      training_type: state.form.training_type,
      level: "STATE",
      notes: state.form.notes || "",
      remarks: state.form.notes || "",
      // Same as existing Single TR.
      created_by: user?.id ?? user?.user_id ?? null,
      district: pk(state.districtId),
      districtName: districtNameFor(state.districtId),
      // Beneficiary requests reserve their selected block.
      block: state.form.training_type === "BENEFICIARY" ? chosenBlockId : null,
      blockName:
        chosenBlock?.block_name_en ||
        chosenBlock?.block_name ||
        chosenBlock?.name ||
        "",
      participants,
      snapshot,
    };
    // Hook validates participant type, district
    // uniqueness and block uniqueness.
    const result = saveDraft(draft);
    if (!result?.ok) {
      setNotice(result?.message || "Unable to add Training Request.");
      return;
    }
    // Only local draft is saved; no creation API call.
    resetCurrent();
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };
  // =========================================
  // EDIT SAVED REQUEST
  // =========================================
  const editDraft = (id) => {
    if (submitting || checkStatus === "checking") return;
    const request = startEditing(id);
    if (!request) return;
    const snapshot = request.snapshot || {};
    state.setSelectedPlan(snapshot.selectedPlan || state.selectedPlan);
    state.setForm({
      ...(snapshot.form || state.form),
      training_type: request.training_type,
      financial_year: request.financial_year,
      partner: String(request.partner ?? ""),
    });
    state.setDistrictId(snapshot.districtId ?? request.district);
    state.setBlockId(snapshot.blockId ?? request.block);
    state.setSelectedBlockForShg(snapshot.selectedBlockForShg || null);
    state.setSelectedShgForMembers(null);
    state.setSelectedBeneficiaries([...(snapshot.selectedBeneficiaries || [])]);
    state.setSelectedTrainersMap(new Map(snapshot.selectedTrainersMap || []));
    state.setSelectedStaffMap(new Map(snapshot.selectedStaffMap || []));
    state.savedMemberResponses.current = new Map(
      snapshot.savedMemberResponses || [],
    );
    state.savedTrainerResponses.current = new Map(
      snapshot.savedTrainerResponses || [],
    );
    state.savedStaffResponses.current = new Map(
      snapshot.savedStaffResponses || [],
    );
    state.setAutoPartnerAssigned(Boolean(request.partner));
    setCheckStatus("idle");
    setConfirmOpen(false);
    setNotice("");
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };
  // =========================================
  // REMOVE A DRAFT
  // =========================================
  const removeRequest = (id) => {
    if (submitting || checkStatus === "checking") return;
    removeDraft(id);
    if (String(id) === String(editingId)) {
      resetCurrent();
    }
  };
  // =========================================
  // REMOVE INDIVIDUAL PARTICIPANT
  // =========================================
  const removeParticipant = (requestId, participantIndex) => {
    if (submitting || editingId !== null || checkStatus === "checking") {
      return;
    }
    const request = requests.find(
      (item) => String(item.id) === String(requestId),
    );
    if (!request) return;
    if (request.participants.length === 1) {
      setNotice(
        "Each request must contain at least one participant. Edit or remove this request instead.",
      );
      return;
    }
    const removed = request.participants[participantIndex];
    if (!removed) return;
    const key = String(participantId(request, removed));
    const snapshot = { ...request.snapshot };
    if (request.training_type === "BENEFICIARY") {
      snapshot.selectedBeneficiaries = (
        snapshot.selectedBeneficiaries || []
      ).filter((item) => String(item.lokos_member_code) !== key);
      snapshot.savedMemberResponses = new Map(
        snapshot.savedMemberResponses || [],
      );
      for (const mapKey of snapshot.savedMemberResponses.keys()) {
        if (String(mapKey).split("|").pop() === key) {
          snapshot.savedMemberResponses.delete(mapKey);
        }
      }
    } else if (request.training_type === "TRAINER") {
      snapshot.selectedTrainersMap = new Map(
        snapshot.selectedTrainersMap || [],
      );
      snapshot.savedTrainerResponses = new Map(
        snapshot.savedTrainerResponses || [],
      );
      for (const mapKey of snapshot.selectedTrainersMap.keys()) {
        if (String(mapKey) === key) {
          snapshot.selectedTrainersMap.delete(mapKey);
        }
      }
      for (const mapKey of snapshot.savedTrainerResponses.keys()) {
        if (String(mapKey) === key) {
          snapshot.savedTrainerResponses.delete(mapKey);
        }
      }
    } else {
      snapshot.selectedStaffMap = new Map(snapshot.selectedStaffMap || []);
      snapshot.savedStaffResponses = new Map(
        snapshot.savedStaffResponses || [],
      );
      for (const mapKey of snapshot.selectedStaffMap.keys()) {
        if (String(mapKey) === key) {
          snapshot.selectedStaffMap.delete(mapKey);
        }
      }
      for (const mapKey of snapshot.savedStaffResponses.keys()) {
        if (String(mapKey) === key) {
          snapshot.savedStaffResponses.delete(mapKey);
        }
      }
    }
    const result = updateDraft(requestId, {
      participants: request.participants.filter(
        (_, index) => index !== participantIndex,
      ),
      snapshot,
    });
    if (!result?.ok) {
      setNotice(result?.message || "Unable to remove participant.");
    }
  };
  // =========================================
  // TOTALS BY PARTICIPANT TYPE
  // =========================================
  const totalByType = useMemo(() => {
    const totals = {
      BENEFICIARY: 0,
      TRAINER: 0,
      STAFF: 0,
    };
    requests.forEach((request) => {
      totals[request.training_type] =
        (totals[request.training_type] || 0) + request.participants.length;
    });
    return totals;
  }, [requests]);
  // =========================================
  // CHECK AVAILABILITY
  // =========================================
  const checkAvailability = async () => {
    if (editingId !== null) {
      setNotice("Save or cancel the request you are editing first.");
      return;
    }
    if (requests.length < 2) {
      setNotice(
        requests.length === 0
          ? "Add at least two Training Requests before checking availability."
          : "Only one Training Request was added. Please use Create Single Training Request for one request. Bulk submission requires at least two requests.",
      );
      return;
    }
    setNotice("");
    setConflicts([]);
    setCheckStatus("checking");
    try {
      const seen = new Set();
      const localConflicts = [];
      // Detect duplicates within the unsent bulk list.
      requests.forEach((request, index) => {
        request.participants.forEach((person) => {
          const id = String(participantId(request, person) ?? "").trim();
          if (!id) {
            localConflicts.push(
              `Request ${index + 1}: participant ID is missing.`,
            );
            return;
          }
          const key = `${request.training_type}:${id}`;
          if (seen.has(key)) {
            localConflicts.push(
              `Request ${index + 1}: participant ${id} is repeated in this bulk list.`,
            );
          }
          seen.add(key);
        });
        const validation = validateDraft(request, request.id);
        if (!validation.ok) {
          localConflicts.push(`Request ${index + 1}: ${validation.message}`);
        }
      });
      if (localConflicts.length > 0) {
        setConflicts(localConflicts);
        setCheckStatus("conflicts");
        return;
      }
      const backendConflicts = [];
      // Existing Single TR engagement API,
      // called for each saved bulk draft.
      for (let index = 0; index < requests.length; index += 1) {
        const request = requests[index];
        const ids = request.participants.map((person) =>
          String(participantId(request, person)),
        );
        const response = await api.post("/tms/check-training-engagement/", {
          participant_type: request.training_type,
          financial_year: request.financial_year,
          training_plan_id: request.training_plan,
          ids,
        });
        const engagedIds = response?.data?.engaged_ids;
        if (!Array.isArray(engagedIds)) {
          throw new Error(
            `Unexpected engagement-check response for Request ${index + 1}.`,
          );
        }
        engagedIds.forEach((id) => {
          backendConflicts.push(
            `Request ${index + 1} (${request.districtName || request.district}): participant ${id} is already engaged.`,
          );
        });
      }
      if (backendConflicts.length > 0) {
        setConflicts(backendConflicts);
        setCheckStatus("conflicts");
        return;
      }
      setCheckStatus("clear");
      setConfirmOpen(true);
    } catch (error) {
      console.error("Bulk engagement check failed", error);
      setNotice(
        error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error.message ||
          "Engagement check failed. Please try again.",
      );
      setCheckStatus("error");
    }
  };
  // =========================================
  // FINAL BULK API SUBMISSION
  // =========================================
  const submitBulk = async () => {
    if (
      submitting ||
      checkStatus !== "clear" ||
      editingId !== null ||
      requests.length < 2
    ) {
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      const creator = user?.id ?? user?.user_id ?? null;
      if (creator == null) {
        throw new Error("Creator ID is missing. Please log in again.");
      }
      // Same one-shot request format as Single TR,
      // wrapped in training_requests for Bulk TR.
      const training_requests = requests.map((request) => ({
        financial_year: request.financial_year,
        training_plan: request.training_plan,
        partner: request.partner,
        training_type: request.training_type,
        level: "STATE",
        status: "BATCHING",
        district: request.district,
        block: request.block ?? null,
        remarks: request.remarks || request.notes || "",
        // Same created_by logic as Single TR.
        created_by: creator,
        participants: request.participants,
      }));
      const response = await api.post("/tms/tr-bulk/create-oneshot/", {
        training_requests,
      });
      // Keep the submission snapshot before clearing local drafts.
      const responseData = response?.data ?? {};
      if (responseData.success === false) {
        throw new Error(
          responseData.message || "Bulk Training Request submission failed.",
        );
      }
      const results = Array.isArray(responseData.results)
        ? responseData.results
        : Array.isArray(responseData.data?.results)
          ? responseData.data.results
          : [];
      setSubmissionResult({
        responseData,
        results,
        financialYear: bulkSummary.financialYear || requests[0]?.financial_year,
        trainingPlan: bulkSummary.planTitle || requests[0]?.planTitle,
        participantType:
          bulkSummary.participantType || requests[0]?.training_type,
        totalRequests: requests.length,
        totalParticipants: requests.reduce(
          (sum, request) => sum + (request.participants?.length || 0),
          0,
        ),
        submittedRequests: requests.map((request, index) => ({
          index: index + 1,
          district: request.districtName || districtNameFor(request.district),
          block:
            request.blockName || (request.block ? String(request.block) : "—"),
          trainingType: request.training_type,
          totalParticipants: request.participants?.length || 0,
        })),
      });
      setConfirmOpen(false);
      clearDrafts();
      // Reset the whole batch after successful submission.
      state.setSelectedPlan(null);
      state.setSelectedTheme(null);
      state.setForm({
        financial_year: "",
        training_type: "BENEFICIARY",
        level: "STATE",
        partner: "",
        notes: "",
      });
      state.setAutoPartnerAssigned(false);
      state.setDistrictId(null);
      clearParticipants();
    } catch (error) {
      console.error("Bulk creation failed", error);
      const data = error?.response?.data;
      setNotice(
        data?.detail ||
          data?.error ||
          (data ? JSON.stringify(data) : error.message) ||
          "Failed to submit Bulk Training Requests.",
      );
      setConfirmOpen(false);
      setCheckStatus("idle");
      // Keep all drafts on failure.
    } finally {
      setSubmitting(false);
    }
  };
  const summaryDistricts = bulkSummary.districts || [];
  const currentPartnerName = partners.find(
    (partner) => idText(partner.id) === idText(state.form.partner),
  )?.name;
  // =========================================
  // RENDER
  // =========================================
  return (
    <div className="bulk-tr-shell">
      <Header />
      <div className="content-area bulk-tr-body">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((value) => !value)}
        />
        <div className="main-area bulk-tr-main">
          <main className="bulk-page">
            <h2>Create Bulk Training Request</h2>
            <p className="bulk-intro">
              Add requests for different districts or blocks, verify all
              participants together, and submit once.
            </p>
            <div className="bulk-layout">
              <div className="bulk-main-column">
                {/* EDIT MODE */}
                {editingId !== null && (
                  <div className="bulk-edit-notice">
                    <span>
                      Editing a saved request. Update its selection, then click{" "}
                      <b>Save Changes</b>.
                    </span>
                    <button
                      type="button"
                      className="bulk-secondary-btn"
                      onClick={resetCurrent}
                    >
                      Cancel Edit
                    </button>
                  </div>
                )}
                {/* SECTION 1 */}
                <section ref={formRef} className="bulk-card bulk-scroll-target">
                  <h3 className="bulk-section-title">
                    <span className="bulk-number">1</span>
                    Add Training Request
                  </h3>
                  <BulkStep1PlanSelection
                    selectedPlan={state.selectedPlan}
                    setSelectedPlan={state.setSelectedPlan}
                    setSelectedTheme={state.setSelectedTheme}
                    setAutoPartnerAssigned={state.setAutoPartnerAssigned}
                    form={state.form}
                    setForm={state.setForm}
                    districtId={state.districtId}
                    setDistrictId={state.setDistrictId}
                    districts={districts}
                    user={user}
                    preloadThemes={themes}
                    partners={partners}
                    onPlanChanged={clearParticipants}
                    onDistrictChanged={clearParticipants}
                    // New bulk restrictions
                    lockedTrainingType={lockedTrainingType}
                    lockedFinancialYear={lockedFinancialYear}
                    lockedTrainingPlan={lockedTrainingPlan}
                    isDistrictReserved={isDistrictReserved}
                  />
                  <div className="bulk-participant-panel">
                    <BulkStep2Participants
                      form={state.form}
                      setForm={state.setForm}
                      user={user}
                      districtId={state.districtId}
                      blockId={state.blockId}
                      setBlockId={state.setBlockId}
                      blockList={blockList}
                      blockLoading={blockLoading}
                      selectedBlockForShg={state.selectedBlockForShg}
                      setSelectedBlockForShg={state.setSelectedBlockForShg}
                      selectedShgForMembers={state.selectedShgForMembers}
                      setSelectedShgForMembers={state.setSelectedShgForMembers}
                      selectedShgLoading={state.selectedShgLoading}
                      setSelectedShgLoading={state.setSelectedShgLoading}
                      memberListReloadToken={state.memberListReloadToken}
                      setMemberListReloadToken={state.setMemberListReloadToken}
                      selectedMemberCodesSet={state.selectedMemberCodesSet}
                      selectedBeneficiaries={state.selectedBeneficiaries}
                      addSelectedMember={state.addSelectedMember}
                      removeSelectedBeneficiary={
                        state.removeSelectedBeneficiary
                      }
                      fetchMemberDetailBestEffort={async (member) => {
                        const code =
                          member?.member_code ||
                          member?.lokos_member_code ||
                          member?.memberCode;
                        if (!code) return member;
                        try {
                          const response =
                            await LOOKUP_API.beneficiaryDetail(code);
                          const data = response?.data ?? response;
                          return data && typeof data === "object"
                            ? data
                            : member;
                        } catch {
                          return member;
                        }
                      }}
                      preloadedTrainers={trainers}
                      preloadReloadToken={trainersReloadToken}
                      fetchMasterTrainersByDistrict={
                        fetchMasterTrainersByDistrict
                      }
                      selectedTrainerIds={state.selectedTrainerIds}
                      onToggleTrainer={handleTrainerToggle}
                      onToggleStaff={handleStaffToggle}
                      selectedStaffIds={state.selectedStaffIds}
                      reservedTrainerIds={reservedTrainerIds}
                      reservedStaffIds={reservedStaffIds}
                      // New bulk restrictions
                      lockedTrainingType={lockedTrainingType}
                      isBlockReserved={isBlockReserved}
                    />
                  </div>
                  <div className="bulk-participant-actions">
                    <button
                      type="button"
                      className="bulk-primary-btn"
                      disabled={submitting || checkStatus === "checking"}
                      onClick={saveCurrent}
                    >
                      {editingId !== null
                        ? "Save Changes"
                        : "+ Add to Bulk Request List"}
                    </button>
                  </div>
                </section>
                {/* SECTION 2 */}
                <div ref={listRef} className="bulk-scroll-target">
                  <BulkRequestList
                    requests={requests}
                    onEdit={editDraft}
                    onRemove={removeRequest}
                    onRemoveParticipant={removeParticipant}
                    onAddAnother={() => {
                      resetCurrent();
                      requestAnimationFrame(() => {
                        formRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      });
                    }}
                  />
                </div>
                {/* SECTION 3 */}
                <section className="bulk-card">
                  <h3 className="bulk-section-title">
                    <span className="bulk-number">3</span>
                    Review &amp; Submit
                  </h3>
                  <p className="bulk-muted">
                    Availability is checked only after you have added all
                    requests. A bulk submission requires at least two requests.
                  </p>
                  <div className="bulk-review-actions">
                    <div>
                      <strong>
                        {requests.length} request(s),{" "}
                        {bulkSummary.totalParticipants} participant(s)
                      </strong>
                      <p className="bulk-muted">
                        Check duplicate participants and existing training
                        engagement before sending one final bulk request.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="bulk-primary-btn"
                      disabled={
                        submitting ||
                        checkStatus === "checking" ||
                        editingId !== null
                      }
                      onClick={checkAvailability}
                    >
                      {checkStatus === "checking"
                        ? "Checking availability..."
                        : "Preview & Check Availability"}
                    </button>
                  </div>
                  {checkStatus === "clear" && (
                    <p className="bulk-check-clear">
                      ✓ All participants passed the availability checks.
                    </p>
                  )}
                  {conflicts.length > 0 && (
                    <div className="bulk-check-conflicts" role="alert">
                      <strong>Availability conflicts:</strong>
                      <ul>
                        {conflicts.map((item, index) => (
                          <li key={`${index}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>
              {/* =====================================
                  SUMMARY SIDEBAR
              ===================================== */}
              <aside className="bulk-sidebar">
                <section className="bulk-side-card">
                  <h3>Current Request Details</h3>
                  <dl>
                    <dt>Financial Year</dt>
                    <dd>{state.form.financial_year || "—"}</dd>
                    <dt>Training Plan</dt>
                    <dd>
                      {state.selectedPlan ? planLabel(state.selectedPlan) : "—"}
                    </dd>
                    <dt>Participant Type</dt>
                    <dd>{typeLabel(state.form.training_type)}</dd>
                    <dt>Level</dt>
                    <dd>STATE</dd>
                    <dt>Target District</dt>
                    <dd>{districtNameFor(state.districtId)}</dd>
                    <dt>Training Partner</dt>
                    <dd>{currentPartnerName || state.form.partner || "—"}</dd>
                    <dt>Participants</dt>
                    <dd>{selectedCount}</dd>
                  </dl>
                </section>
                {/* ENHANCED BULK SUMMARY */}
                <section className="bulk-side-card">
                  <h3>Bulk Request Summary</h3>
                  <dl>
                    <dt>Financial Year</dt>
                    <dd>
                      {bulkSummary.financialYear ||
                        state.form.financial_year ||
                        "—"}
                    </dd>
                    <dt>Training Plan</dt>
                    <dd>
                      {bulkSummary.planTitle ||
                        (state.selectedPlan
                          ? planLabel(state.selectedPlan)
                          : "—")}
                    </dd>
                    <dt>Participant Type</dt>
                    <dd>
                      {typeLabel(
                        bulkSummary.participantType || state.form.training_type,
                      )}
                    </dd>
                    <dt>Total Requests</dt>
                    <dd>
                      <b>{bulkSummary.totalRequests}</b>
                    </dd>
                    <dt>Total Participants</dt>
                    <dd>
                      <b>{bulkSummary.totalParticipants}</b>
                    </dd>
                  </dl>
                  <h4 className="bulk-side-subheading">
                    Selected Districts &amp; Blocks
                  </h4>
                  {summaryDistricts.length === 0 ? (
                    <p className="bulk-muted">No districts added yet.</p>
                  ) : (
                    <div className="bulk-district-summary">
                      {summaryDistricts.map((district) => (
                        <div key={district.id} className="bulk-district-item">
                          <strong>{district.name}</strong>
                          <small>{district.requestCount} request(s)</small>
                          {district.blocks?.length > 0 && (
                            <div className="bulk-block-tags">
                              {district.blocks.map((block) => (
                                <span key={block.id}>{block.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bulk-type-totals">
                    <small>Beneficiaries: {totalByType.BENEFICIARY}</small>
                    <small>Master Trainers: {totalByType.TRAINER}</small>
                    <small>Staff: {totalByType.STAFF}</small>
                  </div>
                  <p className="bulk-muted">
                    Saved requests remain local drafts until confirmed and
                    submitted.
                  </p>
                </section>
              </aside>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      {/* Fixed viewport notification: always visible, even after scrolling. */}
      {notice &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="bulk-visible-notice"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span className="bulk-visible-notice-icon" aria-hidden="true">
              !
            </span>
            <div className="bulk-visible-notice-message">{notice}</div>
            <button
              type="button"
              className="bulk-visible-notice-close"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>,
          document.body,
        )}
      {/* SUCCESS MODAL: full details from the submitted batch */}
      {submissionResult && (
        <div className="bulk-modal-backdrop">
          <div
            className="bulk-modal bulk-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-success-title"
          >
            <div className="bulk-success-modal-top">
              <div className="bulk-success-check" aria-hidden="true">
                ✓
              </div>
              <h2 id="bulk-success-title">
                Bulk Training Requests Created Successfully!
              </h2>
              <p>
                {submissionResult.responseData?.message ||
                  "Your training requests were created successfully."}
              </p>
            </div>
            <div className="bulk-success-stats">
              <div className="bulk-success-stat">
                <span>Requests Submitted</span>
                <strong>{submissionResult.totalRequests}</strong>
              </div>
              <div className="bulk-success-stat">
                <span>Total Participants</span>
                <strong>{submissionResult.totalParticipants}</strong>
              </div>
              {submissionResult.responseData?.total_requests_created !=
                null && (
                <div className="bulk-success-stat">
                  <span>Requests Created</span>
                  <strong>
                    {submissionResult.responseData.total_requests_created}
                  </strong>
                </div>
              )}
            </div>
            <div className="bulk-success-meta">
              <div>
                <b>Financial Year:</b> {submissionResult.financialYear || "—"}
              </div>
              <div>
                <b>Training Plan:</b> {submissionResult.trainingPlan || "—"}
              </div>
              <div>
                <b>Participant Type:</b>{" "}
                {typeLabel(submissionResult.participantType)}
              </div>
              <div>
                <b>Training Level:</b> STATE
              </div>
            </div>
            <h3>Submitted Request Details</h3>
            <div className="bulk-table-scroll">
              <table className="bulk-requests-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>District</th>
                    <th>Block</th>
                    <th>Participant Type</th>
                    <th>Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionResult.submittedRequests.map((request) => (
                    <tr key={request.index}>
                      <td>{request.index}</td>
                      <td>{request.district}</td>
                      <td>{request.block || "—"}</td>
                      <td>{typeLabel(request.trainingType)}</td>
                      <td>{request.totalParticipants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {submissionResult.results.length > 0 && (
              <>
                <h3>Created Training Request IDs</h3>
                <div className="bulk-table-scroll">
                  <table className="bulk-requests-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>TH URID / Request ID</th>
                        <th>Participant Type</th>
                        <th>Participants Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionResult.results.map((result, index) => (
                        <tr
                          key={`${result.training_request_id ?? index}-${index}`}
                        >
                          <td>{index + 1}</td>
                          <td>
                            {result.TH_urid ||
                              result.training_request_id ||
                              "—"}
                          </td>
                          <td>
                            {typeLabel(
                              result.training_type ||
                                submissionResult.submittedRequests[index]
                                  ?.trainingType,
                            )}
                          </td>
                          <td>{result.participants_created ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <div className="bulk-modal-actions">
              <button
                type="button"
                className="bulk-primary-btn"
                onClick={() => setSubmissionResult(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FINAL CONFIRMATION */}
      {confirmOpen && (
        <div className="bulk-modal-backdrop" role="presentation">
          <div
            className="bulk-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm Bulk Training Requests"
          >
            <h3>Confirm Bulk Training Request Submission</h3>
            <p>
              Availability checks passed for <b>{requests.length} requests</b>{" "}
              containing <b>{bulkSummary.totalParticipants} participants</b>.
            </p>
            <p>
              All requests will be created in one transaction. Do you want to
              continue?
            </p>
            <div className="bulk-modal-actions">
              <button
                type="button"
                className="bulk-secondary-btn"
                disabled={submitting}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bulk-primary-btn"
                disabled={submitting}
                onClick={submitBulk}
              >
                {submitting ? "Submitting..." : "Confirm & Submit All"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .bulk-tr-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .bulk-tr-body {
          display: flex;
          flex: 1;
          min-width: 0;
        }
        .bulk-tr-main {
          flex: 1;
          min-width: 0;
        }
        .bulk-page {
          padding: 20px;
          background: #f6f9fd;
          min-height: 100vh;
          color: #0f2b51;
        }
        .bulk-page * {
          box-sizing: border-box;
        }
        .bulk-page > h2 {
          font-size: 24px;
          margin: 0 0 6px;
          color: #0b2850;
        }
        .bulk-intro {
          margin: 0 0 18px;
          color: #66788d;
          font-size: 13px;
        }
        .bulk-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 265px;
          gap: 14px;
          align-items: start;
        }
        .bulk-main-column,
        .bulk-sidebar {
          display: grid;
          gap: 14px;
          min-width: 0;
        }
        .bulk-scroll-target {
          scroll-margin-top: 18px;
          min-width: 0;
        }
        .bulk-card,
        .bulk-side-card {
          background: white;
          border: 1px solid #d8e5f2;
          border-radius: 9px;
          padding: 16px;
          box-shadow: 0 2px 9px rgba(20,64,108,.05);
          min-width: 0;
        }
        .bulk-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: #0c2b5a;
          font-weight: 750;
          margin: 0 0 14px;
        }
        .bulk-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          background: #1169bb;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 14px;
        }
        .bulk-participant-panel {
          border-top: 1px solid #e5edf7;
          margin-top: 15px;
          padding-top: 13px;
        }
        .bulk-participant-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }
        .bulk-primary-btn,
        .bulk-secondary-btn {
          border-radius: 6px;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 650;
          font-size: 12px;
        }
        .bulk-primary-btn {
          border: 1px solid #126ab7;
          background: #126ab7;
          color: white;
        }
        .bulk-secondary-btn {
          border: 1px solid #bed1e6;
          background: white;
          color: #174b7d;
        }
        .bulk-primary-btn:disabled,
        .bulk-secondary-btn:disabled {
          opacity: .5;
          cursor: not-allowed;
        }
        .bulk-plan-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }
        .bulk-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 12px;
          font-weight: 650;
          min-width: 0;
        }
        .bulk-field b {
          color: #dc2626;
        }
        .bulk-field select,
        .bulk-field input {
          font: inherit;
          font-weight: 400;
          font-size: 12px;
          width: 100%;
          min-width: 0;
          border-radius: 5px;
          border: 1px solid #c9d8e8;
          background: white;
          color: #153358;
          height: 36px;
          padding: 6px 9px;
        }
        .bulk-field input[readonly],
        .bulk-field select:disabled {
          background: #f3f6fa;
        }
        .bulk-plan-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 13px;
          background: #edf6ff;
          padding: 12px;
          border-radius: 7px;
        }
        .bulk-plan-symbol {
          border-radius: 7px;
          padding: 10px;
          font-size: 24px;
          background: #d9ebfd;
          color: #1264b0;
        }
        .bulk-plan-description {
          min-width: 0;
          flex: 1;
          font-size: 12px;
        }
        .bulk-plan-description > p {
          margin: 4px 0 10px;
          color: #50647d;
        }
        .bulk-plan-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 11px;
        }
        .bulk-partner-pill {
          background: #eaf9ee;
          color: #147039;
          font-size: 11px;
          padding: 8px;
          border-radius: 6px;
        }
        .bulk-muted {
          color: #66788d;
          font-size: 12px;
          margin: 6px 0;
        }
        .bulk-warning {
          color: #b42318;
          font-size: 12px;
        }
        .bulk-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .bulk-empty {
          border: 1px dashed #bbd0e5;
          padding: 15px;
          border-radius: 7px;
          color: #6b7c91;
          font-size: 12px;
        }
        .bulk-table-scroll {
          width: 100%;
          overflow-x: auto;
        }
        .bulk-requests-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          min-width: 650px;
        }
        .bulk-requests-table th,
        .bulk-requests-table td {
          border: 1px solid #e2e9f1;
          padding: 9px 7px;
          text-align: left;
        }
        .bulk-requests-table th {
          background: #eef4fa;
          color: #2a4665;
          font-weight: 700;
        }
        .bulk-requests-table tbody tr:nth-child(even) {
          background: #f8fbff;
        }
        .bulk-row-actions {
          white-space: nowrap;
        }
        .bulk-row-actions button {
          background: transparent;
          border: 0;
          color: #1169bb;
          cursor: pointer;
          font-size: 11px;
        }
        .bulk-row-actions button.remove {
          color: #d03838;
        }
        .bulk-list-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }
        .bulk-side-card h3 {
          margin: 0 0 13px;
          border-bottom: 1px solid #e2e9f1;
          padding-bottom: 11px;
          font-size: 14px;
          color: #0c2b5a;
        }
        .bulk-side-card dl {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 10px 8px;
          margin: 0;
          font-size: 11px;
        }
        .bulk-side-card dt {
          color: #63758b;
        }
        .bulk-side-card dd {
          color: #153358;
          font-weight: 650;
          margin: 0;
          overflow-wrap: anywhere;
        }
        .bulk-side-subheading {
          font-size: 12px;
          margin: 16px 0 8px;
        }
        .bulk-district-summary {
          display: grid;
          gap: 8px;
        }
        .bulk-district-item {
          background: #f2f7fe;
          border: 1px solid #e1eaf7;
          border-radius: 7px;
          padding: 9px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
        }
        .bulk-district-item small {
          color: #64748b;
        }
        .bulk-block-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .bulk-block-tags span {
          padding: 4px 6px;
          border-radius: 5px;
          background: #e1efff;
          color: #174b7d;
          font-size: 10px;
        }
        .bulk-type-totals {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 14px;
          color: #64748b;
        }
        .bulk-review-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 12px;
          font-size: 12px;
        }
        .bulk-edit-notice {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 11px;
          background: #fff8e6;
          border: 1px solid #f2d48c;
          border-radius: 8px;
          font-size: 12px;
        }
        .bulk-notice,
        .bulk-check-conflicts {
          background: #fff8e6;
          border: 1px solid #f2d48c;
          color: #81470b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 14px;
          font-size: 12px;
        }
        .bulk-notice {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .bulk-notice button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 20px;
        }
        .bulk-check-clear,
        .bulk-success {
          background: #edfbf2;
          color: #116a36;
          padding: 12px;
          border: 1px solid #b9e8ca;
          border-radius: 8px;
          font-size: 12px;
        }
        .bulk-success {
          margin-bottom: 16px;
        }
        .bulk-success h3 {
          margin-top: 0;
        }
        .bulk-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(7, 19, 38, .58);
          z-index: 99999;
          display: grid;
          place-items: center;
          padding: 16px;
        }
        .bulk-modal {
          width: min(480px, 100%);
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 70px #0003;
        }
        .bulk-modal h3 {
          margin-top: 0;
        }
        .bulk-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
        }
        .bulk-visible-notice {
          box-sizing: border-box;
          position: fixed;
          right: max(18px, env(safe-area-inset-right));
          bottom: max(22px, env(safe-area-inset-bottom));
          z-index: 2147483000;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: min(480px, calc(100vw - 32px));
          padding: 14px 14px 14px 12px;
          border: 1px solid #e4a65a;
          border-left: 5px solid #cf7c15;
          border-radius: 12px;
          background: #fffaf0;
          color: #713f12;
          box-shadow: 0 18px 40px rgba(34, 41, 54, 0.28);
          font-size: 14px;
          line-height: 1.45;
        }
        .bulk-visible-notice-icon {
          flex: 0 0 24px;
          display: grid;
          place-items: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          color: #fff;
          font-weight: 800;
        }
        .bulk-visible-notice-message {
          flex: 1;
          min-width: 0;
          overflow-wrap: anywhere;
          font-weight: 600;
        }
        .bulk-visible-notice-close {
          flex: 0 0 28px;
          height: 28px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #713f12;
          cursor: pointer;
          font-size: 21px;
          line-height: 22px;
        }
        .bulk-visible-notice-close:hover {
          background: #fde9cb;
        }
        @media (max-width: 600px) {
          .bulk-visible-notice {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: max(12px, env(safe-area-inset-bottom));
          }
        }
        .bulk-success-modal {
          width: min(780px, 96vw);
          max-height: 90vh;
          overflow-y: auto;
        }
        .bulk-success-modal-top {
          text-align: center;
          padding: 0 0 12px;
        }
        .bulk-success-modal-top h2 {
          font-size: 19px;
          margin: 8px 0;
          color: #166534;
        }
        .bulk-success-modal-top p {
          color: #64748b;
          font-size: 13px;
        }
        .bulk-success-check {
          width: 52px;
          height: 52px;
          line-height: 52px;
          font-size: 30px;
          border-radius: 50%;
          margin: 0 auto;
          background: #dcfce7;
          color: #15803d;
          font-weight: 700;
        }
        .bulk-success-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          margin: 14px 0;
        }
        .bulk-success-stat {
          background: #eff6ff;
          border: 1px solid #d5e7fa;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border-radius: 9px;
        }
        .bulk-success-stat span {
          font-size: 11px;
          color: #64748b;
        }
        .bulk-success-stat strong {
          font-size: 23px;
          color: #164c88;
        }
        .bulk-success-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 12px;
        }
        .bulk-success-modal h3 {
          margin: 18px 0 10px;
          font-size: 14px;
        }
        @media (max-width: 600px) {
          .bulk-success-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
