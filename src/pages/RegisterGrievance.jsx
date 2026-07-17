// src/pages/RegisterGrievance.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOOKUP_API, SUPPORT_API } from "../api/axios";
import img1 from "../assets/LoginThemes/FARMLH.jpg";
import img2 from "../assets/LoginThemes/MFIF.jpg";
import img3 from "../assets/LoginThemes/NON-FARM.jpg";
import img4 from "../assets/LoginThemes/SISD.jpg";
import img5 from "../assets/LoginThemes/TNCB.jpg";

export default function RegisterGrievance() {
  const navigate = useNavigate();
  const slides = [img1, img2, img3, img4, img5];
  const [form, setForm] = useState({
    district: "",
    block: "",
    username: "",
    mobile_no: "",
    problem_message: "",
  });

  const [files, setFiles] = useState([]);
  const [ticket, setTicket] = useState("");
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);

    const totalFiles = [...files, ...selected];

    if (totalFiles.length > 3) {
      alert("Maximum 3 screenshots allowed.");
      return;
    }

    setFiles(totalFiles);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("district_id", form.district);
    payload.append("block_id", form.block);
    payload.append("username", form.username);
    payload.append("mobile_no", form.mobile_no);
    payload.append("problem_message", form.problem_message);

    files.forEach((file) => {
      payload.append("screenshots", file);
    });

    // ===== Debug Logs =====
    console.log("Form State:", form);
    console.log("Selected Files:", files);

    console.log("FormData Payload:");
    for (let [key, value] of payload.entries()) {
      console.log(
        key,
        value instanceof File ? `${value.name} (${value.size} bytes)` : value,
      );
    }

    try {
      const res = await SUPPORT_API.createTicket(payload);

      console.log("API Success:", res);
      console.log("Response Data:", res.data);

      setTicket(res.data.ticket_code);

      setForm({
        district: "",
        block: "",
        username: "",
        mobile_no: "",
        problem_message: "",
      });

      setFiles([]);
      setBlocks([]);
    } catch (err) {
      console.error("API Error:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      } else if (err.request) {
        console.error("No Response Received:", err.request);
      } else {
        console.error("Error Message:", err.message);
      }

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong.",
      );
    }
  };

  const roles = [
    "BMM",
    "DMM",
    "SMM",
    "Training Partner",
    "District-TP-ID",
    "Center-ID",
  ];

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const res = await LOOKUP_API.districts.list({
        page_size: 500,
      });

      console.log("District Response", res.data);

      // setDistricts(res.data.results || res.data);
      const districtData = Array.isArray(res.data.results)
        ? res.data.results
        : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("District Data:", districtData);

      setDistricts(districtData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;

    setForm((prev) => ({
      ...prev,
      district: districtId,
      block: "",
    }));

    setBlocks([]);

    if (!districtId) return;

    try {
      const response = await LOOKUP_API.FULLblocksByDistrict(districtId, {
        page_size: 5000,
      });

      console.log("Blocks API Response:", response.data);

      const blockData = response?.data?.results || response?.data || [];

      setBlocks(blockData);
    } catch (err) {
      console.error("Error loading blocks:", err);

      alert("ब्लॉक लोड करने में समस्या आई, कृपया पुनः प्रयास करें।");
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // every 4 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="grievance-page"
      style={{
        backgroundImage: `url(${slides[currentSlide]})`,
      }}
    >
      <form className="grievance-card" onSubmit={handleSubmit}>
        <h2>Register Grievance</h2>

        <label className="block-label">District</label>

        <select value={form.district} onChange={handleDistrictChange} required>
          <option value="">Select District</option>

          {Array.isArray(districts) &&
            districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name_en}
              </option>
            ))}
        </select>

        <label className="block-label">Block</label>
        <select
          value={form.block}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              block: e.target.value,
            }))
          }
          disabled={!form.district}
        >
          <option value="">Select Block</option>

          {blocks.map((block) => (
            <option key={block.block_id} value={block.block_id}>
              {block.block_name_en}
            </option>
          ))}
        </select>

        <label className="block-label">Role</label>

        <select
          value={form.role}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              role: e.target.value,
            }))
          }
          required
        >
          <option value="">Select Role</option>

          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <label className="block-label">Username</label>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label className="block-label">Phone Number</label>

        <input
          type="tel"
          name="mobile_no"
          placeholder="Enter Mobile Number"
          value={form.mobile_no}
          onChange={handleChange}
          maxLength={10}
          pattern="[0-9]{10}"
          required
        />

        <textarea
          rows="5"
          placeholder="Describe your issue"
          name="problem_message"
          value={form.problem_message}
          onChange={handleChange}
          required
        />

        <label>Upload Screenshots</label>

        <input type="file" multiple accept="image/*" onChange={handleFiles} />

        <small>Minimum 1 screenshot, Maximum 3 screenshots</small>
        {files.length > 0 && (
          <div className="image-preview-container">
            {files.map((file, index) => (
              <div className="image-card" key={index}>
                <img src={URL.createObjectURL(file)} alt="" />

                <button type="button" onClick={() => removeImage(index)}>
                  ✕
                </button>

                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Submit Grievance</button>

        {ticket && (
          <div className="success-box">
            <h3>Complaint Submitted Successfully</h3>

            <h2>{ticket}</h2>

            <p>Please save your Ticket Number.</p>

            <h4>WhatsApp Support</h4>

            <a
              href="https://wa.me/919236434631"
              target="_blank"
              rel="noreferrer"
            >
              +91-9236434631
            </a>
            <br></br>
            <a
              href="https://wa.me/918840961627

"
              target="_blank"
              rel="noreferrer"
            >
              +91-8840961627
            </a>
          </div>
        )}

        <button type="button" className="backBtn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </form>
      <style>{`.grievance-page{
    min-height:100vh;
    background:#f1f5f9;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:30px;
}

.grievance-card{
    width:600px;
    background:#fff;
    border-radius:10px;
    padding:30px;
    box-shadow:0 10px 30px rgba(0,0,0,.15);
}

.grievance-card h2{
    margin-bottom:20px;
    text-align:center;
}

.grievance-card input,
.grievance-card textarea{

    width:100%;
    padding:12px;
    margin-bottom:15px;
    border:1px solid #cbd5e1;
    border-radius:6px;
}

.grievance-card button{

    width:100%;
    height:45px;
    border:none;
    background:#2563eb;
    color:#fff;
    border-radius:6px;
    cursor:pointer;
    font-weight:bold;
}

.backBtn{
    margin-top:10px;
    background:#64748b!important;
}

.success-box{

    margin-top:20px;
    background:#dcfce7;
    border:1px solid #22c55e;
    padding:20px;
    border-radius:8px;
    text-align:center;
}

.success-box h2{
    color:#15803d;
}

.grievance-card label{

    display:block;
    margin-bottom:6px;
    font-weight:600;
    color:#334155;
}

.grievance-card select{

    width:100%;
    height:48px;
    padding:0 14px;
    margin-bottom:16px;

    border:1px solid #cbd5e1;
    border-radius:8px;

    background:#fff;
    font-size:15px;

    transition:.3s;
       overflow-y:auto;
}

.grievance-card select:focus{

    outline:none;

    border-color:#2563eb;

    box-shadow:0 0 0 3px rgba(37,99,235,.15);

}
    .image-preview-container{

    display:flex;
    gap:15px;
    flex-wrap:wrap;
    margin:20px 0;
}

.image-card{

    width:120px;
    border:1px solid #e2e8f0;
    border-radius:10px;
    overflow:hidden;
    position:relative;
    background:#fff;

    box-shadow:0 5px 12px rgba(0,0,0,.08);

}

.image-card img{

    width:100%;
    height:90px;
    object-fit:cover;

}

.image-card span{

    display:block;
    padding:8px;
    font-size:12px;

    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;

}

.image-card button{

    position:absolute;
    top:6px;
    right:6px;

    width:24px!important;
    height:24px!important;

    border:none;
    border-radius:50%;

    background:#ef4444!important;
    color:#fff;

    cursor:pointer;

    font-size:12px;

}
    .grievance-page{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    position:relative;
    overflow:hidden;

    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;

    transition:background-image .8s ease-in-out;
}

.grievance-page::before{

    content:"";
    position:absolute;
    inset:0;

    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);

    background:rgba(0,0,0,.35);
}

.grievance-card{

    position:relative;
    z-index:2;

    width:600px;

    background:rgba(255,255,255,.92);

    backdrop-filter:blur(10px);

    border-radius:16px;

    box-shadow:0 15px 45px rgba(0,0,0,.25);
}
`}</style>
    </div>
  );
}
