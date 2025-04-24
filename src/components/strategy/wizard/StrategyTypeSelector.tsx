
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StrategyLeg } from "@/types/strategy-wizard";

interface StrategyTypeSelectorProps {
  isLoading: boolean;
  strategyTypeOptions: Array<{ value: string; display_name: string }>;
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  isFirstLeg: boolean;
}

export const StrategyTypeSelector = ({
  isLoading,
  strategyTypeOptions,
  leg,
  updateLeg,
  isFirstLeg
}: StrategyTypeSelectorProps) => {
  return (
    <div>
      <h4 className="text-white font-medium mb-4">Strategy Type Selection</h4>
      {isLoading ? (
        <div className="flex justify-center my-4">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {strategyTypeOptions.map((type) => (
            <Button
              key={type.value}
              variant={leg.strategyType === type.value ? "cyan" : "outline"}
              className={`${
                leg.strategyType === type.value
                  ? ""
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
              onClick={() => updateLeg({ strategyType: type.value as any })}
              disabled={!isFirstLeg}
            >
              {type.display_name}
            </Button>
          ))}
        </div>
      )}
      {!isFirstLeg && (
        <p className="text-xs text-gray-400 mt-1">
          Strategy type must be consistent across all legs
        </p>
      )}
    </div>
  );
};
