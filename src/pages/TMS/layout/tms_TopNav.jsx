// src/pages/TMS/layout/tms_TopNav.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
export default function TopNav({ left = null, right = null }) {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  // try to read cached geoscope for contextual title / scope
  let geo = null;
  try {
    geo = JSON.parse(localStorage.getItem("ps_user_geoscope") || "null");
  } catch (e) {
    geo = null;
  }

  let scopeLabel = "";
  if (geo) {
    if (
      geo.role === "bmmu" &&
      Array.isArray(geo.blocks) &&
      geo.blocks.length > 0
    ) {
      scopeLabel = `Block: ${geo.blocks[0]}`;
    } else if (
      (geo.role === "dmmu" || geo.role === "dcnrlm") &&
      Array.isArray(geo.districts) &&
      geo.districts.length > 0
    ) {
      scopeLabel = `District: ${geo.districts[0]}`;
    } else if (geo.role) {
      scopeLabel = geo.role.toUpperCase();
    }
  }

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } finally {
      // ALWAYS redirect to Home after logout
      navigate("/login", { replace: true });
    }
  };

  const defaultRight = (
    <>
      {/* <div className="topnav-user">
        {user?.username ? `Hi, ${user.username}` : "Welcome"}
        {scopeLabel && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            ({scopeLabel})
          </span>
        )}
      </div> */}
      <div className="btn-ghost">
        <button className="btn logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            style={{ marginRight: 8 }}
          />
          Logout
        </button>
      </div>
    </>
  );

  return (
    // <header className="topnav">
    // <div className="topnav-left">
    //   {left || <div className="app-title">Dashboard</div>}
    // </div>
    <div>
      <div>{right || defaultRight}</div>
      <style>
        {`


.btn-ghost{
  width: 100%; /* IMPORTANT */
  margin-top: auto; /* pushes logout to bottom */
  padding: 8px;
}

/* FULL WIDTH BUTTON */
.logout-btn{
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}
`}
      </style>
    </div>
  );
}
