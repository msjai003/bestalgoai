
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface LockedStrategyViewProps {
  strategyName: string;
  strategyId: number;
  onUnlock: () => void;
}

export const LockedStrategyView = ({ strategyName, onUnlock }: LockedStrategyViewProps) => {
  return (
    <div className="text-center py-12 bg-charcoalSecondary/40 rounded-xl border border-gray-700/50">
      <Lock className="h-16 w-16 mx-auto mb-4 text-cyan/70 animate-pulse" />
      <h3 className="text-xl font-semibold mb-2 text-white">Premium Strategy</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        <span className="font-medium text-cyan">{strategyName}</span> is a premium strategy. Upgrade to unlock it and all premium strategies.
      </p>
      <Button 
        className="bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary px-8 py-6 rounded-full shadow-lg hover:shadow-cyan/20 font-medium text-base transition-all duration-300"
        onClick={onUnlock}
      >
        Unlock {strategyName}
      </Button>
    </div>
  );
};
