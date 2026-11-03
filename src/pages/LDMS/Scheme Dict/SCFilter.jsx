import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { LDMS_API } from "../../../api/axios";

export default function SCFilter({ onFilter }) {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [applied, setApplied] = useState({});

  /* ---------------- load departments ---------------- */

  useEffect(() => {
    LDMS_API.departments().then((r) => setDepartments(r.data?.results || []));
  }, []);

  /* ---------------- apply filters ---------------- */

  const applyFilters = () => {
    if (!department) return;

    const dept = departments.find((d) => String(d.id) === String(department));

    setApplied({
      department: dept?.name,
    });

    onFilter?.({
      department_id: department,
    });
  };

  /* ---------------- clear ---------------- */

  const remove = () => {
    setDepartment("");
    setApplied({});

    onFilter?.({});
  };

  return (
    <div className="sc-filter">
      {/* FILTER ROW */}
      <div className="filter-bar">
        <div className="filter-title">
          <FaFilter /> Filter by Department
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>

          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button className="apply-btn" onClick={applyFilters}>
          <FaSearch /> Apply
        </button>
      </div>

      {/* APPLIED FILTER */}

      {applied.department && (
        <div className="applied">
          <span className="pill">
            {applied.department}

            <b onClick={remove}>
              <FaTimes />
            </b>
          </span>
        </div>
      )}

      <style>{`

.sc-filter{
display:flex;
flex-direction:column;
gap:12px;
}

/* FILTER BAR */

.filter-bar{

display:flex;
flex-wrap:wrap;
gap:12px;
align-items:center;

padding:10px 12px;

background:#ffffff;

border:1px solid #f1c0c0;

box-shadow:0 4px 10px rgba(0,0,0,0.06);

animation:fadeIn .25s ease;

}

/* TITLE */

.filter-title{

display:flex;
align-items:center;
gap:6px;

font-weight:700;
color:#7f1d1d;

margin-right:8px;

}

/* INPUTS */

select{

min-width:200px;

padding:7px 10px;

border-radius:6px;

border:1px solid #e5e7eb;

font-size:14px;

transition:all .2s ease;

}

select:focus{

outline:none;

border-color:#c62828;

box-shadow:0 0 0 2px rgba(198,40,40,0.15);

}

/* BUTTON */

.apply-btn{

display:flex;
align-items:center;
gap:6px;

background:#c62828;

color:white;

border:none;

padding:7px 14px;

border-radius:8px;

cursor:pointer;

font-weight:600;

transition:all .2s ease;

}

.apply-btn:hover{

background:#a81f1f;

transform:translateY(-1px);

box-shadow:0 6px 12px rgba(0,0,0,0.15);

}

/* APPLIED */

.applied{

display:flex;

gap:8px;

flex-wrap:wrap;

}

.pill{

display:flex;

align-items:center;

gap:6px;

background:#fdecea;

color:#7f1d1d;

padding:5px 10px;

border-radius:16px;

font-size:13px;

font-weight:500;

}

.pill b{

display:flex;

align-items:center;

cursor:pointer;

color:#c62828;

}

/* ANIMATIONS */

@keyframes fadeIn{

from{opacity:0;transform:translateY(-4px);}
to{opacity:1;}

}

/* MOBILE */

@media(max-width:768px){

.filter-bar{

flex-direction:column;

align-items:stretch;

}

select{

width:100%;

}

.apply-btn{

width:100%;

justify-content:center;

}

}

`}</style>
    </div>
  );
}
