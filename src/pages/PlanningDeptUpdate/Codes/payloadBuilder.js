/**
 * /src/pages/PlanningDeptUpdate/Codes/payloadBuilder.js
 * Constructs the exact JSON payload required by the Planning Department API.
 */

import {
  getFinancialYear,
  getApiMonthCode,
  getFormattedDisclaimerDate,
  getQuarterString,
  getHalfYearString,
} from "../string/dateHelpers";

import {
  getApiDistrictCode,
  getApiBlockCode,
  getIndicatorDetails,
  getDisclaimerTemplate,
} from "../utils/mappingData";

/**
 * Helper to build the Hindi Disclaimer String.
 * It replaces the static placeholders in the API's example string with real user data.
 *
 * @param {Object} officerDetails - { name, designation, department, mobile }
 * @param {Date} date - The date to inject into the string
 * @returns {string} - The formatted disclaimer string
 */
export const buildDisclaimer = (officerDetails, date = new Date()) => {
  // Fetch template from mapping data, or use the default fallback if not loaded
  let template = getDisclaimerTemplate();

  if (!template) {
    template =
      "मैं MR. ABC,DESIGNATION,DEPARTMENT NAME ,MOBILE प्रमाणित करता /करती हूँ कि उपर्युक्त डाटा/सूचना का विवरण परीक्षित कर मेरे द्वारा दिनांक 05/04/2024 को पुष्टि की जाती है|";
  }

  const formattedDate = getFormattedDisclaimerDate(date);

  // Safely fallback to empty strings if details are missing
  const {
    name = "",
    designation = "",
    department = "",
    mobile = "",
  } = officerDetails || {};

  // Replace placeholders. Using regex with 'i' flag makes it case-insensitive
  return template
    .replace(/MR\. ABC/i, name.toUpperCase())
    .replace(/DESIGNATION/i, designation.toUpperCase())
    .replace(/DEPARTMENT NAME/i, department.toUpperCase())
    .replace(/MOBILE/i, mobile)
    .replace(/05\/04\/2024/i, formattedDate); // Replaces the hardcoded date in the CSV example
};

/**
 * Builds the COMPLETE JSON Payload for the Planning Dept API.
 *
 * @param {Object} params - The parameters required to build the payload.
 * @param {string|number} params.lokosDistrictId - The district ID from Lokos (e.g., 31012)
 * @param {string|number} params.lokosBlockId - The block ID from Lokos (e.g., 310133)
 * @param {string} params.indicatorCode - '0511' (HHs) or '0512' (RF)
 * @param {number} params.cumulativeAchievement - The main data value (e.g., memberCount)
 * @param {Object} params.officerDetails - { name, designation, department, mobile }
 *
 * // Optional overrides
 * @param {string} [params.unitOverride] - Force 'Percentage' or 'Number'. If omitted, it auto-detects based on indicator.
 * @param {number} [params.currentMonthAchievement=0] - For mon_ach field
 * @param {number} [params.numerator=0] - For mon_ach_numirator
 * @param {number} [params.denominator=0] - For mon_ach_denominator
 * @param {Date} [params.reportDate] - Defaults to current date. Use dateHelpers.getReportingDate() to pass previous month.
 * @param {Array<string>} [params.omitFields] - Array of column names to REMOVE from the final payload.
 *
 * @returns {Object} - The final JSON payload
 */
export const buildPlanningApiPayload = ({
  lokosDistrictId,
  lokosBlockId,
  indicatorCode,
  cumulativeAchievement = 0,
  officerDetails,
  unitOverride = null,
  currentMonthAchievement = 0,
  numerator = 0,
  denominator = 0,
  reportDate = new Date(),
  omitFields = [],
}) => {
  // 1. Fetch exact API codes based on Lokos IDs
  const dist_code = getApiDistrictCode(lokosDistrictId);
  const Block_code = getApiBlockCode(lokosBlockId);
  const indicator = getIndicatorDetails(indicatorCode);

  // Strict validation: Throw error if mapping fails (e.g., Block is not in the 108 list)
  if (!dist_code)
    throw new Error(
      `Mapping failed: API District Code not found for Lokos ID ${lokosDistrictId}`,
    );
  if (!Block_code)
    throw new Error(
      `Mapping failed: API Block Code not found for Lokos ID ${lokosBlockId}`,
    );
  if (!indicator)
    throw new Error(
      `Mapping failed: Indicator details not found for code ${indicatorCode}`,
    );

  // 2. Determine Unit (Number vs Percentage)
  // 0512 is Percentage (RF received), 0511 is Number (HHs added)
  const derivedUnit =
    unitOverride || (indicatorCode === "0512" ? "Percentage" : "Number");

  // 3. Construct the Full Object
  // We use .toFixed(2) to enforce the "00.00" decimal requirement as a string
  const payload = {
    year: getFinancialYear(reportDate),
    month: getApiMonthCode(reportDate),
    div_code: "00", // Defaulting to "00" as per example. Modify if divisions are added later.
    dist_code: String(dist_code),
    Block_code: String(Block_code),
    prog_code: String(indicator.indicatorCode),
    ProgHeadCode: String(indicator.progHeadCode),
    unit: derivedUnit,
    PeriodNameId: String(indicator.periodicityId),
    LeadDeptNameId: String(indicator.leadDeptId),
    mon_ach_numirator: Number(numerator).toFixed(2),
    mon_ach_denominator: Number(denominator).toFixed(2),
    mon_ach: Number(currentMonthAchievement).toFixed(2),
    cum_ach: Number(cumulativeAchievement).toFixed(2),
    QuarterMonth: getQuarterString(reportDate),
    SixMonthly: getHalfYearString(reportDate),
    Disclaimer: buildDisclaimer(officerDetails, reportDate),
    FourMonth: "", // As per CSV, no helper needed, leaving empty
  };

  // 4. Omit specifically requested fields
  // This makes the builder highly flexible. If the API rejects empty QuarterMonth fields
  // for a monthly indicator, you can just pass omitFields: ['QuarterMonth', 'SixMonthly']
  if (omitFields && omitFields.length > 0) {
    omitFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        delete payload[field];
      }
    });
  }

  return payload;
};
