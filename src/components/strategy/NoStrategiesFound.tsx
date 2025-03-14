
import React from 'react';
import { Button } from "@/components/ui/button";

interface NoStrategiesFoundProps {
  onAddStrategies: () => void;
}

export const NoStrategiesFound: React.FC<NoStrategiesFoundProps> = ({ onAddStrategies }) => {
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 shadow-lg text-center">
      <p className="text-gray-400 mb-4">No strategies found in your wishlist.</p>
      <Button
        onClick={onAddStrategies}
        className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white"
      >
        Add Strategies
      </Button>
    </div>
  );
};
