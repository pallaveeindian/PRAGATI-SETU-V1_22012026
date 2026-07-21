import React, { useState } from "react";

const CrpDetailTable = ({
    rows,
    columns,
    paginatedRows,
    startIndex,
    pageSize,
    totalPages,
    effectivePage,
    onPrevPage,
    onNextPage,
    exportToExcel,
    onRowCellClick,
    renderCellText,
    selectedDistrict,
    detailCount,
    loading,
    error,
}) => {
    const [isExportHover, setIsExportHover] = useState(false);
    const [hoveredClf, setHoveredClf] = useState(null);

    return (
        <div style={{ padding: "18px 20px", maxHeight: "70vh", overflowY: "auto" }}>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "350px",
                        color: "#475569",
                        fontSize: "18px",
                        fontWeight: "600",
                    }}
                >
                    Loading CRP details...
                </div>
            ) : error ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "350px",
                        color: "#dc2626",
                        fontSize: "22px",
                        fontWeight: "600",
                        textAlign: "center",
                    }}
                >
                    {error}
                </div>
            ) : rows.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "350px",
                        color: "#475569",
                        fontSize: "22px",
                        fontWeight: "600",
                        textAlign: "center",
                    }}
                >
                    No Onboarded CRP Details for{" "}
                    {selectedDistrict?.name || "the selected district"}.
                </div>
            ) : (
                <div>
                    {detailCount !== null && detailCount !== undefined && (
                        <p
                            style={{
                                margin: "0 0 12px",
                                color: "#0f172a",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Onboarded CRP Count: {detailCount}
                        </p>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingLeft: "25px",
                            marginBottom: "15px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={exportToExcel}
                            onMouseEnter={() => setIsExportHover(true)}
                            onMouseLeave={() => setIsExportHover(false)}
                            style={{
                                padding: "10px 18px",
                                background: isExportHover
                                    ? "linear-gradient(90deg,#22c55e,#16a34a,#15803d)"
                                    : "linear-gradient(90deg,#15803d,#22c55e)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                marginTop: "-40px",
                                transition: "all 0.3s ease",
                                transform: isExportHover
                                    ? "translateY(-2px) scale(1.03)"
                                    : "scale(1)",
                                boxShadow: isExportHover
                                    ? "0 8px 18px rgba(34,197,94,0.4)"
                                    : "0 3px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            Export to Excel
                        </button>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "980px",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: "#fff" }}>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            style={{
                                                padding: "10px 12px",
                                                border: "1px solid #e2e8f0",
                                                color: "#ffffff",
                                                textAlign: "left",
                                                whiteSpace: "nowrap",
                                                background:
                                                    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                                            }}
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRows.map((row, index) => (
                                    <tr
                                        key={row.srno}
                                        onClick={(event) => onRowCellClick(event, row)}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#fff",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s ease",
                                        }}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.backgroundColor = "#0ab17c";

                                            event.currentTarget
                                                .querySelectorAll("td")
                                                .forEach((td) => {
                                                    td.style.color = "#fff";
                                                });
                                        }}
                                        onMouseLeave={(event) => {
                                            event.currentTarget.style.backgroundColor = "#fff";

                                            event.currentTarget
                                                .querySelectorAll("td")
                                                .forEach((td) => {
                                                    td.style.color = "#000";
                                                });
                                        }}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${row.srno}-${column.key}`}
                                                style={{
                                                    padding: "10px 12px",
                                                    border: "1px solid #e2e8f0",
                                                    color: "#0f172a",
                                                    verticalAlign: "top",
                                                    position: "relative",
                                                }}
                                            >
                                                {column.key === "nodal_clf" ? (
                                                    <>
                                                        <span
                                                            onMouseEnter={() =>
                                                                setHoveredClf(index + startIndex)
                                                            }
                                                            onMouseLeave={() => setHoveredClf(null)}
                                                            style={{
                                                                cursor: "pointer",
                                                                color:
                                                                    hoveredClf === index + startIndex
                                                                        ? "#fff"
                                                                        : "#0f172a",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {renderCellText(row.nodal_clf)}
                                                        </span>

                                                        {hoveredClf === index + startIndex && (
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "-30px",
                                                                    left: "0",
                                                                    background: "#f59e0b",
                                                                    color: "#fff",
                                                                    padding: "8px 12px",
                                                                    borderRadius: "6px",
                                                                    fontSize: "12px",
                                                                    whiteSpace: "nowrap",
                                                                    zIndex: 1000,
                                                                    fontWeight: "bold",
                                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                                                }}
                                                            >
                                                                Fetch CLF Name ?
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    renderCellText(row[column.key])
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "12px",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span style={{ color: "#097e3a", fontSize: "13px" }}>
                            Showing {rows.length === 0 ? 0 : startIndex + 1}-
                            {Math.min(startIndex + pageSize, rows.length)} of {rows.length}{" "}
                            records
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                                type="button"
                                onClick={onPrevPage}
                                disabled={effectivePage === 1}
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    backgroundColor: effectivePage === 1 ? "#f1f5f9" : "#ffffff",
                                    color: effectivePage === 1 ? "#94a3b8" : "#0f172a",
                                    cursor: effectivePage === 1 ? "not-allowed" : "pointer",
                                }}
                            >
                                Previous
                            </button>
                            <span
                                style={{
                                    color: "#0f172a",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                }}
                            >
                                Page {effectivePage} of {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={onNextPage}
                                disabled={effectivePage === totalPages}
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    backgroundColor:
                                        effectivePage === totalPages ? "#f1f5f9" : "#ffffff",
                                    color: effectivePage === totalPages ? "#94a3b8" : "#0f172a",
                                    cursor:
                                        effectivePage === totalPages ? "not-allowed" : "pointer",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrpDetailTable;
