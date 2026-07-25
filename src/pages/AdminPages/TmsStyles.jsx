import React from 'react';

const TmsStyles = () => {
  return (
    <style>{`
      .tms-dashboard {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f7fb;
        padding: 24px;
        min-height: 100vh;
        color: #1e293b;
      }
      .dash-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .dash-title {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
      }
      .fy-container {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        padding: 6px 8px 6px 16px; 
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        border: 1px solid #e2e8f0;
      }
      .fy-label {
        font-size: 14px;
        font-weight: 600;
        color: #475569;
      }
      .fy-dropdown {
        background: #1d4ed8; 
        color: #ffffff; 
        padding: 6px 32px 6px 16px; 
        border-radius: 6px;
        font-weight: 700;
        font-size: 14px;
        height: 32px;
        text-align: center;
        border: none;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 14px;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(29, 78, 216, 0.3);
      }
      .fy-dropdown:hover {
        background: #1e40af; 
        transform: translateY(-1px);
      }
      .fy-dropdown option {
        background: #ffffff;
        color: #1e293b;
        font-weight: 600;
        text-align: center;
      }
      .table-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .table-header {
        padding: 20px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f1f5f9;
      }
      .table-header h3 { margin: 0; font-size: 18px; }
      .export-btn {
        background: linear-gradient(135deg, #10b981, #059669); 
        color: white;
        border: 2px solid #047857; 
        padding: 8px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 3px 6px rgba(16, 185, 129, 0.3);
      }
      .export-btn:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
      }
      .tms-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }
      .tms-table th, .tms-table td {
        padding: 16px 24px;
        border-bottom: 1px solid #f1f5f9;
      }
      .tms-table th {
        background: #f8fafc;
        color: #64748b;
        font-weight: 600;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .tms-table tbody tr:hover {
        background: #f8fafc;
      }
      .progress-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .pct-text {
        font-weight: 600;
        width: 35px;
      }
      .progress-track {
        width: 100px;
        height: 6px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease-in-out;
      }
      .fill-green { background: #10b981; }
      .fill-yellow { background: #f59e0b; }
      .fill-red { background: #ef4444; }
      .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }
      .badge-high { background: #d1fae5; color: #065f46; }
      .badge-med { background: #fef3c7; color: #92400e; }
      .badge-low { background: #fee2e2; color: #991b1b; }
      .modal-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
        z-index: 99999;
      }
      .modal-window {
        width: min(1200px, 100%);
        max-height: calc(100vh - 80px);
        background: white;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 28px 80px rgba(15, 23, 42, 0.18);
        display: flex;
        flex-direction: column;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;
      }
      .modal-header h3 { margin: 0; font-size: 20px; color: #0f172a; }
      .modal-close {
        width: 32px;
        height: 32px;
        border: none;
        justify-content: center;
        align-items: center;
        display: flex;
        border-radius: 50%;
        background: #e2e8f0;
        color: #0f172a;
        font-size: 22px;
        cursor: pointer;
        line-height: 0;
        display: grid;
        place-items: center;
      }
      .modal-body { padding: 16px 24px 24px; overflow: auto; }
      .modal-summary { margin-bottom: 16px; color: #334155; font-size: 15px; font-weight: 600; }
      .modal-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 900px; }
      .modal-table th, .modal-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
      .modal-table th { background: #f8fafc; color: #475569; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
      .modal-table tbody tr:hover { background: #f8fafc; }
    `}</style>
  );
};

export default TmsStyles;