
import React from "react";
import { Lock } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between border border-purple-800/40">
      <div className="flex items-center">
        <Lock className="h-6 w-6 text-purple-400 mr-3" />
        <div>
          <h3 className="text-white font-medium">Premium Content Available</h3>
          <p className="text-gray-300 text-sm">Some files require a premium subscription</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
