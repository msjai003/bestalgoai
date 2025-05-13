
import React from "react";
import { Lock } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between border border-purple-800/40">
      <div className="flex items-start sm:items-center mb-3 sm:mb-0">
        <Lock className="h-6 w-6 text-purple-400 mr-3 mt-0.5 sm:mt-0" />
        <div>
          <h3 className="text-white font-medium">Premium Content Available</h3>
          <p className="text-gray-300 text-sm">All files require payment to unlock and download</p>
        </div>
      </div>
      <div className="mt-1 sm:mt-0 self-start sm:self-center">
        <div className="flex items-center text-cyan-400 text-sm whitespace-normal">
          <Lock className="h-4 w-4 mr-1 shrink-0" />
          <span>Click "Unlock" to purchase individual files</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
