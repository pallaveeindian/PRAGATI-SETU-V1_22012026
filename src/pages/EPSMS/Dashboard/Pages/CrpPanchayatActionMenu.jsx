import React, { useEffect, useState } from "react";


const CrpPanchayatActionMenu = ({ isOpen, position, crp, onClose, onAction }) => {
  const [hoveredAction, setHoveredAction] = useState(null);
  const [closeHovered, setCloseHovered] = useState(false);
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };


    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !crp) return null;

  const top = position?.top ?? 120;
  const left = position?.left ?? 120;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        backgroundColor: "rgba(15, 23, 42, 0.14)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "fixed",
          top: "14em",
          left: "30.5em",
          minWidth: "270px",
          minheight: "270px",

          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
          border: "1px solid #e2e8f0",
          padding: "12px",
          zIndex: 4001,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
              Manage Panchayats
            </div>
            <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
              {crp.name || "CRP"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            style={{
              width: closeHovered ? "90px" : "40px",
              height: "40px",
              borderRadius: closeHovered ? "50px" : "50%",
              backgroundColor: closeHovered ? "rgb(255, 165, 0)" : "rgb(6, 158, 32)",
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
        <div style={{ display: "grid", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              onAction?.("add", crp);
              onClose?.();
            }}
            onMouseEnter={() => setHoveredAction("add")}
            onMouseLeave={() => setHoveredAction(null)}
            style={{
              padding: "10px 14px",
              minWidth: "120px",
              borderRadius: hoveredAction === "add" ? "50px" : "12px",
              border: "1px solid #16a34a",
              background: hoveredAction === "add" ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" : "#ecfdf5",
              color: hoveredAction === "add" ? "#ffffff" : "#166534",
              cursor: "pointer",
              fontWeight: 600,
              textAlign: "center",
              transition: "all 0.25s ease",
              transform: hoveredAction === "add" ? "translateY(-2px)" : "none",
              boxShadow: hoveredAction === "add" ? "0 12px 24px rgba(34,197,94,0.25)" : "none",
            }}
          >
            Add Panchayat
          </button>
          <button
            type="button"
            onClick={() => {
              onAction?.("delete", crp);
              onClose?.();
            }}
            onMouseEnter={() => setHoveredAction("delete")}
            onMouseLeave={() => setHoveredAction(null)}
            style={{
              padding: "10px 14px",
              minWidth: "120px",
              borderRadius: hoveredAction === "delete" ? "50px" : "12px",
              border: "1px solid #dc2626",
              background: hoveredAction === "delete" ? "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)" : "#fef2f2",
              color: hoveredAction === "delete" ? "#ffffff" : "#991b1b",
              cursor: "pointer",
              fontWeight: 600,
              textAlign: "center",
              transition: "all 0.25s ease",
              transform: hoveredAction === "delete" ? "translateY(-2px)" : "none",
              boxShadow: hoveredAction === "delete" ? "0 12px 24px rgba(249,115,22,0.25)" : "none",
            }}
          >
            Delete Panchayat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrpPanchayatActionMenu;
