import React from "react";
import CrpDetailModalHeader from "./CrpDetailModalHeader";

const CrpDetailModalLayout = ({ title, onClose, children }) => (
    <div
        style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
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
                height: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.2)",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
            }}
        >
            <CrpDetailModalHeader title={title} onClose={onClose} />
            {children}
        </div>
    </div>
);

export default CrpDetailModalLayout;
