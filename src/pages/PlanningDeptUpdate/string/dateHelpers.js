/**
 * /src/pages/PlanningDeptUpdate/string/dateHelpers.js
 * Helper functions for formatting dates, calculating Financial Year/Month,
 * and generating periods required by the Planning Department API.
 */

/**
 * Returns the Financial Year in "YYYY-YY" format based on a given date.
 * In India, the Financial Year runs from April 1st to March 31st.
 * Example for Aug 2026: "2026-27"
 * Example for Feb 2026: "2025-26"
 *
 * @param {Date} [date=new Date()] - The date to calculate the FY for. Defaults to today.
 * @returns {string} - e.g., "2023-24", "2026-27"
 */
export const getFinancialYear = (date = new Date()) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth(); // 0-indexed (0 = Jan, 3 = Apr, 11 = Dec)

  let startYear, endYear;

  // If month is Jan (0), Feb (1), or Mar (2), it falls in the previous year's FY
  if (currentMonth < 3) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {
    // April (3) to December (11) falls in the current year's FY
    startYear = currentYear;
    endYear = currentYear + 1;
  }

  // Extract the last two digits of the end year (e.g., 2027 -> "27")
  const shortEndYear = endYear.toString().slice(-2);

  return `${startYear}-${shortEndYear}`;
};

/**
 * Returns the current month code as expected by the API (1 to 12).
 * Note: The API spec uses standard calendar month numbers (4 = April, 1 = January).
 *
 * @param {Date} [date=new Date()] - The date to calculate the month for.
 * @returns {number} - 1 to 12
 */
export const getApiMonthCode = (date = new Date()) => {
  return date.getMonth() + 1; // JS months are 0-11, API needs 1-12
};

/**
 * Formats a date into DD/MM/YYYY string.
 * This is specifically required to inject today's date into the Disclaimer text string.
 * Example: "05/04/2026"
 *
 * @param {Date} [date=new Date()] - The date to format.
 * @returns {string} - e.g., "05/04/2026"
 */
export const getFormattedDisclaimerDate = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Utility to get the "Reporting Date" (Previous Month).
 * Progress reports are often submitted for the PREVIOUS month's achievements.
 * E.g., if you are submitting in May, the data is technically for April.
 * You can pass this date into `getFinancialYear()` and `getApiMonthCode()` if needed.
 *
 * @param {Date} [currentDate=new Date()]
 * @returns {Date} - A JavaScript Date object set to 1 month ago.
 */
export const getReportingDate = (currentDate = new Date()) => {
  const date = new Date(currentDate);
  date.setMonth(date.getMonth() - 1);
  return date;
};

/**
 * Determines the Quarter string as per Planning Dept Code.
 * Useful if the API requires the QuarterMonth field to be populated later.
 *
 * @param {Date} [date=new Date()]
 * @returns {string} - e.g., "Q1 Apr to Jun", "Q2 Jul to Sep"
 */
export const getQuarterString = (date = new Date()) => {
  const month = date.getMonth(); // 0 = Jan, 3 = Apr
  if (month >= 3 && month <= 5) return "Q1 Apr to Jun";
  if (month >= 6 && month <= 8) return "Q2 Jul to Sep";
  if (month >= 9 && month <= 11) return "Q3 Oct to Dec";
  return "Q4 Jan to Mar";
};

/**
 * Determines the Half-Year string as per Planning Dept Code.
 * Useful if the API requires the SixMonthly field to be populated later.
 *
 * @param {Date} [date=new Date()]
 * @returns {string} - e.g., "B1 Apr To Sep", "B2 Oct To Mar"
 */
export const getHalfYearString = (date = new Date()) => {
  const month = date.getMonth(); // 0 = Jan, 3 = Apr
  if (month >= 3 && month <= 8) return "B1 Apr To Sep";
  return "B2 Oct To Mar";
};
