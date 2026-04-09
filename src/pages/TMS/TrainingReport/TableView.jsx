import React from "react";

const TableView = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data found</p>;
    }

    const columns = Object.keys(data[0]);

    return (
        <table border="1" cellPadding="8">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col) => (
                            <td key={col}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableView;