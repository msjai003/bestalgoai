
import React from "react";
import { Lock } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="bg-charcoalPrimary/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-start sm:items-center">
        <Lock className="h-6 w-6 text-purple-400 mr-3 mt-0.5 sm:mt-0" />
        <div>
          <h3 className="text-white font-medium">Premium Content Available</h3>
          <p className="text-gray-300 text-sm">All files are locked and require payment to unlock. After payment, you'll see the download button.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
