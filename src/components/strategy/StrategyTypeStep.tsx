
import { Button } from "@/components/ui/button";
import { StrategyType } from "@/types/strategy";

interface StrategyTypeStepProps {
  strategyType: StrategyType;
  onStrategyTypeChange: (type: StrategyType) => void;
}

export const StrategyTypeStep = ({
  strategyType,
  onStrategyTypeChange,
}: StrategyTypeStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white font-medium">Choose Strategy Type</h3>
      <div className="flex flex-col space-y-4">
        <Button
          variant={strategyType === "predefined" ? "default" : "outline"}
          className={`h-14 w-full ${strategyType === "predefined" ? "bg-gradient-to-r from-pink-500/80 to-purple-500/80" : "bg-gray-800 border-gray-700"}`}
          onClick={() => onStrategyTypeChange("predefined")}
        >
          Predefined Strategies
        </Button>
        <Button
          variant={strategyType === "custom" ? "default" : "outline"}
          className={`h-14 w-full ${strategyType === "custom" ? "bg-gradient-to-r from-pink-500/80 to-purple-500/80" : "bg-gray-800 border-gray-700"}`}
          onClick={() => onStrategyTypeChange("custom")}
        >
          Custom Strategy
        </Button>
      </div>
    </div>
  );
};
