// src/pages/TMS/TrainingPartner/PreviewBatchCreator.jsx

import React from "react";

const PreviewBatchCreator = () => {
    return (
        <div
            style={{
                padding: "24px",
                background: "#f8fafc",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        marginBottom: "10px",
                        color: "#002073",
                    }}
                >
                    Preview Batch Creator
                </h2>

                <p
                    style={{
                        color: "#555",
                        fontSize: "15px",
                        marginBottom: "24px",
                    }}
                >
                    This page is used to preview the details of a training batch before
                    final submission.
                </p>

                <div
                    style={{
                        border: "1px dashed #cbd5e1",
                        borderRadius: "8px",
                        padding: "40px",
                        textAlign: "center",
                        color: "#64748b",
                        background: "#f8fafc",
                    }}
                >
                    <h3>Preview Batch Creator</h3>
                    <p>No preview data available.</p>
                </div>
            </div>
        </div>
    );
};

export default PreviewBatchCreator;