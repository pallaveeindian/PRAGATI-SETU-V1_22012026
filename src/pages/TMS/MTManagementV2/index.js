// src/pages/TMS/MTManagementV2/index.js

/**
 * ============================================================================
 * Master Trainer Management V2 (MTManagementV2)
 * ============================================================================
 * This module provides a complete RBAC-driven interface for SMMU and DMMU
 * to manage Master Trainers, handle one-shot creations/updates, and
 * facilitate the upload and approval of TOT Certificates.
 */

// 1. Export Main Orchestrators (Screens)
// These are the components you will import into your React Router routes.
export { default as MTDirectoryConductor } from "./screens/MTDirectoryConductor";
export { default as MTPendingApprovalsConductor } from "./screens/MTPendingApprovalsConductor";

// 2. Export Hooks
// (Exported for testing or if other advanced modules need to tap into the logic)
export { useMTList } from "./hooks/useMTList";
export { useMTForm } from "./hooks/useMTForm";
export { useMTCertificates } from "./hooks/useMTCertificates";

// 3. Export Presentational Components
// (Exported in case you ever need to reuse these UI pieces in another module)
export { default as MTFilterPanel } from "./components/MTFilterPanel";
export { default as MTTable } from "./components/MTTable";
export { default as MTFormModal } from "./components/MTFormModal";
export { default as MTDetailViewer } from "./components/MTDetailViewer";
export { default as MTCertificateManager } from "./components/MTCertificateManager";
