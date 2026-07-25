// src/pages/EPSMS/layout/MOUAdminHeader.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../../src/contexts/AuthContext";
import BDOLogo from "../../assets/BDOLogo.png"; // Replace with the actual path to your logo image

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
          <img src={BDOLogo} alt="MOU Portal" className="mou-header-logo" />

          <div className="mou-header-title">
            <h2>PMU Admin Portal</h2>
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
          background: linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%);
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
         width: 55px;
  height: 55px;
  object-fit: contain;
  border-radius: 50%;
  
  background: linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%);
  padding: 3px;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);
  
  background-clip: padding-box; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .mou-header-title{
          display:flex;
          flex-direction:column;
        }

        .mou-header-title h2{
          margin:0;
          font-size:24px;
          color:#fff;
          font-weight:700;
          line-height:1.2;
        }

        .mou-header-title p{
          margin:2px 0 0;
          color:#f3f4f6;
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
          border:1px solid #64748b;
          border-radius:8px;
        background: linear-gradient(135deg, rgba(29, 78, 216, 0.85) 0%, rgba(225, 29, 72, 0.85) 100%);
backdrop-filter: blur(10px); 
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
