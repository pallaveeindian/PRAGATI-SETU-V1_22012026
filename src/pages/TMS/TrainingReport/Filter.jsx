// import React, { useEffect, useState } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const Filters = ({ type, filters, setFilters }) => {

//     // ================= STATE =================
//     const [districts, setDistricts] = useState([]);
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // ================= HANDLE CHANGE =================
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === "district_id") {
//             setFilters({
//                 ...filters,
//                 district_id: value,
//                 block_id: "",
//                 panchayat_id: "",
//                 village_id: "",
//             });
//             setBlocks([]);
//             setPanchayats([]);
//             setVillages([]);

//         } else if (name === "block_id") {
//             setFilters({
//                 ...filters,
//                 block_id: value,
//                 panchayat_id: "",
//                 village_id: "",
//             });
//             setPanchayats([]);
//             setVillages([]);

//         } else if (name === "panchayat_id") {
//             setFilters({
//                 ...filters,
//                 panchayat_id: value,
//                 village_id: "",
//             });
//             setVillages([]);

//         } else {
//             setFilters({ ...filters, [name]: value });
//         }
//     };

//     // ================= DISTRICTS =================
//     useEffect(() => {
//         const fetchDistricts = async () => {
//             try {
//                 const res = await LOOKUP_API.districts.list({
//                     page_size: 5000
//                 });

//                 const data = res.data;
//                 setDistricts(data.results || data || []);
//             } catch (err) {
//                 console.error("District error", err);
//             }
//         };

//         fetchDistricts();
//     }, []);

//     // ================= BLOCKS =================
//     useEffect(() => {
//         if (!filters.district_id) {
//             setBlocks([]);
//             return;
//         }

//         const fetchBlocks = async () => {
//             try {
//                 const res = await LOOKUP_API.blocks.list({
//                     district_id: filters.district_id,
//                     page_size: 5000
//                 });

//                 setBlocks(res.data.results || res.data);
//             } catch (err) {
//                 console.error("Block error", err);
//             }
//         };

//         fetchBlocks();
//     }, [filters.district_id]);

//     // ================= PANCHAYATS =================
//     useEffect(() => {
//         if (!filters.block_id) {
//             setPanchayats([]);
//             return;
//         }

//         const fetchPanchayats = async () => {
//             try {
//                 const res = await LOOKUP_API.panchayatsByBlock(filters.block_id);

//                 console.log("Panchayats:", res.data);

//                 const data = res.data;
//                 setPanchayats(data.results || data || []);
//             } catch (err) {
//                 console.error("Panchayat error", err);
//             }
//         };

//         fetchPanchayats();
//     }, [filters.block_id]);

//     // ================= VILLAGES =================
//     useEffect(() => {
//         if (!filters.panchayat_id) {
//             setVillages([]);
//             return;
//         }

//         const fetchVillages = async () => {
//             try {
//                 const res = await LOOKUP_API.villagesByPanchayat(filters.panchayat_id);

//                 console.log("Villages:", res.data);

//                 const data = res.data;
//                 setVillages(data.results || data || []);
//             } catch (err) {
//                 console.error("Village error", err);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat_id]);

//     return (
//         <div className="filters">

//             {/* ================= LOCATION ================= */}

//             <select
//                 name="district_id"
//                 value={filters.district_id || ""}
//                 onChange={handleChange}
//             >
//                 <option value="">Select District</option>
//                 {districts.map((d, i) => (
//                     <option key={d.id || i} value={d.id}>
//                         {d.district_name_en}
//                     </option>
//                 ))}
//             </select>

//             <select
//                 name="block_id"
//                 value={filters.block_id || ""}
//                 onChange={handleChange}
//                 disabled={!filters.district_id}
//             >
//                 <option value="">Select Block</option>
//                 {blocks.map((b, i) => (
//                     <option key={b.id || b.block_id || i} value={b.id || b.block_id}>
//                         {b.block_name_en}
//                     </option>
//                 ))}
//             </select>

//             {type === "BENEFICIARY" && (
//                 <select
//                     name="panchayat_id"
//                     value={filters.panchayat_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.block_id}
//                 >
//                     <option value="">Select Panchayat</option>
//                     {panchayats.map((p, i) => (
//                         <option key={p.id || i} value={p.id}>
//                             {p.panchayat_name_en}
//                         </option>
//                     ))}
//                 </select>
//             )}

//             {type === "BENEFICIARY" && (
//                 <select
//                     name="village_id"
//                     value={filters.village_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.panchayat_id}
//                 >
//                     <option value="">Select Village</option>
//                     {villages.map((v, i) => (
//                         <option key={v.id || i} value={v.id}>
//                             {v.village_name_english}
//                         </option>
//                     ))}
//                 </select>
//             )}

//             {/* ================= COMMON ================= */}

//             <input name="training_plan_id" placeholder="Training Plan ID" value={filters.training_plan_id || ""} onChange={handleChange} />
//             <input name="training_partner_id" placeholder="Training Partner ID" value={filters.training_partner_id || ""} onChange={handleChange} />
//             <input name="level" placeholder="Level" value={filters.level || ""} onChange={handleChange} />
//             <input name="batch_status" placeholder="Batch Status" value={filters.batch_status || ""} onChange={handleChange} />

//             <input type="date" name="start_date" value={filters.start_date || ""} onChange={handleChange} />
//             <input type="date" name="end_date" value={filters.end_date || ""} onChange={handleChange} />

//             {/* ================= BENEFICIARY ================= */}

//             {type === "BENEFICIARY" && (
//                 <>
//                     <select name="gender" value={filters.gender || ""} onChange={handleChange}>
//                         <option value="">Gender</option>
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                     </select>

//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                     <input name="pld_status" placeholder="PLD Status" value={filters.pld_status || ""} onChange={handleChange} />
//                     <input name="social_category" placeholder="Social Category" value={filters.social_category || ""} onChange={handleChange} />
//                     <input name="religion" placeholder="Religion" value={filters.religion || ""} onChange={handleChange} />
//                 </>
//             )}

//             {/* ================= TRAINER ================= */}

//             {type === "TRAINER" && (
//                 <>
//                     <input name="batch_code" placeholder="Batch Code" value={filters.batch_code || ""} onChange={handleChange} />
//                     <input name="trainer_name" placeholder="Trainer Name" value={filters.trainer_name || ""} onChange={handleChange} />
//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                 </>
//             )}

//         </div>
//     );
// };

// export default Filters;



// import React, { useEffect, useState } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const Filters = ({ type, filters, setFilters }) => {

//     // ================= STATE =================
//     const [districts, setDistricts] = useState([]);
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // ================= HANDLE CHANGE =================
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // if (name === "district_id") {
//         //     setFilters({
//         //         ...filters,
//         //         district_id: value,
//         //         block_id: "",
//         //         panchayat_id: "",
//         //         village_id: "",
//         //     });

//         //     setBlocks([]);
//         //     setPanchayats([]);
//         //     setVillages([]);
//         if (name === "district_id") {
//             const selectedDistrict = districts.find(
//                 (d) => String(d.id) === String(value) // ✅ FIX
//             );

//             console.log("selectedDistrict:", selectedDistrict); // debug

//             setFilters({
//                 ...filters,
//                 district_id: selectedDistrict,
//                 block_id: "",
//                 panchayat_id: "",
//                 village_id: "",
//             });
//         } else if (name === "block_id") {
//             // setFilters({
//             //     ...filters,
//             //     block_id: value,
//             //     panchayat_id: "",
//             //     village_id: "",
//             // });
//             const selectedBlock = blocks.find(
//                 (b) => String(b.id) === String(value)
//             );

//             setFilters({
//                 ...filters,
//                 block_id: selectedBlock,
//                 panchayat_id: "",
//                 village_id: "",
//             });



//             setPanchayats([]);
//             setVillages([]);

//         } else if (name === "panchayat_id") {
//             setFilters({
//                 ...filters,
//                 panchayat_id: value,
//                 village_id: "",
//             });

//             setVillages([]);

//         } else {
//             setFilters({ ...filters, [name]: value });
//         }
//     };

//     // ================= DISTRICTS =================
//     useEffect(() => {
//         const fetchDistricts = async () => {
//             try {
//                 const res = await LOOKUP_API.districts.list({
//                     page_size: 5000,
//                 });

//                 const data = res.data;
//                 setDistricts(data.results || data || []);
//             } catch (err) {
//                 console.error("District error", err);
//             }
//         };

//         fetchDistricts();
//     }, []);

//     // ================= BLOCKS =================
//     useEffect(() => {
//         if (!filters.district_id) {
//             setBlocks([]);
//             return;
//         }

//         const fetchBlocks = async () => {
//             try {
//                 const res = await LOOKUP_API.blocks.list({
//                     district_id: filters.district_id?.id,
//                     page_size: 5000,
//                 });
//                 const data = res.data;
//                 setBlocks(data.results || data || []);
//             } catch (err) {
//                 console.error("Block error", err);
//             }
//         };

//         fetchBlocks();
//     }, [filters.district_id]);

//     // ================= PANCHAYATS =================
//     useEffect(() => {
//         if (!filters.block_id) {
//             setPanchayats([]);
//             return;
//         }

//         const fetchPanchayats = async () => {
//             try {
//                 const res = await LOOKUP_API.panchayatsByBlock(filters.block_id?.id);

//                 const data = res.data;
//                 setPanchayats(data.results || data || []);
//             } catch (err) {
//                 console.error("Panchayat error", err);
//             }
//         };

//         fetchPanchayats();
//     }, [filters.block_id]);

//     // ================= VILLAGES =================
//     useEffect(() => {
//         if (!filters.panchayat_id) {
//             setVillages([]);
//             return;
//         }

//         const fetchVillages = async () => {
//             try {
//                 const res = await LOOKUP_API.villagesByPanchayat(filters.panchayat_id);

//                 const data = res.data;
//                 setVillages(data.results || data || []);
//             } catch (err) {
//                 console.error("Village error", err);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat_id]);

//     return (
//         <div className="filters">

//             {/* ================= LOCATION ================= */}

//             {/* <select
//                 name="district_id"
//                 value={filters.district_id || ""}
//                 onChange={handleChange}
//             >
//                 <option value="">Select District</option>
//                 {districts.map((d) => (
//                     <option key={d.id} value={d.id}>
//                         {d.district_id}
//                     </option>
//                 ))}
//             </select> */}
//             <select
//                 name="district_id"
//                 value={filters.district_id?.id || ""}
//                 onChange={handleChange}
//             >
//                 <option value="">Select District</option>
//                 {districts.map((d, index) => (
//                     <option key={`${d.id}-${index}`} value={d.id}>
//                         {d.district_name_en}
//                     </option>
//                 ))}
//             </select>

//             <select
//                 name="block_id"
//                 value={filters.block_id?.id || ""}
//                 onChange={handleChange}
//                 disabled={!filters.district_id}
//             >
//                 <option value="">Select Block</option>
//                 {blocks.map((b) => (
//                     <option key={b.id || b.block_id} value={b.id || b.block_id}>
//                         {b.block_name_en}
//                     </option>
//                 ))}
//             </select>

//             {type === "BENEFICIARY" && (
//                 <select
//                     name="panchayat_id"
//                     value={filters.panchayat_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.block_id}
//                 >
//                     <option value="">Select Panchayat</option>
//                     {panchayats.map((p) => (
//                         <option key={p.id} value={p.id}>
//                             {p.panchayat_name_en}
//                         </option>
//                     ))}
//                 </select>
//             )}

//             {type === "BENEFICIARY" && (
//                 <select
//                     name="village_id"
//                     value={filters.village_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.panchayat_id}
//                 >
//                     <option value="">Select Village</option>
//                     {villages.map((v) => (
//                         <option key={v.id} value={v.id}>
//                             {v.village_name_english}
//                         </option>
//                     ))}
//                 </select>
//             )}

//             {/* ================= COMMON ================= */}

//             <input name="training_plan_id" placeholder="Training Plan ID" value={filters.training_plan_id || ""} onChange={handleChange} />
//             <input name="training_partner_id" placeholder="Training Partner ID" value={filters.training_partner_id || ""} onChange={handleChange} />
//             <input name="level" placeholder="Level" value={filters.level || ""} onChange={handleChange} />
//             <input name="batch_status" placeholder="Batch Status" value={filters.batch_status || ""} onChange={handleChange} />

//             <input type="date" name="start_date" value={filters.start_date || ""} onChange={handleChange} />
//             <input type="date" name="end_date" value={filters.end_date || ""} onChange={handleChange} />

//             {/* ================= BENEFICIARY ================= */}

//             {type === "BENEFICIARY" && (
//                 <>
//                     <select name="gender" value={filters.gender || ""} onChange={handleChange}>
//                         <option value="">Gender</option>
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                     </select>

//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                     <input name="pld_status" placeholder="PLD Status" value={filters.pld_status || ""} onChange={handleChange} />
//                     <input name="social_category" placeholder="Social Category" value={filters.social_category || ""} onChange={handleChange} />
//                     <input name="religion" placeholder="Religion" value={filters.religion || ""} onChange={handleChange} />
//                 </>
//             )}

//             {/* ================= TRAINER ================= */}

//             {type === "TRAINER" && (
//                 <>
//                     <input name="batch_code" placeholder="Batch Code" value={filters.batch_code || ""} onChange={handleChange} />
//                     <input name="trainer_name" placeholder="Trainer Name" value={filters.trainer_name || ""} onChange={handleChange} />
//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                 </>
//             )}

//         </div>
//     );
// };

// export default Filters;



// import React, { useEffect, useState } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const Filters = ({ type, filters, setFilters }) => {
//     // ================= STATE FOR LISTS =================
//     const [districts, setDistricts] = useState([]);
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // ================= HANDLE CHANGE =================
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // Reset logic: when a parent changes, clear all children
//         if (name === "district_id") {
//             setFilters((prev) => ({
//                 ...prev,
//                 district_id: value,
//                 block_id: "",
//                 panchayat_id: "",
//                 village_id: "",
//             }));
//             setBlocks([]);
//             setPanchayats([]);
//             setVillages([]);
//         }
//         else if (name === "block_id") {
//             setFilters((prev) => ({
//                 ...prev,
//                 block_id: value,
//                 panchayat_id: "",
//                 village_id: "",
//             }));
//             setPanchayats([]);
//             setVillages([]);
//         }
//         else if (name === "panchayat_id") {
//             setFilters((prev) => ({
//                 ...prev,
//                 panchayat_id: value,
//                 village_id: "",
//             }));
//             setVillages([]);
//         }
//         else {
//             setFilters((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     // ================= FETCH DISTRICTS =================
//     useEffect(() => {
//         const fetchDistricts = async () => {
//             try {
//                 const res = await LOOKUP_API.districts.list({ page_size: 5000 });
//                 const data = res.data?.results || res.data || [];
//                 setDistricts(data);
//             } catch (err) {
//                 console.error("District error", err);
//             }
//         };
//         fetchDistricts();
//     }, []);

//     // ================= FETCH BLOCKS =================
//     useEffect(() => {
//         // IMPORTANT: Only fetch if we have a valid district_id string
//         if (!filters.district_id || filters.district_id === "") {
//             setBlocks([]);
//             return;
//         }

//         const fetchBlocks = async () => {
//             try {
//                 const res = await LOOKUP_API.blocks.list({
//                     district_id: filters.district_id,
//                     page_size: 5000,
//                 });
//                 const data = res.data?.results || res.data || [];
//                 setBlocks(data);
//             } catch (err) {
//                 console.error("Block error", err);
//             }
//         };
//         fetchBlocks();
//     }, [filters.district_id]);

//     // ================= FETCH PANCHAYATS =================
//     useEffect(() => {
//         if (!filters.block_id) {
//             setPanchayats([]);
//             return;
//         }

//         const fetchPanchayats = async () => {
//             try {
//                 const res = await LOOKUP_API.panchayatsByBlock(filters.block_id);
//                 const data = res.data?.results || res.data || [];
//                 setPanchayats(data);
//             } catch (err) {
//                 console.error("Panchayat error", err);
//             }
//         };
//         fetchPanchayats();
//     }, [filters.block_id]);

//     // ================= FETCH VILLAGES =================
//     useEffect(() => {
//         if (!filters.panchayat_id) {
//             setVillages([]);
//             return;
//         }

//         const fetchVillages = async () => {
//             try {
//                 const res = await LOOKUP_API.villagesByPanchayat(filters.panchayat_id);
//                 const data = res.data?.results || res.data || [];
//                 setVillages(data);
//             } catch (err) {
//                 console.error("Village error", err);
//             }
//         };
//         fetchVillages();
//     }, [filters.panchayat_id]);

//     return (
//         <div className="filters">
//             {/* DISTRICT */}
//             <select
//                 name="district_id"
//                 value={filters.district_id || ""}
//                 onChange={handleChange}
//             >
//                 <option value="">Select District</option>
//                 {districts.map((d) => {
//                     const id = d.id || d.district_id; // Handle different API key names
//                     return (
//                         <option key={`dist-${id}`} value={id}>
//                             {d.district_name_en || d.district_name || "Unknown"}
//                         </option>
//                     );
//                 })}
//             </select>

//             {/* BLOCK */}
//             <select
//                 name="block_id"
//                 value={filters.block_id || ""}
//                 onChange={handleChange}
//                 disabled={!filters.district_id}
//             >
//                 <option value="">Select Block</option>
//                 {blocks.map((b) => {
//                     const id = b.id || b.block_id;
//                     return (
//                         <option key={`block-${id}`} value={id}>
//                             {b.block_name_en || b.block_name || "Unknown"}
//                         </option>
//                     );
//                 })}
//             </select>

//             {/* PANCHAYAT */}
//             {type === "BENEFICIARY" && (
//                 <select
//                     name="panchayat_id"
//                     value={filters.panchayat_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.block_id}
//                 >
//                     <option value="">Select Panchayat</option>
//                     {panchayats.map((p) => {
//                         const id = p.id || p.panchayat_id;
//                         return (
//                             <option key={`panch-${id}`} value={id}>
//                                 {p.panchayat_name_en || "Unknown"}
//                             </option>
//                         );
//                     })}
//                 </select>
//             )}

//             {/* VILLAGE */}
//             {type === "BENEFICIARY" && (
//                 <select
//                     name="village_id"
//                     value={filters.village_id || ""}
//                     onChange={handleChange}
//                     disabled={!filters.panchayat_id}
//                 >
//                     <option value="">Select Village</option>
//                     {villages.map((v) => {
//                         const id = v.id || v.village_id;
//                         return (
//                             <option key={`vill-${id}`} value={id}>
//                                 {v.village_name_english || v.village_name || "Unknown"}
//                             </option>
//                         );
//                     })}
//                 </select>
//             )}

//             {/* COMMON INPUTS */}
//             <input
//                 name="training_plan_id"
//                 placeholder="Training Plan ID"
//                 value={filters.training_plan_id || ""}
//                 onChange={handleChange}
//             />

//             <input
//                 type="date"
//                 name="start_date"
//                 value={filters.start_date || ""}
//                 onChange={handleChange}
//             />


//             <input name="level" placeholder="Level" value={filters.level || ""} onChange={handleChange} />
//             <input name="batch_status" placeholder="Batch Status" value={filters.batch_status || ""} onChange={handleChange} />
//             {type === "BENEFICIARY" && (
//                 <>
//                     <select name="gender" value={filters.gender || ""} onChange={handleChange}>
//                         <option value="">Gender</option>
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                     </select>

//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                     <input name="pld_status" placeholder="PLD Status" value={filters.pld_status || ""} onChange={handleChange} />
//                     <input name="social_category" placeholder="Social Category" value={filters.social_category || ""} onChange={handleChange} />
//                     <input name="religion" placeholder="Religion" value={filters.religion || ""} onChange={handleChange} />
//                 </>
//             )}

//             {/* ================= TRAINER ================= */}

//             {type === "TRAINER" && (
//                 <>
//                     <input name="batch_code" placeholder="Batch Code" value={filters.batch_code || ""} onChange={handleChange} />
//                     <input name="trainer_name" placeholder="Trainer Name" value={filters.trainer_name || ""} onChange={handleChange} />
//                     <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
//                 </>
//             )}
//         </div>
//     );
// };

// export default Filters;



// import React, { useEffect, useState } from "react";
// import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
// import { getCanonicalRole } from "../../../utils/roleUtils";
// import { saveAs } from "file-saver";

// /* ================= GEO SCOPE HELPERS ================= */
// const GEOSCOPE_KEY = "ps_user_geoscope";
// function getGeoscope() {
//     try {
//         const raw = localStorage.getItem(GEOSCOPE_KEY);
//         return raw ? JSON.parse(raw) : null;
//     } catch { return null; }
// }
// function safeFirst(arr) { return Array.isArray(arr) && arr.length ? arr[0] : null; }

// export default function TrainingReportManager({ user }) {
//     const role = getCanonicalRole(user || {});

//     // ================= 1. FILTER STATE =================
//     const [filters, setFilters] = useState({
//         training_type: "BENEFICIARY",
//         mandal_id: "",
//         district_category_id: "",
//         district_id: "",
//         block_id: "",
//         panchayat_id: "",
//         village_id: "",
//         theme_id: "",
//         training_plan_id: "",
//         training_partner_id: "",
//         level: "",
//         batch_status: "",
//         batch_type: "",
//         gender: "",
//         designation: "",
//         pld_status: "",
//         social_category: "",
//         religion: "",
//         trainer_name: "",
//     });

//     // ================= 2. LOOKUPS STATE =================
//     const [lookups, setLookups] = useState({
//         districts: [],
//         blocks: [],
//         panchayats: [],
//         villages: [],
//         mandals: [],
//         categories: [],
//         themes: [],
//         plans: [],
//         partners: []
//     });

//     const [reportData, setReportData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [exporting, setExporting] = useState(false);

//     // Helper to safely extract arrays from DRF responses
//     const extractData = (res) => {
//         if (!res) return [];
//         // Check if data is decrypted and inside results (paginated) or is the raw array
//         const data = res.data?.results || res.data || [];
//         return Array.isArray(data) ? data : [];
//     };

//     // ================= 3. INITIAL LOAD =================
//     useEffect(() => {
//         (async () => {
//             try {
//                 const [distRes, themeRes, partnerRes] = await Promise.all([
//                     LOOKUP_API.districts.list({ page_size: 500 }),
//                     TMS_API.trainingThemes.list({ page_size: 200 }),
//                     TMS_API.trainingPartners.list({ page_size: 200 })
//                 ]);

//                 let mandals = [], categories = [];
//                 if (role === "smmu") {
//                     const [mRes, cRes] = await Promise.all([
//                         LOOKUP_API.mandals.list({ page_size: 500 }),
//                         LOOKUP_API.district_categories.list()
//                     ]);
//                     mandals = extractData(mRes);
//                     categories = extractData(cRes);
//                 }

//                 setLookups(prev => ({
//                     ...prev,
//                     districts: extractData(distRes),
//                     themes: extractData(themeRes),
//                     partners: extractData(partnerRes),
//                     mandals,
//                     categories
//                 }));

//                 const geo = getGeoscope() || {};
//                 if (role === "dmmu") {
//                     const dId = geo.district_id || safeFirst(geo.districts);
//                     if (dId) setFilters(f => ({ ...f, district_id: dId }));
//                 } else if (role === "bmmu") {
//                     const dId = geo.district_id || safeFirst(geo.districts);
//                     const bId = geo.block_id || safeFirst(geo.blocks);
//                     if (dId && bId) setFilters(f => ({ ...f, district_id: dId, block_id: bId }));
//                 }
//             } catch (err) {
//                 console.error("Initial load error", err);
//             }
//         })();
//     }, [role]);

//     // ================= 4. CASCADING SELECTORS =================
//     useEffect(() => {
//         if (!filters.district_id) {
//             setLookups(p => ({ ...p, blocks: [], panchayats: [], villages: [] }));
//             return;
//         }
//         LOOKUP_API.blocks.list({ district_id: filters.district_id, page_size: 500 })
//             .then(r => setLookups(p => ({ ...p, blocks: extractData(r) })));
//     }, [filters.district_id]);

//     useEffect(() => {
//         if (!filters.block_id || filters.training_type !== "BENEFICIARY") {
//             setLookups(p => ({ ...p, panchayats: [] }));
//             return;
//         }
//         LOOKUP_API.panchayatsByBlock(filters.block_id)
//             .then(r => setLookups(p => ({ ...p, panchayats: extractData(r) })));
//     }, [filters.block_id, filters.training_type]);

//     useEffect(() => {
//         if (!filters.panchayat_id || filters.training_type !== "BENEFICIARY") {
//             setLookups(p => ({ ...p, villages: [] }));
//             return;
//         }
//         LOOKUP_API.villagesByPanchayat(filters.panchayat_id)
//             .then(r => setLookups(p => ({ ...p, villages: extractData(r) })));
//     }, [filters.panchayat_id, filters.training_type]);

//     useEffect(() => {
//         if (!filters.theme_id) {
//             setLookups(p => ({ ...p, plans: [] }));
//             return;
//         }
//         TMS_API.trainingPlans.list({ theme: filters.theme_id })
//             .then(r => setLookups(p => ({ ...p, plans: extractData(r) })));
//     }, [filters.theme_id]);

//     // ================= 5. EVENT HANDLERS =================
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));

//         if (name === "district_id") setFilters(f => ({ ...f, block_id: "", panchayat_id: "", village_id: "" }));
//         if (name === "block_id") setFilters(f => ({ ...f, panchayat_id: "", village_id: "" }));
//         if (name === "panchayat_id") setFilters(f => ({ ...f, village_id: "" }));
//         if (name === "theme_id") setFilters(f => ({ ...f, training_plan_id: "" }));
//     };

//     const fetchReport = async (isExport = false) => {
//         if (isExport) setExporting(true); else setLoading(true);
//         try {
//             const params = Object.fromEntries(
//                 Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
//             );

//             if (isExport) {
//                 params.export = "excel";
//                 const response = await api.get("cmp-training-report/", { params, responseType: 'blob' });
//                 saveAs(response.data, `Training_Report_${filters.training_type}.xlsx`);
//             } else {
//                 const res = await api.get("cmp-training-report/", { params });
//                 setReportData(Array.isArray(res.data) ? res.data : []);
//             }
//         } catch (err) {
//             console.error("API Error", err);
//         } finally {
//             setLoading(false);
//             setExporting(false);
//         }
//     };

//     // ================= 6. RENDER =================
//     return (
//         <div style={{ padding: "20px" }}>
//             <h3 style={{ color: "#3d6ba6", marginBottom: "20px" }}>Training Participant Report</h3>

//             <div style={filterPanelStyle}>
//                 <div className="filter-grid">
//                     <div className="filter-box">
//                         <label>Training Type *</label>
//                         <select name="training_type" value={filters.training_type} onChange={handleChange}>
//                             <option value="BENEFICIARY">Beneficiary</option>
//                             <option value="TRAINER">Trainer</option>
//                         </select>
//                     </div>

//                     {role === "smmu" && (
//                         <>
//                             <div className="filter-box">
//                                 <label>Mandal</label>
//                                 <select name="mandal_id" value={filters.mandal_id} onChange={handleChange}>
//                                     <option value="">All Mandals</option>
//                                     {lookups.mandals?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//                                 </select>
//                             </div>
//                         </>
//                     )}

//                     <div className="filter-box">
//                         <label>District</label>
//                         <select name="district_id" value={filters.district_id} onChange={handleChange} disabled={role === "dmmu" || role === "bmmu"}>
//                             <option value="">All Districts</option>
//                             {lookups.districts?.map(d => <option key={d.district_id} value={d.district_id}>{d.district_name_en}</option>)}
//                         </select>
//                     </div>

//                     <div className="filter-box">
//                         <label>Block</label>
//                         <select name="block_id" value={filters.block_id} onChange={handleChange} disabled={role === "bmmu" || !filters.district_id}>
//                             <option value="">All Blocks</option>
//                             {lookups.blocks?.map(b => <option key={b.block_id} value={b.block_id}>{b.block_name_en}</option>)}
//                         </select>
//                     </div>

//                     {filters.training_type === "BENEFICIARY" && (
//                         <>
//                             <div className="filter-box">
//                                 <label>Panchayat</label>
//                                 <select name="panchayat_id" value={filters.panchayat_id} onChange={handleChange} disabled={!filters.block_id}>
//                                     <option value="">All Panchayats</option>
//                                     {lookups.panchayats?.map(p => <option key={p.panchayat_id} value={p.panchayat_id}>{p.panchayat_name_en}</option>)}
//                                 </select>
//                             </div>
//                         </>
//                     )}

//                     <div className="filter-box">
//                         <label>Theme</label>
//                         <select name="theme_id" value={filters.theme_id} onChange={handleChange}>
//                             <option value="">All Themes</option>
//                             {lookups.themes?.map(t => <option key={t.id} value={t.id}>{t.theme_name}</option>)}
//                         </select>
//                     </div>

//                     <div className="filter-box">
//                         <label>Training Plan</label>
//                         <select name="training_plan_id" value={filters.training_plan_id} onChange={handleChange} disabled={!filters.theme_id}>
//                             <option value="">All Plans</option>
//                             {lookups.plans?.map(p => <option key={p.id} value={p.id}>{p.training_name}</option>)}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="action-row">
//                     <button className="btn-view" onClick={() => fetchReport(false)} disabled={loading || exporting}>
//                         {loading ? "Searching..." : "View Report"}
//                     </button>
//                     <button className="btn-excel" onClick={() => fetchReport(true)} disabled={loading || exporting}>
//                         {exporting ? "Downloading..." : "Export Excel"}
//                     </button>
//                 </div>
//             </div>

//             <div className="table-container">
//                 <table className="report-table">
//                     <thead>
//                         <tr>
//                             {reportData.length > 0 ? (
//                                 Object.keys(reportData[0]).map(key => <th key={key}>{key}</th>)
//                             ) : (
//                                 <th style={{ textAlign: 'center' }}>No results to display.</th>
//                             )}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reportData.map((row, index) => (
//                             <tr key={index}>
//                                 {Object.values(row).map((val, i) => <td key={i}>{val ?? "-"}</td>)}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <style>{`
//                 .filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
//                 .filter-box { display: flex; flex-direction: column; }
//                 .filter-box label { font-size: 11px; font-weight: 700; color: #444; margin-bottom: 3px; text-transform: uppercase; }
//                 .filter-box select { padding: 8px; border: 1px solid #3d6ba6; border-radius: 4px; font-size: 13px; }
//                 .action-row { margin-top: 20px; display: flex; gap: 15px; justify-content: center; }
//                 .btn-view { background: #3d6ba6; color: white; border: none; padding: 10px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; }
//                 .btn-excel { background: #1b5e20; color: white; border: none; padding: 10px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; }
//                 .table-container { margin-top: 25px; overflow-x: auto; border: 1px solid #ccc; border-radius: 8px; background: white; min-height: 100px;}
//                 .report-table { width: 100%; border-collapse: collapse; font-size: 12px; }
//                 .report-table th { background: #3d6ba6; color: white; padding: 12px; text-align: left; white-space: nowrap; }
//                 .report-table td { padding: 10px 12px; border-bottom: 1px solid #eee; white-space: nowrap; }
//             `}</style>
//         </div>
//     );
// }

// const filterPanelStyle = {
//     background: "#eef2f7",
//     padding: "20px",
//     borderRadius: "8px",
//     border: "1px solid #3d6ba6"
// };


import React, { useEffect, useState } from "react";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { saveAs } from "file-saver";

/* ================= GEO SCOPE HELPERS ================= */
const GEOSCOPE_KEY = "ps_user_geoscope";
function getGeoscope() {
    try {
        const raw = localStorage.getItem(GEOSCOPE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}
function safeFirst(arr) { return Array.isArray(arr) && arr.length ? arr[0] : null; }

export default function TrainingReportManager({ user }) {
    const role = getCanonicalRole(user || {});

    // ================= 1. FILTER STATE =================
    const [filters, setFilters] = useState({
        training_type: "",
        mandal_id: "",
        district_category_id: "",
        district_id: "",
        block_id: "",
        panchayat_id: "",
        village_id: "",
        aspirational_only: false,

        training_partner_id: "",
        theme_id: "",
        training_plan_id: "",

        status: "",      // Request Status
        level: "",       // STATE, DISTRICT, BLOCK
        batch_type: "",  // SBC, etc

        gender: "",
        designation: "",
    });

    // ================= 2. LOOKUPS STATE =================
    const [lookups, setLookups] = useState({
        districts: [],
        blocks: [],
        panchayats: [],
        villages: [],
        mandals: [],
        categories: [],
        themes: [],
        plans: [],
        partners: []
    });

    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const extractData = (res) => {
        if (!res) return [];
        const data = res.data?.results || res.data || [];
        return Array.isArray(data) ? data : [];
    };

    // ================= 3. INITIAL LOAD =================
    useEffect(() => {
        (async () => {
            try {
                const [distRes, themeRes, partnerRes] = await Promise.all([
                    LOOKUP_API.districts.list({ page_size: 500 }),
                    TMS_API.trainingThemes.list({ page_size: 200 }),
                    TMS_API.trainingPartners.list({ page_size: 200 })
                ]);

                let mandals = [], categories = [];
                if (role === "smmu") {
                    const [mRes, cRes] = await Promise.all([
                        LOOKUP_API.mandals.list({ page_size: 500 }),
                        LOOKUP_API.district_categories.list()
                    ]);
                    mandals = extractData(mRes);
                    categories = extractData(cRes);
                }

                setLookups(prev => ({
                    ...prev,
                    districts: extractData(distRes),
                    themes: extractData(themeRes),
                    partners: extractData(partnerRes),
                    mandals,
                    categories
                }));

                // Role-based Auto Selection
                const geo = getGeoscope() || {};
                if (role === "dmmu") {
                    const dId = geo.district_id || safeFirst(geo.districts);
                    if (dId) setFilters(f => ({ ...f, district_id: dId }));
                } else if (role === "bmmu") {
                    const dId = geo.district_id || safeFirst(geo.districts);
                    const bId = geo.block_id || safeFirst(geo.blocks);
                    if (dId && bId) setFilters(f => ({ ...f, district_id: dId, block_id: bId }));
                }
            } catch (err) {
                console.error("Initial load error", err);
            }
        })();
    }, [role]);

    // ================= 4. CASCADING SELECTORS =================

    // Blocks & Mandals based on District
    useEffect(() => {
        if (!filters.district_id) {
            setLookups(p => ({ ...p, blocks: [], panchayats: [], villages: [] }));
            return;
        }

        // Fetch Blocks
        LOOKUP_API.blocks.list({ district_id: filters.district_id, page_size: 500 })
            .then(r => {
                let data = extractData(r);
                if (filters.aspirational_only) {
                    data = data.filter(b => Number(b.is_aspirational) === 1);
                }
                setLookups(p => ({ ...p, blocks: data }));
            });

        // Fetch Mandals if SMMU
        if (role === "smmu") {
            LOOKUP_API.mandals.list({ district: filters.district_id, page_size: 500 })
                .then(r => setLookups(p => ({ ...p, mandals: extractData(r) })));
        }
    }, [filters.district_id, filters.aspirational_only, role]);

    // Panchayats
    useEffect(() => {
        if (!filters.block_id || filters.training_type !== "BENEFICIARY") {
            setLookups(p => ({ ...p, panchayats: [] }));
            return;
        }
        LOOKUP_API.panchayatsByBlock(filters.block_id)
            .then(r => setLookups(p => ({ ...p, panchayats: extractData(r) })));
    }, [filters.block_id, filters.training_type]);

    // Training Plans
    useEffect(() => {
        if (!filters.theme_id) {
            setLookups(p => ({ ...p, plans: [] }));
            return;
        }
        TMS_API.trainingPlans.list({ theme: filters.theme_id })
            .then(r => setLookups(p => ({ ...p, plans: extractData(r) })));
    }, [filters.theme_id]);

    // ================= 5. EVENT HANDLERS =================
    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     const val = type === 'checkbox' ? checked : value;

    //     setFilters(prev => ({ ...prev, [name]: val }));

    //     // Reset children logic
    //     if (name === "district_id") setFilters(f => ({ ...f, block_id: "", mandal_id: "", panchayat_id: "", village_id: "" }));
    //     if (name === "block_id") setFilters(f => ({ ...f, panchayat_id: "", village_id: "" }));
    //     if (name === "theme_id") setFilters(f => ({ ...f, training_plan_id: "" }));
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFilters(prev => {
            let updated = { ...prev, [name]: val };

            if (name === "district_id") {
                updated.block_id = "";
                updated.mandal_id = "";
                updated.panchayat_id = "";
                updated.village_id = "";
            }

            if (name === "block_id") {
                updated.panchayat_id = "";
                updated.village_id = "";
            }

            if (name === "theme_id") {
                updated.training_plan_id = "";
            }

            return updated;
        });
    };
    // const fetchReport = async (isExport = false) => {
    //     if (isExport) setExporting(true); else setLoading(true);
    //     try {
    //         // const params = Object.fromEntries(
    //         //     Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== false)
    //         // );
    //         let params = Object.fromEntries(
    //             Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== false)
    //         );

    //         // 🔥 IMPORTANT MAPPING (NO FILTER REMOVED)
    //         if (params.status) {
    //             params.batch_status = params.status;
    //             delete params.status;
    //         }
    //         // if (isExport) {
    //         //     params.export = "excel";
    //         //     const response = await api.get(TMS_API.trainingReports.list, { params, responseType: 'blob' });
    //         //     saveAs(response.data, `Training_Report_${filters.training_type}_${new Date().toISOString().split('T')[0]}.xlsx`);
    //         // } else {
    //         //     const res = await TMS_API.trainingReports.list(params);
    //         //     setReportData(Array.isArray(res.data) ? res.data : []);
    //         // }
    //         if (isExport) {
    //             params.export = "excel";

    //             const response = await TMS_API.trainingReports.list(params, {
    //                 responseType: "blob",
    //             });

    //             saveAs(
    //                 response.data,
    //                 `Training_Report_${filters.training_type}_${new Date()
    //                     .toISOString()
    //                     .split("T")[0]}.xlsx`
    //             );
    //         } else {
    //             const res = await TMS_API.trainingReports.list(params);
    //             setReportData(Array.isArray(res.data) ? res.data : []);
    //         }
    //     } catch (err) {
    //         console.error("API Error", err);
    //     } finally {
    //         setLoading(false);
    //         setExporting(false);
    //     }
    // };

    // ================= 6. RENDER =================

    // ... inside TrainingReportManager component

    const fetchReport = async (isExport = false) => {
        // 1. STOPS SEARCH IF MANDATORY TYPE IS MISSING
        if (!filters.training_type) {
            alert("Please select a Participant Type (Beneficiary or Trainer) first.");
            return;
        }

        if (isExport) setExporting(true);
        else setLoading(true);

        try {
            // 2. CLEAN PARAMS
            let params = Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, v]) => v !== "" && v !== null && v !== false
                )
            );

            // 3. BACKEND MAPPING
            if (params.status) {
                params.batch_status = params.status;
                delete params.status;
            }

            // 4. ATTENDANCE LOGIC ALERT (Frontend Workaround)
            // If user picks PENDING, they likely won't get data because backend checks 'attended=True'
            if (params.batch_status === "PENDING") {
                console.warn("Backend only returns participants with marked attendance. Pending batches may return empty results.");
            }

            console.log("FINAL PARAMS SENDING TO BACKEND:", params);

            if (isExport) {
                params.export = "excel";
                const res = await api.get("/tms/cmp-training-report/", {
                    params,
                    responseType: "blob",
                });
                saveAs(res.data, `Report_${filters.training_type}_${new Date().toISOString().split("T")[0]}.xlsx`);
            } else {
                const res = await api.get("/tms/cmp-training-report/", { params });

                // 5. DATA FALLBACK
                const data = Array.isArray(res.data) ? res.data : [];
                setReportData(data);

                if (data.length === 0) {
                    alert("No records found");
                }
            }
        } catch (err) {
            console.error("API Error", err);
        } finally {
            setLoading(false);
            setExporting(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3 style={{ color: "#3d6ba6", marginBottom: "20px" }}>Training Report</h3>

            <div className="filter-container-custom">
                {/* ===== ROW 1 ===== */}
                <div className="filter-row top-row">

                    {/* Participant Type */}
                    <div className="filter-box">
                        <label>Type</label>
                        <select
                            name="training_type"
                            value={filters.training_type}
                            onChange={handleChange}
                            className="filter-input-styled"
                        >
                            <option value="">Select</option>
                            <option value="BENEFICIARY">Beneficiary</option>
                            <option value="TRAINER">Trainer</option>
                        </select>
                    </div>

                    {/* District */}
                    {role !== "bmmu" && (
                        <div className="filter-box">
                            <label>District</label>
                            <select
                                name="district_id"
                                value={filters.district_id}
                                onChange={handleChange}
                                disabled={role === "dmmu"}
                                className="filter-input-styled"
                            >
                                <option value="">Select</option>
                                {lookups.districts?.map(d => (
                                    <option key={d.district_id} value={d.district_id}>
                                        {d.district_name_en}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Aspirational */}
                    {role !== "bmmu" && (
                        <div className="filter-box">
                            <label>Aspirational</label>
                            <label className="aspirational-label">
                                <input
                                    type="checkbox"
                                    name="aspirational_only"
                                    checked={filters.aspirational_only}
                                    onChange={handleChange}
                                />
                                Yes
                            </label>
                        </div>
                    )}

                    {/* Block */}
                    <div className="filter-box">
                        <label>Block</label>
                        <select
                            name="block_id"
                            value={filters.block_id}
                            onChange={handleChange}
                            disabled={!filters.district_id}
                            className="filter-input-styled"
                        >
                            <option value="">Select</option>
                            {lookups.blocks?.map(b => (
                                <option key={b.block_id} value={b.block_id}>
                                    {b.block_name_en}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ===== ROW 2 ===== */}
                <div className="filter-row bottom-row">

                    {/* Partner */}
                    <div className="filter-box">
                        <label>Partner</label>
                        <select
                            name="training_partner_id"
                            value={filters.training_partner_id}
                            onChange={handleChange}
                            className="filter-input-styled"
                        >
                            <option value="">Select</option>
                            {lookups.partners?.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Theme */}
                    <div className="filter-box">
                        <label>Theme</label>
                        <select
                            name="theme_id"
                            value={filters.theme_id}
                            onChange={handleChange}
                            className="filter-input-styled"
                        >
                            <option value="">Select</option>
                            {lookups.themes?.map(t => (
                                <option key={t.id} value={t.id}>{t.theme_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Plan */}
                    <div className="filter-box">
                        <label>TRaining Plan</label>
                        <select
                            name="training_plan_id"
                            value={filters.training_plan_id}
                            onChange={handleChange}
                            disabled={!filters.theme_id}
                            className="filter-input-styled"
                        >
                            <option value="">Select</option>
                            {lookups.plans?.map(p => (
                                <option key={p.id} value={p.id}>{p.training_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="filter-box">
                        <label>Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="filter-input-styled"
                        >
                            <option value="">All</option>
                            {["PENDING", "ONGOING", "REVIEW", "COMPLETED", "REJECTED"].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level */}
                    <div className="filter-box">
                        <label>Level</label>
                        <select
                            name="level"
                            value={filters.level}
                            onChange={handleChange}
                            className="filter-input-styled"
                        >
                            <option value="">All</option>
                            <option value="STATE">State</option>
                            <option value="DISTRICT">District</option>
                            <option value="BLOCK">Block</option>
                        </select>
                    </div>
                </div>

                <div className="action-row">
                    <button className="btn-view" onClick={() => fetchReport(false)} disabled={loading || exporting}>
                        {loading ? "Searching..." : "View Report"}
                    </button>
                    <button className="btn-excel" onClick={() => fetchReport(true)} disabled={loading || exporting}>
                        {exporting ? "Downloading..." : "Export Excel"}
                    </button>
                </div>
            </div>

            {/* <div className="table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            {reportData.length > 0 ? (
                                Object.keys(reportData[0]).map(key => <th key={key}>{key}</th>)
                            ) : (
                                <th style={{ textAlign: 'center' }}>No results to display.</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((val, i) => <td key={i}>{val ?? "-"}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            <div className="table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            {reportData.length > 0 ? (
                                Object.keys(reportData[0]).map(key => <th key={key}>{key}</th>)
                            ) : (
                                <th style={{ textAlign: 'center' }}>Report Results</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? (
                            reportData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((val, i) => <td key={i}>{val ?? "-"}</td>)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="20" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    {loading ? "Fetching data..." : (
                                        <div>
                                            <p>No data found for the selected filters.</p>
                                            <p style={{ fontSize: '11px', color: '#999' }}>
                                                Note: This report only includes participants where <b>Attendance</b> has been marked in the system.
                                            </p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
        .filter-container-custom {
            background: #e4ecf5;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #3d6ba6;
            margin-bottom: 20px;
        }
       .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
       .filter-box {
    flex: 1 1 180px;
    display: flex;
    flex-direction: column;
}
        .filter-box label {
            font-size: 11px;
            font-weight: 700;
            color: #2b4e72;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .filter-input-styled {
            padding: 8px;
            border: 1px solid #3d6ba6;
            border-radius: 6px;
            font-size: 13px;
            background: #fff;
            outline: none;
        }
        .aspirational-label {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 10px;
            background: #fff;
            border: 1px solid #3d6ba6;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            height: 35px;
        }
        .action-row {
            margin-top: 20px;
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .btn-view { background: #3d6ba6; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-excel { background: #1b5e20; color: white; border: none; padding: 10px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .table-container { margin-top: 25px; overflow-x: auto; border: 1px solid #ccc; border-radius: 8px; background: white; min-height: 100px;}
        .report-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .report-table th { background: #3d6ba6; color: white; padding: 12px; text-align: left; white-space: nowrap; }
        .report-table td { padding: 10px 12px; border-bottom: 1px solid #eee; white-space: nowrap; }
        .report-table tr:hover { background: #f1f4f8; }
        /* TOP ROW - 4 ITEMS */
.top-row .filter-box {
    flex: 1 1 22%;
}

/* BOTTOM ROW - AUTO FIT */
.bottom-row .filter-box {
    flex: 1 1 18%;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
    .filter-box {
        flex: 1 1 100%;
    }
}
      `}</style>
        </div>
    );
}