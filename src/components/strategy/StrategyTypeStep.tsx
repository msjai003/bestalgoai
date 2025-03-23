
import { Button } from "@/components/ui/button";
import { StrategyType } from "@/types/strategy";
import { Code, Lightning } from "lucide-react";

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
          className={`h-14 w-full rounded-xl flex items-center justify-between px-4 ${
            strategyType === "predefined" 
              ? "shadow-cyan/20 bg-gradient-to-r from-cyan to-cyan/80" 
              : "border-cyan/30 text-cyan hover:bg-cyan/10"
          }`}
          onClick={() => onStrategyTypeChange("predefined")}
        >
          <div className="flex items-center">
            <div className="bg-charcoalPrimary/30 p-2 rounded-lg mr-3">
              <Lightning className="h-5 w-5 text-cyan" />
            </div>
            <span>Predefined Strategies</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-charcoalPrimary flex items-center justify-center">
            {strategyType === "predefined" && (
              <div className="w-3 h-3 bg-charcoalPrimary rounded-full" />
            )}
          </div>
        </Button>
        <Button
          variant={strategyType === "custom" ? "gradient" : "outline"}
          className={`h-14 w-full rounded-xl flex items-center justify-between px-4 ${
            strategyType === "custom" 
              ? "shadow-cyan/20 bg-gradient-to-r from-cyan to-cyan/80" 
              : "border-cyan/30 text-cyan hover:bg-cyan/10"
          }`}
          onClick={() => onStrategyTypeChange("custom")}
        >
          <div className="flex items-center">
            <div className="bg-charcoalPrimary/30 p-2 rounded-lg mr-3">
              <Code className="h-5 w-5 text-cyan" />
            </div>
            <span>Custom Strategy</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-charcoalPrimary flex items-center justify-center">
            {strategyType === "custom" && (
              <div className="w-3 h-3 bg-charcoalPrimary rounded-full" />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};
