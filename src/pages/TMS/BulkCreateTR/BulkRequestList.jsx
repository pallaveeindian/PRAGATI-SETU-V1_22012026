// src\pages\TMS\BulkCreateTR\BulkRequestList.jsx
import React, { useEffect, useMemo, useState } from "react";

const typeNames = {
  BENEFICIARY: "Beneficiaries (SHG)",
  TRAINER: "Master Trainers",
  STAFF: "Staff",
};

const valueOrDash = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const getParticipantId = (request, participant) => {
  if (request.training_type === "BENEFICIARY") {
    return participant.lokos_member_code ?? participant.member_code;
  }

  if (request.training_type === "TRAINER") {
    return participant.trainer ?? participant.trainer_id;
  }

  return participant.staff ?? participant.staff_id;
};

// Retrieve the original selected participant details,
// if the submission payload has limited information.
const getSnapshotPerson = (request, id) => {
  const selectedMap =
    request.training_type === "TRAINER"
      ? request.snapshot?.selectedTrainersMap
      : request.snapshot?.selectedStaffMap;

  if (!(selectedMap instanceof Map)) return null;

  for (const [mapId, person] of selectedMap) {
    if (String(mapId) === String(id)) {
      return person;
    }
  }

  return null;
};

const getParticipantName = (request, participant) => {
  const id = getParticipantId(request, participant);
  const snapshot = getSnapshotPerson(request, id);

  return (
    participant.member_name ||
    participant.full_name ||
    participant.name ||
    snapshot?.full_name ||
    snapshot?.name ||
    `${
      request.training_type === "BENEFICIARY"
        ? "Beneficiary"
        : request.training_type === "TRAINER"
          ? "Trainer"
          : "Staff"
    } ${valueOrDash(id)}`
  );
};

const getParticipantDetails = (request, person) => {
  if (request.training_type === "BENEFICIARY") {
    return [
      person.lokos_shg_name && `SHG: ${person.lokos_shg_name}`,
      person.lokos_shg_code && `SHG code: ${person.lokos_shg_code}`,
      person.mobile && `Mobile: ${person.mobile}`,
    ].filter(Boolean);
  }

  if (request.training_type === "TRAINER") {
    return [person.mobile_no && `Mobile: ${person.mobile_no}`].filter(Boolean);
  }

  return [person.designation && `Designation: ${person.designation}`].filter(
    Boolean,
  );
};

export default function BulkRequestList({
  requests = [],
  onEdit,
  onRemove,
  onRemoveParticipant,
  onAddAnother,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const totalParticipants = useMemo(
    () =>
      requests.reduce(
        (sum, request) => sum + (request.participants?.length || 0),
        0,
      ),
    [requests],
  );

  // Close participant details when its draft is deleted.
  useEffect(() => {
    if (
      expandedId !== null &&
      !requests.some((request) => String(request.id) === String(expandedId))
    ) {
      setExpandedId(null);
    }
  }, [requests, expandedId]);

  // Remove a draft from the local Bulk Request List.
  const removeRequest = (request) => {
    const confirmed = window.confirm(
      `Remove the ${
        typeNames[request.training_type] || "Training"
      } request for ${
        request.districtName || request.district
      }? This only removes the unsent draft.`,
    );

    if (confirmed) {
      onRemove?.(request.id);
    }
  };

  return (
    <section className="bulk-card bulk-list-section">
      {/* HEADER */}
      <div className="bulk-list-heading">
        <div>
          <h3 className="bulk-section-title">
            <span className="bulk-number">2</span>
            Bulk Request List
          </h3>

          <p className="bulk-muted">
            Review and edit your saved drafts before the final bulk submission.
          </p>
        </div>

        <button
          type="button"
          className="bulk-secondary-btn"
          onClick={onAddAnother}
        >
          + Add Another Request
        </button>
      </div>

      {/* TOTALS */}
      <div className="bulk-list-stats" aria-live="polite">
        <span>
          <strong>{requests.length}</strong> Saved Requests
        </span>

        <span>
          <strong>{totalParticipants}</strong> Participants
        </span>
      </div>

      {/* EMPTY LIST */}
      {requests.length === 0 ? (
        <div className="bulk-empty">
          No requests added yet. Choose a district and participants above, then
          click <strong>Add to Bulk Request List</strong>.
        </div>
      ) : (
        <div className="bulk-table-scroll">
          <table className="bulk-requests-table">
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">Training Plan</th>
                <th scope="col">Type / Level</th>
                <th scope="col">District / Block</th>
                <th scope="col">Training Partner</th>
                <th scope="col">Participants</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request, requestIndex) => {
                const expanded = String(expandedId) === String(request.id);

                const participants = request.participants || [];

                return (
                  <React.Fragment key={request.id}>
                    {/* MAIN REQUEST ROW */}
                    <tr>
                      <td>{requestIndex + 1}</td>

                      <td>
                        <strong>
                          {request.planTitle || `Plan ${request.training_plan}`}
                        </strong>

                        <div className="bulk-list-subtext">
                          FY: {valueOrDash(request.financial_year)}
                        </div>
                      </td>

                      <td>
                        <strong>
                          {typeNames[request.training_type] ||
                            request.training_type}
                        </strong>

                        <div className="bulk-list-subtext">
                          {valueOrDash(request.level)}
                        </div>
                      </td>

                      <td>
                        <strong>
                          {request.districtName ||
                            `District ${valueOrDash(request.district)}`}
                        </strong>

                        {request.training_type === "BENEFICIARY" && (
                          <div className="bulk-list-subtext">
                            Block:{" "}
                            {request.blockName || valueOrDash(request.block)}
                          </div>
                        )}
                      </td>

                      <td>
                        {request.partnerName ||
                          `Partner ${valueOrDash(request.partner)}`}
                      </td>

                      <td>
                        <strong>{participants.length}</strong>
                      </td>

                      <td>
                        <span className="bulk-draft-label">Draft</span>
                      </td>

                      <td>
                        <div className="bulk-list-row-actions">
                          {/* VIEW PARTICIPANTS */}
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-label={`${
                              expanded ? "Hide" : "View"
                            } participants for request ${requestIndex + 1}`}
                            onClick={() =>
                              setExpandedId(expanded ? null : request.id)
                            }
                          >
                            {expanded
                              ? "Hide Participants"
                              : "View Participants"}
                          </button>

                          {/* EDIT REQUEST */}
                          <button
                            type="button"
                            onClick={() => onEdit?.(request.id)}
                          >
                            Edit
                          </button>

                          {/* REMOVE REQUEST */}
                          <button
                            type="button"
                            className="bulk-list-danger"
                            onClick={() => removeRequest(request)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED PARTICIPANTS */}
                    {expanded && (
                      <tr className="bulk-list-expanded-row">
                        <td colSpan={8}>
                          <div className="bulk-list-participant-heading">
                            <strong>
                              Selected Participants ({participants.length})
                            </strong>

                            <span>
                              {request.districtName ||
                                `District ${request.district}`}

                              {request.training_type === "BENEFICIARY" &&
                              request.blockName
                                ? ` · ${request.blockName}`
                                : ""}
                            </span>
                          </div>

                          <div className="bulk-table-scroll">
                            <table className="bulk-list-participant-table">
                              <thead>
                                <tr>
                                  <th scope="col">S.no</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Participant ID</th>
                                  <th scope="col">Details</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {participants.map((person, personIndex) => {
                                  const id = getParticipantId(request, person);

                                  const details = getParticipantDetails(
                                    request,
                                    person,
                                  );

                                  const isLastParticipant =
                                    participants.length <= 1;

                                  return (
                                    <tr key={`${String(id)}-${personIndex}`}>
                                      <td>{personIndex + 1}</td>

                                      <td>
                                        {getParticipantName(request, person)}
                                      </td>

                                      <td>{valueOrDash(id)}</td>

                                      <td>
                                        {details.length
                                          ? details.join(" · ")
                                          : "—"}
                                      </td>

                                      <td>
                                        <button
                                          type="button"
                                          className="bulk-list-remove-person"
                                          disabled={isLastParticipant}
                                          title={
                                            isLastParticipant
                                              ? "At least one participant is required. Edit or remove the draft instead."
                                              : "Remove this participant from the draft"
                                          }
                                          onClick={() =>
                                            onRemoveParticipant?.(
                                              request.id,
                                              personIndex,
                                            )
                                          }
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .bulk-list-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .bulk-list-heading .bulk-section-title {
          margin-bottom: 6px;
        }

        .bulk-list-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin: 12px 0;
        }

        .bulk-list-stats span {
          background: #edf5ff;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 12px;
          color: #164c88;
        }

        .bulk-list-subtext {
          font-size: 11px;
          color: #64748b;
          margin-top: 5px;
        }

        .bulk-list-row-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .bulk-list-row-actions button {
          border: 1px solid #cbddeb;
          background: #f8fbff;
          padding: 6px 8px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 11px;
          color: #164c88;
        }

        .bulk-list-row-actions .bulk-list-danger {
          border-color: #fecaca;
          background: #fff1f2;
          color: #b91c1c;
        }

        .bulk-draft-label {
          display: inline-block;
          background: #fff7ed;
          color: #9a3412;
          font-weight: 650;
          padding: 4px 7px;
          border-radius: 5px;
        }

        .bulk-list-expanded-row > td {
          background: #f7faff;
          padding: 12px;
        }

        .bulk-list-participant-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
          font-size: 12px;
          color: #334155;
        }

        .bulk-list-participant-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 520px;
          background: #fff;
          font-size: 11px;
        }

        .bulk-list-participant-table th,
        .bulk-list-participant-table td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }

        .bulk-list-participant-table th {
          background: #edf3fb;
          color: #334155;
        }

        .bulk-list-remove-person {
          background: #fff1f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 5px 9px;
          border-radius: 5px;
          cursor: pointer;
        }

        .bulk-list-remove-person:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        
      `}</style>
    </section>
  );
}
