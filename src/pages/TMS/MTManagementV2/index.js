/**
 * ============================================================================
 * Master Trainer Management V2 (MTManagementV2)
 * ============================================================================
 * This module provides a complete RBAC-driven interface for SMMU, DMMU, and BMMU
 * to manage Master Trainers, handle one-shot creations/updates,
 * facilitate the upload and approval of TOT Certificates, and manage Registrations.
 */

// 1. Export Main Orchestrators (Screens)
// These are the components you will import into your React Router routes.
export { default as MTDirectoryConductor } from "./screens/MTDirectoryConductor";
export { default as MTPendingApprovalsConductor } from "./screens/MTPendingApprovalsConductor";
export { default as MTProfileRegistrationsConductor } from "./screens/MTProfileRegistrationsConductor"; // <-- SURGICAL ADDITION

// 2. Export Hooks
// (Exported for testing or if other advanced modules need to tap into the logic)
export { useMTList } from "./hooks/useMTList";
export { useMTForm } from "./hooks/useMTForm";
export { useMTCertificates } from "./hooks/useMTCertificates";
export { useMTProfileApprovals } from "./hooks/useMTProfileApprovals"; // <-- SURGICAL ADDITION

// 3. Export Presentational Components
// (Exported in case you ever need to reuse these UI pieces in another module)
export { default as MTFilterPanel } from "./components/MTFilterPanel";
export { default as MTTable } from "./components/MTTable";
export { default as MTFormModal } from "./components/MTFormModal";
export { default as MTDetailViewer } from "./components/MTDetailViewer";
export { default as MTCertificateManager } from "./components/MTCertificateManager";
export { default as MTProfileApprovalsTable } from "./components/MTProfileApprovalsTable"; // <-- SURGICAL ADDITION
export { default as MTApprovalActionModal } from "./components/MTApprovalActionModal"; // <-- SURGICAL ADDITION
