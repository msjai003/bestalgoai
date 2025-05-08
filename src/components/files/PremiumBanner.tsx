
import React from "react";
import { Lock, CreditCard } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between border border-purple-800/40">
      <div className="flex items-center">
        <Lock className="h-6 w-6 text-purple-400 mr-3" />
        <div>
          <h3 className="text-white font-medium">Premium Content Available</h3>
          <p className="text-gray-300 text-sm">Some files are locked and require payment to unlock</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-0">
        <div className="flex items-center text-cyan-400 text-sm">
          <CreditCard className="h-4 w-4 mr-1" />
          <span>Click "Unlock" to purchase individual files</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
