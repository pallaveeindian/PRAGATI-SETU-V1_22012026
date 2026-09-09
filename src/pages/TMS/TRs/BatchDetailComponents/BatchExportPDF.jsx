// src/pages/TMS/TRs/BatchDetailComponents/BatchExportPDF.jsx
import React, { useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { generateBatchHTML } from "./BatchHTML"; // SURGICAL IMPORT

export default function BatchExportPDF({ batchData }) {
  const [exporting, setExporting] = useState(false);

  const generatePDF = () => {
    if (!batchData) return;
    setExporting(true);

    try {
      // 1. Build HTML Content using our separated pure function
      const htmlContent = generateBatchHTML(batchData);

      // 2. Open in new window and trigger print
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for images and CSS to load, then print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setExporting(false);
        }, 1500); // Increased timeout slightly to ensure heavy media loads
      } else {
        alert("Please allow pop-ups to generate the PDF.");
        setExporting(false);
      }
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
      setExporting(false);
    }
  };

  return (
    <button
      className="btn-pdf"
      onClick={generatePDF}
      disabled={exporting || !batchData}
      title="Open Print Preview to Save as PDF"
    >
      {exporting ? (
        <>
          <FaSpinner className="spin" style={{ marginRight: "6px" }} />{" "}
          Exporting...
        </>
      ) : (
        <>
          <FaFilePdf style={{ marginRight: "6px" }} /> Export PDF
        </>
      )}
      <style>{`
        .btn-pdf {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
        }
        .btn-pdf:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(239, 68, 68, 0.3);
        }
        .btn-pdf:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
