
import React from "react";
import { Lock } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="bg-charcoalPrimary/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-start sm:items-center">
        <Lock className="h-8 w-8 text-cyan mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
        <div>
          <h3 className="text-white text-lg font-medium">Premium Files Available</h3>
          <p className="text-gray-300 text-sm">All files are locked and require a one-time payment of ₹1 to unlock. Click the lock icon to make payment and get access.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
