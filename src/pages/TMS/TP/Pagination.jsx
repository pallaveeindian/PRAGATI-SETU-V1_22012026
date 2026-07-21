import React from "react";
import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
} from "react-icons/fa";

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage = 15,
    onPageChange,
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                flexWrap: "wrap",
                gap: 10,
            }}
        >
            <div style={{ fontWeight: 500 }}>
                Showing <b>{start}</b> - <b>{end}</b> of <b>{totalItems}</b>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button
                    className="tp-btn-outline"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                >
                    <FaAngleDoubleLeft />
                </button>

                <button
                    className="tp-btn-outline"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <FaAngleLeft />
                </button>

                <span
                    style={{
                        padding: "8px 16px",
                        fontWeight: 600,
                        border: "1px solid #ddd",
                        borderRadius: 6,
                    }}
                >
                    {currentPage} / {totalPages}
                </span>

                <button
                    className="tp-btn-outline"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <FaAngleRight />
                </button>

                <button
                    className="tp-btn-outline"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(totalPages)}
                >
                    <FaAngleDoubleRight />
                </button>
            </div>
        </div>
    );
}