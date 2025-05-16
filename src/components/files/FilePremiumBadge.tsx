
import React from "react";
import { Lock } from "lucide-react";

interface FilePremiumBadgeProps {
  show: boolean;
}

const FilePremiumBadge = ({ show }: FilePremiumBadgeProps) => {
  if (!show) return null;
  
  return (
    <div className="flex items-center ml-1 text-amber-500" data-testid="premium-badge">
      <Lock className="h-4 w-4 mr-1" aria-label="Premium file" />
      <span className="text-xs font-medium">Premium</span>
    </div>
  );
};

export default FilePremiumBadge;
