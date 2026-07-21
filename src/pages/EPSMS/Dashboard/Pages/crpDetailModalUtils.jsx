const toArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const parsed = value.trim();
    return parsed ? [parsed] : [];
  }
  return [value];
};

const normalizeRows = (payload) => {
  if (Array.isArray(payload)) return payload.filter(Boolean);
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.results,
    payload.data,
    payload.items,
    payload.details,
    payload.rows,
    payload.list,
    payload.crps,
    payload.records,
    payload.response,
    payload.payload,
    payload.result,
    payload.crp_details,
    payload.crpep_details,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter(Boolean);
  }

  return [payload];
};

const getPanchayatDisplayName = (item) => {
  if (!item) return "";

  if (typeof item === "string") {
    const trimmed = item.trim();
    return trimmed || "";
  }

  if (typeof item !== "object") return "";

  const candidates = [
    item?.panchayat_name_en,
    item?.panchayat_name_hi,
    item?.panchayat_name,
    item?.name,
    item?.label,
    item?.panchayat?.panchayat_name_en,
    item?.panchayat?.panchayat_name_hi,
    item?.panchayat?.panchayat_name,
    item?.panchayat?.name,
    item?.panchayat?.label,
    item?.panchayat_name_en || item?.panchayat_name_hi || item?.panchayat_name || item?.name || item?.label,
  ];

  return candidates.find((candidate) => candidate !== undefined && candidate !== null && candidate !== "") || "";
};

const normalizeAllocatedPanchayats = (value) => {
  if (value == null || value === "") return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
          .map((entry) => ({ panchayat_name: entry }));
      }
      return [{ panchayat_name: trimmed }];
    }
  }

  if (typeof value === "object") {
    if (Array.isArray(value?.results)) return value.results;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.items)) return value.items;
    return [value];
  }

  return [];
};

const formatCellValue = (value) => {
  const normalized = normalizeAllocatedPanchayats(value);
  if (!normalized.length) return "-";

  const displayValues = normalized
    .map((item) => getPanchayatDisplayName(item))
    .filter(Boolean);

  return displayValues.length ? displayValues.join(", ") : "-";
};

const renderCellText = (value) => {
  if (value == null || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const getPanchayatId = (item) => {
  if (!item || typeof item !== "object") return null;
  return item?.panchayat_id || item?.id || item?.panchayatId || item?.panchayat?.id || item?.panchayat?.panchayat_id || item?.value || null;
};

const getPanchayatName = (item) => {
  if (!item || typeof item !== "object") return "";
  return item?.panchayat_name || item?.name || item?.label || item?.panchayat?.name || item?.panchayat?.panchayat_name || "";
};

const getBlockIdFromItem = (item) => {
  if (!item || typeof item !== "object") return null;
  return item?.block_id || item?.blockId || item?.block?.id || item?.block?.block_id || item?.block?.blockId || null;
};

const getBlockNameFromItem = (item) => {
  if (!item || typeof item !== "object") return "";
  return item?.block_name || item?.block_name_en || item?.block?.block_name || item?.block?.block_name_en || item?.block?.name || item?.block?.label || "";
};

const getMappingId = (item) => {
  if (!item || typeof item !== "object") return null;
  return item?.mapping_id || item?.mappingId || item?.id || null;
};

const findNestedValue = (source, fieldNames = [], visited = new WeakSet()) => {
  if (!source || typeof source !== "object") return null;
  if (visited.has(source)) return null;
  visited.add(source);

  if (Array.isArray(source)) {
    for (const entry of source) {
      const found = findNestedValue(entry, fieldNames, visited);
      if (found !== null && found !== undefined && found !== "") return found;
    }
    return null;
  }

  for (const fieldName of fieldNames) {
    const value = source[fieldName];
    if (value !== undefined && value !== null && value !== "") return value;
  }

  const nestedCandidates = [
    source?.rawItem,
    source?.crp,
    source?.crpep,
    source?.crp_details,
    source?.crpep_details,
    source?.master_user,
    source?.masterUser,
    source?.user,
    source?.user_details,
    source?.data,
    source?.result,
    source?.results,
    source?.items,
    source?.details,
    source?.rows,
  ];

  for (const nestedCandidate of nestedCandidates) {
    const found = findNestedValue(nestedCandidate, fieldNames, visited);
    if (found !== null && found !== undefined && found !== "") return found;
  }

  for (const value of Object.values(source)) {
    if (value && typeof value === "object") {
      const found = findNestedValue(value, fieldNames, visited);
      if (found !== null && found !== undefined && found !== "") return found;
    }
  }

  return null;
};

const resolveCrpId = (item) => {
  if (!item || typeof item !== "object") return null;

  const idCandidates = [
    "crp_id",
    "crpId",
    "crpep_id",
    "crpepId",
    "crp_id_value",
    "crpep_id_value",
    "id",
    "user_id",
    "userId",
    "master_user_id",
    "master_userId",
    "member_id",
    "memberId",
  ];

  const resolved = findNestedValue(item, idCandidates);
  return resolved !== null && resolved !== undefined && resolved !== "" ? String(resolved) : null;
};

const resolveCrpMemberCode = (item) => {
  if (!item || typeof item !== "object") return "";
  return item?.crp_member_code || item?.member_code || item?.memberCode || item?.crpep_details?.[0]?.crp_member_code || "";
};

const extractListFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [payload.results, payload.data, payload.items, payload.details, payload.rows, payload.list, payload.records, payload.response, payload.payload, payload.result, payload.crps, payload.crp_details, payload.crpep_details];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const createInitialAssignmentModal = () => ({
  open: false,
  mode: "add",
  crp: null,
  loading: false,
  panchayats: [],
  selectedIds: [],
  currentAssignedIds: [],
  saving: false,
  manualName: "",
});

export {
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
};

export default {
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
};
