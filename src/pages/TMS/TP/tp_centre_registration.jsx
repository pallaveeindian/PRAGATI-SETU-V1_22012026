import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaPlus,
  FaTrash,
  FaDownload,
  FaUniversity,
} from "react-icons/fa";

/* ===================== CONSTANTS ===================== */

const STEPS = [
  "Basic",
  "Address",
  "Facilities",
  "Rooms Availability",
  "Photos",
];
const EMPTY_ROOM = { room_name: "", room_capacity: 20 };
const EMPTY_MEDIA = {
  category: "OTHER",
  file: null,
  notes: "",
  id: null,
  existing_url: null,
};

function ConfirmModal({ open, payload, onClose, onConfirm, submitting }) {
  if (!open) return null;

  return (
    <div
      className="tp-modal-backdrop"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="tp-modal-card" style={{ maxWidth: 500 }}>
        <h3>
          Confirm Training Centre{" "}
          {payload?.centreId ? "Update" : "Registration"}
        </h3>

        {submitting ? (
          <div style={{ padding: 30, textAlign: "center" }}>
            <strong>Registering Your Centre, Please Wait…</strong>
          </div>
        ) : (
          <>
            <p style={{ marginTop: 16, fontSize: 15 }}>
              Are you sure you want to <b>confirm submission</b>?
            </p>

            <div style={{ textAlign: "right", marginTop: 20 }}>
              <button className="tp-btn-outline" onClick={onClose}>
                <FaArrowLeft /> Edit
              </button>{" "}
              <button className="tp-btn" onClick={onConfirm}>
                <FaCheck /> Confirm Submission
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
/* ===================== MAIN ===================== */

export default function TpCentreRegistration() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { centreId } = useParams(); // 👈 EDIT MODE
  const [navCollapsed, setNavCollapsed] = useState(false);

  const isEdit = Boolean(centreId);

  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ===================== LOOKUPS ===================== */

  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [errors, setErrors] = useState({});

  /* ===================== FORM STATE ===================== */

  const [centre, setCentre] = useState({
    serial_number: "",
    venue_name: "",
    centre_type: "",
    venue_address: "",
    district: "",
    block: "",
    panchayat: "",
    village: "",
    security_arrangements: "",
    toilets_bathrooms: 1,
    power_water_facility: "",
    medical_kit: false,
    open_space: false,
    field_visit_facility: false,
    transport_facility: false,
    dining_facility: false,
    other_details: "",
    training_hall_count: 1,
    training_hall_capacity: 20,
    // centre_type: "",
    centre_type_other: "",
  });

  const [rooms, setRooms] = useState([{ ...EMPTY_ROOM }]);
  const [media, setMedia] = useState([{ ...EMPTY_MEDIA }]);

  /* ===================== LOAD DISTRICTS ===================== */

  useEffect(() => {
    LOOKUP_API.districts
      .list({ page_size: 100 })
      .then((r) => setDistricts(r?.data?.results || []));
  }, []);

  /* ===================== LOAD EDIT DATA ===================== */

  useEffect(() => {
    if (!isEdit) return;

    async function loadCentre() {
      const c = await TMS_API.trainingPartnerCentres.retrieve(centreId);
      const centreData = c.data;

      setCentre({
        ...centreData,
        district: centreData.district || "",
        block: centreData.block || "",
        panchayat: centreData.panchayat || "",
        village: centreData.village || "",
      });

      const r = await TMS_API.trainingPartnerCentreRooms.list({
        centre: centreId,
      });
      setRooms(
        r.data.results.map((x) => ({
          id: x.id,
          room_name: x.room_name,
          room_capacity: x.room_capacity,
        })),
      );

      const m = await TMS_API.trainingPartnerSubmissions.list({
        centre: centreId,
      });
      setMedia(
        m.data.results.map((x) => ({
          id: x.id,
          category: x.category,
          file: null,
          notes: x.notes || "",
          existing_url: x.file,
        })),
      );
    }

    loadCentre();
  }, [centreId, isEdit]);

  /* ===================== CASCADING LOOKUPS ===================== */

  useEffect(() => {
    if (!centre.district) return;
    setLoadingBlocks(true);
    LOOKUP_API.blocks
      .retrieve(centre.district, { page_size: 100 })
      .then((r) => setBlocks(r?.data?.results || []))
      .finally(() => setLoadingBlocks(false));
  }, [centre.district]);

  useEffect(() => {
    if (!centre.block) return;
    setLoadingPanchayats(true);
    LOOKUP_API.panchayats
      .retrieve(centre.block, { page_size: 100 })
      .then((r) => setPanchayats(r?.data?.results || []))
      .finally(() => setLoadingPanchayats(false));
  }, [centre.block]);

  useEffect(() => {
    if (!centre.panchayat) return;
    setLoadingVillages(true);
    LOOKUP_API.villages
      .retrieve(centre.panchayat, { page_size: 100 })
      .then((r) => setVillages(r?.data?.results || []))
      .finally(() => setLoadingVillages(false));
  }, [centre.panchayat]);

  /* ===================== SUBMIT ===================== */

  async function handleConfirmSubmit() {
    setSubmitting(true);
    try {
      const tp = await TMS_API.trainingPartners.list({
        search: user.id,
        fields: "id",
      });
      const partnerId = tp?.data?.results?.[0]?.id;
      if (!partnerId) throw new Error("Training Partner not found");

      const centrePayload = {
        ...centre,
        partner: partnerId,
        created_by: user.id,
        toilets_bathrooms: Number(centre.toilets_bathrooms),
        training_hall_count: Number(centre.training_hall_count),
        training_hall_capacity: Number(centre.training_hall_capacity),
      };

      // 1. Create or Update the main Centre record
      const centreResp = isEdit
        ? await TMS_API.trainingPartnerCentres.update(centreId, centrePayload)
        : await TMS_API.trainingPartnerCentres.create(centrePayload);

      const finalCentreId = centreResp.data.id;
      let partialErrors = false;

      // 2. Process Rooms independently
      for (const r of rooms) {
        if (!r.room_name) continue;
        try {
          if (r.id) {
            await TMS_API.trainingPartnerCentreRooms.update(r.id, {
              ...r,
              centre: finalCentreId,
            });
          } else {
            await TMS_API.trainingPartnerCentreRooms.create({
              ...r,
              centre: finalCentreId,
              created_by: user.id,
            });
          }
        } catch (roomErr) {
          console.error("Room creation failed:", roomErr);
          partialErrors = true;
        }
      }

      // 3. Process Media independently
      for (const [index, m] of media.entries()) {
        if (m.id && !m.file) continue;

        if (m.file) {
          const fd = new FormData();
          fd.append("partner", partnerId);
          fd.append("centre", finalCentreId);
          fd.append("category", m.category);

          // --- SURGICAL RENAME START ---
          const ext = m.file.name.split(".").pop(); // Extract original extension
          const newFileName = `${m.category}_${index + 1}.${ext}`; // Format: <picture_type>_<s.no.>.<ext>

          // Append the file using the third argument to force the new filename
          fd.append("file", m.file, newFileName);
          // --- SURGICAL RENAME END ---

          fd.append("created_by", user.id);
          fd.append("is_active", "1");
          if (m.notes) fd.append("notes", m.notes);

          try {
            await TMS_API.trainingPartnerSubmissions.createMultipart(fd);
          } catch (mediaErr) {
            console.error("Photo upload failed:", mediaErr);
            partialErrors = true;
          }
        }
      }

      // 4. Alert user and ALWAYS navigate away if the Centre was successfully created
      if (partialErrors) {
        alert(
          `Centre ${isEdit ? "updated" : "registered"}, but some rooms or media failed to save. You can edit this centre to retry uploading media.`,
        );
      } else {
        alert(
          `Training Centre ${isEdit ? "updated" : "registered"} successfully`,
        );
      }
      navigate("/tms/tp/centre-list");
    } catch (e) {
      // This will only catch if the main Centre creation fails (e.g. invalid data)
      console.error(e);
      alert("Failed to submit centre. Please review the form and try again.");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }

  /* ===================== TABLE HELPERS ===================== */

  const row = (key, label, field) => (
    <tr key={key}>
      <td style={{ border: "1px solid #ccc", padding: 8, width: "30%" }}>
        <label>{label}</label>
      </td>
      <td style={{ border: "1px solid #ccc", padding: 8 }}>{field}</td>
    </tr>
  );

  const table = (rows, key) => (
    <table
      className="tp-table"
      key={key}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #ccc",
        marginBottom: 20,
      }}
    >
      <tbody>{rows}</tbody>
    </table>
  );

  /* ===================== RENDER ===================== */

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav
          left={
            <div className="app-title">
              Pragati Setu —{" "}
              {isEdit ? "Edit Training Centre" : "New Training Centre"}
            </div>
          }
        /> */}

          <main style={{ padding: "50px 18px" }}>
            {/* ===== Page Header ===== */}
            <div className="tp-page-header">
              <div>
                <h2 className="tp-page-title">
                  <FaUniversity />
                  {isEdit
                    ? "Edit Training Centre"
                    : "Training Centre Registration"}
                </h2>
                <p className="tp-page-subtitle">
                  Fill the required details to register your training centre
                </p>
              </div>
            </div>
            {/* ===== Stepper ===== */}
            <div className="stepper">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  className={i === step ? "step active" : "step"}
                  onClick={() => setStep(i)}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {i + 1}. {s}
                  </span>
                </button>
              ))}
            </div>

            {/* ===================== BASIC ===================== */}
            {step === 0 && (
              <>
                {table(
                  [
                    row(
                      "sn",
                      "Serial Number",
                      <>
                        <input
                          type="text"
                          className="input-blue"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={centre.serial_number}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length > 6) {
                              setErrors({
                                ...errors,
                                serial_number:
                                  "Serial Number cannot be more than 6 digits",
                              });
                              return;
                            }

                            setCentre({ ...centre, serial_number: value });

                            setErrors({
                              ...errors,
                              serial_number: value
                                ? ""
                                : "Serial Number is required",
                            });
                          }}
                        />

                        {errors.serial_number && (
                          <small style={{ color: "red" }}>
                            {errors.serial_number}
                          </small>
                        )}
                      </>,
                    ),
                    row(
                      "name",
                      "Centre Name",
                      <>
                        <input
                          type="text"
                          className="input-blue"
                          value={centre.venue_name}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();

                            setCentre({ ...centre, venue_name: value });

                            setErrors({
                              ...errors,
                              venue_name: value
                                ? ""
                                : "Centre Name is required",
                            });
                          }}
                        />

                        {errors.venue_name && (
                          <small style={{ color: "red" }}>
                            {errors.venue_name}
                          </small>
                        )}
                      </>,
                    ),
                    row(
                      "type",
                      "Centre Type",
                      <>
                        <select
                          value={centre.centre_type}
                          className="input-blue"
                          onChange={(e) =>
                            setCentre({
                              ...centre,
                              centre_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="PRIVATE">Private</option>
                          <option value="GOVERNMENT">Government</option>
                          <option value="LODGE">Lodge</option>
                          <option value="RENTED">Rented</option>
                          <option value="OTHERS">Others</option>
                        </select>
                        {centre.centre_type === "OTHERS" && (
                          <>
                            <input
                              placeholder="Specify other centre type"
                              value={centre.centre_type_other || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCentre({
                                  ...centre,
                                  centre_type_other: value,
                                });

                                setErrors({
                                  ...errors,
                                  centre_type_other: value
                                    ? ""
                                    : "Please specify centre type",
                                });
                              }}
                            />

                            {errors.centre_type_other && (
                              <small style={{ color: "red" }}>
                                {errors.centre_type_other}
                              </small>
                            )}
                          </>
                        )}
                      </>,
                    ),
                  ],
                  "basic",
                )}
                <div
                  style={{
                    marginTop: 15,
                    padding: 12,
                    background: "#f0f8ff",
                    borderLeft: "4px solid #5a8cc2",
                    fontSize: 14,
                  }}
                >
                  <strong>Instructions for Basic Details:</strong>
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    <li>
                      <strong>Serial Number:</strong> Numeric only, maximum 6
                      digits.
                    </li>
                    <li>
                      <strong>Centre Name:</strong> Enter the official name of
                      the venue.
                    </li>
                    <li>
                      <strong>Centre Type:</strong> Select from the dropdown. If
                      'Others', you must manually type the specification.
                    </li>
                  </ul>
                </div>
              </>
            )}
            {/* ===================== ADDRESS ===================== */}
            {step === 1 && (
              <>
                {table(
                  [
                    row(
                      "addr",
                      "Centre Address",
                      <>
                        <textarea
                          maxLength={150}
                          className="input-blue"
                          value={centre.venue_address}
                          onChange={(e) =>
                            setCentre({
                              ...centre,
                              venue_address: e.target.value,
                            })
                          }
                        />
                        <small>{centre.venue_address.length}/150</small>
                      </>,
                    ),

                    row(
                      "dist",
                      "District",
                      <select
                        value={centre.district}
                        className="input-blue"
                        onChange={(e) =>
                          setCentre({ ...centre, district: e.target.value })
                        }
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.district_id} value={d.district_id}>
                            {d.district_name_en}
                          </option>
                        ))}
                      </select>,
                    ),
                    row(
                      "block",
                      "Block",
                      loadingBlocks ? (
                        "Loading…"
                      ) : (
                        <select
                          value={centre.block}
                          className="input-blue"
                          onChange={(e) =>
                            setCentre({ ...centre, block: e.target.value })
                          }
                        >
                          <option value="">Select Block</option>
                          {blocks.map((b) => (
                            <option key={b.block_id} value={b.block_id}>
                              {b.block_name_en}
                            </option>
                          ))}
                        </select>
                      ),
                    ),
                    row(
                      "pan",
                      "Panchayat",
                      loadingPanchayats ? (
                        "Loading…"
                      ) : (
                        <select
                          value={centre.panchayat}
                          className="input-blue"
                          onChange={(e) =>
                            setCentre({ ...centre, panchayat: e.target.value })
                          }
                        >
                          <option value="">Select Panchayat</option>
                          {panchayats.map((p) => (
                            <option key={p.panchayat_id} value={p.panchayat_id}>
                              {p.panchayat_name_en}
                            </option>
                          ))}
                        </select>
                      ),
                    ),
                    row(
                      "vill",
                      "Village",
                      loadingVillages ? (
                        "Loading…"
                      ) : (
                        <select
                          value={centre.village}
                          className="input-blue"
                          onChange={(e) =>
                            setCentre({ ...centre, village: e.target.value })
                          }
                        >
                          <option value="">Select Village</option>
                          {villages.map((v) => (
                            <option key={v.village_id} value={v.village_id}>
                              {v.village_name_english}
                            </option>
                          ))}
                        </select>
                      ),
                    ),
                  ],
                  "address",
                )}
                <div
                  style={{
                    marginTop: 15,
                    padding: 12,
                    background: "#f0f8ff",
                    borderLeft: "4px solid #5a8cc2",
                    fontSize: 14,
                  }}
                >
                  <strong>Instructions for Address:</strong>
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    <li>
                      <strong>Centre Address:</strong> Provide the street
                      address or landmarks (max 150 characters).
                    </li>
                    <li>
                      <strong>Dropdowns:</strong> Select the District first.
                      This will automatically load the corresponding Blocks,
                      Panchayats, and Villages sequentially.
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ===================== FACILITIES ===================== */}
            {step === 2 && (
              <>
                {table(
                  [
                    row(
                      "sec",
                      "Security Arrangements",
                      <>
                        <textarea
                          maxLength={150}
                          className="input-blue"
                          value={centre.security_arrangements}
                          onChange={(e) =>
                            setCentre({
                              ...centre,
                              security_arrangements: e.target.value,
                            })
                          }
                        />
                        <small>{centre.security_arrangements.length}/150</small>
                      </>,
                    ),

                    row(
                      "toilet",
                      "Total Toilets / Bathrooms",
                      <input
                        type="number"
                        className="input-blue"
                        min="1"
                        value={centre.toilets_bathrooms}
                        onChange={(e) =>
                          setCentre({
                            ...centre,
                            toilets_bathrooms: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                        }}
                      />,
                    ),
                    row(
                      "power",
                      "Power / Water Availability",
                      <select
                        value={centre.power_water_facility}
                        className="input-blue"
                        onChange={(e) =>
                          setCentre({
                            ...centre,
                            power_water_facility: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="REGULAR">Regular</option>
                        <option value="LIMITED">Limited</option>
                        <option value="SCARCE">Scarce</option>
                      </select>,
                    ),
                    ...[
                      ["medical_kit", "Medical Kit Available"],
                      ["open_space", "Open Space Available"],
                      ["field_visit_facility", "Field Visit Facility"],
                      ["transport_facility", "Transport Facility"],
                      ["dining_facility", "Dining Facility"],
                    ].map(([k, label]) =>
                      row(
                        k,
                        label,
                        <>
                          <label>
                            <input
                              type="radio"
                              checked={centre[k] === true}
                              onChange={() =>
                                setCentre({ ...centre, [k]: true })
                              }
                            />{" "}
                            Yes
                          </label>{" "}
                          <label>
                            <input
                              type="radio"
                              checked={centre[k] === false}
                              onChange={() =>
                                setCentre({ ...centre, [k]: false })
                              }
                            />{" "}
                            No
                          </label>
                        </>,
                      ),
                    ),
                    row(
                      "other",
                      "Other Details",
                      <>
                        <textarea
                          maxLength={300}
                          className="input-blue"
                          value={centre.other_details}
                          onChange={(e) =>
                            setCentre({
                              ...centre,
                              other_details: e.target.value,
                            })
                          }
                        />
                        <small>{centre.other_details.length}/300</small>
                      </>,
                    ),
                  ],
                  "facilities",
                )}
                <div
                  style={{
                    marginTop: 15,
                    padding: 12,
                    background: "#f0f8ff",
                    borderLeft: "4px solid #5a8cc2",
                    fontSize: 14,
                  }}
                >
                  <strong>Instructions for Facilities:</strong>
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    <li>
                      <strong>Descriptions:</strong> Keep security/other
                      descriptions brief (max 150-300 characters).
                    </li>
                    <li>
                      <strong>Numerical Inputs:</strong> Enter exact counts for
                      Toilets/Bathrooms.
                    </li>
                    <li>
                      <strong>Yes/No Toggles:</strong> Accurately indicate the
                      availability of facilities as these may be verified later.
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ===================== ROOMS ===================== */}
            {step === 3 && (
              <>
                {table(
                  [
                    row(
                      "hc",
                      "Total Training Halls",
                      <input
                        type="number"
                        min="1"
                        value={centre.training_hall_count}
                        className="input-blue"
                        onChange={(e) =>
                          setCentre({
                            ...centre,
                            training_hall_count: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                        }}
                      />,
                    ),
                    row(
                      "cap",
                      "Total Training Hall Capacity",
                      <input
                        type="number"
                        min="1"
                        value={centre.training_hall_capacity}
                        className="input-blue"
                        onChange={(e) =>
                          setCentre({
                            ...centre,
                            training_hall_capacity: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                        }}
                      />,
                    ),
                  ],
                  "rooms-main",
                )}

                {rooms.map((r, i) =>
                  table(
                    [
                      row(
                        `rn_${i}`,
                        "Hall Name",
                        <textarea
                          value={r.room_name}
                          className="input-blue"
                          onChange={(e) => {
                            const c = [...rooms];
                            c[i].room_name = e.target.value;
                            setRooms(c);
                          }}
                        />,
                      ),
                      row(
                        `rc_${i}`,
                        "Hall Capacity",
                        <input
                          type="number"
                          min="1"
                          value={r.room_capacity}
                          className="input-blue"
                          onChange={(e) => {
                            const c = [...rooms];
                            c[i].room_capacity = e.target.value;
                            setRooms(c);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px",
                          }}
                        />,
                      ),
                      row(
                        `rd_${i}`,
                        "Action",
                        <button
                          className="tp-btn-danger"
                          onClick={() =>
                            setRooms(rooms.filter((_, idx) => idx !== i))
                          }
                        >
                          <FaTrash /> Delete
                        </button>,
                      ),
                    ],
                    `room_${i}`,
                  ),
                )}

                <button
                  className="tp-btn"
                  onClick={() => setRooms([...rooms, { ...EMPTY_ROOM }])}
                >
                  <FaPlus /> Add Room
                </button>

                {/* ---> Instructions <--- */}
                <div
                  style={{
                    marginTop: 15,
                    padding: 12,
                    background: "#f0f8ff",
                    borderLeft: "4px solid #5a8cc2",
                    fontSize: 14,
                  }}
                >
                  <strong>Instructions for Rooms:</strong>
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    <li>
                      <strong>Totals:</strong> First enter the overall count and
                      combined capacity of all training halls.
                    </li>
                    <li>
                      <strong>Add Room:</strong> Click "Add Room" to list each
                      hall individually. Give each a unique name (e.g., "Hall
                      A") and its specific seating capacity.
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ===================== MEDIA ===================== */}
            {step === 4 && (
              <>
                {media.map((m, i) =>
                  table(
                    [
                      row(
                        `mc_${i}`,
                        "What kind of photo are you uploading?",
                        <select
                          value={m.category}
                          className="input-blue"
                          onChange={(e) => {
                            const c = [...media];
                            c[i].category = e.target.value;
                            setMedia(c);
                          }}
                        >
                          {[
                            "FOODING",
                            "TOILET",
                            "CENTRE_FRONT",
                            "HOSTEL",
                            "CCTV_SECURITY",
                            "ACTIVITY_HALL",
                            "OTHER",
                          ].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>,
                      ),

                      row(
                        `mf_${i}`,
                        "Upload File",
                        <>
                          {/* Existing file preview (ONLY when no new file selected) */}
                          {m.id && !m.file && (
                            <div style={{ marginBottom: 6 }}>
                              {/* --- SURGICAL THUMBNAIL ADDITION START --- */}
                              {m.existing_url &&
                                !m.existing_url
                                  .toLowerCase()
                                  .includes(".pdf") && (
                                  <div style={{ marginBottom: 10 }}>
                                    <a
                                      href={m.existing_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Click to view full image"
                                    >
                                      <img
                                        src={m.existing_url}
                                        alt="Preview"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: "6px",
                                          border: "1px solid #ccc",
                                          boxShadow:
                                            "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                      />
                                    </a>
                                  </div>
                                )}
                              {/* --- SURGICAL THUMBNAIL ADDITION END --- */}

                              <button
                                onClick={async () => {
                                  try {
                                    const response = await api.get(
                                      `/tms/submissions/${m.id}/download/`,
                                      { responseType: "blob" },
                                    );

                                    const disposition =
                                      response.headers["content-disposition"];
                                    let filename = "download";

                                    if (disposition) {
                                      const match =
                                        disposition.match(/filename="(.+)"/);
                                      if (match?.[1]) {
                                        filename = match[1];
                                      }
                                    }

                                    const blob = new Blob([response.data]);
                                    const url =
                                      window.URL.createObjectURL(blob);

                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = filename;

                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    window.URL.revokeObjectURL(url);
                                  } catch (err) {
                                    console.error("Download failed", err);
                                  }
                                }}
                              >
                                <FaDownload /> Download existing file
                              </button>
                            </div>
                          )}

                          {/* New file upload */}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const allowed = [
                                "image/jpeg",
                                "image/jpg",
                                "application/pdf",
                              ];

                              if (!allowed.includes(file.type)) {
                                alert("Only JPG or PDF files are allowed");
                                e.target.value = "";
                                return;
                              }

                              const c = [...media];
                              c[i].file = file; //  new file set
                              c[i].existing_url = null; //  hide old file
                              setMedia(c);
                            }}
                          />
                        </>,
                      ),
                      row(
                        `mn_${i}`,
                        "Notes",
                        <>
                          <textarea
                            maxLength={300}
                            value={m.notes}
                            className="input-blue"
                            onChange={(e) => {
                              const c = [...media];
                              c[i].notes = e.target.value;
                              setMedia(c);
                            }}
                          />
                          <small>{m.notes.length}/300</small>
                        </>,
                      ),
                      row(
                        `md_${i}`,
                        "Action",
                        <button
                          className="tp-btn-danger"
                          onClick={async () => {
                            if (m.id) {
                              await TMS_API.trainingPartnerSubmissions.destroy(
                                m.id,
                              );
                            }

                            setMedia(media.filter((_, idx) => idx !== i));
                          }}
                        >
                          <FaTrash /> Delete
                        </button>,
                      ),
                    ],
                    `media_${i}`,
                  ),
                )}

                <button
                  className="tp-btn"
                  onClick={() => setMedia([...media, { ...EMPTY_MEDIA }])}
                >
                  <FaPlus /> Add Photos
                </button>

                {/* ---> Instructions <--- */}
                <div
                  style={{
                    marginTop: 15,
                    padding: 12,
                    background: "#f0f8ff",
                    borderLeft: "4px solid #5a8cc2",
                    fontSize: 14,
                  }}
                >
                  <strong>Instructions for Photos:</strong>
                  <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                    <li>
                      <strong>Photo Category:</strong> Select the appropriate
                      category (e.g., CENTRE_FRONT, CCTV_SECURITY) for each
                      file.
                    </li>
                    <li>
                      <strong>Upload:</strong> Only JPG/JPEG or PDF formats are
                      allowed. Existing files can be downloaded using the
                      provided button.
                    </li>
                    <li>
                      <strong>Notes:</strong> Add brief context if necessary
                      (e.g., "Front entrance facing North").
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ===================== ACTIONS ===================== */}
            <div style={{ textAlign: "right", marginTop: 20 }}>
              {step > 0 && (
                <button
                  className="tp-btn-outline"
                  onClick={() => setStep(step - 1)}
                >
                  <FaArrowLeft /> Back
                </button>
              )}{" "}
              {step < STEPS.length - 1 ? (
                <button className="tp-btn" onClick={() => setStep(step + 1)}>
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  className="tp-btn"
                  disabled={submitting}
                  onClick={() => setConfirmOpen(true)}
                >
                  <FaCheck /> Register Centre
                </button>
              )}
            </div>
          </main>
          <div style={{ padding: 18, margin: "0 auto" }}>
            <ConfirmModal
              open={confirmOpen}
              payload={{ centre, rooms, media, centreId }}
              submitting={submitting}
              onClose={() => setConfirmOpen(false)}
              onConfirm={handleConfirmSubmit}
            />
          </div>
          <Footer />
        </div>
      </div>

      {/* Confirm Modal */}
      <style>{`


/* MAIN CONTENT AREA */
.content-area {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* ===== MAIN AREA ===== */
.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;   /* overflow fix */
}

/* ===== MAIN CONTENT ===== */
.main-area main {
  flex: 1;   /*  pushes footer down */
}

/* ===== FOOTER FIX ===== */
footer {
  margin-top: auto;   /*  footer always bottom */
  flex-shrink: 0;
}



.input-blue {
  width: 100%;
  border: 1px solid #5a8cc2 !important;
  border-radius: 6px;
  padding: 8px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #fff;
}

/* Hover effect */
.input-blue:hover {
  border-color: #3d6ba6;
}

/* Focus effect */
.input-blue:focus {
  border-color: #5a8cc2;
  box-shadow: 0 0 0 2px rgba(61,107,166,0.2);
}

`}</style>
    </div>
  );
}
