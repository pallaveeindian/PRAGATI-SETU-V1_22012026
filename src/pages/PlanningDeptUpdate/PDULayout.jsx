// src\pages\PlanningDeptUpdate\PDULayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PDUProvider, usePDUContext } from "./context/PDUContext";
import PDUHeader from "./Layout/PDUHeader";
import PDUFooter from "./Layout/PDUFooter";
import PDULoader from "./components/PDULoader";
import PDUbg from "../../assets/abapi_data/BGBG.png";

// 1. Inner Component to consume the Context and block rendering until loaded
const PDUAppContent = () => {
  const {
    isInitialized,
    error,
    aspirationalBlocks,
    loadAspirationalBlocksData,
  } = usePDUContext();

  // Automatically trigger the 108 blocks fetch as soon as base state is ready
  useEffect(() => {
    if (isInitialized && aspirationalBlocks.length === 0) {
      loadAspirationalBlocksData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  // Handle API connection errors globally
  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          color: "#991b1b",
          flexDirection: "column",
        }}
      >
        <h2>Connection Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // GLOBAL LOADER: Blocks all child pages from rendering until ALL data is populated
  if (!isInitialized || aspirationalBlocks.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <PDULoader text="Synchronizing Live Lokos API Data..." />
      </div>
    );
  }

  // Once 100% loaded, render the Header, Background, Outlet (Pages), and Footer
  return (
    <div
      className="pdu-app-layout"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <PDUHeader />

      <main
        style={{
          flexGrow: 1,
          backgroundImage: `url(${PDUbg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Outlet />
      </main>

      <PDUFooter />
    </div>
  );
};

// 2. Main Layout Export (Provides the Context to the Inner Component)
export default function PDULayout() {
  return (
    <PDUProvider>
      <PDUAppContent />
    </PDUProvider>
  );
}
