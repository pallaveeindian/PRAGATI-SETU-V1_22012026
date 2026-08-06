// src/pages/TMS/TP_CP/cpad_per_batch.jsx
import React from "react";
import BatchAttendanceStepper from "./AttendanceModule/BatchAttendanceStepper";

/**
 * ROUTE WRAPPER: Daily Attendance Phase
 *
 * This file acts purely as an entry point to maintain compatibility
 * with the existing routing structure (<Route path="cp/batch-attendance/:id" />).
 *
 * All data fetching, state management, layout rendering, and complex business logic
 * have been migrated to the highly modular `AttendanceModule`.
 */
export default function CpAdPerBatch() {
  // Mount the core engine and explicitly start the user on Step 2 (Attendance)
  return <BatchAttendanceStepper activeStep={2} />;
}
