import React, { useState } from "react";
import PrernaCanteenTopNav from "./PrernaCanteenTopNav";
import RecordedPrernaCanteen from "./RecordedPrernaCanteen";
import CanteenForm from "./CanteenForm";

export default function PrernaCanteenTabs({ onBackClick }) {
    const [activeTab, setActiveTab] = useState("recorded");

    return (
        <>
            <PrernaCanteenTopNav onBackClick={onBackClick} />

            <div className="margintop">

                <div className="d-flex border-bottom mb-4">

                    <button
                        className={`btn me-2 ${activeTab === "recorded" ? "btn-success" : "btn-light"
                            }`}
                        onClick={() => setActiveTab("recorded")}
                    >
                        Recorded Prerna Canteens
                    </button>

                    <button
                        className={`btn ${activeTab === "record" ? "btn-success" : "btn-light"
                            }`}
                        onClick={() => setActiveTab("record")}
                    >
                        Record a Canteen
                    </button>

                </div>

                {activeTab === "recorded" ? (
                    <RecordedPrernaCanteen />
                ) : (
                    <CanteenForm />
                )}

            </div>

            <style>{`
                .canteen-tabs-container{
                    width:100%;
                    padding:20px;
                    background:#f8fafc;
                    min-height:100vh;
                }
.marginTop{
margin-top: 3px;
}
                .tabs-header{
                    display:flex;
                    gap:10px;
                    margin-bottom:20px;
                    border-bottom:2px solid #e5e7eb;
                }

                .tab-btn{
                    border:none;
                    outline:none;
                    cursor:pointer;
                    padding:12px 25px;
                    font-size:15px;
                    font-weight:600;
                    background:#e5e7eb;
                    color:#374151;
                    border-radius:8px 8px 0 0;
                }

                .tab-btn.active{
                    background:#15803d;
                    color:#fff;
                }
            `}</style>
        </>
    );
}