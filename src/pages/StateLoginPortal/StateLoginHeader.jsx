// src/pages/StateLoginPortal/StateLoginHeader.jsx
import React from "react";
import { FiLogOut } from "react-icons/fi";
import PrernaLogo from "../../assets/prerna.png";
import Emblem from "../../assets/EmblemOfndia.png";
import UpGovLogo from "../../assets/UpgovNoBgImg.png";
const StateLoginHeader = ({ activeTab }) => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const headerGradients = {
        "home-dashboard": `linear-gradient(
    to right,
    #632f05 0%,
    #EA580C 15%,
    #F97316 40%,
    #FB923C 65%,
    #FDBA74 85%,
    #FED7AA 100%
  )`,

        tms: `linear-gradient(
    to right,
    #02132E 0%,
    #042152 12%,
    #062C6E 28%,
    #08398A 45%,
    #0A4AAA 60%,
    #1D63C9 75%,
    #3D82E0 88%,
    #B9D7FB 100%
  )`,

        lakhpati: `linear-gradient(
    to right,
    #2B0207 0%,
    #4A0410 12%,
    #6B091A 28%,
    #8B1122 45%,
    #B91C1C 60%,
    #DC2626 75%,
    #EF4444 88%,
    #FCA5A5 100%
  )`,

        crpep: `linear-gradient(
    to right,
    #052E16 0%,
    #14532D 12%,
    #166534 28%,
    #15803D 45%,
    #16A34A 60%,
    #22C55E 75%,
    #4ADE80 88%,
    #BBF7D0 100%
  )`,
    };

    const headerBackground =
        headerGradients[activeTab] || headerGradients["home-dashboard"];

    return (
        <>
            <header
                className="state-header"
                style={{ background: headerBackground }}
            >
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
                    background-size: 400% 400%;
                    animation: gradient 12s ease infinite;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding: 0 24px;
                    box-sizing: border-box;
                    color: white;

                    position: relative;
                    overflow: hidden;
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
