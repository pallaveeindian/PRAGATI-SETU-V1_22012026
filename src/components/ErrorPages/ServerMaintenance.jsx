import React, { useEffect, useState } from "react";
import GovHeader from "../../../src/pages/GovHeader";
import TopNavigation from "./HeaderNav";
import Footer from "./Footer";

import up_logo from "../../assets/upgov_logo.jpg";
import dhanyawaad from "../../assets/namaste.png";

/*
|--------------------------------------------------------------------------
| SET YOUR MAINTENANCE END TIME HERE (IST)
|--------------------------------------------------------------------------
|
| Format:
| YYYY-MM-DDTHH:mm:ss+05:30
|
| 15 June 2026, 8:00 PM IST
|
*/
const MAINTENANCE_END_TIME = "2026-06-25T06:00:00+05:30";

const ServerMaintenance = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const endTime = new Date(MAINTENANCE_END_TIME).getTime();

    const updateCountdown = () => {
      const now = Date.now();

      const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

      setTimeLeft(remainingSeconds);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="home-shell">
      {/* HEADER */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={(scale) =>
          document.documentElement.style.setProperty("--font-scale", scale)
        }
      />

      <TopNavigation />

      {/* MAIN CONTENT */}
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>Scheduled Maintenance in Progress</h1>

          <p style={styles.text}>
            We are currently performing scheduled maintenance to enhance the
            performance, reliability, and security of our platform. During this
            time, some services may be temporarily unavailable.
          </p>

          <div>
            <svg
              aria-label="server-loader being flipped clockwise and circled by three white curves fading in and out"
              role="img"
              height="56px"
              width="56px"
              viewBox="0 0 56 56"
              class="server-loader"
            >
              <clipPath id="sand-mound-top">
                <path
                  d="M 14.613 13.087 C 15.814 12.059 19.3 8.039 20.3 6.539 C 21.5 4.789 21.5 2.039 21.5 2.039 L 3 2.039 C 3 2.039 3 4.789 4.2 6.539 C 5.2 8.039 8.686 12.059 9.887 13.087 C 11 14.039 12.25 14.039 12.25 14.039 C 12.25 14.039 13.5 14.039 14.613 13.087 Z"
                  class="server-loader__sand-mound-top"
                ></path>
              </clipPath>
              <clipPath id="sand-mound-bottom">
                <path
                  d="M 14.613 20.452 C 15.814 21.48 19.3 25.5 20.3 27 C 21.5 28.75 21.5 31.5 21.5 31.5 L 3 31.5 C 3 31.5 3 28.75 4.2 27 C 5.2 25.5 8.686 21.48 9.887 20.452 C 11 19.5 12.25 19.5 12.25 19.5 C 12.25 19.5 13.5 19.5 14.613 20.452 Z"
                  class="server-loader__sand-mound-bottom"
                ></path>
              </clipPath>
              <g transform="translate(2,2)">
                <g
                  transform="rotate(-90,26,26)"
                  stroke-linecap="round"
                  stroke-dashoffset="153.94"
                  stroke-dasharray="153.94 153.94"
                  stroke="hsl(0,0%,100%)"
                  fill="none"
                >
                  <circle
                    transform="rotate(0,26,26)"
                    r="24.5"
                    cy="26"
                    cx="26"
                    stroke-width="2.5"
                    class="server-loader__motion-thick"
                  ></circle>
                  <circle
                    transform="rotate(90,26,26)"
                    r="24.5"
                    cy="26"
                    cx="26"
                    stroke-width="1.75"
                    class="server-loader__motion-medium"
                  ></circle>
                  <circle
                    transform="rotate(180,26,26)"
                    r="24.5"
                    cy="26"
                    cx="26"
                    stroke-width="1"
                    class="server-loader__motion-thin"
                  ></circle>
                </g>
                <g
                  transform="translate(13.75,9.25)"
                  class="server-loader__model"
                >
                  <path
                    d="M 1.5 2 L 23 2 C 23 2 22.5 8.5 19 12 C 16 15.5 13.5 13.5 13.5 16.75 C 13.5 20 16 18 19 21.5 C 22.5 25 23 31.5 23 31.5 L 1.5 31.5 C 1.5 31.5 2 25 5.5 21.5 C 8.5 18 11 20 11 16.75 C 11 13.5 8.5 15.5 5.5 12 C 2 8.5 1.5 2 1.5 2 Z"
                    fill="hsl(var(--hue),90%,85%)"
                  ></path>

                  <g stroke-linecap="round" stroke="#4A77A8">
                    <line
                      y2="20.75"
                      x2="12"
                      y1="15.75"
                      x1="12"
                      stroke-dasharray="0.25 33.75"
                      stroke-width="1"
                      class="server-loader__sand-grain-left"
                    ></line>
                    <line
                      y2="21.75"
                      x2="12.5"
                      y1="16.75"
                      x1="12.5"
                      stroke-dasharray="0.25 33.75"
                      stroke-width="1"
                      class="server-loader__sand-grain-right"
                    ></line>
                    <line
                      y2="31.5"
                      x2="12.25"
                      y1="18"
                      x1="12.25"
                      stroke-dasharray="0.5 107.5"
                      stroke-width="1"
                      class="server-loader__sand-drop"
                    ></line>
                    <line
                      y2="31.5"
                      x2="12.25"
                      y1="14.75"
                      x1="12.25"
                      stroke-dasharray="54 54"
                      stroke-width="1.5"
                      class="server-loader__sand-fill"
                    ></line>
                    <line
                      y2="31.5"
                      x2="12"
                      y1="16"
                      x1="12"
                      stroke-dasharray="1 107"
                      stroke-width="1"
                      stroke="#7db9fa"
                      class="server-loader__sand-line-left"
                    ></line>
                    <line
                      y2="31.5"
                      x2="12.5"
                      y1="16"
                      x1="12.5"
                      stroke-dasharray="12 96"
                      stroke-width="1"
                      stroke="#ddeeff"
                      class="server-loader__sand-line-right"
                    ></line>

                    <g stroke-width="0" fill="#4A77A8">
                      <path
                        d="M 12.25 15 L 15.392 13.486 C 21.737 11.168 22.5 2 22.5 2 L 2 2.013 C 2 2.013 2.753 11.046 9.009 13.438 L 12.25 15 Z"
                        clip-path="url(#sand-mound-top)"
                      ></path>
                      <path
                        d="M 12.25 18.5 L 15.392 20.014 C 21.737 22.332 22.5 31.5 22.5 31.5 L 2 31.487 C 2 31.487 2.753 22.454 9.009 20.062 Z"
                        clip-path="url(#sand-mound-bottom)"
                      ></path>
                    </g>
                  </g>

                  <g
                    stroke-width="2"
                    stroke-linecap="round"
                    opacity="0.7"
                    fill="none"
                  >
                    <path
                      d="M 19.437 3.421 C 19.437 3.421 19.671 6.454 17.914 8.846 C 16.157 11.238 14.5 11.5 14.5 11.5"
                      stroke="hsl(0,0%,100%)"
                      class="server-loader__glare-top"
                    ></path>
                    <path
                      transform="rotate(180,12.25,16.75)"
                      d="M 19.437 3.421 C 19.437 3.421 19.671 6.454 17.914 8.846 C 16.157 11.238 14.5 11.5 14.5 11.5"
                      stroke="hsla(0,0%,100%,0)"
                      class="server-loader__glare-bottom"
                    ></path>
                  </g>

                  <rect
                    height="2"
                    width="24.5"
                    fill="hsl(var(--hue),90%,50%)"
                  ></rect>
                  <rect
                    height="1"
                    width="19.5"
                    y="0.5"
                    x="2.5"
                    ry="0.5"
                    rx="0.5"
                    fill="hsl(var(--hue),90%,57.5%)"
                  ></rect>
                  <rect
                    height="2"
                    width="24.5"
                    y="31.5"
                    fill="hsl(var(--hue),90%,50%)"
                  ></rect>
                  <rect
                    height="1"
                    width="19.5"
                    y="32"
                    x="2.5"
                    ry="0.5"
                    rx="0.5"
                    fill="hsl(var(--hue),90%,57.5%)"
                  ></rect>
                </g>
              </g>
            </svg>
          </div>

          {/* COUNTDOWN */}
          <div style={styles.countdownContainer}>
            <div style={styles.countdownLabel}>
              Estimated Time Until Service Restoration
            </div>

            <div style={styles.countdown}>
              {hours}:{minutes}:{seconds}
            </div>
          </div>

          <p style={styles.smallText}>
            We appreciate your patience and understanding as we work to improve
            your experience. Services will be restored as soon as maintenance is
            complete.
          </p>
          <div style={styles.icon}>
            <img src={dhanyawaad} />
          </div>
          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .home-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #ffffff;
        }

        :root {
          --font-scale: 1;
        }

        body {
          font-size: calc(16px * var(--font-scale));
        }

        .home-footer {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .desktop-logo {
            display: none;
          }

          .mobile-logo {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #2b4e72, #5a8cc2)",
    fontFamily: "Segoe UI, sans-serif",
    paddingTop: "110px",
    paddingBottom: "110px",
  },

  card: {
    textAlign: "center",
    background: "#fd7302",
    padding: "45px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color: "#ffffff",
    maxWidth: "650px",
    width: "90%",
  },

  icon: {
    justifyContent: "centre",
  },

  title: {
    fontSize: "32px",
    marginBottom: "12px",
    color: "#ffffff",
    fontWeight: "700",
  },

  text: {
    fontSize: "16px",
    opacity: 0.95,
    lineHeight: "1.6",
    color: "#ffffff",
    marginBottom: "25px",
  },

  countdownContainer: {
    marginTop: "15px",
    marginBottom: "25px",
  },

  countdownLabel: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    opacity: 0.95,
  },

  countdown: {
    fontSize: "72px",
    fontWeight: "900",
    lineHeight: 1,
    letterSpacing: "4px",
    textShadow: "0 4px 12px rgba(0,0,0,0.25)",
    fontFamily: "'Courier New', monospace",
  },

  smallText: {
    fontSize: "14px",
    opacity: 0.95,
    marginTop: "10px",
  },

  button: {
    marginTop: "28px",
    padding: "12px 28px",
    borderRadius: "8px",
    border: "none",
    background: "#ffffff",
    color: "#fd7302",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
};

export default ServerMaintenance;
