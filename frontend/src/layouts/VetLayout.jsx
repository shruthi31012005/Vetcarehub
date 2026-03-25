import React from "react";
import Sidebar from "../components/sidebar";

const VetLayout = ({ children }) => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar role="vet" />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </div>

    </div>
  );
};

export default VetLayout;