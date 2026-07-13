import React, { useState } from "react";
import PrernaCanteenTopNav from "./PrernaCanteenTopNav";
import RecordedPrernaCanteens from "./RecordedPrernaCanteens";
import CanteenForm from "./CanteenForm";

export default function PrernaCanteenTabs({ onBackClick }) {
    const [activeTab, setActiveTab] = useState("recorded");

    return (
        <>
            <PrernaCanteenTopNav onBackClick={onBackClick} />

            <div className="canteen-tabs-container marginTop">

                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === "recorded" ? "active" : ""}`}
                        onClick={() => setActiveTab("recorded")}
                    >
                        Recorded Prerna Canteens
                    </button>

                    <button
                        className={`tab-btn ${activeTab === "record" ? "active" : ""}`}
                        onClick={() => setActiveTab("record")}
                    >
                        Record a Canteen
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "recorded" ? (
                        <RecordedPrernaCanteens />
                    ) : (
                        <CanteenForm />
                    )}
                </div>

            </div>

            <style>{`
                .canteen-tabs-container {
                    width: 100%;
                    padding: 0 20px 20px 20px; /* Adjusted padding */
                    min-height: 100vh;
                }
                
                .marginTop {
                    margin-top: 25px; /* Added distinct margin-top */
                }
                
                .tabs-header {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #e2e8f0; /* Clean bottom line spanning the container */
                }

                .tab-btn {
                    border: none;
                    outline: none;
                    cursor: pointer;
                    padding: 12px 28px;
                    font-size: 15px;
                    font-weight: 600;
                    background: #f1f5f9; /* Light gray for inactive state */
                    color: #475569;
                    border-radius: 6px 6px 0 0;
                    transition: all 0.2s ease-in-out; /* Smooth transition for hover */
                }

                /* Hover Effect */
                .tab-btn:hover {
                    background: #e2e8f0;
                    color: #0f172a;
                }

                /* Active State Styling */
                .tab-btn.active {
                    background: #940a0a; /* Dark blue matching your layout screenshots */
                    color: #ffffff;
                    box-shadow: 0 -3px 6px #940a0a(0,0,0,0.1);
                }
            `}</style>
        </>
    );
}