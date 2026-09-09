// src/pages/TMS/TP_CP/cpad_per_batch_ekyc.jsx
import React from "react";
import BatchAttendanceStepper from "./AttendanceModule/BatchAttendanceStepper";

/**
 * ROUTE WRAPPER: E-KYC Phase
 *
 * This file acts purely as an entry point to maintain compatibility
 * with the existing routing structure (<Route path="cp/batch-attendance-ekyc/:id" />).
 *
 * All data fetching, caching, layout rendering, and complex business logic
 * have been migrated to the modular `AttendanceModule`.
 */
export default function CpAdPerBatchEkyc() {
  return <BatchAttendanceStepper activeStep={1} />;
}
