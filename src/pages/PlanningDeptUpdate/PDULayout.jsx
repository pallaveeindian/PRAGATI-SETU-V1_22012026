import React from "react";
import { Outlet } from "react-router-dom";
import { PDUProvider } from "./context/PDUContext";
import PDUHeader from "./Layout/PDUHeader";
import PDUFooter from "./Layout/PDUFooter";

export default function PDULayout() {
  return (
    /* 
      By wrapping Outlet in PDUProvider, ALL pages inside this layout 
      (Dashboard, SHGPointer, etc.) get access to usePDUContext()! 
    */
    <PDUProvider>
      <div
        className="pdu-app-layout"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <PDUHeader />

        <main style={{ flexGrow: 1, backgroundColor: "#f3f4f6" }}>
          {/* Outlet renders the matched child route (e.g., PDUDashboard) */}
          <Outlet />
        </main>

        <PDUFooter />
      </div>
    </PDUProvider>
  );
}
