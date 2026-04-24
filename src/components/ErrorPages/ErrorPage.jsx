import React from "react";
import GovHeader from "../../../src/pages/GovHeader";
import TopNavigation from "./HeaderNav";
import Footer from "./Footer";

import up_logo from "../../assets/upgov_logo.jpg";

const ErrorPage = () => {
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

      {/* MAIN */}
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>

          {/* ✅ HARD CODED ENGLISH */}
          <h1 style={styles.title}>Something Went Wrong</h1>

          <p style={styles.text}>
            We encountered an error.
            <br />
            Sorry for the inconvenience.
          </p>

          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        <Footer />
      </footer>
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
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color: "#ffffff",
    maxWidth: "420px",
    width: "90%",
  },

  icon: {
    fontSize: "60px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#ffffff",
    fontWeight: "700",
  },

  text: {
    fontSize: "15px",
    opacity: 0.95,
    lineHeight: "1.6",
    color: "#ffffff",
  },

  button: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#ffffff",
    color: "#fd7302",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ErrorPage;
