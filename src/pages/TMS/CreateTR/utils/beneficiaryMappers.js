// src/pages/TMS/CreateTR/utils/beneficiaryMappers.js
import { EPSAKHI_API } from "../../../../api/axios";

export function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveJson(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
}

export function getRoleKeyFromUser(user) {
  if (!user) return "";
  const id = Number(user.role_id ?? user.role);
  if (!Number.isNaN(id)) {
    if (id === 1) return "bmmu";
    if (id === 2) return "dmmu";
    if (id === 3) return "smmu";
    if (id === 4) return "training_partner";
  }
  const rn = (user.role_name || "").toLowerCase();
  if (rn.includes("bmmu")) return "bmmu";
  if (rn.includes("dmmu")) return "dmmu";
  if (rn.includes("smmu") || rn.includes("state_mission")) return "smmu";
  return "";
}

export function resolveFinalDistrict({
  districtId,
  geoscopeCached,
  user,
  userBlock,
  fetchDistrictFromBlock,
  setDistrictId,
}) {
  let district =
    districtId ??
    geoscopeCached?.districts?.[0] ??
    geoscopeCached?.district_id ??
    user?.district_id ??
    null;

  return (async () => {
    if (!district && userBlock) {
      try {
        const d = await fetchDistrictFromBlock(userBlock);
        if (d) {
          district = isNaN(Number(d)) ? d : Number(d);
          setDistrictId?.(district);
        }
      } catch {}
    }
    return district;
  })();
}

export function calculateAgeFromDob(dob) {
  if (!dob) return null;
  try {
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  } catch (e) {
    return null;
  }
}

export function mapUpsrlmMemberToTrBeneficiary(m, shgCode) {
  if (!m) return {};
  const member = Array.isArray(m?.data) ? m.data[0] || {} : m;

  const member_name =
    member.member_name || member.memberName || member.name || "";
  const member_code =
    member.member_code ||
    member.memberCode ||
    member.lokos_member_code ||
    (member.member_id ? String(member.member_id) : "") ||
    member.nic_member_code ||
    member.member_id ||
    "";

  let pld_status_value = "";
  if (
    member.pld_status === true ||
    String(member.pld_status).toLowerCase() === "true"
  ) {
    pld_status_value = "YES";
  } else if (
    member.pld_status === false ||
    String(member.pld_status).toLowerCase() === "false"
  ) {
    pld_status_value = "NO";
  } else {
    pld_status_value =
      typeof member.pld_status === "string" ? member.pld_status : "";
  }

  let designation = "";
  if (
    Array.isArray(member.member_designations) &&
    member.member_designations.length > 0
  ) {
    designation = Array.from(
      new Set(
        member.member_designations.map((d) => d.designation).filter(Boolean),
      ),
    ).join(", ");
    if (!designation && member.member_designations[0]?.designation) {
      designation = member.member_designations[0].designation;
    }
  } else if (member.member_designation) {
    designation = member.member_designation;
  }

  let mobile = "";
  if (Array.isArray(member.member_phones) && member.member_phones.length > 0) {
    mobile =
      member.member_phones[0]?.phone_no || member.member_phones[0]?.phone || "";
  } else if (member.phone_no) {
    mobile = member.phone_no;
  } else if (member.mobile) {
    mobile = member.mobile;
  }

  const education = member.education || "";
  const religion = member.religion || "";
  const social_category = member.social_category || member.socialCategory || "";

  let address = "";
  let district_id = null;
  let block_id = null;
  let panchayat_id = null;
  let village_id = null;

  if (
    Array.isArray(member.member_addresses) &&
    member.member_addresses.length > 0
  ) {
    const a = member.member_addresses[0];
    const parts = [];
    if (a.address_line1) parts.push(String(a.address_line1).trim());
    if (a.address_line2) parts.push(String(a.address_line2).trim());
    if (a.village_name) parts.push(String(a.village_name).trim());
    if (a.panchayat_name) parts.push(String(a.panchayat_name).trim());
    if (a.block_name) parts.push(String(a.block_name).trim());
    if (a.district_name) parts.push(String(a.district_name).trim());
    address = parts.join(", ");

    district_id = a.district_id
      ? isNaN(Number(a.district_id))
        ? a.district_id
        : Number(a.district_id)
      : null;
    block_id = a.block_id
      ? isNaN(Number(a.block_id))
        ? a.block_id
        : Number(a.block_id)
      : null;
    panchayat_id = a.panchayat_id
      ? isNaN(Number(a.panchayat_id))
        ? a.panchayat_id
        : Number(a.panchayat_id)
      : null;
    village_id = a.village_id
      ? isNaN(Number(a.village_id))
        ? a.village_id
        : Number(a.village_id)
      : null;
  }

  const email = member.email || member.member_email || "";
  const dob = member.dob || member.date_of_birth || member.dob_date || null;
  const age = calculateAgeFromDob(dob) ?? member.age ?? null;
  const gender = member.gender || "";

  return {
    lokos_shg_code:
      shgCode || member.shg_code || (member.shg && member.shg.shg_code) || "",
    shg_code:
      shgCode || member.shg_code || (member.shg && member.shg.shg_code) || "",
    lokos_member_code: member_code,
    member_code: member_code,
    member_name,
    age,
    gender,
    pld_status: pld_status_value,
    designation,
    social_category,
    religion,
    mobile,
    email,
    education,
    address,
    district_id,
    block_id,
    panchayat_id,
    village_id,
    __raw_upsrlm: member,
  };
}

export async function fetchMemberDetailBestEffort(member) {
  const memberCode =
    member.member_code ||
    member.lokos_member_code ||
    member.memberCode ||
    member.id ||
    member.member_id ||
    member.nic_member_code ||
    "";

  const shgCode =
    member.shg_code ||
    member.lokos_shg_code ||
    member.shgCode ||
    (member.shg && (member.shg.shg_code || member.shg.code)) ||
    "";

  const looksDetailed =
    member &&
    (member.age ||
      member.pld_status ||
      member.member_phones ||
      member.member_addresses ||
      member.dob);

  if (looksDetailed) {
    return mapUpsrlmMemberToTrBeneficiary(member, shgCode);
  }

  const attempts = [];

  if (typeof EPSAKHI_API?.upsrlmMemberDetail === "function") {
    attempts.push(() => EPSAKHI_API.upsrlmMemberDetail(shgCode, memberCode));
  }
  if (typeof EPSAKHI_API?.memberDetail === "function") {
    attempts.push(() => EPSAKHI_API.memberDetail(memberCode));
  }
  attempts.push(() =>
    EPSAKHI_API.get(`/upsrlm/shg-members/?search=${memberCode}`),
  );
  attempts.push(() => EPSAKHI_API.get(`/upsrlm/members/${memberCode}/`));
  attempts.push(() => EPSAKHI_API.get(`/upsrlm/members/detail/${memberCode}/`));
  attempts.push(() => EPSAKHI_API.get(`/shg-members/${memberCode}/`));
  attempts.push(() => EPSAKHI_API.get(`/members/${memberCode}/`));

  for (const fn of attempts) {
    try {
      const res = await fn();
      const payload = res?.data ?? res ?? null;
      if (!payload) continue;

      let candidate = null;
      if (Array.isArray(payload.data) && payload.data.length > 0) {
        candidate = payload.data[0];
      } else if (Array.isArray(payload.results) && payload.results.length > 0) {
        candidate = payload.results[0];
      } else if (
        payload.member_name ||
        payload.member_code ||
        payload.dob ||
        payload.member_addresses
      ) {
        candidate = payload;
      } else {
        candidate = payload;
      }

      if (candidate) {
        return mapUpsrlmMemberToTrBeneficiary(candidate, shgCode);
      }
    } catch (e) {
      // ignore and continue
    }
  }

  return mapUpsrlmMemberToTrBeneficiary(member, shgCode);
}
