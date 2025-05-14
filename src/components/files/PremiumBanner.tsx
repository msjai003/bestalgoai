
import React from "react";
import { Lock, Download } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="bg-charcoalPrimary/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-start sm:items-center">
        <Lock className="h-10 w-10 text-cyan mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
        <div>
          <h3 className="text-white text-lg font-medium">Files Locked for Protection</h3>
          <p className="text-gray-300 text-sm">All files are locked to protect my work. Click the Download button with <Lock className="h-3.5 w-3.5 inline text-cyan" /> icon and pay ₹1 to unlock. Thank you for your support!</p>
          <div className="mt-2 text-xs text-gray-400 flex items-center">
            <Download className="h-4 w-4 mr-1" />
            <Lock className="h-3 w-3 absolute ml-4 mt-[-8px]" />
            <span className="ml-6">= Pay ₹1 to unlock and download</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
