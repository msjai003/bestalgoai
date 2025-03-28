
import { Button } from "@/components/ui/button";
import { StrategyType } from "@/types/strategy";
import { Code, Zap } from "lucide-react";

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
      <h3 className="text-lg font-semibold text-white mb-2">Choose Strategy Type</h3>
      <div className="flex flex-col space-y-4">
        <Button
          variant={strategyType === "predefined" ? "cyan" : "outline"}
          size="lg"
          className={`h-16 w-full rounded-xl flex items-center justify-between px-5 transition-all duration-300 ${
            strategyType === "predefined" 
              ? "shadow-lg shadow-cyan/10" 
              : "border-cyan/30 text-cyan hover:bg-cyan/10"
          }`}
          onClick={() => onStrategyTypeChange("predefined")}
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-charcoalPrimary/80 to-charcoalPrimary/50 p-2.5 rounded-lg mr-3 shadow-inner">
              <Zap className="h-5 w-5 text-cyan" />
            </div>
            <span className="font-medium">Predefined Strategies</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-charcoalPrimary flex items-center justify-center">
            {strategyType === "predefined" && (
              <div className="w-3 h-3 bg-charcoalPrimary rounded-full" />
            )}
          </div>
        </Button>
        <Button
          variant={strategyType === "custom" ? "cyan" : "outline"}
          size="lg"
          className={`h-16 w-full rounded-xl flex items-center justify-between px-5 transition-all duration-300 ${
            strategyType === "custom" 
              ? "shadow-lg shadow-cyan/10" 
              : "border-cyan/30 text-cyan hover:bg-cyan/10"
          }`}
          onClick={() => onStrategyTypeChange("custom")}
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-charcoalPrimary/80 to-charcoalPrimary/50 p-2.5 rounded-lg mr-3 shadow-inner">
              <Code className="h-5 w-5 text-cyan" />
            </div>
            <span className="font-medium">Custom Strategies</span>
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
