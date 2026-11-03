// src/pages/LDMS/scheme_dict.jsx
import React, { useState } from "react";
import SCHeader from "./Scheme Dict/SCHeader";
import SCFilter from "./Scheme Dict/SCFilter";
import SCRecor from "./Scheme Dict/SCRecor";

export default function SchemeDictionary() {
  const [filters, setFilters] = useState({});

  return (
    <div className="bmmu-ldms-dashboard">
      {/* Row 1 */}
      <div className="ldms-grid-row one-col">
        <SCHeader />
      </div>

      {/* Row 2 */}
      <div className="ldms-grid-row one-col">
        <div className="ldms-card">
          <SCFilter onFilter={setFilters} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="ldms-grid-row one-col">
        <div className="book-ldms-card">
          <SCRecor filters={filters} />
        </div>
      </div>

      {/* ---- styles ---- */}
      <style>{`
/* ===============================
   MAIN DASHBOARD LAYOUT
================================ */

.bmmu-ldms-dashboard {
  display:flex;
  flex-direction:column;
  background:#fff5f5;
  width:100%;
  max-width:100%;
  overflow-x:hidden;
}

/* ===============================
   GRID ROWS
================================ */

.ldms-grid-row {
  display:grid;
  gap:16px;
  width:100%;
  max-width:100%;
}

.ldms-grid-row.two-col {
  grid-template-columns:1fr 1fr;
}

.ldms-grid-row.one-col {
  grid-template-columns:1fr;
}

/* ===============================
   STANDARD CARD
================================ */

.ldms-card {
  background:#fff5f5;
  width:100%;
  max-width:100%;
}

/* ===============================
   BOOK CONTAINER
================================ */

.book-ldms-card {

  display:flex;
  justify-content:center;
  align-items:flex-start;

  width:100%;
  max-width:100%;

  padding:16px 0px;

  position:relative;

  overflow:hidden;

}

/* subtle paper background */

.book-ldms-card::before{
  content:"";
  position:absolute;
  inset:0;

  background:
  radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);

  background-size:4px 4px;
  opacity:.25;

  pointer-events:none;
}

/* ===============================
   BOOK WRAPPER
================================ */

.book-ldms-card > div {

  width:100%;

  display:flex;
  justify-content:center;

}

/* ===============================
   RESPONSIVE BREAKPOINTS
================================ */

@media (max-width:1200px){

  .book-ldms-card > div{
    max-width:800px;
  }

}

@media (max-width:900px){

  .book-ldms-card > div{
    max-width:700px;
  }

}

@media (max-width:768px){

  .book-ldms-card{
    padding:10px;
  }

  .book-ldms-card > div{
    max-width:100%;
  }

}

@media (max-width:500px){

  .book-ldms-card{
    padding:4px;
  }

}

      `}</style>
    </div>
  );
}
