
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StrategyStatusBadgeProps {
  isPremium: boolean;
  isPaid: boolean;
}

export const StrategyStatusBadge: React.FC<StrategyStatusBadgeProps> = ({ 
  isPremium, 
  isPaid 
}) => {
  if (!isPremium) return null;
  
  if (isPaid) {
    return (
      <Badge variant="outline" className="ml-2 bg-green-900/30 text-green-300 border-green-800">
        Unlocked
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="ml-2 bg-yellow-900/30 text-yellow-300 border-yellow-800">
      Premium
    </Badge>
  );
};
