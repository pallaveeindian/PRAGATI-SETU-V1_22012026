import React from "react";

const ParticipantCount = ({ selectedParticipants = 0, totalLimit = 0 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
          textAlign: "center",
        }}
      >
        Participant Count
      </h4>

      <div
        style={{
          width: "200px",
          height: "95px",
          background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
          borderRadius: "16px",
          padding: "16px 18px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 20px rgba(249,115,22,0.22)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Selected
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "44px",
              fontWeight: "800",
              lineHeight: 1,
            }}
          >
            {selectedParticipants}
          </span>

          <span
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "3px",
            }}
          >
            /{totalLimit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCount;
