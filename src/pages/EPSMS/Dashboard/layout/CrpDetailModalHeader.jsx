import React, { useState } from "react";

const CrpDetailModalHeader = ({ title, onClose }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            }}
        >
            <h3 style={{ margin: 0, color: "#ffffff", fontSize: "16px" }}>
                {title || "CRP Details"}
            </h3>
            <button
                type="button"
                onClick={onClose}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: "9em",
                    height: "3em",
                    borderTopLeftRadius: "17px",
                    borderBottomRightRadius: "17px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                    border: "none",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1,
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: "#16a34a",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    backgroundImage: isHovered
                        ? "linear-gradient(to right, #0fd850 0%, #f9f047 100%)"
                        : "none",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: isHovered
                            ? "linear-gradient(90deg, #16a34a 0%, #f59e0b 100%)"
                            : "transparent",
                        transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.35s ease",
                        zIndex: -1,
                    }}
                />
                <span style={{ position: "relative", zIndex: 1, fontWeight: "bold" }}>
                    BACK
                </span>
            </button>
        </div>
    );
};

export default CrpDetailModalHeader;
