
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NoStrategiesFoundProps {
  onAddStrategies: () => void;
}

export const NoStrategiesFound: React.FC<NoStrategiesFoundProps> = ({ onAddStrategies }) => {
  return (
    <div className="premium-card p-6 border border-cyan/20 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
      <div className="relative z-10">
        <p className="text-charcoalTextSecondary mb-4">No strategies found in your wishlist.</p>
        <Button
          onClick={onAddStrategies}
          variant="gradient"
          className="w-full"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Strategies
        </Button>
      </div>
    </div>
  );
};
