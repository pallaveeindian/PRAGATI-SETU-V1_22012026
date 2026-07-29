import React from "react";
import "./styles/PDUDataTable.css";

/**
 * PDUDataTable - A highly reusable and consistent data table component.
 *
 * @param {Array<Object>} columns - Definition of table columns [{ key: 'id', label: 'Name', render: (row) => ... }]
 * @param {Array<Object>} data - The array of data objects to render
 * @param {boolean} highlightTopThree - If true, highlights the first 3 rows as Gold, Silver, Bronze
 * @param {string} emptyMessage - Message to display if data array is empty
 * @param {string} className - Optional additional CSS classes
 */
const PDUDataTable = ({
  columns = [],
  data = [],
  highlightTopThree = false,
  emptyMessage = "No data available.",
  className = "",
}) => {
  // Helper to determine the medal class and emoji based on the row index
  const getRowHighlightConfig = (index) => {
    if (!highlightTopThree) return { className: "", emoji: "" };

    switch (index) {
      case 0:
        return { className: "pdu-row-gold", emoji: "🥇 " };
      case 1:
        return { className: "pdu-row-silver", emoji: "🥈 " };
      case 2:
        return { className: "pdu-row-bronze", emoji: "🥉 " };
      default:
        return { className: "", emoji: "" };
    }
  };

  return (
    <div className={`pdu-table-container ${className}`}>
      <table className="pdu-data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`pdu-table-th ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                style={{ width: col.width || "auto" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="pdu-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const { className: highlightClass, emoji } =
                getRowHighlightConfig(rowIndex);

              return (
                <tr
                  key={rowIndex}
                  className={`pdu-table-row ${highlightClass}`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      className={`pdu-table-td ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                    >
                      {/* Automatically prepend the medal emoji to the first column if highlighted */}
                      {colIndex === 0 && highlightTopThree && emoji && (
                        <span className="pdu-medal-emoji">{emoji}</span>
                      )}

                      {/* Use the custom render function if provided, otherwise render the raw value */}
                      {col.render ? col.render(row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PDUDataTable;
