// src/pages/StateLoginPortal/StateLoginHeader.jsx
import React from "react";
import { FiLogOut } from "react-icons/fi";
import PrernaLogo from "../../assets/prerna.png";
import Emblem from "../../assets/EmblemOfndia.png";
import UpGovLogo from "../../assets/UpgovNoBgImg.png";
const StateLoginHeader = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/state-login";
  };

  return (
    <>
      <header className="state-header">
        {/* Left Section */}
        <div className="header-left">
          <img src={PrernaLogo} alt="Prerna Logo" className="header-logo" />

          <div className="header-title">
            <span className="header-subtitle">PRAGATI SETU</span>

            <h2>Master Login</h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <img src={Emblem} alt="Emblem of India" className="gov-logo" />

          <img src={UpGovLogo} alt="UP Government Logo" className="gov-logo" />

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      <style>{`
                .state-header {
                    height: 82px;
                    background: linear-gradient(
                        90deg,
                        #083a8c,
                        #1293db
                    );

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding: 0 24px;
                    box-sizing: border-box;
                    color: white;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .header-logo {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .header-title {
                    display: flex;
                    flex-direction: column;
                }

                .header-subtitle {
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 1px;
                }

                .header-title h2 {
                    margin: 2px 0 0;
                    font-size: 18px;
                    font-weight: 500;
                    color: white;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .gov-logo {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    background: white;
                    object-fit: contain;
                    padding: 4px;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    border: none;
                    background: #f97316;
                    color: white;

                    padding: 12px 24px;
                    border-radius: 10px;

                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .logout-btn:hover {
                    background: #ea580c;
                }

                @media (max-width: 768px) {
                    .header-title h2 {
                        font-size: 14px;
                    }

                    .gov-logo {
                        width: 42px;
                        height: 42px;
                    }

                    .logout-btn {
                        padding: 10px 16px;
                    }
                }
            `}</style>
    </>
  );
};

export default StateLoginHeader;
