
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
      <h3 className="text-charcoalTextPrimary font-medium">Choose Strategy Type</h3>
      <div className="flex flex-col space-y-4">
        <Button
          variant={strategyType === "predefined" ? "gradient" : "outline"}
          className={`h-14 w-full ${strategyType === "predefined" ? "shadow-cyan/20" : "border-cyan/30 text-cyan hover:bg-cyan/10"}`}
          onClick={() => onStrategyTypeChange("predefined")}
        >
          Predefined Strategies
        </Button>
        <Button
          variant={strategyType === "custom" ? "gradient" : "outline"}
          className={`h-14 w-full ${strategyType === "custom" ? "shadow-cyan/20" : "border-cyan/30 text-cyan hover:bg-cyan/10"}`}
          onClick={() => onStrategyTypeChange("custom")}
        >
          Custom Strategy
        </Button>
      </div>
    </div>
  );
};
