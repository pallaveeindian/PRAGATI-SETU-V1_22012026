import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import prernaLogo from "../../../assets/prernaHd.png";
// Import these if you have them locally, otherwise I've used placeholders below
import upGovtLogo from "../../../assets/UpgovNoBgImg.png";
import emblemLogo from "../../../assets/EmblemOfndia.png";
import TopNav from "./tms_TopNav";

const Header = () => {
  const { user } = useAuth();

  const username = user?.username || user?.name || "Guest";
  const initial = username.charAt(0).toUpperCase();

  // Placeholder URLs for the logos requested


  return (
    <header className="header">
      {/* Left Side: Standard Government Branding (Similar to the image you provided) */}
      <div className="header-left">
        <img src={prernaLogo} alt="Prerna Logo" className="prerna-logo" />
        <div className="gov-text">
          <span className="pragati-text">PRAGATI SETU</span>
          <span className="header-title">Training Management System</span>
        </div>
      </div>

      {/* Right Side: Stacked Information */}
      <div className="header-right-container">

        {/* Bottom Row: UP Logo, Stumb, and Login Button */}
        <div className="bottom-row">
          <div className="logo-group">
            <img src={upGovtLogo} alt="UP Government Logo" className=" up-logo" />
            <img src={emblemLogo} alt="Stumb" className="sub-logo stumb " />
          </div>
          <TopNav />
          {/* <button className="user-btn">
                        <div className="avatar">{initial}</div>
                        <span className="username-text">{username}</span>
                    </button> */}
        </div>
      </div>

      <style>
        {`
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 30px;
            color: white;
            position: relative;
              isolation: isolate;  
            min-height: 80px;
            background: linear-gradient(
              90deg,
              #002073 0%,
              #0167b6 52%,
              #0093e1 100%
            );
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }

          /* Left Branding Style */
          .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 2;
          }

          .main-emblem {
            height: 70px;
            filter: brightness(0) invert(1); /* Makes emblem white */
          }

          .gov-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }

          .gov-india {
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0.5px;
          }

          .dept-text {
            font-size: 18px;
            font-weight: 700;
          }

          /* Right Container Stacking */
          .header-right-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
            z-index: 2;
          }

          .top-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .prerna-logo {
            height: 60px;
            width: auto;
          }

          .pragati-text {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            color: #ffd700; /* Gold color for emphasis */
          }

          .header-title {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 1px;
            color: #ffffff;
            -webkit-text-stroke: 0.5px #ff8c00;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .bottom-row {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .sub-logo {
            height: 60px;
            width: auto;
          }
          .stumb {
  height: 60px;
  width: 60px;
  object-fit: contain;
  background: #ffffff;     /* same as UP logo */
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
margin-left: 10px; /* slight overlap with UP logo */
  filter: none;            /*  remove invert */
}
    

          /* Background Curves Animation */
          .header::before {
            content: "";
            position: absolute;
            bottom: -50px;
            left: -10%;
            width: 120%;
            height: 100px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            z-index: 1;
            transform: rotate(-2deg);
          }

          .up-logo {
  height: 60px;
  width: 60px;
  object-fit: contain;
  background: #ffffff;          /* White background */
  border-radius: 50%;           /* Makes it circular */
  padding: 6px;                 /* Space inside circle */
  box-shadow: 0 2px 6px rgba(0,0,0,0.2); /* optional nice effect */
}
          @media (max-width: 768px) {
            .header {
              flex-direction: column;
              align-items: flex-start;
              padding: 15px;
              gap: 15px;
            }
            .header-right-container {
              align-items: flex-start;
              width: 100%;
            }
            .header-title {
                font-size: 18px;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;