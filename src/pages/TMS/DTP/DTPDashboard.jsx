// src/pages/TMS/DTP/DTPDashboard.jsx
import React from "react";
import {
  FaBuilding,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
} from "react-icons/fa";

import Header from "../layout/header";
import TmsLeftNav from "../layout/tms_LeftNav";

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const iconStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "#f4b400",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

export default function DTPDashboard() {
  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f5f7fb",
        }}
      >
        <TmsLeftNav />

        <main
          style={{
            flex: 1,
            marginTop: "70px", // Header height
            padding: "24px",
            minHeight: "calc(100vh - 70px)",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: "8px",
              color: "#1f2937",
              fontWeight: 700,
            }}
          >
            District Training Partner (DTP) Dashboard
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "30px",
            }}
          >
            Welcome to the District Training Partner Dashboard.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaBuilding />
              </div>
              <div>
                <h3>Total Training Centers</h3>
                <h2>0</h2>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaUsers />
              </div>
              <div>
                <h3>Total Participants</h3>
                <h2>0</h2>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaChalkboardTeacher />
              </div>
              <div>
                <h3>Active Trainers</h3>
                <h2>0</h2>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaClipboardList />
              </div>
              <div>
                <h3>Training Batches</h3>
                <h2>0</h2>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>Overview</h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.8",
              }}
            >
              This dashboard serves as the home page for District Training
              Partners. Training statistics, participant details, training
              centers, trainers, and reports can be added here in future
              updates.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
