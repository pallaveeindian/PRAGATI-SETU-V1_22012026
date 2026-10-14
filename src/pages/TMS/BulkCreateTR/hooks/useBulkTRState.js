//  src\pages\TMS\BulkCreateTR\hooks\useBulkTRState.js
import { useMemo, useRef, useState } from "react";

// Normalize district and block IDs for comparison.
const getId = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "object") {
    return String(value.block_id ?? value.district_id ?? value.id ?? "");
  }

  return String(value);
};

// Collect all blocks belonging to a Beneficiary draft.
const getDraftBlockIds = (draft) => {
  const ids = new Set();

  const addBlock = (value) => {
    const id = getId(value);
    if (id) ids.add(id);
  };

  addBlock(draft?.block);
  addBlock(draft?.snapshot?.blockId);
  addBlock(draft?.snapshot?.selectedBlockForShg);

  (draft?.participants || []).forEach((participant) => {
    addBlock(participant.block ?? participant.block_id);
  });

  return [...ids];
};

export function useBulkTRState() {
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const nextId = useRef(1);

  // Once the first request is saved, its participant
  // type becomes mandatory for the entire bulk submission.
  const lockedTrainingType =
    requests.length > 0 ? requests[0].training_type : null;

  // Financial year and plan shared by the bulk requests.
  const lockedFinancialYear = requests[0]?.financial_year || "";

  const lockedTrainingPlan = requests[0]?.training_plan ?? null;

  // Exclude the currently edited draft from duplicate checks.
  const getOtherRequests = (excludeId = editingId) => {
    return requests.filter(
      (request) =>
        excludeId === null || String(request.id) !== String(excludeId),
    );
  };

  // TRAINER and STAFF: district cannot be repeated.
  const isDistrictReserved = (districtId, excludeId = editingId) => {
    const id = getId(districtId);
    if (!id) return false;

    return getOtherRequests(excludeId).some(
      (request) => getId(request.district) === id,
    );
  };

  // BENEFICIARY: block cannot be repeated.
  // District reuse is allowed.
  const isBlockReserved = (blockId, excludeId = editingId) => {
    const id = getId(blockId);
    if (!id) return false;

    return getOtherRequests(excludeId).some(
      (request) =>
        request.training_type === "BENEFICIARY" &&
        getDraftBlockIds(request).includes(id),
    );
  };

  // Validate every draft before adding or updating.
  const validateDraft = (draft, excludeId = editingId) => {
    if (!draft) {
      return {
        ok: false,
        message: "Training Request data is missing.",
      };
    }

    if (lockedTrainingType && draft.training_type !== lockedTrainingType) {
      return {
        ok: false,
        message:
          `This bulk submission is locked to ` +
          `${lockedTrainingType} participants.`,
      };
    }

    if (lockedFinancialYear && draft.financial_year !== lockedFinancialYear) {
      return {
        ok: false,
        message: "All bulk requests must have the same Financial Year.",
      };
    }

    if (
      lockedTrainingPlan !== null &&
      getId(draft.training_plan) !== getId(lockedTrainingPlan)
    ) {
      return {
        ok: false,
        message: "All bulk requests must have the same Training Plan.",
      };
    }

    if (!getId(draft.district)) {
      return {
        ok: false,
        message: "Please select a district.",
      };
    }

    if (!Array.isArray(draft.participants) || draft.participants.length === 0) {
      return {
        ok: false,
        message: "Select at least one participant.",
      };
    }

    // Master Trainer / Staff district restriction
    if (
      ["TRAINER", "STAFF"].includes(draft.training_type) &&
      isDistrictReserved(draft.district, excludeId)
    ) {
      return {
        ok: false,
        message:
          "This district has already been used in another " +
          "Bulk Training Request. Please choose a different district.",
      };
    }

    // Beneficiary block restriction
    if (draft.training_type === "BENEFICIARY") {
      const blockIds = getDraftBlockIds(draft);

      if (blockIds.length === 0) {
        return {
          ok: false,
          message: "Please select a block.",
        };
      }

      if (blockIds.length > 1) {
        return {
          ok: false,
          message:
            "A Beneficiary Training Request must contain " +
            "participants from only one block.",
        };
      }

      if (isBlockReserved(blockIds[0], excludeId)) {
        return {
          ok: false,
          message:
            "This block has already been used in another " +
            "Bulk Training Request. Please choose a different block.",
        };
      }
    }

    return { ok: true, message: "" };
  };

  // Add or save an edited draft locally.
  const saveDraft = (draft) => {
    const validation = validateDraft(draft);

    if (!validation.ok) {
      return validation;
    }

    const id = editingId ?? `draft-${nextId.current++}`;

    setRequests((previous) =>
      editingId !== null
        ? previous.map((request) =>
            String(request.id) === String(editingId)
              ? { ...draft, id }
              : request,
          )
        : [...previous, { ...draft, id }],
    );

    setEditingId(null);

    return { ok: true, id };
  };

  // Update a saved draft without losing other requests.
  const updateDraft = (id, changes) => {
    const existing = requests.find(
      (request) => String(request.id) === String(id),
    );

    if (!existing) {
      return {
        ok: false,
        message: "Training Request not found.",
      };
    }

    const updated =
      typeof changes === "function"
        ? changes(existing)
        : { ...existing, ...changes };

    const validation = validateDraft(updated, id);

    if (!validation.ok) {
      return validation;
    }

    setRequests((previous) =>
      previous.map((request) =>
        String(request.id) === String(id) ? { ...updated, id } : request,
      ),
    );

    return { ok: true };
  };

  const removeDraft = (id) => {
    setRequests((previous) =>
      previous.filter((request) => String(request.id) !== String(id)),
    );

    if (String(editingId) === String(id)) {
      setEditingId(null);
    }
  };

  const startEditing = (id) => {
    const draft = requests.find((request) => String(request.id) === String(id));

    if (draft) {
      setEditingId(id);
    }

    return draft ?? null;
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const clearDrafts = () => {
    setRequests([]);
    setEditingId(null);
    nextId.current = 1;
  };

  // Summary of all saved requests.
  const bulkSummary = useMemo(() => {
    const districtMap = new Map();

    let totalParticipants = 0;

    requests.forEach((request) => {
      totalParticipants += request.participants?.length || 0;

      const districtId = getId(request.district);
      if (!districtId) return;

      if (!districtMap.has(districtId)) {
        districtMap.set(districtId, {
          id: districtId,
          name: request.districtName || `District ${districtId}`,
          requestCount: 0,
          blocks: new Map(),
        });
      }

      const district = districtMap.get(districtId);
      district.requestCount += 1;

      if (request.training_type === "BENEFICIARY") {
        const selectedBlock = request.snapshot?.selectedBlockForShg;

        getDraftBlockIds(request).forEach((blockId) => {
          const selectedBlockId = getId(selectedBlock);

          const blockName =
            selectedBlockId === blockId
              ? selectedBlock?.block_name_en ||
                selectedBlock?.block_name ||
                selectedBlock?.name
              : null;

          district.blocks.set(blockId, {
            id: blockId,
            name: blockName || request.blockName || `Block ${blockId}`,
          });
        });
      }
    });

    return {
      financialYear: requests[0]?.financial_year || "",
      trainingPlan: requests[0]?.training_plan ?? null,
      planTitle: requests[0]?.planTitle || "",
      participantType: requests[0]?.training_type || "",
      totalRequests: requests.length,
      totalParticipants,
      districts: [...districtMap.values()].map((district) => ({
        ...district,
        blocks: [...district.blocks.values()],
      })),
    };
  }, [requests]);

  return {
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
  };
}
