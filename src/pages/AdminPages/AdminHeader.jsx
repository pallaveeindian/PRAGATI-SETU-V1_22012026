// src/pages/EPSMS/layout/MOUAdminHeader.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../../src/contexts/AuthContext";
import esmLogo from "../../assets/ems_logo.png";

export default function MOUAdminHeader() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    try {
      if (logout) {
        logout();
      } else {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (err) {
      console.error(err);
    }

    navigate("/mou/login", { replace: true });
  };

  return (
    <>
      <header className="mou-admin-header">
        <div className="mou-header-left">
          <img src={esmLogo} alt="MOU Portal" className="mou-header-logo" />

          <div className="mou-header-title">
            <h2>Grievence Portal</h2>
            <p>Admin Login</p>
          </div>
        </div>

        <div className="mou-header-right">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <style>{`
        .mou-admin-header{
          height:72px;
          width:100%;
          background:#ffffff;
          border-bottom:1px solid #e5e7eb;
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:0 28px;
          box-sizing:border-box;
          box-shadow:0 2px 10px rgba(0,0,0,.06);
          position:sticky;
          top:0;
          z-index:1000;
        }

        .mou-header-left{
          display:flex;
          align-items:center;
          gap:16px;
        }

        .mou-header-logo{
          width:52px;
          height:52px;
          object-fit:contain;
        }

        .mou-header-title{
          display:flex;
          flex-direction:column;
        }

        .mou-header-title h2{
          margin:0;
          font-size:24px;
          color:#1d4ed8;
          font-weight:700;
          line-height:1.2;
        }

        .mou-header-title p{
          margin:2px 0 0;
          color:#6b7280;
          font-size:14px;
          font-weight:500;
        }

        .mou-header-right{
          display:flex;
          align-items:center;
        }

        .logout-btn{
          display:flex;
          align-items:center;
          gap:8px;
          padding:10px 18px;
          border:none;
          border-radius:8px;
          background:#dc2626;
          color:#fff;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:.25s;
        }

        .logout-btn:hover{
          background:#b91c1c;
          transform:translateY(-1px);
        }

        .logout-btn svg{
          font-size:16px;
        }

        @media (max-width:768px){

          .mou-admin-header{
            padding:0 16px;
          }

          .mou-header-title h2{
            font-size:20px;
          }

          .logout-btn span{
            display:none;
          }

          .logout-btn{
            padding:10px;
          }

          .mou-header-logo{
            width:45px;
            height:45px;
          }
        }
      `}</style>
    </>
  );
}
