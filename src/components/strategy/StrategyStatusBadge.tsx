
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UnlockIcon, LockIcon, CheckCircleIcon, PlayIcon } from "lucide-react";

interface StrategyStatusBadgeProps {
  isPremium: boolean;
  isPaid: boolean;
}

export const StrategyStatusBadge: React.FC<StrategyStatusBadgeProps> = ({ 
  isPremium, 
  isPaid 
}) => {
  if (!isPremium) {
    // First strategy is free, show "Free" badge
    return (
      <Badge variant="outline" className="ml-2 bg-green-900/30 text-green-300 border-green-800 flex items-center gap-1">
        <UnlockIcon size={12} />
        <span>Free</span>
      </Badge>
    );
  }
  
  if (isPaid) {
    // Paid premium strategy - show "Unlocked" badge with Play icon
    return (
      <Badge variant="outline" className="ml-2 bg-green-900/30 text-green-300 border-green-800 flex items-center gap-1">
        <PlayIcon size={12} />
        <span>Unlocked</span>
      </Badge>
    );
  }
  
  // Premium unpaid strategy
  return (
    <Badge variant="outline" className="ml-2 bg-yellow-900/30 text-yellow-300 border-yellow-800 flex items-center gap-1">
      <LockIcon size={12} />
      <span>Premium</span>
    </Badge>
  );
};
