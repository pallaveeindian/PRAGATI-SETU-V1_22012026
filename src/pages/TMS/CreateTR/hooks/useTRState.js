// src/pages/TMS/CreateTR/hooks/useTRState.js
import { useState, useMemo, useRef, useCallback } from "react";
import { TMS_API } from "../../../../api/axios";

export function useTRState(initialGeoscope = null) {
  // Stepper State
  const [step, setStep] = useState(1); // 1 plan, 2 participants, 3 review
  const [participantSubStep, setParticipantSubStep] = useState(0); // 0 = Block, 1 = SHG list, 2 = Members

  // Geographic State
  const [blockId, setBlockId] = useState(
    initialGeoscope?.blocks?.[0] ?? initialGeoscope?.block_id ?? null,
  );
  const [districtId, setDistrictId] = useState(
    initialGeoscope?.districts?.[0] ?? initialGeoscope?.district_id ?? null,
  );

  // Form & Plan State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [autoPartnerAssigned, setAutoPartnerAssigned] = useState(false);
  const [form, setForm] = useState({
    training_type: "BENEFICIARY",
    level: "BLOCK",
    partner: "",
    notes: "",
    financial_year: "",
  });

  // Beneficiary (SHG) Selection State
  const [selectedBlockForShg, setSelectedBlockForShg] = useState(null);
  const [selectedShgForMembers, setSelectedShgForMembers] = useState(null);
  const [selectedShgLoading, setSelectedShgLoading] = useState(false);
  const [memberListReloadToken, setMemberListReloadToken] = useState(0);

  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);
  const savedMemberResponses = useRef(new Map());

  // Trainer Selection State
  const [selectedTrainersMap, setSelectedTrainersMap] = useState(new Map());
  const savedTrainerResponses = useRef(new Map());

  // Modal & Submission State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSummary, setSubmitSummary] = useState(null);

  // Engagement Verification State
  const [engagementStatus, setEngagementStatus] = useState("idle"); // 'idle', 'checking', 'all_clear', 'has_engaged'
  const [engagedParticipants, setEngagedParticipants] = useState([]);

  // --- Derived State (Memos) ---
  const selectedMemberCodesSet = useMemo(() => {
    return new Set(
      selectedBeneficiaries.map((b) => String(b.lokos_member_code)),
    );
  }, [selectedBeneficiaries]);

  const selectedTrainerIds = useMemo(() => {
    return new Set(Array.from(selectedTrainersMap.keys()));
  }, [selectedTrainersMap]);

  const selectedTrainerList = useMemo(() => {
    return Array.from(selectedTrainersMap.values());
  }, [selectedTrainersMap]);

  // --- Stepper Navigation ---
  const goToNext = () => setStep((s) => Math.min(3, s + 1));
  const goToPrev = () => setStep((s) => Math.max(1, s - 1));
  const jumpToStep = (n) => setStep(n);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // --- Beneficiary Handlers ---
  const addSelectedMember = useCallback((memberObj) => {
    const lokos_shg_code =
      memberObj.shg_code ||
      memberObj.lokos_shg_code ||
      memberObj.shgCode ||
      (memberObj.shg && (memberObj.shg.shg_code || memberObj.shg.code));

    const lokos_member_code =
      memberObj.member_code ||
      memberObj.lokos_member_code ||
      memberObj.memberCode ||
      memberObj.id;

    const key = `${lokos_shg_code}|${lokos_member_code}`;
    savedMemberResponses.current.set(key, memberObj);

    setSelectedBeneficiaries((prev) => {
      const exists = prev.some(
        (p) =>
          String(p.lokos_member_code) === String(lokos_member_code) &&
          String(p.lokos_shg_code) === String(lokos_shg_code),
      );
      if (exists) return prev;

      // 1. Safe fallback to raw API data if mapper missed it
      const raw = memberObj.__raw_upsrlm || memberObj;
      const rawAddr =
        Array.isArray(raw.member_addresses) && raw.member_addresses.length > 0
          ? raw.member_addresses[0]
          : {};

      // 2. Robust Age Calculation
      let safeAge = memberObj.age ?? raw.age ?? raw.dob_age ?? null;
      if (!safeAge && raw.dob) {
        const d = new Date(raw.dob);
        if (!Number.isNaN(d.getTime())) {
          const today = new Date();
          safeAge = today.getFullYear() - d.getFullYear();
          const m = today.getMonth() - d.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
            safeAge--;
          }
        }
      }

      // 3. Robust PLD Status Calculation (Handles booleans, strings, and 0/1)
      let rawPld =
        memberObj.pld_status ?? raw.pld_status ?? raw.pldStatus ?? "";
      let safePld = "";
      if (
        rawPld === true ||
        String(rawPld).toLowerCase() === "true" ||
        String(rawPld) === "1"
      ) {
        safePld = "YES";
      } else if (
        rawPld === false ||
        String(rawPld).toLowerCase() === "false" ||
        String(rawPld) === "0"
      ) {
        safePld = "NO";
      } else {
        safePld = rawPld ? String(rawPld).toUpperCase() : "NO";
      }

      // 4. Normalized Object for Step 3
      const normalized = {
        lokos_shg_code,
        lokos_member_code,
        member_name:
          memberObj.member_name || memberObj.name || raw.member_name || "",
        age: safeAge,
        gender: memberObj.gender || raw.gender || "",
        pld_status: safePld,
        mobile:
          (memberObj.member_phones && memberObj.member_phones[0]?.phone_no) ||
          memberObj.mobile ||
          memberObj.phone_no ||
          raw.phone_no ||
          "",
        address: memberObj.address || raw.address || "",
        social_category:
          memberObj.social_category ||
          memberObj.socialCategory ||
          raw.social_category ||
          "",
        religion: memberObj.religion || raw.religion || "",
        district_id:
          memberObj.district_id ??
          memberObj.districtId ??
          raw.district_id ??
          rawAddr.district_id ??
          null,
        block_id:
          memberObj.block_id ??
          memberObj.blockId ??
          raw.block_id ??
          rawAddr.block_id ??
          null,
        panchayat_id:
          memberObj.panchayat_id ??
          memberObj.panchayatId ??
          raw.panchayat_id ??
          rawAddr.panchayat_id ??
          null,
        village_id:
          memberObj.village_id ??
          memberObj.villageId ??
          raw.village_id ??
          rawAddr.village_id ??
          null,
        designation: memberObj.designation || raw.designation || "",
        education: memberObj.education || raw.education || "",
        email: memberObj.email || raw.email || "",
      };
      return [...prev, normalized];
    });
  }, []);

  const removeSelectedBeneficiary = useCallback(
    (lokos_member_code, lokos_shg_code) => {
      const mcode = lokos_member_code ?? "";
      const scode = lokos_shg_code ?? "";

      setSelectedBeneficiaries((prev) =>
        prev.filter(
          (b) =>
            !(
              String(b.lokos_member_code) === String(mcode) &&
              String(b.lokos_shg_code) === String(scode)
            ),
        ),
      );
      try {
        const key = `${scode}|${mcode}`;
        savedMemberResponses.current.delete(key);
      } catch (e) {
        // ignore
      }
    },
    [],
  );

  // --- Trainer Handlers ---
  const onToggleTrainer = useCallback(async (trainerObj, add) => {
    const id = trainerObj.id;
    if (add) {
      if (!savedTrainerResponses.current.has(id)) {
        try {
          const resp = await TMS_API.masterTrainers.retrieve(id);
          const payload = resp?.data ?? resp ?? trainerObj;
          savedTrainerResponses.current.set(id, payload);
        } catch (e) {
          savedTrainerResponses.current.set(id, trainerObj);
        }
      }
      setSelectedTrainersMap((m) => {
        const copy = new Map(m);
        copy.set(id, savedTrainerResponses.current.get(id));
        return copy;
      });
    } else {
      setSelectedTrainersMap((m) => {
        const copy = new Map(m);
        copy.delete(id);
        return copy;
      });
    }
  }, []);

  const removeSelectedTrainer = useCallback((id) => {
    setSelectedTrainersMap((m) => {
      const copy = new Map(m);
      copy.delete(id);
      return copy;
    });
  }, []);

  const removeIneligibleParticipants = useCallback(() => {
    if (form.training_type === "BENEFICIARY") {
      const engagedSet = new Set(
        engagedParticipants.map((b) => b.lokos_member_code),
      );
      setSelectedBeneficiaries((prev) =>
        prev.filter((b) => !engagedSet.has(b.lokos_member_code)),
      );
    } else {
      const engagedSet = new Set(engagedParticipants.map((t) => String(t.id)));
      setSelectedTrainersMap((prev) => {
        const copy = new Map(prev);
        for (const key of copy.keys()) {
          if (engagedSet.has(String(key))) copy.delete(key);
        }
        return copy;
      });
    }
    setEngagementStatus("idle");
    setEngagedParticipants([]);
  }, [engagedParticipants, form.training_type]);

  return {
    step,
    setStep,
    participantSubStep,
    setParticipantSubStep,
    goToNext,
    goToPrev,
    jumpToStep,

    blockId,
    setBlockId,
    districtId,
    setDistrictId,

    form,
    setForm,
    handleFormChange,
    selectedPlan,
    setSelectedPlan,
    selectedTheme,
    setSelectedTheme,
    autoPartnerAssigned,
    setAutoPartnerAssigned,

    selectedBlockForShg,
    setSelectedBlockForShg,
    selectedShgForMembers,
    setSelectedShgForMembers,
    selectedShgLoading,
    setSelectedShgLoading,
    memberListReloadToken,
    setMemberListReloadToken,

    selectedBeneficiaries,
    setSelectedBeneficiaries,
    savedMemberResponses,
    addSelectedMember,
    removeSelectedBeneficiary,
    selectedMemberCodesSet,

    selectedTrainersMap,
    setSelectedTrainersMap,
    savedTrainerResponses,
    onToggleTrainer,
    removeSelectedTrainer,
    selectedTrainerIds,
    selectedTrainerList,

    previewOpen,
    setPreviewOpen,
    submitting,
    setSubmitting,
    submitSummary,
    setSubmitSummary,

    engagementStatus,
    setEngagementStatus,
    engagedParticipants,
    setEngagedParticipants,
    removeIneligibleParticipants,
  };
}
