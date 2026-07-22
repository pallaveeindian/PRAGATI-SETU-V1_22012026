import React, { useState } from "react";
import EpsmsLogo from "../../../../assets/ems_logo.png";
import UpGovLogo from "../../../../assets/upgov_logo.jpg";
import IndiaEmblem from "../../../../assets/EmblemOfndia.png";

const Header = ({ activeMenu, onLogout, displayName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const title = "UDHYAM SAKHI ADMIN PORTAL";

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        zIndex: "1001",
        flexShrink: 0,
        width: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        borderBottom: "3px solid #16a34a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 18px",
          minHeight: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={EpsmsLogo}
            alt="EMS Logo"
            style={{ width: "70px", height: "70px", objectFit: "contain" }}
          />

          <div>
            <div
              style={{
                color: "#fff7ed",
                margin: 0,
                fontWeight: 700,
                letterSpacing: "0.5px",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              Pragati Setu
            </div>
            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontWeight: "800",
                letterSpacing: "0.5px",
                fontSize: "18px",
              }}
            >
              {title}
            </h2>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "relative",
          }}
        >
          <img
            src={UpGovLogo}
            alt="Government Logo"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              background: "transparent",
              padding: 0,
              margin: 0,
              display: "block",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fef3c7 0%, #fff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
            }}
          >
            <img
              src={IndiaEmblem}
              alt="Emblem of India"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                borderRadius: "50%",
              }}
            />
          </div>
          {displayName && (
            <button
              type="button"
              onClick={() => setShowLogout((prev) => !prev)}
              onMouseEnter={(e) => {
                setIsHovered(true);
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.18)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.16)";
              }}
              onMouseLeave={(e) => {
                setIsHovered(false);
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#fff",
                padding: "8px 14px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "none",
                transition:
                  "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                minWidth: "fit-content",
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </button>
          )}
          {showLogout && (
            <button
              type="button"
              onClick={onLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #22c55e 0%, #f59e0b 100%)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.24)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #16a34a 0%, #15803d 100%)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.18)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                color: "#fff",
                padding: "10px 16px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                transition:
                  "background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                minWidth: "110px",
                lineHeight: 1.2,
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
