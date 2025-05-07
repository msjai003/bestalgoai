
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumBannerProps {
  onUpgradeClick: () => void;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ onUpgradeClick }) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center mb-4 sm:mb-0">
        <Lock className="h-6 w-6 text-purple-400 mr-3" />
        <div>
          <h3 className="text-white font-medium">Premium Content Available</h3>
          <p className="text-gray-300 text-sm">Upgrade to access premium ZIP files</p>
        </div>
      </div>
      <Button 
        onClick={onUpgradeClick} 
        className="bg-cyan hover:bg-cyan/80 w-full sm:w-auto"
      >
        Upgrade to Pro
      </Button>
    </div>
  );
};

export default PremiumBanner;
