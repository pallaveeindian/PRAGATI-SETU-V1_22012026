// src/pages/TMS/CreateTR/Step2Participants.jsx
import React from "react";
import ShgListTable from "../../Dashboard/ShgListTable";
import ShgMemberListTable from "../../Dashboard/ShgMemberListTable";
import MasterTrainerList from "./MasterTrainerList";
import StaffList from "./StaffList";
import { LOOKUP_API } from "../../../api/axios";
import { Underline } from "docx";

// Internal Sub-component for SHG Member rendering
function MemberListArea({
  selectedShg,
  onSelectMember,
  onToggleMember,
  reloadToken = 0,
  selectedMemberCodes = null,
}) {
  if (!selectedShg) {
    return (
      <div className="muted">Select an SHG from the left to view members.</div>
    );
  }

  const stableKey =
    selectedShg.id ??
    selectedShg.shg_code ??
    selectedShg.shgCode ??
    JSON.stringify(selectedShg);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <strong>SHG:</strong>{" "}
        {selectedShg.shg_name || selectedShg.name || selectedShg.shg_code}
      </div>

      <div key={`${stableKey}::${reloadToken}`}>
        <ShgMemberListTable
          shg={selectedShg}
          shgId={selectedShg.id ?? selectedShg.shg_code}
          onSelectMember={(m) => onSelectMember && onSelectMember(m)}
          onToggleMember={(m, checked) => {
            if (onToggleMember) return onToggleMember(m, checked);
            if (checked && onSelectMember) onSelectMember(m);
          }}
          selectedMemberCodes={selectedMemberCodes}
        />
      </div>
    </div>
  );
}

export default function Step2Participants({
  form,
  setForm,
  roleKey,
  user,
  geoscopeCached,
  districtId,
  blockId,
  setBlockId,
  blockList,
  blockLoading,
  participantSubStep,
  setParticipantSubStep,
  selectedBlockForShg,
  setSelectedBlockForShg,
  selectedShgForMembers,
  setSelectedShgForMembers,
  selectedShgLoading,
  setSelectedShgLoading,
  memberListReloadToken,
  setMemberListReloadToken,
  selectedMemberCodesSet,
  selectedBeneficiaries,
  addSelectedMember,
  removeSelectedBeneficiary,
  fetchMemberDetailBestEffort,
  hover,
  setHover,
  goToPrev,
  goToNext,
  fetchMasterTrainersByDistrict,
  preloadedTrainers,
  preloadReloadToken,
  selectedTrainerIds,
  onToggleTrainer,
  onToggleStaff,
  selectedStaffIds,
}) {
  const headerGradient = {
    background: "linear-gradient(90deg, #e4ecf5, #a7c6ed)",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    border: "2px solid #3d6ba6",
  };

  const btnPrimary = {
    background: "linear-gradient(20deg, #e4ecf5, #5a8cc2)",
    border: "2px solid #3d6ba6",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  const btnOutline = {
    background: "#fff",
    border: "2px solid #3d6ba6",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  };

  // IMPLEMENTATION OF TR PARTICIPANT MINIMUM LIMIT - 1
  const currentCount =
    form.training_type === "BENEFICIARY"
      ? selectedBeneficiaries?.length || 0
      : form.training_type === "TRAINER"
        ? selectedTrainerIds?.size || 0
        : selectedStaffIds?.size || 0;

  const hasEnough = currentCount >= 1;

  React.useEffect(() => {
    if (roleKey === "smmu") {
      // Switch from default Beneficiary to Trainer
      if (form.training_type === "BENEFICIARY") {
        setForm((f) => ({ ...f, training_type: "TRAINER" }));
      }
      // Force fetch trainers by default on component mount
      fetchMasterTrainersByDistrict(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (roleKey === "smmu" && form.level !== "STATE") {
      setForm((f) => ({
        ...f,
        level: "STATE",
      }));
    }
  }, [roleKey, form.level, setForm]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={headerGradient}>2 — Select Participants</h3>
          <div className="muted">
            Choose Participants depending on selection.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* NEW: Counter warning if under 15 */}
          {!hasEnough && (
            <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 600 }}>
              ⚠ Participant selection does not meet the minimum requirement
              (Selected: {currentCount})
            </span>
          )}

          <button
            className="btnPrimaryHover"
            style={btnOutline}
            onClick={goToPrev}
          >
            Back
          </button>
          <button
            style={{
              ...btnPrimary,
              opacity: hasEnough ? 1 : 0.6,
              cursor: hasEnough ? "pointer" : "not-allowed",
            }}
            onClick={goToNext}
            disabled={!hasEnough}
            className={hasEnough ? "btnPrimaryHover" : ""}
          >
            Next
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "12px 0",
          alignItems: "center",
        }}
      >
        <label style={{ fontWeight: 700 }}>Applicable For</label>

        <select
          value={form.training_type}
          onChange={(e) => {
            const val = e.target.value;
            setForm((f) => ({ ...f, training_type: val }));

            if (val === "TRAINER") {
              fetchMasterTrainersByDistrict(true);
            }
            // Note: If val === "STAFF", StaffList.jsx triggers its own fetch automatically.
          }}
          style={{
            outline: "2px solid #3d6ba6",
          }}
        >
          {roleKey === "smmu" ? (
            <>
              <option value="TRAINER">Master Trainer</option>
              <option value="STAFF">Staff List</option>
            </>
          ) : (
            <>
              <option value="BENEFICIARY">Beneficiary</option>
              <option value="TRAINER">Master Trainer</option>
            </>
          )}
        </select>

        <label style={{ fontWeight: 700, marginLeft: 12 }}>Level</label>

        <select
          value={roleKey === "smmu" ? "STATE" : form.level}
          onChange={(e) =>
            roleKey !== "smmu" && setForm({ ...form, level: e.target.value })
          }
          disabled={roleKey === "smmu"}
          style={{
            outline: "2px solid #3d6ba6",
            background: roleKey === "smmu" ? "#e2e8f0" : "#fff",
            cursor: roleKey === "smmu" ? "not-allowed" : "pointer",
          }}
        >
          {roleKey !== "smmu" && (
            <>
              <option value="BLOCK">Block</option>
              <option value="DISTRICT">District</option>
            </>
          )}

          <option value="STATE">State</option>
        </select>
      </div>
      {form.training_type === "BENEFICIARY" && (
        <h3
          style={{
            fontSize: 18,
            color: "#000000",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          <span>कैडर का चयन करने के लिए</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 1000,
              color: "#8a0000",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {" "}
            SHG List{" "}
          </span>
          <span>
            टैब पर क्लिक करें। इसके बाद प्रतिभागियों का चयन करें और
            <span
              style={{
                fontSize: 18,
                fontWeight: 1000,
                color: "#8a0000",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {" "}
              यह प्रक्रिया तब तक दोहराएँ, जब तक सभी प्रतिभागी योजना में चयनित न
              हो जाएँ।
            </span>
          </span>
        </h3>
      )}
      {form.training_type === "BENEFICIARY" ? (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {roleKey === "dmmu" && (
              <div
                onClick={() => setParticipantSubStep(0)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: participantSubStep === 0 ? "#0b2540" : "#f5f7fa",
                  color: participantSubStep === 0 ? "#fff" : "#0b2540",
                  cursor: "pointer",
                  fontWeight: 1000,
                }}
              >
                1 — Block
              </div>
            )}

            <div
              onClick={() => {
                if (roleKey === "dmmu" && !blockId) return;
                setParticipantSubStep(1);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "3px solid #3d6ba6",
                background: participantSubStep === 1 ? "#0b2540" : "#f5f7fa",
                color: participantSubStep === 1 ? "#fff" : "#0b2540",
                cursor:
                  roleKey === "dmmu" && !blockId ? "not-allowed" : "pointer",
                opacity: roleKey === "dmmu" && !blockId ? 0.5 : 1,
                fontWeight: 1000,
              }}
            >
              {roleKey === "dmmu" ? "2 — SHG list" : "1 — SHG list"}
            </div>

            <div
              onClick={() => {
                if (roleKey === "dmmu" && !selectedShgForMembers) return;
                setParticipantSubStep(2);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "3px solid #3da642",
                background: participantSubStep === 2 ? "#0b2540" : "#f5f7fa",
                color: participantSubStep === 2 ? "#fff" : "#0b2540",
                cursor:
                  roleKey === "dmmu" && !selectedShgForMembers
                    ? "not-allowed"
                    : "pointer",
                opacity: roleKey === "dmmu" && !selectedShgForMembers ? 0.5 : 1,
                fontWeight: 1000,
              }}
            >
              {roleKey === "dmmu" ? "3 — Members" : "2 — Members"}
            </div>
          </div>

          {/* DMMU BLOCK SELECTION */}
          {roleKey === "dmmu" && participantSubStep === 0 && (
            <div>
              <h4>Select Block</h4>
              <div style={{ fontSize: 13, color: "#6c757d", marginBottom: 8 }}>
                Select a block to view SHGs under it.
              </div>

              {blockLoading ? (
                <div className="table-spinner">Loading blocks…</div>
              ) : !blockList || blockList.length === 0 ? (
                <p className="muted">No blocks found for this district.</p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {blockList.map((b) => (
                    <div
                      key={
                        b.id ??
                        b.block_id ??
                        `${b.block_name_en}-${b.district_id}`
                      }
                      onClick={() => {
                        setSelectedBlockForShg(b);
                        setBlockId(b.block_id);
                        setSelectedShgForMembers(null);
                        setMemberListReloadToken((t) => t + 1);
                        setParticipantSubStep(1);
                      }}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        border:
                          selectedBlockForShg?.block_id === b.block_id
                            ? "2px solid #2563eb"
                            : "1px solid #e5e7eb",
                        cursor: "pointer",
                        background:
                          selectedBlockForShg?.block_id === b.block_id
                            ? "linear-gradient(135deg, #dbeafe, #eff6ff)"
                            : "#ffffff",
                        boxShadow:
                          selectedBlockForShg?.block_id === b.block_id
                            ? "0 6px 18px rgba(37, 99, 235, 0.25)"
                            : "0 2px 6px rgba(0,0,0,0.06)",
                        transition: "all 0.25s ease",
                        transform:
                          hover === b.block_id
                            ? "translateY(-4px) scale(1.02)"
                            : "none",
                      }}
                      onMouseEnter={() => setHover(b.block_id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 15,
                              color: "#1e293b",
                            }}
                          >
                            {b.block_name_en || b.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 2,
                            }}
                          >
                            Block ID: {b.block_id}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            padding: "4px 8px",
                            borderRadius: 999,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 600,
                          }}
                        >
                          SELECT
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SHG LIST */}
          {participantSubStep === 1 &&
            (roleKey !== "dmmu" || selectedBlockForShg) && (
              <div>
                <h4>SHG list</h4>
                <div
                  style={{ fontSize: 13, color: "#6c757d", marginBottom: 8 }}
                >
                  Select an SHG to view members.
                </div>

                {roleKey === "dmmu" && !blockId ? (
                  <div className="muted">Please select a block first.</div>
                ) : (
                  <ShgListTable
                    blockId={blockId}
                    onSelectShg={(shg) => {
                      setSelectedShgLoading(true);
                      setSelectedShgForMembers(shg);
                      setParticipantSubStep(2);
                      setMemberListReloadToken((t) => t + 1);
                      setTimeout(() => setSelectedShgLoading(false), 700);
                    }}
                  />
                )}
              </div>
            )}

          {/* MEMBER LIST */}
          {participantSubStep === 2 && selectedShgForMembers && (
            <div>
              <h4>Members (selected SHG)</h4>
              <div style={{ fontSize: 13, color: "#6c757d", marginBottom: 8 }}>
                Check members to add them to selection.
              </div>

              {selectedShgLoading ? (
                <div className="table-spinner" style={{ padding: 12 }}>
                  Loading members…
                </div>
              ) : (
                <div className="no-action">
                  <MemberListArea
                    selectedShg={selectedShgForMembers}
                    onToggleMember={async (member, checked) => {
                      const lokos_shg_code =
                        member.shg_code ||
                        member.lokos_shg_code ||
                        member.shg?.shg_code ||
                        (selectedShgForMembers &&
                          (selectedShgForMembers.shg_code ||
                            selectedShgForMembers.code));

                      const lokos_member_code =
                        member.member_code ||
                        member.lokos_member_code ||
                        member.memberCode ||
                        member.id;

                      // SURGICAL FIX: Properly process the uncheck event
                      if (!checked) {
                        if (typeof removeSelectedBeneficiary === "function") {
                          removeSelectedBeneficiary(
                            lokos_member_code,
                            lokos_shg_code,
                          );
                        }
                        return;
                      }

                      const already = selectedBeneficiaries.some(
                        (p) =>
                          String(p.lokos_member_code) ===
                            String(lokos_member_code) &&
                          String(p.lokos_shg_code) === String(lokos_shg_code),
                      );
                      if (already) return;

                      const applyFallback = (data) => {
                        let did =
                          data.district_id ||
                          data.districtId ||
                          (data.__raw_upsrlm && data.__raw_upsrlm.district_id);
                        let bid =
                          data.block_id ||
                          data.blockId ||
                          (data.__raw_upsrlm && data.__raw_upsrlm.block_id);
                        let changed = false;

                        // Secure fallback identifiers from geoscope cache and state
                        const actualUserDistrict =
                          districtId ||
                          geoscopeCached?.districts?.[0] ||
                          user?.district_id ||
                          user?.districtId;
                        const actualUserBlock =
                          blockId ||
                          geoscopeCached?.blocks?.[0] ||
                          user?.block_id ||
                          user?.blockId;

                        // Fallback for District
                        if (!did || did === "-") {
                          if (
                            roleKey === "bmmu" ||
                            user?.role_id == 1 ||
                            roleKey === "dmmu" ||
                            user?.role_id == 2
                          ) {
                            data.district_id = actualUserDistrict;
                            changed = true;
                          }
                        }

                        // Fallback for Block
                        if (!bid || bid === "-") {
                          if (roleKey === "bmmu" || user?.role_id == 1) {
                            data.block_id = actualUserBlock;
                            changed = true;
                          } else if (roleKey === "dmmu" || user?.role_id == 2) {
                            data.block_id =
                              selectedBlockForShg?.block_id ||
                              selectedBlockForShg?.id ||
                              actualUserBlock;
                            changed = true;
                          }
                        }

                        if (changed) {
                          console.log(
                            `Defaulted missing district/block for member ${data.member_code || data.lokos_member_code} to user's ids. District: ${data.district_id}, Block: ${data.block_id}`,
                          );
                        }

                        return data;
                      };

                      try {
                        const detail =
                          await fetchMemberDetailBestEffort(member);
                        let merged = {
                          ...(detail || {}),
                          shg_code: lokos_shg_code,
                          member_code: lokos_member_code,
                        };
                        addSelectedMember(applyFallback(merged));
                      } catch (e) {
                        let fallbackMerged = {
                          ...member,
                          shg_code: lokos_shg_code,
                          member_code: lokos_member_code,
                        };
                        addSelectedMember(applyFallback(fallbackMerged));
                      }
                    }}
                    reloadToken={memberListReloadToken}
                    selectedMemberCodes={selectedMemberCodesSet}
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : form.training_type === "TRAINER" ? (
        <div>
          <MasterTrainerList
            onToggleTrainer={onToggleTrainer}
            selectedIds={selectedTrainerIds}
            preloadedTrainers={preloadedTrainers}
            preloadReloadToken={preloadReloadToken}
            onRequestReload={() => fetchMasterTrainersByDistrict(true)}
          />
        </div>
      ) : form.training_type === "STAFF" ? (
        <div>
          <StaffList
            user={user}
            onToggleStaff={onToggleStaff}
            selectedIds={selectedStaffIds}
          />
        </div>
      ) : null}
    </>
  );
}
