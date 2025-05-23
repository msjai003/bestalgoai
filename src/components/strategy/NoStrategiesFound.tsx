
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";

interface NoStrategiesFoundProps {
  onAddStrategies: () => void;
}

export const NoStrategiesFound: React.FC<NoStrategiesFoundProps> = ({ onAddStrategies }) => {
  return (
    <div className="premium-card p-8 border border-cyan/20 text-center relative overflow-hidden rounded-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800/50 p-4 rounded-full">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
        <p className="text-charcoalTextSecondary mb-6 max-w-md mx-auto">
          You haven't added any strategies to your wishlist yet. Browse our selection of strategies and add your favorites.
        </p>
        <Button
          onClick={onAddStrategies}
          variant="gradient"
          size="lg"
          className="mx-auto cursor-pointer bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-charcoalPrimary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Browse Strategies
        </Button>
      </div>
    </div>
  );
};
