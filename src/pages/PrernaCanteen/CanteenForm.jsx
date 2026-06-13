// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope from "../../Hooks/useUserGeoscope";


// export default function CanteenForm() {
//     // Geography Dropdown Options State
//     const [districts, setDistricts] = useState([]);
//     const [blocks, setBlocks] = useState([]);
//     const [shgs, setShgs] = useState([]);


//     // =================================================
//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");
//     const [clf, setClf] = useState("");

//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     const { geoScope, loading } = useUserGeoscope();

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Helper utility updated to capture your backend's "data" key layout wrapper
//     const extractListing = (response) => {
//         if (!response) return [];

//         // Unify Axios data vs raw object payload
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];

//         // FIX: Check for the custom layout "data" array key from your backend meta payload
//         if (payload.data && Array.isArray(payload.data)) return payload.data;

//         // Fallback checks for standard DRF pagination or raw listings arrays
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;

//         return [];
//     };

//     useEffect(() => {
//         if (!geoScope) return;

//         console.log("User GeoScope:", geoScope);

//         // response structure ke hisab se fields adjust kar lena
//         const districtId =
//             geoScope?.district_id ||
//             geoScope?.district ||
//             "";

//         const blockId =
//             geoScope?.block_id ||
//             geoScope?.block ||
//             "";

//         if (districtId) {
//             setDistrict(String(districtId));
//         }

//         if (blockId) {
//             setBlock(String(blockId));
//         }
//     }, [geoScope]);

//     // 1. Fetch Districts on Mount
//     useEffect(() => {
//         const fetchDistricts = async () => {
//             try {
//                 const response = await LOOKUP_API.districts.list();
//                 setDistricts(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching districts", err);
//                 setDistricts([]);
//             }
//         };
//         fetchDistricts();
//     }, []);

//     // 2. Fetch Blocks when District ID changes
//     // useEffect(() => {
//     //     const fetchBlocks = async () => {
//     //         if (!district) {
//     //             setBlocks([]);
//     //             return;
//     //         }
//     //         try {
//     //             const response = await LOOKUP_API.blocksByDistrict(district);
//     //             setBlocks(extractListing(response));
//     //         } catch (err) {
//     //             console.error("Error fetching blocks", err);
//     //             setBlocks([]);
//     //         }
//     //     };

//     //     setBlock("");
//     //     setShg("");
//     //     setAvailableMembers([]);
//     //     setSelectedMembers([]);
//     //     setClf("");
//     //     fetchBlocks();
//     // }, [district]);

//     useEffect(() => {
//         const fetchBlocks = async () => {
//             if (!district) {
//                 setBlocks([]);
//                 return;
//             }

//             try {
//                 const response =
//                     await LOOKUP_API.blocksByDistrict(district);

//                 setBlocks(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching blocks", err);
//                 setBlocks([]);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");

//         fetchBlocks();
//     }, [district]);

//     // 3. Fetch SHGs when Block ID changes
//     useEffect(() => {
//         const fetchShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block);
//                 setShgs(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//         fetchShgs();
//     }, [block]);

//     // 4. Fetch Members when SHG changes
//     useEffect(() => {
//         const fetchMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg);
//                 setAvailableMembers(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             }
//         };

//         fetchMembers();
//     }, [shg]);

//     // 5. Resolve CLF dynamically when members are selected
//     useEffect(() => {
//         const resolveClf = async () => {
//             if (selectedMembers.length === 0) {
//                 setClf("");
//                 return;
//             }
//             try {
//                 const response = await LOOKUP_API.upsrlmFindClf({
//                     member_codes: selectedMembers
//                         .map((member) => member.member_code)
//                         .join(",")
//                 });
//                 setClf(response?.data?.clf_name || "CLF Not Found");
//             } catch (err) {
//                 console.error("Error resolving CLF", err);
//                 setClf("Error Resolving CLF");
//             }
//         };
//         resolveClf();
//     }, [selectedMembers]);

//     // ===================== CHANGED =====================
//     // Store complete member object instead of only member_code
//     // ===================== FIXED =====================
//     const addMember = (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find(
//             (m) => m.member_code === memberCode
//         );

//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some(
//             (m) => m.member_code === memberCode
//         );

//         if (!alreadyExists) {
//             setSelectedMembers([
//                 ...selectedMembers,
//                 {
//                     member_code: memberObj.member_code,

//                     // name store separately
//                     member_name:
//                         memberObj.applicant_name ||
//                         memberObj.member_name ||
//                         "",

//                     // keep full response if needed later
//                     ...memberObj,
//                 },
//             ]);
//         }

//         setSelectedMember("");
//     };
//     // =================================================
//     // ===================================================

//     // ===================== CHANGED =====================
//     const removeMember = (memberCode) => {
//         setSelectedMembers(
//             selectedMembers.filter(
//                 (member) => member.member_code !== memberCode
//             )
//         );
//     };
//     // ===================================================

//     // restored missing product check toggle handler
//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = {
//             district,
//             block,
//             shg,
//             clf,
//             selectedMembers,
//             canteenType,
//             otherCanteenType,
//             foodType,
//             otherFoodType,
//             aopName,
//             aopMembers,
//             accountNo,
//             ifsc,
//             branch,
//             bankName,
//             investment,
//             monthlySale,
//             rent,
//             salary,
//             electricity,
//             miscellaneous,
//             otherExpense,
//             totalIncome,
//             totalExpense,
//             profitLoss,
//             packedProducts,
//             training,
//             trainingSource,
//             trainingAmount,
//         };

//         console.log("Form Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => setDistrict(e.target.value)}
//                         >
//                             <option value="">Select District</option>
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={!district}
//                         >
//                             <option value="">Select Block</option>
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <select
//                             value={shg.code}
//                             onChange={(e) => setShg(e.target.value)}
//                             disabled={!block}
//                         >
//                             <option value="">Select SHG</option>
//                             {Array.isArray(shgs) && shgs.map((s) => (
//                                 <option key={`shg-${s.code}`} value={s.code}>
//                                     {s.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>CLF</label>
//                         <input value={clf} readOnly placeholder="Auto-resolved CLF" />
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <select
//                                 value={selectedMember}
//                                 onChange={(e) => {
//                                     setSelectedMember(e.target.value);
//                                     addMember(e.target.value);
//                                 }}
//                             >
//                                 <option value="">Select Member</option>
//                                 {availableMembers.map((member) => (
//                                     <option key={`member-${member.member_code}`} value={member.member_code}>
//                                         {member.applicant_name || member.member_name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div
//                                     className="chip"
//                                     key={`chip-${member.member_code}-${idx}`}
//                                 >
//                                     <span>
//                                         {member.member_name}
//                                         {" "}
//                                         (
//                                         {member.member_code}
//                                         )
//                                     </span>

//                                     <button
//                                         type="button"
//                                         onClick={() =>
//                                             removeMember(member.member_code)
//                                         }
//                                     >
//                                         ×
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select
//                     value={canteenType}
//                     onChange={(e) => setCanteenType(e.target.value)}
//                 >
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input
//                         placeholder="Enter Other Type"
//                         value={otherCanteenType}
//                         onChange={(e) => setOtherCanteenType(e.target.value)}
//                     />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select
//                         value={foodType}
//                         onChange={(e) => setFoodType(e.target.value)}
//                     >
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input
//                             placeholder="Enter Food Type"
//                             value={otherFoodType}
//                             onChange={(e) => setOtherFoodType(e.target.value)}
//                         />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Restored Checkbox Listing layout wrapper */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input
//                                     type="checkbox"
//                                     checked={packedProducts.includes(item)}
//                                     onChange={() => toggleProduct(item)}
//                                 />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Restored Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details Layout block */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly] { background: #f3f4f6; cursor: not-allowed; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }
//             `}</style>
//         </div>
//     );
// }




// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State
//     const [shgs, setShgs] = useState([]);

//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");
//     const [clf, setClf] = useState("");

//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//     }, [district, geoLoading]);

//     // Fetch SHGs when Block ID updates
//     useEffect(() => {
//         const fetchShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block);
//                 setShgs(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//         fetchShgs();
//     }, [block]);

//     // Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg);
//                 setAvailableMembers(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             }
//         };

//         fetchMembers();
//     }, [shg]);

//     // Dynamic CLF lookups
//     useEffect(() => {
//         const resolveClf = async () => {
//             if (selectedMembers.length === 0) {
//                 setClf("");
//                 return;
//             }
//             try {
//                 const response = await LOOKUP_API.upsrlmFindClf({
//                     member_codes: selectedMembers
//                         .map((member) => member.member_code)
//                         .join(",")
//                 });
//                 setClf(response?.data?.clf_name || "CLF Not Found");
//             } catch (err) {
//                 console.error("Error resolving CLF", err);
//                 setClf("Error Resolving CLF");
//             }
//         };
//         resolveClf();
//     }, [selectedMembers]);

//     const addMember = (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find(
//             (m) => m.member_code === memberCode
//         );

//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some(
//             (m) => m.member_code === memberCode
//         );

//         if (!alreadyExists) {
//             setSelectedMembers([
//                 ...selectedMembers,
//                 {
//                     member_code: memberObj.member_code,
//                     member_name: memberObj.applicant_name || memberObj.member_name || "",
//                     ...memberObj,
//                 },
//             ]);
//         }
//         setSelectedMember("");
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = {
//             district,
//             block,
//             shg,
//             clf,
//             selectedMembers,
//             canteenType,
//             otherCanteenType,
//             foodType,
//             otherFoodType,
//             aopName,
//             aopMembers,
//             accountNo,
//             ifsc,
//             branch,
//             bankName,
//             investment,
//             monthlySale,
//             rent,
//             salary,
//             electricity,
//             miscellaneous,
//             otherExpense,
//             totalIncome,
//             totalExpense,
//             profitLoss,
//             packedProducts,
//             training,
//             trainingSource,
//             trainingAmount,
//         };

//         console.log("Form Submitting Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <select
//                             value={shg}
//                             onChange={(e) => setShg(e.target.value)}
//                             disabled={!block || GlobalLoadingState}
//                         >
//                             <option value="">Select SHG</option>
//                             {Array.isArray(shgs) && shgs.map((s) => (
//                                 <option key={`shg-${s.code}`} value={s.code}>
//                                     {s.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>CLF</label>
//                         <input value={clf} readOnly placeholder="Auto-resolved CLF" />
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <select
//                                 value={selectedMember}
//                                 onChange={(e) => {
//                                     setSelectedMember(e.target.value);
//                                     addMember(e.target.value);
//                                 }}
//                             >
//                                 <option value="">Select Member</option>
//                                 {availableMembers.map((member) => (
//                                     <option key={`member-${member.member_code}`} value={member.member_code}>
//                                         {member.applicant_name || member.member_name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div
//                                     className="chip"
//                                     key={`chip-${member.member_code}-${idx}`}
//                                 >
//                                     <span>
//                                         {member.member_name} ({member.member_code})
//                                     </span>

//                                     <button
//                                         type="button"
//                                         onClick={() => removeMember(member.member_code)}
//                                     >
//                                         ×
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select
//                     value={canteenType}
//                     onChange={(e) => setCanteenType(e.target.value)}
//                 >
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input
//                         placeholder="Enter Other Type"
//                         value={otherCanteenType}
//                         onChange={(e) => setOtherCanteenType(e.target.value)}
//                     />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select
//                         value={foodType}
//                         onChange={(e) => setFoodType(e.target.value)}
//                     >
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input
//                             placeholder="Enter Food Type"
//                             value={otherFoodType}
//                             onChange={(e) => setOtherFoodType(e.target.value)}
//                         />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input
//                                     type="checkbox"
//                                     checked={packedProducts.includes(item)}
//                                     onChange={() => toggleProduct(item)}
//                                 />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }
//             `}</style>
//         </div>
//     );
// }

// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State
//     const [shgs, setShgs] = useState([]);

//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");
//     const [clf, setClf] = useState("");

//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//     }, [district, geoLoading]);

//     // Fetch SHGs when Block ID updates
//     useEffect(() => {
//         const fetchShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block);
//                 setShgs(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//         fetchShgs();
//     }, [block]);

//     // Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg);
//                 setAvailableMembers(extractListing(response));
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             }
//         };

//         fetchMembers();
//     }, [shg]);

//     // Dynamic CLF lookups
//     useEffect(() => {
//         const resolveClf = async () => {
//             if (selectedMembers.length === 0) {
//                 setClf("");
//                 return;
//             }
//             try {
//                 const response = await LOOKUP_API.upsrlmFindClf({
//                     member_codes: selectedMembers
//                         .map((member) => member.member_code)
//                         .join(",")
//                 });
//                 setClf(response?.data?.clf_name || "CLF Not Found");
//             } catch (err) {
//                 console.error("Error resolving CLF", err);
//                 setClf("Error Resolving CLF");
//             }
//         };
//         resolveClf();
//     }, [selectedMembers]);

//     const addMember = (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (!alreadyExists) {
//             setSelectedMembers([
//                 ...selectedMembers,
//                 {
//                     member_code: memberObj.member_code,
//                     member_name: memberObj.applicant_name || memberObj.member_name || "",
//                     ...memberObj,
//                 },
//             ]);
//         }
//         setSelectedMember("");
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = { district, block, shg, clf, selectedMembers, canteenType, otherCanteenType, foodType, otherFoodType, aopName, aopMembers, accountNo, ifsc, branch, bankName, investment, monthlySale, rent, salary, electricity, miscellaneous, otherExpense, totalIncome, totalExpense, profitLoss, packedProducts, training, trainingSource, trainingAmount };
//         console.log("Form Submitting Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <select
//                             value={shg}
//                             onChange={(e) => setShg(e.target.value)}
//                             disabled={!block || GlobalLoadingState}
//                         >
//                             <option value="">Select SHG</option>
//                             {Array.isArray(shgs) && shgs.map((s) => (
//                                 <option key={`shg-${s.code}`} value={s.code}>
//                                     {s.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>CLF</label>
//                         <input value={clf} readOnly placeholder="Auto-resolved CLF" />
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <select
//                                 value={selectedMember}
//                                 onChange={(e) => {
//                                     setSelectedMember(e.target.value);
//                                     addMember(e.target.value);
//                                 }}
//                             >
//                                 <option value="">Select Member</option>
//                                 {availableMembers.map((member) => (
//                                     <option key={`member-${member.member_code}`} value={member.member_code}>
//                                         {member.applicant_name || member.member_name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.member_name} ({member.member_code})</span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input placeholder="Enter Other Type" value={otherCanteenType} onChange={(e) => setOtherCanteenType(e.target.value)} />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input placeholder="Enter Food Type" value={otherFoodType} onChange={(e) => setOtherFoodType(e.target.value)} />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }
//             `}</style>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);

//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");
//     const [clf, setClf] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//         setClf("");
//     }, [district, geoLoading]);

//     // Initial Fetch SHGs when Block ID updates
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 // Assuming API accepts page parameter for pagination handling
//                 const response = await EPSAKHI_API.upsrlmShgList(block, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 // If returned rows match pagination cutoffs, allow incremental load
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         setClf("");
//         fetchInitialShgs();
//     }, [block]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Dynamic CLF lookups triggered on latest selected member changes
//     useEffect(() => {
//         const resolveClf = async () => {
//             if (selectedMembers.length === 0) {
//                 setClf("");
//                 return;
//             }
//             // Get the last added member profile to trigger tracking
//             const targetMember = selectedMembers[selectedMembers.length - 1];
//             try {
//                 const response = await LOOKUP_API.upsrlmFindClf({
//                     block_id: block,
//                     member_code: targetMember.member_code
//                 });
//                 // Dynamic mapping matching your updated requirements structure
//                 if (response?.data?.clf_name || response?.clf_name) {
//                     setClf(response?.data?.clf_name || response?.clf_name);
//                 } else {
//                     setClf("CLF Not Found");
//                 }
//             } catch (err) {
//                 console.error("Error resolving CLF parameters", err);
//                 setClf("Error Resolving CLF");
//             }
//         };
//         resolveClf();
//     }, [selectedMembers, block]);

//     const addMember = (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (!alreadyExists) {
//             setSelectedMembers([
//                 ...selectedMembers,
//                 {
//                     member_code: memberObj.member_code,
//                     member_name: memberObj.applicant_name || memberObj.member_name || "",
//                     ...memberObj,
//                 },
//             ]);
//         }
//         setSelectedMember("");
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = { district, block, shg, clf, selectedMembers, canteenType, otherCanteenType, foodType, otherFoodType, aopName, aopMembers, accountNo, ifsc, branch, bankName, investment, monthlySale, rent, salary, electricity, miscellaneous, otherExpense, totalIncome, totalExpense, profitLoss, packedProducts, training, trainingSource, trainingAmount };
//         console.log("Form Submitting Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">Select SHG</option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Loading..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     <div>
//                         <label>CLF</label>
//                         <input value={clf} readOnly placeholder="Auto-resolved CLF" />
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.member_name} ({member.member_code})</span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input placeholder="Enter Other Type" value={otherCanteenType} onChange={(e) => setOtherCanteenType(e.target.value)} />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input placeholder="Enter Food Type" value={otherFoodType} onChange={(e) => setOtherFoodType(e.target.value)} />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 /* Custom Styles for Pagination Support Controls */
//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//             `}</style>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);

//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Initial Fetch SHGs when Block ID updates
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, { page: 1, page_size: 20 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, { page: nextPage, page_size: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         // Setup placeholder entry while network request processes
//         const uniqueId = Date.now();
//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             member_name: memberObj.applicant_name || memberObj.member_name || "",
//             clf_name: "Resolving CLF...",
//             ...memberObj,
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const targetClfName = response?.data?.clf_name || response?.clf_name || "CLF Not Found";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: targetClfName } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = { district, block, shg, selectedMembers, canteenType, otherCanteenType, foodType, otherFoodType, aopName, aopMembers, accountNo, ifsc, branch, bankName, investment, monthlySale, rent, salary, electricity, miscellaneous, otherExpense, totalIncome, totalExpense, profitLoss, packedProducts, training, trainingSource, trainingAmount };
//         console.log("Form Submitting Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">Select SHG</option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Loading..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.member_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input placeholder="Enter Other Type" value={otherCanteenType} onChange={(e) => setOtherCanteenType(e.target.value)} />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input placeholder="Enter Food Type" value={otherFoodType} onChange={(e) => setOtherFoodType(e.target.value)} />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import { LOOKUP_API, EPSAKHI_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     const [canteenType, setCanteenType] = useState("");
//     const [otherCanteenType, setOtherCanteenType] = useState("");

//     const [foodType, setFoodType] = useState("");
//     const [otherFoodType, setOtherFoodType] = useState("");

//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);

//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);

//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 // Pass search key dynamically into your API utility option payload
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         // Setup placeholder entry while network request processes
//         const uniqueId = Date.now();
//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             member_name: memberObj.applicant_name || memberObj.member_name || "",
//             clf_name: "Resolving CLF...",
//             ...memberObj,
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const targetClfName = response?.data.name || "CLF Not Found";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: targetClfName } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     const submitForm = () => {
//         const payload = { district, block, shg, selectedMembers, canteenType, otherCanteenType, foodType, otherFoodType, aopName, aopMembers, accountNo, ifsc, branch, bankName, investment, monthlySale, rent, salary, electricity, miscellaneous, otherExpense, totalIncome, totalExpense, profitLoss, packedProducts, training, trainingSource, trainingAmount };
//         console.log("Form Submitting Payload:", payload);
//         alert("Form Submitted Successfully");
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             {/* SHG Inline Search Field */}
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.member_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 {canteenType === "Others" && (
//                     <input placeholder="Enter Other Type" value={otherCanteenType} onChange={(e) => setOtherCanteenType(e.target.value)} />
//                 )}

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>

//                     {foodType === "Others" && (
//                         <input placeholder="Enter Food Type" value={otherFoodType} onChange={(e) => setOtherFoodType(e.target.value)} />
//                     )}
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid">
//                         <input placeholder="Training Source" value={trainingSource} onChange={(e) => setTrainingSource(e.target.value)} />
//                         <input placeholder="Training Amount" value={trainingAmount} onChange={(e) => setTrainingAmount(e.target.value)} />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured Multi-Part data mappings directly to your back-end database
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }

//         try {
//             const formData = new FormData();

//             // 1) Parent Configuration Data Layer: CanteenHome Model fields
//             formData.append("canteen_type", canteenType);
//             formData.append("district", district);
//             formData.append("block", block);

//             // 2) Child Array Configuration Layer: CanteenMember instances stringified
//             // Form data natively tracks nested data layers via structural array bracket assignments
//             selectedMembers.forEach((member, index) => {
//                 formData.append(`members[${index}]lokos_member_code`, member.member_code);
//                 formData.append(`members[${index}]applicant_name`, member.applicant_name);
//                 formData.append(`members[${index}]lokos_shg_code`, member.lokos_shg_code);
//                 formData.append(`members[${index}]lokos_shg_name`, member.lokos_shg_name);
//                 formData.append(`members[${index}]lokos_clf_code`, member.lokos_clf_code);
//                 formData.append(`members[${index}]lokos_clf_name`, member.clf_name);
//                 if (member.age) formData.append(`members[${index}]age`, member.age);
//                 formData.append(`members[${index}]gender`, member.gender);
//                 formData.append(`members[${index}]mobile`, member.mobile);
//             });

//             // 3) Informational Meta Layer: CanteenDetail fields
//             formData.append("detail.food_type", foodType);
//             formData.append("detail.sells_other_shg_packaged_food", packedFood);
//             formData.append("detail.has_canteen_management_training", training);
//             formData.append("detail.packaged_products_list", JSON.stringify(packedProducts));

//             // 4) Financial Balance Data Layer: CanteenFinance parameters
//             formData.append("finance.total_investment", investment || "0.00");
//             formData.append("finance.monthly_sale", monthlySale || "0.00");
//             formData.append("finance.rent", rent || "0.00");
//             formData.append("finance.salary", salary || "0.00");
//             formData.append("finance.electricity", electricity || "0.00");
//             formData.append("finance.miscellaneous", miscellaneous || "0.00");
//             formData.append("finance.other_expense", otherExpense || "0.00");
//             formData.append("finance.total_income", totalIncome.toString());
//             formData.append("finance.total_expense", totalExpense.toString());
//             formData.append("finance.profit_loss", profitLoss.toString());

//             // 5) Special Context Segment Layer: CanteenModelPC fields (conditional payload generation)
//             if (canteenType === "Model PC") {
//                 formData.append("model_pc.aop_name", aopName);
//                 formData.append("model_pc.aop_members", aopMembers);
//                 formData.append("model_pc.account_no", accountNo);
//                 formData.append("model_pc.ifsc", ifsc);
//                 formData.append("model_pc.branch", branch);
//                 formData.append("model_pc.bank_name", bankName);
//             }

//             const response = await PRERNA_API.createCanteen(formData);
//             if (response.status === 200 || response.status === 201) {
//                 alert("Canteen entry saved successfully onto records ledger.");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             alert("Failed saving record data details. Inspect execution stack diagnostics.");
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators & Media Handles
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");
//     const [fssaiFile, setFssaiFile] = useState(null);

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured Multi-Part data mappings directly to your back-end database
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }

//         try {
//             const formData = new FormData();

//             // 1) Parent Configuration Data Layer: CanteenHome Model fields
//             formData.append("canteen_type", canteenType);
//             formData.append("district", district);
//             formData.append("block", block);

//             // 2) Child Array Configuration Layer: CanteenMember instances stringified
//             selectedMembers.forEach((member, index) => {
//                 formData.append(`members[${index}]lokos_member_code`, member.member_code);
//                 formData.append(`members[${index}]applicant_name`, member.applicant_name);
//                 formData.append(`members[${index}]lokos_shg_code`, member.lokos_shg_code);
//                 formData.append(`members[${index}]lokos_shg_name`, member.lokos_shg_name);
//                 formData.append(`members[${index}]lokos_clf_code`, member.lokos_clf_code);
//                 formData.append(`members[${index}]lokos_clf_name`, member.clf_name);
//                 if (member.age) formData.append(`members[${index}]age`, member.age);
//                 formData.append(`members[${index}]gender`, member.gender);
//                 formData.append(`members[${index}]mobile`, member.mobile);
//             });

//             // 3) Informational Meta Layer: CanteenDetail fields
//             formData.append("detail.food_type", foodType);
//             formData.append("detail.sells_other_shg_packaged_food", packedFood);
//             formData.append("detail.has_canteen_management_training", training);
//             formData.append("detail.packaged_products_list", JSON.stringify(packedProducts));

//             // Appending dynamic training fields when set to "Yes"
//             if (training === "Yes") {
//                 formData.append("detail.training_source", trainingSource);
//                 formData.append("detail.training_amount", trainingAmount);
//             }

//             // 4) Financial Balance Data Layer: CanteenFinance parameters
//             formData.append("finance.total_investment", investment || "0.00");
//             formData.append("finance.monthly_sale", monthlySale || "0.00");
//             formData.append("finance.rent", rent || "0.00");
//             formData.append("finance.salary", salary || "0.00");
//             formData.append("finance.electricity", electricity || "0.00");
//             formData.append("finance.miscellaneous", miscellaneous || "0.00");
//             formData.append("finance.other_expense", otherExpense || "0.00");
//             formData.append("finance.total_income", totalIncome.toString());
//             formData.append("finance.total_expense", totalExpense.toString());
//             formData.append("finance.profit_loss", profitLoss.toString());

//             // 5) Special Context Segment Layer: CanteenModelPC fields (conditional payload generation)
//             if (canteenType === "Model PC") {
//                 formData.append("model_pc.aop_name", aopName);
//                 formData.append("model_pc.aop_members", aopMembers);
//                 formData.append("model_pc.account_no", accountNo);
//                 formData.append("model_pc.ifsc", ifsc);
//                 formData.append("model_pc.branch", branch);
//                 formData.append("model_pc.bank_name", bankName);
//             }

//             // 6) Media Document Attachment Layer: CanteenLicense Model
//             if (fssaiFile) {
//                 formData.append("licenses[0]license_name", "FSSAI License");
//                 formData.append("licenses[0]license_file", fssaiFile);
//             }

//             const response = await PRERNA_API.createCanteen(formData);
//             if (response.status === 200 || response.status === 201) {
//                 alert("Canteen entry saved successfully onto records ledger.");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             alert("Failed saving record data details. Inspect execution stack diagnostics.");
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid" style={{ marginTop: "15px" }}>
//                         <input
//                             placeholder="Training Source"
//                             value={trainingSource}
//                             onChange={(e) => setTrainingSource(e.target.value)}
//                         />
//                         <input
//                             placeholder="Training Amount"
//                             value={trainingAmount}
//                             onChange={(e) => setTrainingAmount(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* FSSAI License Document Upload Section */}
//             <div className="section">
//                 <h2>Certificates & Licensing Documentation</h2>
//                 <div className="uploadBox">
//                     <label>FSSAI License</label>
//                     <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => setFssaiFile(e.target.files[0] || null)}
//                     />
//                 </div>
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .uploadBox { padding: 10px 0; }
//                 .uploadBox input[type="file"] { padding-top: 12px; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators & Media Handles
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");
//     const [fssaiFile, setFssaiFile] = useState(null);

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured Multi-Part data mappings matched to the documentation contract
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }
//         if (selectedMembers.length === 0) {
//             alert("Please select at least one SHG Member before submitting.");
//             return;
//         }

//         try {
//             // 1. Define target row payloads matching Django backend contracts
//             const homePayload = {
//                 canteen_type: canteenType,
//                 district_id: Number(district),
//                 block_id: Number(block)
//             };

//             const primaryMember = selectedMembers[0];
//             const memberPayload = {
//                 applicant_name: primaryMember.applicant_name,
//                 mobile: primaryMember.mobile,
//                 lokos_member_code: primaryMember.member_code,
//                 lokos_shg_code: primaryMember.lokos_shg_code,
//                 lokos_shg_name: primaryMember.lokos_shg_name,
//                 lokos_clf_code: primaryMember.lokos_clf_code,
//                 lokos_clf_name: primaryMember.clf_name,
//                 age: primaryMember.age ? Number(primaryMember.age) : null,
//                 gender: primaryMember.gender
//             };

//             const detailPayload = {
//                 canteen_name: `${primaryMember.lokos_shg_name || "SHG"} Canteen`,
//                 food_type: foodType,
//                 sells_other_shg_packaged_food: packedFood,
//                 has_canteen_management_training: training,
//                 packaged_products_list: packedProducts,
//                 training_source: training === "Yes" ? trainingSource : "",
//                 training_amount: training === "Yes" ? trainingAmount : ""
//             };

//             const financePayload = {
//                 total_investment: investment || "0.00",
//                 monthly_sale: monthlySale || "0.00",
//                 rent: rent || "0.00",
//                 salary: salary || "0.00",
//                 electricity: electricity || "0.00",
//                 miscellaneous: miscellaneous || "0.00",
//                 other_expense: otherExpense || "0.00",
//                 total_income: totalIncome.toString(),
//                 total_expense: totalExpense.toString(),
//                 profit_loss: profitLoss.toString()
//             };

//             let modelPcPayload = null;
//             if (canteenType === "Model PC") {
//                 modelPcPayload = {
//                     aop_name: aopName,
//                     aop_members: aopMembers,
//                     account_no: accountNo,
//                     ifsc: ifsc,
//                     branch: branch,
//                     bank_name: bankName
//                 };
//             }

//             const licensesText = [];
//             if (fssaiFile) {
//                 licensesText.push({ license_name: "FSSAI License" });
//             }

//             // ==========================================
//             // LOGGING THE PAYLOAD STRUCTS TO THE CONSOLE
//             // ==========================================
//             console.group("🚀 Canteen Form - Payload Submission Blueprint");
//             console.log("1. Home Payload Structure:", homePayload);
//             console.log("2. Primary Member Payload Structure:", memberPayload);
//             console.log("3. Detail Payload Structure:", detailPayload);
//             console.log("4. Finance Payload Structure:", financePayload);
//             if (modelPcPayload) {
//                 console.log("5. Model PC Payload Structure:", modelPcPayload);
//             }
//             console.log("6. Licenses Manifest Array:", licensesText);
//             console.log("7. Attached Binary License File (FSSAI):", fssaiFile);
//             console.groupEnd();

//             // 2. Assemble FormData container pipeline
//             const formData = new FormData();
//             formData.append("home", JSON.stringify(homePayload));
//             formData.append("member", JSON.stringify(memberPayload));
//             formData.append("detail", JSON.stringify(detailPayload));
//             formData.append("finance", JSON.stringify(financePayload));

//             if (modelPcPayload) {
//                 formData.append("model_pc", JSON.stringify(modelPcPayload));
//             }

//             formData.append("licenses", JSON.stringify(licensesText));
//             if (fssaiFile) {
//                 formData.append("license_file_0", fssaiFile);
//             }

//             // Display finalized FormData stream structure before firing network request
//             console.group("📦 Final FormData Entries (Inspected via Iterator)");
//             for (let [key, value] of formData.entries()) {
//                 console.log(`Key: "${key}" => Value:`, value);
//             }
//             console.groupEnd();

//             // Fire API request through your custom interceptor wrapper mapping
//             const response = await PRERNA_API.createCanteen(formData);

//             if (response.status === 200 || response.status === 201) {
//                 alert("Canteen Survey Form Saved and Submitted Successfully!");
//                 // Clear state handles or navigate out
//                 setSelectedMembers([]);
//                 setFssaiFile(null);
//                 setInvestment("");
//                 setMonthlySale("");
//                 setRent("");
//                 setSalary("");
//                 setElectricity("");
//                 setMiscellaneous("");
//                 setOtherExpense("");
//                 setAopName("");
//                 setAopMembers("");
//                 setAccountNo("");
//                 setIfsc("");
//                 setBranch("");
//                 setBankName("");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             const serverErrorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
//             alert(`Failed saving record details to server backend. Diagnostic payload: ${serverErrorMsg}`);
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid" style={{ marginTop: "15px" }}>
//                         <input
//                             placeholder="Training Source"
//                             value={trainingSource}
//                             onChange={(e) => setTrainingSource(e.target.value)}
//                         />
//                         <input
//                             placeholder="Training Amount"
//                             value={trainingAmount}
//                             onChange={(e) => setTrainingAmount(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* FSSAI License Document Upload Section */}
//             <div className="section">
//                 <h2>Certificates & Licensing Documentation</h2>
//                 <div className="uploadBox">
//                     <label>FSSAI License</label>
//                     <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => setFssaiFile(e.target.files[0] || null)}
//                     />
//                 </div>
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .uploadBox { padding: 10px 0; }
//                 .uploadBox input[type="file"] { padding-top: 12px; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators & Media Handles
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");
//     const [fssaiFile, setFssaiFile] = useState(null);

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured Multi-Part data mappings matched to the documentation contract
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }
//         if (selectedMembers.length === 0) {
//             alert("Please select at least one SHG Member before submitting.");
//             return;
//         }

//         try {
//             // 1. Define target row payloads matching Django backend contracts
//             const homePayload = {
//                 canteen_type: canteenType,
//                 district_id: Number(district),
//                 block_id: Number(block)
//             };

//             const primaryMember = selectedMembers[0];
//             const memberPayload = {
//                 applicant_name: primaryMember.applicant_name,
//                 mobile: primaryMember.mobile,
//                 lokos_member_code: primaryMember.member_code,
//                 lokos_shg_code: primaryMember.lokos_shg_code,
//                 lokos_shg_name: primaryMember.lokos_shg_name,
//                 lokos_clf_code: primaryMember.lokos_clf_code,
//                 lokos_clf_name: primaryMember.clf_name,
//                 age: primaryMember.age ? Number(primaryMember.age) : null,
//                 gender: primaryMember.gender
//             };

//             const detailPayload = {
//                 canteen_name: `${primaryMember.lokos_shg_name || "SHG"} Canteen`,
//                 food_type: foodType,
//                 sells_other_shg_packaged_food: packedFood,
//                 has_canteen_management_training: training,
//                 packaged_products_list: packedProducts,
//                 training_source: training === "Yes" ? trainingSource : "",
//                 training_amount: training === "Yes" ? trainingAmount : ""
//             };

//             const financePayload = {
//                 total_investment: investment || "0.00",
//                 monthly_sale: monthlySale || "0.00",
//                 rent: rent || "0.00",
//                 salary: salary || "0.00",
//                 electricity: electricity || "0.00",
//                 miscellaneous: miscellaneous || "0.00",
//                 other_expense: otherExpense || "0.00",
//                 total_income: totalIncome.toString(),
//                 total_expense: totalExpense.toString(),
//                 profit_loss: profitLoss.toString()
//             };

//             let modelPcPayload = null;
//             if (canteenType === "Model PC") {
//                 modelPcPayload = {
//                     aop_name: aopName,
//                     aop_members: aopMembers,
//                     account_no: accountNo,
//                     ifsc: ifsc,
//                     branch: branch,
//                     bank_name: bankName
//                 };
//             }

//             const licensesText = [];
//             if (fssaiFile) {
//                 licensesText.push({ license_name: "FSSAI License" });
//             }

//             // ==========================================
//             // LOGGING THE PAYLOAD STRUCTS TO THE CONSOLE
//             // ==========================================
//             console.group("🚀 Canteen Form - Payload Submission Blueprint");
//             console.log("1. Home Payload Structure:", homePayload);
//             console.log("2. Primary Member Payload Structure:", memberPayload);
//             console.log("3. Detail Payload Structure:", detailPayload);
//             console.log("4. Finance Payload Structure:", financePayload);
//             if (modelPcPayload) {
//                 console.log("5. Model PC Payload Structure:", modelPcPayload);
//             }
//             console.log("6. Licenses Manifest Array:", licensesText);
//             console.log("7. Attached Binary License File (FSSAI):", fssaiFile);
//             console.groupEnd();

//             // 2. Assemble FormData container pipeline
//             const formData = new FormData();
//             formData.append("home", JSON.stringify(homePayload));
//             formData.append("member", JSON.stringify(memberPayload));
//             formData.append("detail", JSON.stringify(detailPayload));
//             formData.append("finance", JSON.stringify(financePayload));

//             if (modelPcPayload) {
//                 formData.append("model_pc", JSON.stringify(modelPcPayload));
//             }

//             formData.append("licenses", JSON.stringify(licensesText));
//             if (fssaiFile) {
//                 formData.append("license_file_0", fssaiFile);
//             }

//             // Display finalized FormData stream structure before firing network request
//             console.group("📦 Final FormData Entries (Inspected via Iterator)");
//             for (let [key, value] of formData.entries()) {
//                 console.log(`Key: "${key}" => Value:`, value);
//             }
//             console.groupEnd();

//             // Fire API request through your custom interceptor wrapper mapping
//             const response = await PRERNA_API.createCanteen(formData);

//             if (response.status === 200 || response.status === 201) {
//                 alert("Canteen Survey Form Saved and Submitted Successfully!");
//                 // Clear state handles or navigate out
//                 setSelectedMembers([]);
//                 setFssaiFile(null);
//                 setInvestment("");
//                 setMonthlySale("");
//                 setRent("");
//                 setSalary("");
//                 setElectricity("");
//                 setMiscellaneous("");
//                 setOtherExpense("");
//                 setAopName("");
//                 setAopMembers("");
//                 setAccountNo("");
//                 setIfsc("");
//                 setBranch("");
//                 setBankName("");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             const serverErrorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
//             alert(`Failed saving record details to server backend. Diagnostic payload: ${serverErrorMsg}`);
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid" style={{ marginTop: "15px" }}>
//                         <input
//                             placeholder="Training Source"
//                             value={trainingSource}
//                             onChange={(e) => setTrainingSource(e.target.value)}
//                         />
//                         <input
//                             placeholder="Training Amount"
//                             value={trainingAmount}
//                             onChange={(e) => setTrainingAmount(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* FSSAI License Document Upload Section */}


//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>
//             <div className="section">
//                 <h2>Certificates & Licensing Documentation</h2>
//                 <div className="uploadBox">
//                     <label>FSSAI License</label>
//                     <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => setFssaiFile(e.target.files[0] || null)}
//                     />
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .uploadBox { padding: 10px 0; }
//                 .uploadBox input[type="file"] { padding-top: 12px; }
//             `}</style>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators & Media Handles
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");
//     const [fssaiFile, setFssaiFile] = useState(null);

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured JSON blocks as expected by your Django MultiPart registration contract
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }
//         if (selectedMembers.length === 0) {
//             alert("Please select at least one SHG Member before submitting.");
//             return;
//         }

//         try {
//             // 1. Structure raw data nodes precisely aligned with server models mapping instructions
//             const homePayload = {
//                 canteen_type: canteenType,
//                 district_id: Number(district),
//                 block_id: Number(block)
//             };

//             const primaryMember = selectedMembers[0];
//             const memberPayload = {
//                 applicant_name: primaryMember.applicant_name,
//                 mobile: primaryMember.mobile,
//                 lokos_member_code: primaryMember.member_code,
//                 lokos_shg_code: primaryMember.lokos_shg_code,
//                 lokos_shg_name: primaryMember.lokos_shg_name,
//                 lokos_clf_code: primaryMember.lokos_clf_code,
//                 lokos_clf_name: primaryMember.clf_name,
//                 age: primaryMember.age ? Number(primaryMember.age) : null,
//                 gender: primaryMember.gender
//             };

//             const detailPayload = {
//                 canteen_name: `${primaryMember.lokos_shg_name || "SHG"} Canteen`,
//                 food_type: foodType,
//                 sells_other_shg_packaged_food: packedFood,
//                 has_canteen_management_training: training,
//                 packaged_products_list: packedProducts,
//                 training_source: training === "Yes" ? trainingSource : "",
//                 training_amount: training === "Yes" ? trainingAmount : ""
//             };

//             const financePayload = {
//                 total_investment: investment || "0.00",
//                 monthly_sale: monthlySale || "0.00",
//                 rent: rent || "0.00",
//                 salary: salary || "0.00",
//                 electricity: electricity || "0.00",
//                 miscellaneous: miscellaneous || "0.00",
//                 other_expense: otherExpense || "0.00",
//                 total_income: totalIncome.toString(),
//                 total_expense: totalExpense.toString(),
//                 profit_loss: profitLoss.toString()
//             };

//             let modelPcPayload = null;
//             if (canteenType === "Model PC") {
//                 modelPcPayload = {
//                     aop_name: aopName,
//                     aop_members: aopMembers,
//                     account_no: accountNo,
//                     ifsc: ifsc,
//                     branch: branch,
//                     bank_name: bankName
//                 };
//             }

//             const licensesText = [];
//             if (fssaiFile) {
//                 licensesText.push({ license_name: "FSSAI License" });
//             }

//             // ==========================================
//             // LOGGING THE PAYLOAD STRUCTS TO THE CONSOLE
//             // ==========================================
//             console.group("🚀 Canteen Form - Payload Submission Blueprint");
//             console.log("1. Home Payload Structure:", homePayload);
//             console.log("2. Primary Member Payload Structure:", memberPayload);
//             console.log("3. Detail Payload Structure:", detailPayload);
//             console.log("4. Finance Payload Structure:", financePayload);
//             if (modelPcPayload) {
//                 console.log("5. Model PC Payload Structure:", modelPcPayload);
//             }
//             console.log("6. Licenses Manifest Array:", licensesText);
//             console.log("7. Attached Binary License File (FSSAI):", fssaiFile);
//             console.groupEnd();

//             // 2. Pack multi-part properties inside active FormData pipeline wrapper
//             const formData = new FormData();
//             formData.append("home", JSON.stringify(homePayload));
//             formData.append("member", JSON.stringify(memberPayload));
//             formData.append("detail", JSON.stringify(detailPayload));
//             formData.append("finance", JSON.stringify(financePayload));

//             if (modelPcPayload) {
//                 formData.append("model_pc", JSON.stringify(modelPcPayload));
//             }

//             formData.append("licenses", JSON.stringify(licensesText));
//             if (fssaiFile) {
//                 formData.append("license_file_0", fssaiFile);
//             }

//             // =======================================================
//             // DISPLAY FINALIZED FORMDATA ENTRIES FOR INSPECTION
//             // =======================================================
//             console.group("📦 Final FormData Entries (Inspected via Iterator)");
//             for (let [key, value] of formData.entries()) {
//                 console.log(`Key: "${key}" => Value:`, value);
//             }
//             console.groupEnd();

//             // Fire API request through your custom interceptor wrapper mapping
//             const response = await PRERNA_API.createCanteen(formData);

//             if (response.status === 200 || response.status === 201) {
//                 alert("Server Response:", response.data, "Canteen Survey Form Saved and Submitted Successfully!");
//                 // alert("Canteen Survey Form Saved and Submitted Successfully!");
//                 // Clear state handles or navigate out
//                 setSelectedMembers([]);
//                 setFssaiFile(null);
//                 setInvestment("");
//                 setMonthlySale("");
//                 setRent("");
//                 setSalary("");
//                 setElectricity("");
//                 setMiscellaneous("");
//                 setOtherExpense("");
//                 setAopName("");
//                 setAopMembers("");
//                 setAccountNo("");
//                 setIfsc("");
//                 setBranch("");
//                 setBankName("");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             const serverErrorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
//             alert(`Failed saving record details to server backend. Diagnostic payload: ${serverErrorMsg}`);
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid" style={{ marginTop: "15px" }}>
//                         <input
//                             placeholder="Training Source"
//                             value={trainingSource}
//                             onChange={(e) => setTrainingSource(e.target.value)}
//                         />
//                         <input
//                             placeholder="Training Amount"
//                             value={trainingAmount}
//                             onChange={(e) => setTrainingAmount(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             {/* Certificates & Licensing Documentation */}
//             <div className="section">
//                 <h2>Certificates & Licensing Documentation</h2>
//                 <div className="uploadBox">
//                     <label>FSSAI License</label>
//                     <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => setFssaiFile(e.target.files[0] || null)}
//                     />
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .uploadBox { padding: 10px 0; }
//                 .uploadBox input[type="file"] { padding-top: 12px; }
//             `}</style>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";
// import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
// import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";

// export default function CanteenForm() {
//     // Geography Dropdown Options State & Pagination Control
//     const [shgs, setShgs] = useState([]);
//     const [shgPage, setShgPage] = useState(1);
//     const [hasMoreShgs, setHasMoreShgs] = useState(true);
//     const [loadingShgs, setLoadingShgs] = useState(false);
//     const [shgSearchTerm, setShgSearchTerm] = useState("");
//     const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

//     // Selections (Aligned with CanteenHome Database Model Fields)
//     const [district, setDistrict] = useState("");
//     const [block, setBlock] = useState("");
//     const [shg, setShg] = useState("");

//     // Members State & Pagination Control
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [memberPage, setMemberPage] = useState(1);
//     const [hasMoreMembers, setHasMoreMembers] = useState(true);
//     const [loadingMembers, setLoadingMembers] = useState(false);

//     const [selectedMember, setSelectedMember] = useState("");
//     const [selectedMembers, setSelectedMembers] = useState([]);

//     // Detail Configuration States
//     const [canteenType, setCanteenType] = useState("");
//     const [foodType, setFoodType] = useState("");

//     // Model PC Structured States
//     const [aopName, setAopName] = useState("");
//     const [aopMembers, setAopMembers] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [ifsc, setIfsc] = useState("");
//     const [branch, setBranch] = useState("");
//     const [bankName, setBankName] = useState("");

//     // Finance Metrics Configuration States
//     const [investment, setInvestment] = useState("");
//     const [monthlySale, setMonthlySale] = useState("");
//     const [rent, setRent] = useState("");
//     const [salary, setSalary] = useState("");
//     const [electricity, setElectricity] = useState("");
//     const [miscellaneous, setMiscellaneous] = useState("");
//     const [otherExpense, setOtherExpense] = useState("");

//     // Categorized Flag Indicators & Media Handles
//     const [packedFood, setPackedFood] = useState("");
//     const [packedProducts, setPackedProducts] = useState([]);
//     const [training, setTraining] = useState("");
//     const [trainingSource, setTrainingSource] = useState("");
//     const [trainingAmount, setTrainingAmount] = useState("");
//     const [fssaiFile, setFssaiFile] = useState(null);

//     // Helper utility to capture custom data layout format from your backend metadata payload
//     const extractListing = (response) => {
//         if (!response) return [];
//         const payload = response.data !== undefined ? response.data : response;
//         if (!payload) return [];
//         if (payload.data && Array.isArray(payload.data)) return payload.data;
//         if (payload.results && Array.isArray(payload.results)) return payload.results;
//         if (Array.isArray(payload)) return payload;
//         return [];
//     };

//     // 1. Fetch User Scope first
//     const { geoScope, loading: geoLoading } = useUserGeoscope();

//     // 2. Feed parameters cleanly down to filter calculations
//     const {
//         districts,
//         blocks,
//         isBMM,
//         isDMM,
//         loading: filterLoading
//     } = useCanteenFilters({
//         district,
//         setDistrict,
//         block,
//         setBlock,
//         geoScope,
//         geoLoading,
//         extractListing
//     });

//     const totalExpense =
//         Number(rent || 0) +
//         Number(salary || 0) +
//         Number(electricity || 0) +
//         Number(miscellaneous || 0) +
//         Number(otherExpense || 0);

//     const totalIncome = Number(monthlySale || 0);
//     const profitLoss = totalIncome - totalExpense;

//     // Debounce processing for SHG search queries
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedShgSearch(shgSearchTerm);
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [shgSearchTerm]);

//     // Reset downstream entries when base district updates
//     useEffect(() => {
//         if (geoLoading) return;
//         setShg("");
//         setShgs([]);
//         setShgPage(1);
//         setHasMoreShgs(true);
//         setShgSearchTerm("");
//         setDebouncedShgSearch("");
//         setAvailableMembers([]);
//         setMemberPage(1);
//         setHasMoreMembers(true);
//         setSelectedMembers([]);
//     }, [district, geoLoading]);

//     // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
//     useEffect(() => {
//         const fetchInitialShgs = async () => {
//             if (!block) {
//                 setShgs([]);
//                 return;
//             }
//             setLoadingShgs(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgList(block, {
//                     page: 1,
//                     page_size: 20,
//                     search: debouncedShgSearch
//                 });
//                 const data = extractListing(response);
//                 setShgs(data);
//                 setShgPage(1);
//                 setHasMoreShgs(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching SHGs", err);
//                 setShgs([]);
//             } finally {
//                 setLoadingShgs(false);
//             }
//         };

//         setShg("");
//         setAvailableMembers([]);
//         setSelectedMembers([]);
//         fetchInitialShgs();
//     }, [block, debouncedShgSearch]);

//     // Paginated load-more logic for SHGs
//     const loadMoreShgs = async () => {
//         if (loadingShgs || !hasMoreShgs || !block) return;
//         setLoadingShgs(true);
//         const nextPage = shgPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgList(block, {
//                 page: nextPage,
//                 page_size: 20,
//                 search: debouncedShgSearch
//             });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreShgs(false);
//             } else {
//                 setShgs((prev) => [...prev, ...data]);
//                 setShgPage(nextPage);
//                 if (data.length < 20) setHasMoreShgs(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra SHG entries", err);
//         } finally {
//             setLoadingShgs(false);
//         }
//     };

//     // Initial Fetch Members when SHG code updates
//     useEffect(() => {
//         const fetchInitialMembers = async () => {
//             if (!shg) {
//                 setAvailableMembers([]);
//                 return;
//             }
//             setLoadingMembers(true);
//             try {
//                 const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
//                 const data = extractListing(response);
//                 setAvailableMembers(data);
//                 setMemberPage(1);
//                 setHasMoreMembers(data.length >= 20);
//             } catch (err) {
//                 console.error("Error fetching members", err);
//                 setAvailableMembers([]);
//             } finally {
//                 setLoadingMembers(false);
//             }
//         };

//         setAvailableMembers([]);
//         fetchInitialMembers();
//     }, [shg]);

//     // Paginated load-more logic for Members
//     const loadMoreMembers = async () => {
//         if (loadingMembers || !hasMoreMembers || !shg) return;
//         setLoadingMembers(true);
//         const nextPage = memberPage + 1;
//         try {
//             const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
//             const data = extractListing(response);
//             if (data.length === 0) {
//                 setHasMoreMembers(false);
//             } else {
//                 setAvailableMembers((prev) => [...prev, ...data]);
//                 setMemberPage(nextPage);
//                 if (data.length < 20) setHasMoreMembers(false);
//             }
//         } catch (err) {
//             console.error("Error loading extra Member entries", err);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     // Async addMember utility that pulls unique CLF context values on demand
//     const addMember = async (memberCode) => {
//         if (!memberCode) return;

//         const memberObj = availableMembers.find((m) => m.member_code === memberCode);
//         if (!memberObj) return;

//         const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
//         if (alreadyExists) {
//             setSelectedMember("");
//             return;
//         }

//         const uniqueId = Date.now();
//         const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

//         const temporaryMemberItem = {
//             id: uniqueId,
//             member_code: memberObj.member_code,
//             applicant_name: memberObj.applicant_name || memberObj.member_name || "",
//             lokos_shg_code: shg,
//             lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
//             lokos_clf_code: "",
//             clf_name: "Resolving CLF...",
//             age: memberObj.age || null,
//             gender: memberObj.gender || "Female",
//             mobile: memberObj.mobile || "",
//             email: memberObj.email || ""
//         };

//         setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
//         setSelectedMember("");

//         try {
//             const response = await LOOKUP_API.upsrlmFindClf({
//                 block_id: block,
//                 member_code: memberObj.member_code,
//             });

//             const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
//             const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
//                 )
//             );
//         } catch (err) {
//             console.error("Error resolving individual member CLF context:", err);
//             setSelectedMembers((prev) =>
//                 prev.map((item) =>
//                     item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
//                 )
//             );
//         }
//     };

//     const removeMember = (memberCode) => {
//         setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
//     };

//     const toggleProduct = (product) => {
//         if (packedProducts.includes(product)) {
//             setPackedProducts(packedProducts.filter((item) => item !== product));
//         } else {
//             setPackedProducts([...packedProducts, product]);
//         }
//     };

//     // Submits structured JSON blocks handling multiple members correctly
//     const submitForm = async () => {
//         if (!district || !block) {
//             alert("Please input essential regional parameters first.");
//             return;
//         }
//         if (selectedMembers.length === 0) {
//             alert("Please select at least one SHG Member before submitting.");
//             return;
//         }

//         try {
//             // 1. Structure raw data nodes precisely aligned with server model mapping instructions
//             const homePayload = {
//                 canteen_type: canteenType,
//                 district_id: Number(district),
//                 block_id: Number(block)
//             };

//             // Process all selected members into an array payload instead of tracking just index 0
//             const membersArrayPayload = selectedMembers.map((member) => ({
//                 applicant_name: member.applicant_name,
//                 mobile: member.mobile,
//                 lokos_member_code: member.member_code,
//                 lokos_shg_code: member.lokos_shg_code,
//                 lokos_shg_name: member.lokos_shg_name,
//                 lokos_clf_code: member.lokos_clf_code,
//                 lokos_clf_name: member.clf_name,
//                 age: member.age ? Number(member.age) : null,
//                 gender: member.gender
//             }));

//             const referenceShgName = selectedMembers[0]?.lokos_shg_name || "SHG";
//             const detailPayload = {
//                 canteen_name: `${referenceShgName} Canteen`,
//                 food_type: foodType,
//                 sells_other_shg_packaged_food: packedFood,
//                 has_canteen_management_training: training,
//                 packaged_products_list: packedProducts,
//                 training_source: training === "Yes" ? trainingSource : "",
//                 training_amount: training === "Yes" ? trainingAmount : ""
//             };

//             const financePayload = {
//                 total_investment: investment || "0.00",
//                 monthly_sale: monthlySale || "0.00",
//                 rent: rent || "0.00",
//                 salary: salary || "0.00",
//                 electricity: electricity || "0.00",
//                 miscellaneous: miscellaneous || "0.00",
//                 other_expense: otherExpense || "0.00",
//                 total_income: totalIncome.toString(),
//                 total_expense: totalExpense.toString(),
//                 profit_loss: profitLoss.toString()
//             };

//             let modelPcPayload = null;
//             if (canteenType === "Model PC") {
//                 modelPcPayload = {
//                     aop_name: aopName,
//                     aop_members: aopMembers,
//                     account_no: accountNo,
//                     ifsc: ifsc,
//                     branch: branch,
//                     bank_name: bankName
//                 };
//             }

//             const licensesText = [];
//             if (fssaiFile) {
//                 licensesText.push({ license_name: "FSSAI License" });
//             }

//             // ==========================================
//             // LOGGING THE PAYLOAD STRUCTS TO THE CONSOLE
//             // ==========================================
//             console.group("🚀 Canteen Form - Payload Submission Blueprint");
//             console.log("1. Home Payload Structure:", homePayload);
//             console.log("2. Multiple Members Payload Array:", membersArrayPayload);
//             console.log("3. Detail Payload Structure:", detailPayload);
//             console.log("4. Finance Payload Structure:", financePayload);
//             if (modelPcPayload) {
//                 console.log("5. Model PC Payload Structure:", modelPcPayload);
//             }
//             console.log("6. Licenses Manifest Array:", licensesText);
//             console.log("7. Attached Binary License File (FSSAI):", fssaiFile);
//             console.groupEnd();

//             // 2. Pack multi-part properties inside active FormData pipeline wrapper
//             const formData = new FormData();
//             formData.append("home", JSON.stringify(homePayload));

//             // Sending the multiple members collection array as a stringified payload key
//             formData.append("member", JSON.stringify(membersArrayPayload));

//             formData.append("detail", JSON.stringify(detailPayload));
//             formData.append("finance", JSON.stringify(financePayload));

//             if (modelPcPayload) {
//                 formData.append("model_pc", JSON.stringify(modelPcPayload));
//             }

//             formData.append("licenses", JSON.stringify(licensesText));
//             if (fssaiFile) {
//                 formData.append("license_file_0", fssaiFile);
//             }

//             // =======================================================
//             // DISPLAY FINALIZED FORMDATA ENTRIES FOR INSPECTION
//             // =======================================================
//             console.group("📦 Final FormData Entries (Inspected via Iterator)");
//             for (let [key, value] of formData.entries()) {
//                 console.log(`Key: "${key}" => Value:`, value);
//             }
//             console.groupEnd();

//             // Fire API request through your custom interceptor wrapper mapping
//             const response = await PRERNA_API.createCanteen(formData);

//             if (response.status === 200 || response.status === 201) {
//                 alert("Canteen Survey Form Saved and Submitted Successfully!");
//                 // Clear state handles
//                 setSelectedMembers([]);
//                 setFssaiFile(null);
//                 setInvestment("");
//                 setMonthlySale("");
//                 setRent("");
//                 setSalary("");
//                 setElectricity("");
//                 setMiscellaneous("");
//                 setOtherExpense("");
//                 setAopName("");
//                 setAopMembers("");
//                 setAccountNo("");
//                 setIfsc("");
//                 setBranch("");
//                 setBankName("");
//             }
//         } catch (error) {
//             console.error("Critical submission failure encountered:", error);
//             const serverErrorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
//             alert(`Failed saving record details to server backend. Diagnostic payload: ${serverErrorMsg}`);
//         }
//     };

//     const GlobalLoadingState = geoLoading || filterLoading;

//     return (
//         <div className="container">
//             <h1>Canteen Survey Form</h1>

//             {/* Location Details */}
//             <div className="section">
//                 <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

//                 <div className="grid">
//                     <div>
//                         <label>District</label>
//                         <select
//                             value={district}
//                             onChange={(e) => {
//                                 setDistrict(e.target.value);
//                                 setBlock("");
//                             }}
//                             disabled={isBMM || isDMM || GlobalLoadingState}
//                         >
//                             {!isBMM && !isDMM && <option value="">Select District</option>}
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <option key={`district-${d.district_id}`} value={d.district_id}>
//                                     {d.district_name_en || d.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Block</label>
//                         <select
//                             value={block}
//                             onChange={(e) => setBlock(e.target.value)}
//                             disabled={isBMM || !district || GlobalLoadingState}
//                         >
//                             {!isBMM && <option value="">Select Block</option>}
//                             {Array.isArray(blocks) && blocks.map((b) => (
//                                 <option key={`block-${b.block_id}`} value={b.block_id}>
//                                     {b.block_name_en || b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>SHG</label>
//                         <div className="paginated-select-container">
//                             <input
//                                 type="text"
//                                 className="search-input-field"
//                                 placeholder="🔍 Type to search SHG..."
//                                 value={shgSearchTerm}
//                                 onChange={(e) => setShgSearchTerm(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             />

//                             <select
//                                 value={shg}
//                                 onChange={(e) => setShg(e.target.value)}
//                                 disabled={!block || GlobalLoadingState}
//                             >
//                                 <option value="">
//                                     {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
//                                 </option>
//                                 {Array.isArray(shgs) && shgs.map((s) => (
//                                     <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
//                                         {s.name || s.shg_name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {block && hasMoreShgs && (
//                                 <button
//                                     type="button"
//                                     className="load-more-btn"
//                                     onClick={loadMoreShgs}
//                                     disabled={loadingShgs}
//                                 >
//                                     {loadingShgs ? "Searching..." : "Load More SHGs"}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {Array.isArray(availableMembers) && availableMembers.length > 0 && (
//                     <>
//                         <div className="memberSection">
//                             <label>SHG Members</label>
//                             <div className="paginated-select-container">
//                                 <select
//                                     value={selectedMember}
//                                     onChange={(e) => {
//                                         setSelectedMember(e.target.value);
//                                         addMember(e.target.value);
//                                     }}
//                                 >
//                                     <option value="">Select Member (Name - Code)</option>
//                                     {availableMembers.map((member) => (
//                                         <option key={`member-${member.member_code}`} value={member.member_code}>
//                                             {member.applicant_name || member.member_name} ({member.member_code})
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {hasMoreMembers && (
//                                     <button
//                                         type="button"
//                                         className="load-more-btn"
//                                         onClick={loadMoreMembers}
//                                         disabled={loadingMembers}
//                                     >
//                                         {loadingMembers ? "Loading..." : "Load More Members"}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="chips">
//                             {selectedMembers.map((member, idx) => (
//                                 <div className="chip" key={`chip-${member.member_code}-${idx}`}>
//                                     <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
//                                     <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Canteen Details */}
//             <div className="section">
//                 <h2>Canteen Details</h2>
//                 <label>Type Of Canteen</label>
//                 <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Prerna Canteen</option>
//                     <option>Model PC</option>
//                     <option>Prerna Cafe</option>
//                     <option>Sarvodaya Vidyalaya</option>
//                     <option>Janjatiya</option>
//                     <option>Others</option>
//                 </select>

//                 <div className="fieldGroup">
//                     <label>Type Of Food</label>
//                     <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
//                         <option value="">Select Food Type</option>
//                         <option>Breakfast</option>
//                         <option>Lunch</option>
//                         <option>Dinner</option>
//                         <option>Tea & Snacks</option>
//                         <option>Fast Food</option>
//                         <option>Beverages</option>
//                         <option>Others</option>
//                     </select>
//                 </div>

//                 {canteenType === "Model PC" && (
//                     <div className="section">
//                         <h3>Model PC Details</h3>
//                         <div className="grid">
//                             <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
//                             <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
//                             <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
//                             <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
//                             <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
//                             <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Packaged Food Section */}
//             <div className="section">
//                 <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
//                 <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                 </select>

//                 {packedFood === "Yes" && (
//                     <div className="productGrid">
//                         {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
//                             <label key={item}>
//                                 <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
//                                 {item}
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Training Section */}
//             <div className="section">
//                 <h2>Have you received any training related to operating or managing the canteen?</h2>
//                 <select value={training} onChange={(e) => setTraining(e.target.value)}>
//                     <option value="">Select</option>
//                     <option>Yes</option>
//                     <option>No</option>
//                 </select>

//                 {training === "Yes" && (
//                     <div className="grid" style={{ marginTop: "15px" }}>
//                         <input
//                             placeholder="Training Source"
//                             value={trainingSource}
//                             onChange={(e) => setTrainingSource(e.target.value)}
//                         />
//                         <input
//                             placeholder="Training Amount"
//                             value={trainingAmount}
//                             onChange={(e) => setTrainingAmount(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* Financial Details */}
//             <div className="section">
//                 <h2>Financial Details</h2>
//                 <div className="grid">
//                     <div>
//                         <label>Total Investment</label>
//                         <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Monthly Sale</label>
//                         <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Rent</label>
//                         <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Salary</label>
//                         <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Electricity</label>
//                         <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Miscellaneous</label>
//                         <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Other Expense</label>
//                         <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Total Income (Read Only)</label>
//                         <input value={totalIncome} readOnly placeholder="Total Income" />
//                     </div>
//                     <div>
//                         <label>Total Expense (Read Only)</label>
//                         <input value={totalExpense} readOnly placeholder="Total Expense" />
//                     </div>
//                     <div>
//                         <label>Profit / Loss (Read Only)</label>
//                         <input value={profitLoss} readOnly placeholder="Profit/Loss" />
//                     </div>
//                 </div>
//             </div>

//             {/* Certificates & Licensing Documentation */}
//             <div className="section">
//                 <h2>Certificates & Licensing Documentation</h2>
//                 <div className="uploadBox">
//                     <label>FSSAI License</label>
//                     <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => setFssaiFile(e.target.files[0] || null)}
//                     />
//                 </div>
//             </div>

//             <button className="submitBtn" onClick={submitForm}>Submit Form</button>

//             <style>{`
//                 .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
//                 h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
//                 .section { margin-bottom: 28px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e5e7eb; }
//                 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
//                 .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
//                 label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
//                 input, select { width: 100%; height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid #d1d5db; background: white; font-size: 14px; box-sizing: border-box; margin-top: 5px; }
//                 input[readonly], select[disabled] { background: #f3f4f6; cursor: not-allowed; color: #6b7280; }
//                 .memberSection { margin-top: 25px; }
//                 .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
//                 .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
//                 .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
//                 .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
//                 .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
//                 .productGrid input { width: auto; height: auto; margin: 0; }
//                 .submitBtn { width: 100%; height: 54px; border: none; border-radius: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600; margin-top: 30px; cursor: pointer; transition: .25s; }
//                 .submitBtn:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,.25); }

//                 .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
//                 .search-input-field { height: 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; margin-bottom: 2px; background: #fdfdfd; }
//                 .search-input-field:focus { border-color: #3b82f6; outline: none; background: #fff; }
//                 .load-more-btn { background-color: #f1f5f9; color: #1e293b; border: 1px dashed #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; transition: 0.2s ease; }
//                 .load-more-btn:hover:not(:disabled) { background-color: #e2e8f0; color: #0f172a; }
//                 .load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .uploadBox { padding: 10px 0; }
//                 .uploadBox input[type="file"] { padding-top: 12px; }
//             `}</style>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { LOOKUP_API, EPSAKHI_API, PRERNA_API } from "../../api/axios";
import useUserGeoscope, { useCanteenFilters } from "../../Hooks/useUserGeoscope";
import prernaLogo from '../../assets/prerna.png'

export default function CanteenForm() {
    // Geography Dropdown Options State & Pagination Control
    const [shgs, setShgs] = useState([]);
    const [shgPage, setShgPage] = useState(1);
    const [hasMoreShgs, setHasMoreShgs] = useState(true);
    const [loadingShgs, setLoadingShgs] = useState(false);
    const [shgSearchTerm, setShgSearchTerm] = useState("");
    const [debouncedShgSearch, setDebouncedShgSearch] = useState("");

    // Selections (Aligned with CanteenHome Database Model Fields)
    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");
    const [shg, setShg] = useState("");

    // Members State & Pagination Control
    const [availableMembers, setAvailableMembers] = useState([]);
    const [memberPage, setMemberPage] = useState(1);
    const [hasMoreMembers, setHasMoreMembers] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const [selectedMember, setSelectedMember] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Detail Configuration States
    const [canteenType, setCanteenType] = useState("");
    const [otherCanteenType, setOtherCanteenType] = useState("");
    const [foodType, setFoodType] = useState("");
    const [otherFoodType, setOtherFoodType] = useState("");

    // Model PC Structured States
    const [aopName, setAopName] = useState("");
    const [aopMembers, setAopMembers] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [branch, setBranch] = useState("");
    const [bankName, setBankName] = useState("");

    // Finance Metrics Configuration States
    const [investment, setInvestment] = useState("");
    const [monthlySale, setMonthlySale] = useState("");
    const [rent, setRent] = useState("");
    const [salary, setSalary] = useState("");
    const [electricity, setElectricity] = useState("");
    const [miscellaneous, setMiscellaneous] = useState("");
    const [otherExpense, setOtherExpense] = useState("");

    // Categorized Flag Indicators & Media Handles
    const [packedFood, setPackedFood] = useState("");
    const [packedProducts, setPackedProducts] = useState([]);
    const [training, setTraining] = useState("");
    const [trainingSource, setTrainingSource] = useState("");
    const [trainingAmount, setTrainingAmount] = useState("");
    const [fssaiFile, setFssaiFile] = useState(null);

    // Helper utility to capture custom data layout format from your backend metadata payload
    const extractListing = (response) => {
        if (!response) return [];
        const payload = response.data !== undefined ? response.data : response;
        if (!payload) return [];
        if (payload.data && Array.isArray(payload.data)) return payload.data;
        if (payload.results && Array.isArray(payload.results)) return payload.results;
        if (Array.isArray(payload)) return payload;
        return [];
    };

    // 1. Fetch User Scope first
    const { geoScope, loading: geoLoading } = useUserGeoscope();

    // 2. Feed parameters cleanly down to filter calculations
    const {
        districts,
        blocks,
        isBMM,
        isDMM,
        loading: filterLoading
    } = useCanteenFilters({
        district,
        setDistrict,
        block,
        setBlock,
        geoScope,
        geoLoading,
        extractListing
    });

    const totalExpense =
        Number(rent || 0) +
        Number(salary || 0) +
        Number(electricity || 0) +
        Number(miscellaneous || 0) +
        Number(otherExpense || 0);

    const totalIncome = Number(monthlySale || 0);
    const profitLoss = totalIncome - totalExpense;

    // Debounce processing for SHG search queries
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedShgSearch(shgSearchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [shgSearchTerm]);

    // Reset downstream entries when base district updates
    useEffect(() => {
        if (geoLoading) return;
        setShg("");
        setShgs([]);
        setShgPage(1);
        setHasMoreShgs(true);
        setShgSearchTerm("");
        setDebouncedShgSearch("");
        setAvailableMembers([]);
        setMemberPage(1);
        setHasMoreMembers(true);
        setSelectedMembers([]);
    }, [district, geoLoading]);

    // Fetch SHGs dynamically when Block ID or Debounced Search state shifts
    useEffect(() => {
        const fetchInitialShgs = async () => {
            if (!block) {
                setShgs([]);
                return;
            }
            setLoadingShgs(true);
            try {
                const response = await EPSAKHI_API.upsrlmShgList(block, {
                    page: 1,
                    page_size: 20,
                    search: debouncedShgSearch
                });
                const data = extractListing(response);
                setShgs(data);
                setShgPage(1);
                setHasMoreShgs(data.length >= 20);
            } catch (err) {
                console.error("Error fetching SHGs", err);
                setShgs([]);
            } finally {
                setLoadingShgs(false);
            }
        };

        setShg("");
        setAvailableMembers([]);
        setSelectedMembers([]);
        fetchInitialShgs();
    }, [block, debouncedShgSearch]);

    // Paginated load-more logic for SHGs
    const loadMoreShgs = async () => {
        if (loadingShgs || !hasMoreShgs || !block) return;
        setLoadingShgs(true);
        const nextPage = shgPage + 1;
        try {
            const response = await EPSAKHI_API.upsrlmShgList(block, {
                page: nextPage,
                page_size: 20,
                search: debouncedShgSearch
            });
            const data = extractListing(response);
            if (data.length === 0) {
                setHasMoreShgs(false);
            } else {
                setShgs((prev) => [...prev, ...data]);
                setShgPage(nextPage);
                if (data.length < 20) setHasMoreShgs(false);
            }
        } catch (err) {
            console.error("Error loading extra SHG entries", err);
        } finally {
            setLoadingShgs(false);
        }
    };

    // Initial Fetch Members when SHG code updates
    useEffect(() => {
        const fetchInitialMembers = async () => {
            if (!shg) {
                setAvailableMembers([]);
                return;
            }
            setLoadingMembers(true);
            try {
                const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: 1, limit: 20 });
                const data = extractListing(response);
                setAvailableMembers(data);
                setMemberPage(1);
                setHasMoreMembers(data.length >= 20);
            } catch (err) {
                console.error("Error fetching members", err);
                setAvailableMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        };

        setAvailableMembers([]);
        fetchInitialMembers();
    }, [shg]);

    // Paginated load-more logic for Members
    const loadMoreMembers = async () => {
        if (loadingMembers || !hasMoreMembers || !shg) return;
        setLoadingMembers(true);
        const nextPage = memberPage + 1;
        try {
            const response = await EPSAKHI_API.upsrlmShgMembers(shg, { page: nextPage, limit: 20 });
            const data = extractListing(response);
            if (data.length === 0) {
                setHasMoreMembers(false);
            } else {
                setAvailableMembers((prev) => [...prev, ...data]);
                setMemberPage(nextPage);
                if (data.length < 20) setHasMoreMembers(false);
            }
        } catch (err) {
            console.error("Error loading extra Member entries", err);
        } finally {
            setLoadingMembers(false);
        }
    };

    // Async addMember utility that pulls unique CLF context values on demand
    const addMember = async (memberCode) => {
        if (!memberCode) return;

        const memberObj = availableMembers.find((m) => m.member_code === memberCode);
        if (!memberObj) return;

        const alreadyExists = selectedMembers.some((m) => m.member_code === memberCode);
        if (alreadyExists) {
            setSelectedMember("");
            return;
        }

        const uniqueId = Date.now();
        const activeShgObject = shgs.find(s => (s.code || s.shg_code) === shg);

        const temporaryMemberItem = {
            id: uniqueId,
            member_code: memberObj.member_code,
            applicant_name: memberObj.applicant_name || memberObj.member_name || "",
            lokos_shg_code: shg,
            lokos_shg_name: activeShgObject ? (activeShgObject.name || activeShgObject.shg_name) : "",
            lokos_clf_code: "",
            clf_name: "Resolving CLF...",
            age: memberObj.age || null,
            gender: memberObj.gender || "Female",
            mobile: memberObj.mobile || "",
            email: memberObj.email || ""
        };

        setSelectedMembers((prev) => [...prev, temporaryMemberItem]);
        setSelectedMember("");

        try {
            const response = await LOOKUP_API.upsrlmFindClf({
                block_id: block,
                member_code: memberObj.member_code,
            });

            const resolvedClfName = response?.data?.name || response?.data?.clf_name || "CLF Not Found";
            const resolvedClfCode = response?.data?.code || response?.data?.clf_code || "";

            setSelectedMembers((prev) =>
                prev.map((item) =>
                    item.id === uniqueId ? { ...item, clf_name: resolvedClfName, lokos_clf_code: resolvedClfCode } : item
                )
            );
        } catch (err) {
            console.error("Error resolving individual member CLF context:", err);
            setSelectedMembers((prev) =>
                prev.map((item) =>
                    item.id === uniqueId ? { ...item, clf_name: "Error Resolving" } : item
                )
            );
        }
    };

    const removeMember = (memberCode) => {
        setSelectedMembers(selectedMembers.filter((m) => m.member_code !== memberCode));
    };

    const toggleProduct = (product) => {
        if (packedProducts.includes(product)) {
            setPackedProducts(packedProducts.filter((item) => item !== product));
        } else {
            setPackedProducts([...packedProducts, product]);
        }
    };

    // Submits structured JSON blocks handling multiple members correctly
    const submitForm = async () => {
        if (!district || !block) {
            alert("Please input essential regional parameters first.");
            return;
        }
        if (selectedMembers.length === 0) {
            alert("Please select at least one SHG Member before submitting.");
            return;
        }

        // Intercept and resolve custom values for dropdown selectors dynamically
        const finalCanteenTypeValue = canteenType === "Others" ? otherCanteenType : canteenType;
        const finalFoodTypeValue = foodType === "Others" ? otherFoodType : foodType;

        try {
            // 1. Structure raw data nodes precisely aligned with server model mapping instructions
            const homePayload = {
                canteen_type: finalCanteenTypeValue,
                district_id: Number(district),
                block_id: Number(block)
            };

            // Process all selected members into an array payload instead of tracking just index 0
            const membersArrayPayload = selectedMembers.map((member) => ({
                applicant_name: member.applicant_name,
                mobile: member.mobile,
                lokos_member_code: member.member_code,
                lokos_shg_code: member.lokos_shg_code,
                lokos_shg_name: member.lokos_shg_name,
                lokos_clf_code: member.lokos_clf_code,
                lokos_clf_name: member.clf_name,
                age: member.age ? Number(member.age) : null,
                gender: member.gender
            }));

            const referenceShgName = selectedMembers[0]?.lokos_shg_name || "SHG";
            const detailPayload = {
                canteen_name: `${referenceShgName} Canteen`,
                food_type: finalFoodTypeValue,
                sells_other_shg_packaged_food: packedFood,
                has_canteen_management_training: training,
                packaged_products_list: packedProducts,
                training_source: training === "Yes" ? trainingSource : "",
                training_amount: training === "Yes" ? trainingAmount : ""
            };

            const financePayload = {
                total_investment: investment || "0.00",
                monthly_sale: monthlySale || "0.00",
                rent: rent || "0.00",
                salary: salary || "0.00",
                electricity: electricity || "0.00",
                miscellaneous: miscellaneous || "0.00",
                other_expense: otherExpense || "0.00",
                total_income: totalIncome.toString(),
                total_expense: totalExpense.toString(),
                profit_loss: profitLoss.toString()
            };

            let modelPcPayload = null;
            if (canteenType === "Model PC") {
                modelPcPayload = {
                    aop_name: aopName,
                    aop_members: aopMembers,
                    account_no: accountNo,
                    ifsc: ifsc,
                    branch: branch,
                    bank_name: bankName
                };
            }

            const licensesText = [];
            if (fssaiFile) {
                licensesText.push({ license_name: "FSSAI License" });
            }

            // ==========================================
            // LOGGING THE PAYLOAD STRUCTS TO THE CONSOLE
            // ==========================================
            console.group("🚀 Canteen Form - Payload Submission Blueprint");
            console.log("1. Home Payload Structure:", homePayload);
            console.log("2. Multiple Members Payload Array:", membersArrayPayload);
            console.log("3. Detail Payload Structure:", detailPayload);
            console.log("4. Finance Payload Structure:", financePayload);
            if (modelPcPayload) {
                console.log("5. Model PC Payload Structure:", modelPcPayload);
            }
            console.log("6. Licenses Manifest Array:", licensesText);
            console.log("7. Attached Binary License File (FSSAI):", fssaiFile);
            console.groupEnd();

            // 2. Pack multi-part properties inside active FormData pipeline wrapper
            const formData = new FormData();
            formData.append("home", JSON.stringify(homePayload));

            // Sending the multiple members collection array as a stringified payload key
            formData.append("member", JSON.stringify(membersArrayPayload));

            formData.append("detail", JSON.stringify(detailPayload));
            formData.append("finance", JSON.stringify(financePayload));

            if (modelPcPayload) {
                formData.append("model_pc", JSON.stringify(modelPcPayload));
            }

            formData.append("licenses", JSON.stringify(licensesText));
            if (fssaiFile) {
                formData.append("license_file_0", fssaiFile);
            }

            // =======================================================
            // DISPLAY FINALIZED FORMDATA ENTRIES FOR INSPECTION
            // =======================================================
            console.group("📦 Final FormData Entries (Inspected via Iterator)");
            for (let [key, value] of formData.entries()) {
                console.log(`Key: "${key}" => Value:`, value);
            }
            console.groupEnd();

            // Fire API request through your custom interceptor wrapper mapping
            const response = await PRERNA_API.createCanteen(formData);

            if (response.status === 200 || response.status === 201) {
                alert("Canteen Survey Form Saved and Submitted Successfully!");
                // Clear state handles
                setSelectedMembers([]);
                setFssaiFile(null);
                setInvestment("");
                setMonthlySale("");
                setRent("");
                setSalary("");
                setElectricity("");
                setMiscellaneous("");
                setOtherExpense("");
                setAopName("");
                setAopMembers("");
                setAccountNo("");
                setIfsc("");
                setBranch("");
                setBankName("");
                setOtherCanteenType("");
                setOtherFoodType("");
            }
        } catch (error) {
            console.error("Critical submission failure encountered:", error);
            const serverErrorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            alert(`Failed saving record details to server backend. Diagnostic payload: ${serverErrorMsg}`);
        }
    };

    const GlobalLoadingState = geoLoading || filterLoading;

    return (
        <div className="container">
            <div className="heading-section">
                <img src={prernaLogo} alt="Prerna Logo" className="logo" />
            </div>
            <h1>Prerna Canteen Survey Form</h1>

            {/* Location Details */}
            <div className="section">
                <h2>Location Details {GlobalLoadingState && <span style={{ fontSize: '13px', color: '#3d6ba6', marginLeft: '10px' }}>(Loading regional boundaries...)</span>}</h2>

                {/* <div className="grid">
                    <div>
                        <label>District</label>
                        <select
                            value={district}
                            onChange={(e) => {
                                setDistrict(e.target.value);
                                setBlock("");
                            }}
                            disabled={isBMM || isDMM || GlobalLoadingState}
                        >
                            {!isBMM && !isDMM && <option value="">Select District</option>}
                            {Array.isArray(districts) && districts.map((d) => (
                                <option key={`district-${d.district_id}`} value={d.district_id}>
                                    {d.district_name_en || d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Block</label>
                        <select
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                            disabled={isBMM || !district || GlobalLoadingState}
                        >
                            {!isBMM && <option value="">Select Block</option>}
                            {Array.isArray(blocks) && blocks.map((b) => (
                                <option key={`block-${b.block_id}`} value={b.block_id}>
                                    {b.block_name_en || b.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>SHG</label>
                        <div className="paginated-select-container">
                            <input
                                type="text"
                                className="search-input-field"
                                placeholder="🔍 Type to search SHG..."
                                value={shgSearchTerm}
                                onChange={(e) => setShgSearchTerm(e.target.value)}
                                disabled={!block || GlobalLoadingState}
                            />

                            <select
                                value={shg}
                                onChange={(e) => setShg(e.target.value)}
                                disabled={!block || GlobalLoadingState}
                            >
                                <option value="">
                                    {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
                                </option>
                                {Array.isArray(shgs) && shgs.map((s) => (
                                    <option key={`shg-${s.code || s.shg_code}`} value={s.code || s.shg_code}>
                                        {s.name || s.shg_name}
                                    </option>
                                ))}
                            </select>
                            {block && hasMoreShgs && (
                                <button
                                    type="button"
                                    className="load-more-btn"
                                    onClick={loadMoreShgs}
                                    disabled={loadingShgs}
                                >
                                    {loadingShgs ? "Searching..." : "Load More SHGs"}
                                </button>
                            )}
                        </div>
                    </div>
                </div> */}

                <div className="grid">
                    <div>
                        <label>DISTRICT</label>
                        <select
                            value={district}
                            onChange={(e) => {
                                setDistrict(e.target.value);
                                setBlock("");
                            }}
                            disabled={isBMM || isDMM || GlobalLoadingState}
                        >
                            {!isBMM && !isDMM && <option value="">Select District</option>}
                            {districts?.map((d) => (
                                <option key={d.district_id} value={d.district_id}>
                                    {d.district_name_en || d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>BLOCK</label>
                        <select
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                            disabled={isBMM || !district || GlobalLoadingState}
                        >
                            {!isBMM && <option value="">Select Block</option>}
                            {blocks?.map((b) => (
                                <option key={b.block_id} value={b.block_id}>
                                    {b.block_name_en || b.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>SHG SEARCH</label>
                        <input
                            type="text"
                            className="search-input-field"
                            placeholder="Type to search SHG..."
                            value={shgSearchTerm}
                            onChange={(e) => setShgSearchTerm(e.target.value)}
                            disabled={!block || GlobalLoadingState}
                        />
                    </div>
                </div>

                <div className="shg-row">
                    <div className="shg-select-wrapper">
                        <label>SELECT SHG</label>
                        <select
                            value={shg}
                            onChange={(e) => setShg(e.target.value)}
                            disabled={!block || GlobalLoadingState}
                        >
                            <option value="">
                                {loadingShgs ? "Loading SHG entries..." : "Select SHG"}
                            </option>
                            {shgs?.map((s) => (
                                <option
                                    key={s.code || s.shg_code}
                                    value={s.code || s.shg_code}
                                >
                                    {s.name || s.shg_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {block && hasMoreShgs && (
                        <button
                            type="button"
                            className="load-more-btn"
                            onClick={loadMoreShgs}
                            disabled={loadingShgs}
                        >
                            ↻ {loadingShgs ? "Loading..." : "Load more"}
                        </button>
                    )}
                </div>

                {Array.isArray(availableMembers) && availableMembers.length > 0 && (
                    <>
                        <div className="memberSection">
                            <label>SHG Members</label>
                            <div className="paginated-select-container">
                                <select
                                    value={selectedMember}
                                    onChange={(e) => {
                                        setSelectedMember(e.target.value);
                                        addMember(e.target.value);
                                    }}
                                >
                                    <option value="">Select Member (Name - Code)</option>
                                    {availableMembers.map((member) => (
                                        <option key={`member-${member.member_code}`} value={member.member_code}>
                                            {member.applicant_name || member.member_name} ({member.member_code})
                                        </option>
                                    ))}
                                </select>
                                {hasMoreMembers && (
                                    <button
                                        type="button"
                                        className="load-more-btn"
                                        onClick={loadMoreMembers}
                                        disabled={loadingMembers}
                                    >
                                        {loadingMembers ? "Loading..." : "Load More Members"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="chips">
                            {selectedMembers.map((member, idx) => (
                                <div className="chip" key={`chip-${member.member_code}-${idx}`}>
                                    <span>{member.applicant_name} ({member.member_code}) - <strong>CLF: {member.clf_name}</strong></span>
                                    <button type="button" onClick={() => removeMember(member.member_code)}>×</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Canteen Details */}
            {/* <div className="section">
                <h2>Canteen Details</h2>

                <div>
                    <label>Type Of Canteen</label>
                    <select value={canteenType} onChange={(e) => setCanteenType(e.target.value)}>
                        <option value="">Select</option>
                        <option>Prerna Canteen</option>
                        <option>Model PC</option>
                        <option>Prerna Cafe</option>
                        <option>Sarvodaya Vidyalaya</option>
                        <option>Janjatiya</option>
                        <option>Others</option>
                    </select>
                    {canteenType === "Others" && (
                        <input
                            type="text"
                            style={{ marginTop: "10px" }}
                            placeholder="Please specify custom canteen type..."
                            value={otherCanteenType}
                            onChange={(e) => setOtherCanteenType(e.target.value)}
                        />
                    )}
                </div>

                <div className="fieldGroup">
                    <label>Type Of Food</label>
                    <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                        <option value="">Select Food Type</option>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Tea & Snacks</option>
                        <option>Fast Food</option>
                        <option>Beverages</option>
                        <option>Others</option>
                    </select>
                    {foodType === "Others" && (
                        <input
                            type="text"
                            style={{ marginTop: "10px" }}
                            placeholder="Please specify custom food type..."
                            value={otherFoodType}
                            onChange={(e) => setOtherFoodType(e.target.value)}
                        />
                    )}
                </div>

                {canteenType === "Model PC" && (
                    <div className="section">
                        <h3>Model PC Details</h3>
                        <div className="grid">
                            <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
                            <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
                            <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                            <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                            <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
                            <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </div>
                    </div>
                )}
            </div> */}

            <div className="section">
                <h2>Canteen Details</h2>

                <div className="canteen-grid">
                    <div>
                        <label>Type Of Canteen</label>
                        <select
                            value={canteenType}
                            onChange={(e) => setCanteenType(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option>Prerna Canteen</option>
                            <option>Model PC</option>
                            <option>Prerna Cafe</option>
                            <option>Sarvodaya Vidyalaya</option>
                            <option>Janjatiya</option>
                            <option>Others</option>
                        </select>

                        {canteenType === "Others" && (
                            <input
                                type="text"
                                style={{ marginTop: "10px" }}
                                placeholder="Please specify custom canteen type..."
                                value={otherCanteenType}
                                onChange={(e) => setOtherCanteenType(e.target.value)}
                            />
                        )}
                    </div>

                    <div>
                        <label>Type Of Food</label>
                        <select
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                        >
                            <option value="">Select Food Type</option>
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Tea & Snacks</option>
                            <option>Fast Food</option>
                            <option>Beverages</option>
                            <option>Others</option>
                        </select>

                        {foodType === "Others" && (
                            <input
                                type="text"
                                style={{ marginTop: "10px" }}
                                placeholder="Please specify custom food type..."
                                value={otherFoodType}
                                onChange={(e) => setOtherFoodType(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                {canteenType === "Model PC" && (
                    <div className="section">
                        <h3>Model PC Details</h3>
                        <div className="grid">
                            <input placeholder="Name Of AOP" value={aopName} onChange={(e) => setAopName(e.target.value)} />
                            <input placeholder="No Of Members In AOP" value={aopMembers} onChange={(e) => setAopMembers(e.target.value)} />
                            <input placeholder="A/C Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                            <input placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                            <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
                            <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>


            {/* Packaged Food Section */}
            {/* <div className="section">
                <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>
                <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select> */}

            <div className="two-column-sections">

                <div className="section">
                    <h2>Are any other packaged food products manufactured by SHGs also being sold at the canteen?</h2>

                    <select value={packedFood} onChange={(e) => setPackedFood(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>

                    {/* 
                {packedFood === "Yes" && (
                    <div className="productGrid">
                        {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => (
                            <label key={item}>
                                <input type="checkbox" checked={packedProducts.includes(item)} onChange={() => toggleProduct(item)} />
                                {item}
                            </label>
                        ))}
                    </div>
                )} */}

                    {packedFood === "Yes" && (
                        <>
                            <div className="productGrid">
                                {["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen", "Others"].map((item) => {
                                    // Determine if checked: standard items use .includes(), 
                                    // "Others" is checked if there's any value in the array that isn't a standard item
                                    const isChecked = item === "Others"
                                        ? packedProducts.some(p => !["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen"].includes(p))
                                        : packedProducts.includes(item);

                                    return (
                                        <label key={item}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleProduct(item)}
                                            />
                                            {item}
                                        </label>
                                    );
                                })}
                            </div>

                            {/* If there's any string in packedProducts that is NOT a standard item,
          it means the user clicked "Others". We show the typable text input box.
        */}
                            {packedProducts.some(p => !["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen"].includes(p)) && (
                                <div style={{ marginTop: "12px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600" }}>Specify Other Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Type custom product name here..."
                                        // Find the custom string inside the same packedProducts array to display it
                                        value={packedProducts.find(p => !["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen"].includes(p)) || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const standardItems = ["Spices", "Edible Oil", "Chips", "Papad", "Pickle", "Sweets", "Biscuits", "Namkeen"];

                                            // Update the custom value inside the same array line
                                            setPackedProducts(prev => {
                                                const filtered = prev.filter(p => standardItems.includes(p));
                                                return [...filtered, val]; // keeps standard ones, appends the typed text
                                            });
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>


                {/* Training Section */}
                <div className="section">
                    <h2>Have you received any training related to operating or managing the canteen?</h2>
                    <select value={training} onChange={(e) => setTraining(e.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>

                    {training === "Yes" && (
                        <div className="grid" style={{ marginTop: "15px" }}>
                            <input
                                placeholder="Training Source"
                                value={trainingSource}
                                onChange={(e) => setTrainingSource(e.target.value)}
                            />
                            <input
                                placeholder="Training Amount"
                                value={trainingAmount}
                                onChange={(e) => setTrainingAmount(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Financial Details */}
            <div className="section">
                <h2>Financial Details</h2>
                <div className="grid">
                    <div>
                        <label>Total Investment</label>
                        <input placeholder="Total Investment" value={investment} onChange={(e) => setInvestment(e.target.value)} />
                    </div>
                    <div>
                        <label>Monthly Sale</label>
                        <input placeholder="Monthly Sale" value={monthlySale} onChange={(e) => setMonthlySale(e.target.value)} />
                    </div>
                    <div>
                        <label>Rent</label>
                        <input placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} />
                    </div>
                    <div>
                        <label>Salary</label>
                        <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                    </div>
                    <div>
                        <label>Electricity</label>
                        <input placeholder="Electricity" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
                    </div>
                    <div>
                        <label>Miscellaneous</label>
                        <input placeholder="Miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
                    </div>
                    <div>
                        <label>Other Expense</label>
                        <input placeholder="Other Expense" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
                    </div>
                    <div>
                        <label>Total Income (Read Only)</label>
                        <input value={totalIncome} readOnly placeholder="Total Income" />
                    </div>
                    <div>
                        <label>Total Expense (Read Only)</label>
                        <input value={totalExpense} readOnly placeholder="Total Expense" />
                    </div>
                    <div>
                        <label>Profit / Loss (Read Only)</label>
                        <input value={profitLoss} readOnly placeholder="Profit/Loss" />
                    </div>
                </div>
            </div>

            {/* Certificates & Licensing Documentation */}
            <div className="section">
                <h2>Certificates & Licensing</h2>

                <div className="uploadBox">
                    <label htmlFor="fssai-upload" className="upload-card">
                        <div className="upload-icon">⬆</div>
                        <div className="upload-title">Upload FSSAI licence</div>
                        <div className="upload-subtitle">
                            PDF, JPG or PNG
                        </div>

                        {fssaiFile && (
                            <div className="file-name">
                                {fssaiFile.name}
                            </div>
                        )}
                    </label>

                    <input
                        id="fssai-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFssaiFile(e.target.files?.[0] || null)}
                        hidden
                    />
                </div>
            </div>

            <div className="submit-wrapper">
                <button className="submitBtn" onClick={submitForm}>
                    Submit
                </button>
            </div>

            <style>{`
                .container { max-width: 1400px; margin: 30px auto; padding: 30px; background: #ffffff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: sans-serif; }
                h1 { text-align: center; margin-bottom: 30px; color: #1e293b; }
                .section {
    margin-bottom: 28px;
    padding: 24px;
    border-radius: 16px;
    background: #fafafa;
    border: 2px solid #f87171;
    transition: all 0.3s ease;
}

.section:focus-within {
    border-color: #dc2626;
    background: #fff;
    box-shadow:
        0 0 0 5px rgba(220, 38, 38, 0.12),
        0 12px 30px rgba(220, 38, 38, 0.18);
}
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
}

.shg-row {
    margin-top: 16px;
    display: flex;
    align-items: flex-end;
    gap: 12px;
}

.shg-select-wrapper {
    flex: 1;
}

.shg-select-wrapper select {
    width: 100%;
}

.load-more-btn {
    height: 48px;
    min-width: 150px;
    border-radius: 10px;
    border: 1px solid #f59e0b;
    background: #fff;
    color: #1f2937;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #fff;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .shg-row {
        flex-direction: column;
        align-items: stretch;
    }

    .load-more-btn {
        width: 100%;
    }
}
                .fieldGroup { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
                label { font-size: 14px; font-weight: 600; color: #374151; display: block; margin-top: 10px; }
               input,
select {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid #f59e0b; /* Amber border */
    background: white;
    font-size: 14px;
    box-sizing: border-box;
    margin-top: 5px;
    outline: none;
    transition: all 0.2s ease;
}

input:hover,
select:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

input:focus,
select:focus {
    border-color: #2563eb;
    transform: translateY(-3px);
    box-shadow:
        0 0 0 4px rgba(37, 99, 235, 0.18),
        0 12px 24px rgba(0, 0, 0, 0.12);
}
input[readonly],
select[disabled] {
    background: #f3f4f6;
    cursor: not-allowed;
    color: #6b7280;
}
                .memberSection { margin-top: 25px; }
                .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
                .chip { display: flex; align-items: center; gap: 8px; background: #2563eb; color: white; border-radius: 50px; padding: 8px 14px; }
                .chip button { border: none; background: transparent; color: white; cursor: pointer; font-size: 18px; }
                .productGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; }
                .productGrid label { background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .productGrid input { width: auto; height: auto; margin: 0; }
   .submit-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
                .submitBtn {
    min-width: 220px;
    height: 50px;
    padding: 0 30px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.submitBtn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 14px 30px rgba(245, 158, 11, 0.4);
}

.submitBtn:active {
    transform: scale(0.98);
}
                .paginated-select-container { display: flex; flex-direction: column; gap: 6px; }
                .search-input-field {
    height: 40px;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 2px;
    background: #fdfdfd;
    outline: none;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
    transition: all 0.2s ease;
}

.search-input-field:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
                
                .uploadBox { padding: 10px 0; }
                .uploadBox input[type="file"] { padding-top: 12px; }

                .heading-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.heading-section h1 {
    margin: 0;
}

.logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.uploadBox {
    margin-top: 20px;
}

.upload-card {
    width: 100%;
    min-height: 150px;
    border: 1.5px dashed #cfcfcf;
    border-radius: 14px;
    background: #faf9f6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: center;
}

.upload-card:hover {
    border-color: #f59e0b;
    background: #fffbeb;
}

.upload-icon {
    font-size: 38px;
    color: #6b7280;
    margin-bottom: 10px;
}

.upload-title {
    font-size: 18px;
    font-weight: 500;
    color: #1f2937;
}

.upload-subtitle {
    margin-top: 6px;
    font-size: 14px;
    color: #6b7280;
}

.file-name {
    margin-top: 12px;
    padding: 6px 12px;
    border-radius: 8px;
    background: #fef3c7;
    color: #92400e;
    font-size: 13px;
    font-weight: 500;
}
    .canteen-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
}

@media (max-width: 768px) {
    .canteen-grid {
        grid-template-columns: 1fr;
    }
}
    .two-column-sections {
    display: flex;
    gap: 24px;
    align-items: stretch;
    margin-bottom: 28px;
}

.two-column-sections .section {
    flex: 1;
    margin-bottom: 0;
}
            `}</style>
        </div>
    );
}