// src\pages\TMS\BulkCreateTR\BulkStep2Participants.jsx
import React, { useEffect, useRef } from "react";
import ShgListTable from "../../Dashboard/ShgListTable";
import ShgMemberListTable from "../../Dashboard/ShgMemberListTable";
import MasterTrainerList from "../CreateTR/MasterTrainerList";
import StaffList from "../CreateTR/StaffList";
const getBlockId = (block) => {
  if (!block) return "";
  if (typeof block !== "object") {
    return String(block);
  }
  return String(block.block_id ?? block.id ?? "");
};
const getBlockName = (block) =>
  block.block_name_en ||
  block.block_name ||
  block.name ||
  `Block ${getBlockId(block)}`;
const PARTICIPANT_TYPES = [
  // {
  //   value: "BENEFICIARY",
  //   label: "Beneficiaries (SHG)",
  // },
  {
    value: "TRAINER",
    label: "Master Trainers",
  },
  {
    value: "STAFF",
    label: "Staff",
  },
];
export default function BulkStep2Participants({
  form,
  setForm,
  user,
  districtId,
  blockId,
  setBlockId,
  blockList = [],
  blockLoading = false,
  selectedBlockForShg,
  setSelectedBlockForShg,
  selectedShgForMembers,
  setSelectedShgForMembers,
  selectedShgLoading = false,
  setSelectedShgLoading,
  memberListReloadToken = 0,
  setMemberListReloadToken,
  selectedMemberCodesSet,
  selectedBeneficiaries = [],
  addSelectedMember,
  removeSelectedBeneficiary,
  fetchMemberDetailBestEffort,
  preloadedTrainers = [],
  preloadReloadToken = 0,
  fetchMasterTrainersByDistrict,
  selectedTrainerIds,
  onToggleTrainer,
  selectedStaffIds,
  onToggleStaff,
  reservedTrainerIds = new Set(),
  reservedStaffIds = new Set(),
  // NEW: Values supplied by useBulkTRState()
  lockedTrainingType = null,
  isBlockReserved = () => false,
}) {
  const membersRef = useRef(null);
  const activeType = lockedTrainingType || form.training_type;
  const selectedBlockId =
    getBlockId(selectedBlockForShg) || getBlockId(blockId);
  const currentCount =
    activeType === "BENEFICIARY"
      ? selectedBeneficiaries.length
      : activeType === "TRAINER"
        ? selectedTrainerIds?.size || 0
        : selectedStaffIds?.size || 0;
  // =========================================
  // LOCK PARTICIPANT TYPE
  // =========================================
  useEffect(() => {
    if (lockedTrainingType && form.training_type !== lockedTrainingType) {
      setForm((previous) => ({
        ...previous,
        training_type: lockedTrainingType,
        level: "STATE",
      }));
    }
  }, [lockedTrainingType, form.training_type, setForm]);
  // All participant types use fixed STATE level.
  useEffect(() => {
    if (form.level !== "STATE") {
      setForm((previous) => ({
        ...previous,
        level: "STATE",
      }));
    }
  }, [form.level, setForm]);
  // =========================================
  // CHANGE PARTICIPANT TYPE
  // =========================================
  const handleTypeChange = (type) => {
    if (lockedTrainingType && type !== lockedTrainingType) {
      return;
    }
    if (type === form.training_type) return;
    setForm((previous) => ({
      ...previous,
      training_type: type,
      level: "STATE",
    }));
    if (type === "TRAINER") {
      fetchMasterTrainersByDistrict?.(true);
    }
  };
  // =========================================
  // CHECK BLOCK AVAILABILITY
  // =========================================
  const blockAlreadyUsed = (id) => {
    if (!id) return false;
    // The hook automatically excludes the draft
    // currently being edited.
    return isBlockReserved(id);
  };
  // =========================================
  // SELECT BENEFICIARY BLOCK
  // =========================================
  const handleBlockSelect = (block) => {
    const nextBlockId = getBlockId(block);
    if (blockAlreadyUsed(nextBlockId)) {
      alert(
        "This block has already been used in another " +
          "Bulk Training Request. Please choose a different block.",
      );
      return;
    }
    if (nextBlockId === selectedBlockId) {
      return;
    }
    // Avoid retaining members from two different
    // blocks in the same request.
    if (selectedBeneficiaries.length > 0) {
      alert(
        "Please remove the currently selected beneficiaries " +
          "before changing the block.",
      );
      return;
    }
    setBlockId(nextBlockId);
    setSelectedBlockForShg(block);
    setSelectedShgForMembers(null);
    setSelectedShgLoading?.(false);
    setMemberListReloadToken((previous) => previous + 1);
  };
  // =========================================
  // SELECT SHG
  // =========================================
  const handleShgSelect = (shg) => {
    if (!shg) return;
    setSelectedShgForMembers(shg);
    setSelectedShgLoading?.(false);
    setMemberListReloadToken((previous) => previous + 1);
    requestAnimationFrame(() => {
      membersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };
  // =========================================
  // SELECT / UNSELECT BENEFICIARY
  // =========================================
  const handleMemberToggle = async (member, checked) => {
    if (!member) return;
    if (!selectedBlockId) {
      alert("Please select a block first.");
      return;
    }
    if (blockAlreadyUsed(selectedBlockId)) {
      alert("This block is already used in another Bulk Training Request.");
      return;
    }
    const shgCode =
      member.shg_code ||
      member.lokos_shg_code ||
      member.shg?.shg_code ||
      selectedShgForMembers?.shg_code ||
      selectedShgForMembers?.code;
    const memberCode =
      member.member_code ||
      member.lokos_member_code ||
      member.memberCode ||
      member.id;
    if (!memberCode) return;
    // Unselect member
    if (!checked) {
      removeSelectedBeneficiary?.(memberCode, shgCode);
      return;
    }
    const alreadySelected = selectedBeneficiaries.some(
      (selected) =>
        String(selected.lokos_member_code) === String(memberCode) &&
        String(selected.lokos_shg_code) === String(shgCode),
    );
    if (alreadySelected) return;
    let memberData = member;
    // Reuse existing detail-fetch logic when available.
    if (typeof fetchMemberDetailBestEffort === "function") {
      try {
        const detail = await fetchMemberDetailBestEffort(member);
        if (detail && typeof detail === "object") {
          memberData = {
            ...member,
            ...(detail?.data && !Array.isArray(detail.data)
              ? detail.data
              : detail),
          };
        }
      } catch (error) {
        console.warn("Member detail could not be loaded.", error);
      }
    }
    // Add the correct district/block context.
    const enrichedMember = {
      ...memberData,
      shg_code: shgCode,
      member_code: memberCode,
      lokos_shg_code: shgCode,
      lokos_member_code: memberCode,
      district_id: districtId ?? memberData.district_id ?? null,
      block_id: selectedBlockId,
    };
    addSelectedMember?.(enrichedMember);
  };
  // =========================================
  // COMMON STYLES
  // =========================================
  const cardStyle = {
    border: "1px solid #dbe3ef",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
  };
  const headingStyle = {
    fontSize: 16,
    fontWeight: 700,
    color: "#164c88",
    marginBottom: 12,
  };
  const selectedBlockName = blockList.find(
    (block) => getBlockId(block) === selectedBlockId,
  );
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* =====================================
          PARTICIPANT TYPE SELECTION
      ===================================== */}
      <section style={cardStyle}>
        <div style={headingStyle}>Select Participant Type *</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 10,
          }}
        >
          {PARTICIPANT_TYPES.map((type) => {
            const selected = activeType === type.value;
            const disabled =
              Boolean(lockedTrainingType) && lockedTrainingType !== type.value;
            return (
              <button
                key={type.value}
                type="button"
                disabled={disabled}
                onClick={() => handleTypeChange(type.value)}
                style={{
                  padding: "13px 12px",
                  borderRadius: 10,
                  fontWeight: 700,
                  border: selected ? "2px solid #164c88" : "1px solid #cbd5e1",
                  color: selected ? "#164c88" : "#475569",
                  background: selected
                    ? "#eaf2ff"
                    : disabled
                      ? "#f1f5f9"
                      : "#ffffff",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.45 : 1,
                }}
              >
                {type.label}
                {selected && " ✓"}
                {disabled && (
                  <div
                    style={{
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    Locked
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {lockedTrainingType && (
          <p
            style={{
              fontSize: 12,
              marginTop: 10,
              color: "#64748b",
            }}
          >
            Participant Type is locked because a Training Request has already
            been added to this bulk list.
          </p>
        )}
        {/* FIXED TRAINING LEVEL (all three participant types) */}
        <div style={{ marginTop: 15 }}>
          <label htmlFor="bulk-training-level" style={{ fontWeight: 700 }}>
            Training Level
          </label>
          <input
            id="bulk-training-level"
            type="text"
            value="STATE"
            readOnly
            style={{
              display: "block",
              width: "100%",
              maxWidth: 280,
              padding: 10,
              marginTop: 6,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              background: "#f1f5f9",
              color: "#164c88",
              fontWeight: 600,
              cursor: "not-allowed",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "#eff6ff",
            color: "#164c88",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          Minimum 1 participant required. Currently selected:{" "}
          <strong>{currentCount}</strong>
        </div>
      </section>
      {/* =====================================
          BENEFICIARY SELECTION
      ===================================== */}
      {activeType === "BENEFICIARY" && (
        <>
          {/* BLOCK SELECTION */}
          <section style={cardStyle}>
            <div style={headingStyle}>Select Block *</div>
            {!districtId ? (
              <p style={{ color: "#64748b" }}>
                Please select a Target District first.
              </p>
            ) : blockLoading ? (
              <p>Loading blocks...</p>
            ) : blockList.length === 0 ? (
              <p>No blocks found for this district.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 10,
                }}
              >
                {blockList.map((block) => {
                  const id = getBlockId(block);
                  const used = blockAlreadyUsed(id);
                  const selected = selectedBlockId === id;
                  return (
                    <button
                      type="button"
                      key={id}
                      disabled={used}
                      onClick={() => handleBlockSelect(block)}
                      style={{
                        padding: 12,
                        borderRadius: 9,
                        textAlign: "left",
                        border: selected
                          ? "2px solid #164c88"
                          : "1px solid #cbd5e1",
                        background: used
                          ? "#f1f5f9"
                          : selected
                            ? "#eaf2ff"
                            : "#ffffff",
                        color: used ? "#94a3b8" : "#1e293b",
                        fontWeight: selected ? 700 : 500,
                        cursor: used ? "not-allowed" : "pointer",
                      }}
                    >
                      {getBlockName(block)}
                      {selected && <span> ✓</span>}
                      {used && (
                        <div
                          style={{
                            fontSize: 11,
                            marginTop: 5,
                            color: "#b45309",
                          }}
                        >
                          Already used in Bulk List
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <p
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              You can reuse a district, but each block can be used only once in
              the current Bulk Training Request.
            </p>
          </section>
          {/* SHG SELECTION */}
          {selectedBlockId && (
            <section style={cardStyle}>
              <div style={headingStyle}>Select SHG</div>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                Selected Block:{" "}
                <strong>
                  {selectedBlockName
                    ? getBlockName(selectedBlockName)
                    : selectedBlockId}
                </strong>
              </p>
              <ShgListTable
                blockId={selectedBlockId}
                onSelectShg={handleShgSelect}
              />
            </section>
          )}
          {/* MEMBER SELECTION */}
          {selectedBlockId && (
            <section
              ref={membersRef}
              style={{
                ...cardStyle,
                scrollMarginTop: 90,
              }}
            >
              <div style={headingStyle}>Select SHG Members</div>
              {!selectedShgForMembers ? (
                <p style={{ color: "#64748b" }}>
                  Select an SHG above to view members.
                </p>
              ) : selectedShgLoading ? (
                <p>Loading members...</p>
              ) : (
                <>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    SHG:{" "}
                    {selectedShgForMembers.shg_name ||
                      selectedShgForMembers.name ||
                      selectedShgForMembers.shg_code}
                  </div>
                  <ShgMemberListTable
                    key={
                      String(
                        selectedShgForMembers.id ??
                          selectedShgForMembers.shg_code,
                      ) +
                      "-" +
                      memberListReloadToken
                    }
                    shg={selectedShgForMembers}
                    shgId={
                      selectedShgForMembers.id ?? selectedShgForMembers.shg_code
                    }
                    onToggleMember={handleMemberToggle}
                    selectedMemberCodes={selectedMemberCodesSet}
                    // Hide View Details only in Bulk TR
                    hideViewDetails={true}
                  />
                </>
              )}
            </section>
          )}
          {/* SELECTED BENEFICIARIES */}
          {selectedBeneficiaries.length > 0 && (
            <section style={cardStyle}>
              <div style={headingStyle}>
                Selected Beneficiaries ({selectedBeneficiaries.length})
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                {selectedBeneficiaries.map((beneficiary, index) => (
                  <div
                    key={
                      String(beneficiary.lokos_member_code) +
                      "-" +
                      String(beneficiary.lokos_shg_code)
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                      padding: 10,
                      background: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <strong>
                        {index + 1}.{" "}
                        {beneficiary.member_name ||
                          beneficiary.name ||
                          beneficiary.lokos_member_code}
                      </strong>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        Member Code: {beneficiary.lokos_member_code}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeSelectedBeneficiary?.(
                          beneficiary.lokos_member_code,
                          beneficiary.lokos_shg_code,
                        )
                      }
                      style={{
                        border: "1px solid #fecaca",
                        borderRadius: 7,
                        background: "#fff1f2",
                        color: "#b91c1c",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {/* =====================================
          MASTER TRAINER SELECTION
      ===================================== */}
      {activeType === "TRAINER" && (
        <section style={cardStyle}>
          <div style={headingStyle}>Master Trainer List</div>
          {reservedTrainerIds.size > 0 && (
            <p style={{ color: "#64748b", fontSize: 12 }}>
              {reservedTrainerIds.size} Master Trainer(s) already used in other
              saved bulk requests. They cannot be selected again.
            </p>
          )}
          <MasterTrainerList
            onToggleTrainer={onToggleTrainer}
            unavailableIds={reservedTrainerIds}
            selectedIds={selectedTrainerIds}
            preloadedTrainers={preloadedTrainers}
            preloadReloadToken={preloadReloadToken}
            onRequestReload={() => fetchMasterTrainersByDistrict?.(true)}
          />
        </section>
      )}
      {/* =====================================
          STAFF SELECTION
      ===================================== */}
      {activeType === "STAFF" && (
        <section style={cardStyle}>
          <div style={headingStyle}>Staff List</div>
          {reservedStaffIds.size > 0 && (
            <p style={{ color: "#64748b", fontSize: 12 }}>
              {reservedStaffIds.size} Staff member(s) already used in other
              saved bulk requests. They cannot be selected again.
            </p>
          )}
          <StaffList
            user={user}
            onToggleStaff={onToggleStaff}
            unavailableIds={reservedStaffIds}
            selectedIds={selectedStaffIds}
          />
        </section>
      )}
    </div>
  );
}
