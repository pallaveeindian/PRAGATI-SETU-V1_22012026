import React from "react";
import CrpDetailModalLayout from "../layout/CrpDetailModalLayout";
import CrpDetailTable from "../layout/CrpDetailTable";
import CrpPanchayatActionMenu from "./CrpPanchayatActionMenu";
import CrpDetailAssignmentModal from "./CrpDetailAssignmentModal.jsx";
import { useCrpDetailModalLogic } from "./useCrpDetailModalLogic.jsx";

const CrpDetailModal = ({
  isOpen,
  title,
  data = [],
  detailCount = null,
  loading = false,
  error = "",
  onClose,
  selectedDistrict = null,
  onPanchayatSaved = null,
}) => {
  const {
    currentPage,
    setCurrentPage,
    actionMenu,
    setActionMenu,
    assignmentModal,
    setAssignmentModal,
    pageSize,
    rows,
    columns,
    totalPages,
    effectivePage,
    startIndex,
    paginatedRows,
    exportToExcel,
    handleRowCellClick,
    renderCellText,
    toggleAssignmentSelection,
    clearSelection,
    saveAssignment,
    handleAction,
    isAddSelectionValid,
  } = useCrpDetailModalLogic({ data, selectedDistrict, onPanchayatSaved });

  if (!isOpen) return null;

  const renderModalContent = () => (
    <CrpDetailModalLayout title={title} onClose={onClose}>
      <CrpDetailTable
        rows={rows}
        columns={columns}
        paginatedRows={paginatedRows}
        startIndex={startIndex}
        pageSize={pageSize}
        totalPages={totalPages}
        effectivePage={effectivePage}
        onPrevPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
        onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        exportToExcel={exportToExcel}
        onRowCellClick={handleRowCellClick}
        renderCellText={renderCellText}
        selectedDistrict={selectedDistrict}
        detailCount={detailCount}
        loading={loading}
        error={error}
      />
      <>
        <CrpPanchayatActionMenu
          isOpen={actionMenu.open}
          position={actionMenu.position}
          crp={actionMenu.crp}
          onClose={() => setActionMenu({ open: false, position: null, crp: null })}
          onAction={handleAction}
        />
        <CrpDetailAssignmentModal
          assignmentModal={assignmentModal}
          onClose={() =>
            setAssignmentModal({
              open: false,
              mode: "add",
              crp: null,
              loading: false,
              panchayats: [],
              selectedIds: [],
              currentAssignedIds: [],
              saving: false,
              manualName: "",
            })
          }
          saveAssignment={saveAssignment}
          toggleAssignmentSelection={toggleAssignmentSelection}
          clearSelection={clearSelection}
          getPanchayatId={(p) => p?.panchayat_id || p?.id || p?.panchayat?.id || p?.panchayat?.panchayat_id || p?.panchayatId || p?.panchayat_id_value || p?.value}
          getMappingId={(p) => p?.mapping_id || p?.id || p?.crp_panchayat_id || p?.crp_panchayat_map_id || p?.mapping?.id}
          getPanchayatName={(p) => p?.panchayat_name_en || p?.panchayat_name || p?.name || p?.label || p?.panchayat?.panchayat_name_en || p?.panchayat?.panchayat_name || p?.panchayatName || p?.title || p?.value || "-"}
          isAddSelectionValid={isAddSelectionValid}
        />
      </>
    </CrpDetailModalLayout>
  );

  try {
    return renderModalContent();
  } catch (error) {
    console.error("Failed to render CRP detail modal", error);
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.2)",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Unable to load CRP details</h3>
          <p style={{ color: "#475569", marginBottom: "16px" }}>
            The CRP detail view hit an unexpected issue. Please try again.
          </p>

        </div>
      </div>
    );
  }
};

export default CrpDetailModal;
