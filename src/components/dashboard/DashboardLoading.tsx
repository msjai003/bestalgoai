
import React from "react";
import { Loader } from "lucide-react";

const DashboardLoading: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin text-[#FF00D4] mx-auto mb-4" />
        <p className="text-white">Loading dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
