import React, { useState } from "react";

const CrpDetailAssignmentModal = ({
    assignmentModal,
    onClose,
    saveAssignment,
    toggleAssignmentSelection,
    clearSelection,
    getPanchayatId,
    getMappingId,
    getPanchayatName,
    isAddSelectionValid,
}) => {
    if (!assignmentModal.open) return null;

    const closeModal = () => onClose?.();
    const [closeHovered, setCloseHovered] = useState(false);

    const renderPanchayatList = () => {
        return assignmentModal.panchayats.map((p) => {
            const id = String(getPanchayatId(p) || getMappingId(p) || "");
            const label = getPanchayatName(p);
            const isSelected = assignmentModal.selectedIds.includes(id);
            return (
                <label
                    key={id || label}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 12px",
                        border: `1px solid ${isSelected ? "#16a34a" : "#e2e8f0"}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#ecfdf5" : "#ffffff",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAssignmentSelection(id)}
                    />
                    <span style={{ color: "#0f172a", fontWeight: 600 }}>{label}</span>
                </label>
            );
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5000,
                padding: "20px",
            }}
            onClick={closeModal}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "560px",
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.2)",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <div style={{ position: "sticky", top: 0, zIndex: 12, background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)", padding: "14px 18px", borderBottom: "1px solid #eef2f7", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "nowrap" }}>
                    <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>
                            {assignmentModal.mode === "delete"
                                ? `Delete Panchayat from ${assignmentModal.crp?.name || "CRP"}`
                                : `Add Panchayat to ${assignmentModal.crp?.name || "CRP"}`}
                        </h4>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "nowrap" }}>
                        <button
                            type="button"
                            onClick={saveAssignment}
                            disabled={assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid)}
                            onMouseEnter={(e) => {
                                if (assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid)) return;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(34,197,94,0.25)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
                            }}
                            onMouseLeave={(e) => {
                                if (assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid)) return;
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(22, 163, 74, 0.25)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                            }}
                            style={{
                                height: '40px',
                                minWidth: '110px',
                                padding: "10px 16px",
                                borderTopLeftRadius: "16px",
                                borderBottomRightRadius: "16px",
                                border: "1px solid rgba(34, 197, 94, 0.7)",
                                background: assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid)
                                    ? '#94a3b8'
                                    : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                color: "#ffffff",
                                cursor: assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid) ? 'not-allowed' : 'pointer',
                                fontWeight: 700,
                                fontSize: "13px",
                                whiteSpace: "nowrap",
                                lineHeight: 1,
                                boxShadow: assignmentModal.saving || assignmentModal.loading || (assignmentModal.mode === "delete" ? assignmentModal.selectedIds.length === 0 : !isAddSelectionValid) ? 'none' : '0 4px 10px rgba(22, 163, 74, 0.25)',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                            }}
                        >
                            {assignmentModal.saving ? "Saving..." : assignmentModal.mode === "delete" ? "Delete" : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={clearSelection}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, #fd7e14 0%, #f59e0b 100%)";
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(249, 115, 22, 0.25)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, #f59e0b 0%, #feae24 100%)";
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.transform = "none";
                            }}
                            style={{
                                height: '40px',
                                minWidth: '110px',
                                padding: '12px 18px',
                                borderTopLeftRadius: "16px",
                                borderBottomRightRadius: "16px",
                                border: '1px solid rgba(255, 208, 116, 0.7)',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #feae24 100%)',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                whiteSpace: 'nowrap',
                                lineHeight: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                            }}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            onMouseEnter={() => setCloseHovered(true)}
                            onMouseLeave={() => setCloseHovered(false)}
                            style={{
                                width: closeHovered ? "60px" : "40px",
                                height: "40px",
                                borderRadius: closeHovered ? "40px" : "50%",
                                backgroundColor: closeHovered ? "rgb(#f59e0b)" : "rgb(27, 147, 53)",
                                border: "none",
                                color: "#ffffff",
                                cursor: "pointer",
                                overflow: "hidden",
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: closeHovered ? "0px 0px 0px 4px rgba(180, 160, 255, 0.253)" : "0px 0px 0px 4px rgba(180, 160, 255, 0)",
                                transition: "width 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
                                padding: 0,
                            }}
                        >
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", position: "relative" }}>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.3s ease",
                                        transform: closeHovered ? "translateY(-200%)" : "translateY(0)",
                                        position: "relative",
                                    }}
                                >
                                    ✕
                                </span>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        opacity: closeHovered ? 1 : 0,
                                        transition: "opacity 0.3s ease, font-size 0.3s ease",
                                        fontSize: closeHovered ? "13px" : "0px",
                                        whiteSpace: "nowrap",
                                        color: "#ffffff",
                                    }}
                                >
                                    Close
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                <div style={{ padding: "18px", overflowY: "auto", flex: 1 }}>
                    {assignmentModal.loading ? (
                        <div style={{ color: "#475569", padding: "20px 0" }}>Loading panchayats...</div>
                    ) : assignmentModal.mode === "add" ? (
                        assignmentModal.panchayats.length === 0 ? (
                            <div style={{ color: "#475569", padding: "20px 0" }}>
                                No panchayat options are available for selection for this block.
                            </div>
                        ) : (
                            <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                                <div style={{ color: "#475569", fontSize: "13px" }}>
                                    Select two or more panchayats to assign to this CRP.
                                </div>
                                {renderPanchayatList()}
                            </div>
                        )
                    ) : assignmentModal.panchayats.length === 0 ? (
                        <div style={{ color: "#475569", padding: "20px 0" }}>
                            No assigned panchayats were found for this CRP.
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                            {renderPanchayatList()}
                        </div>
                    )}
                </div>
                {/* Bottom action bar removed — Save and Clear are now in the header */}
            </div>
        </div>
    );
};

export default CrpDetailAssignmentModal;
