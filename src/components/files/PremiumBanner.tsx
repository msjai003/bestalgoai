
import React from "react";
import { Lock } from "lucide-react";

const PremiumBanner = () => {
  return (
    <div className="bg-charcoalSecondary p-4 mb-6 rounded-md border border-gray-700">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-600/20 rounded-md text-amber-500">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">Trading Files</h3>
          <p className="text-gray-400 text-sm">
            ZIP files require a one-time payment of ₹1 to unlock. Other files are free to download.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
