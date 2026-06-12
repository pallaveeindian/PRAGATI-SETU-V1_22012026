import React, { useEffect, useState } from "react";
import GovHeader from "../../../src/pages/GovHeader";
import TopNavigation from "./HeaderNav";
import Footer from "./Footer";

import up_logo from "../../assets/upgov_logo.jpg";

/*
|--------------------------------------------------------------------------
| SET YOUR MAINTENANCE END TIME HERE (IST)
|--------------------------------------------------------------------------
|
| Format:
| YYYY-MM-DDTHH:mm:ss+05:30
|
| 12 June 2026, 12:00 PM IST
|
*/
const MAINTENANCE_END_TIME = "2026-06-12T12:00:00+05:30";

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
          <div style={styles.icon}>🛠️</div>

          <h1 style={styles.title}>Site Under Maintenance</h1>

          <p style={styles.text}>
            Our services are temporarily unavailable while scheduled maintenance
            is being performed.
          </p>

          {/* COUNTDOWN */}
          <div style={styles.countdownContainer}>
            <div style={styles.countdownLabel}>Expected Availability In</div>

            <div style={styles.countdown}>
              {hours}:{minutes}:{seconds}
            </div>
          </div>

          <p style={styles.smallText}>
            We apologize for the inconvenience. Please check back shortly.
          </p>

          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Refresh
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
    fontSize: "60px",
    marginBottom: "20px",
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
