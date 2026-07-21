import React from "react";

const LoginStatus = () => {
  return (
    
    <div style={{ height: "100px", width: "100%", backgroundColor: "#fff", color: "#0f172a", padding: "20px", boxSizing: "border-box", borderRadius: "8px", boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.4)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-orange-500">
          Welcome to Login Status Dashboard
        </h3>
        <p className="mt-3 text-gray-600 text-lg">
          Login status and analytics will be available here.
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginStatus;