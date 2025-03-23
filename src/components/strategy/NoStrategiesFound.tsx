
import React from 'react';
import { Button } from "@/components/ui/button";

interface NoStrategiesFoundProps {
  onAddStrategies: () => void;
}

export const NoStrategiesFound: React.FC<NoStrategiesFoundProps> = ({ onAddStrategies }) => {
  return (
    <div className="bg-charcoalSecondary/30 rounded-xl p-6 border border-gray-700 shadow-lg text-center">
      <p className="text-gray-400 mb-4">No strategies found in your wishlist.</p>
      <Button
        onClick={onAddStrategies}
        className="gradient-button"
      >
        Add Strategies
      </Button>
    </div>
  );
};
