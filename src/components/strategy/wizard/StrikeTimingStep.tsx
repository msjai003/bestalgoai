
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface StrikeTimingStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
}

export const StrikeTimingStep = ({ 
  leg, 
  updateLeg 
}: StrikeTimingStepProps) => {
  const [isPremiumSelected, setIsPremiumSelected] = useState<boolean>(leg.strikeCriteria === "premium");
  
  const handleStrikeCriteriaChange = (criteria: "strike" | "premium") => {
    setIsPremiumSelected(criteria === "premium");
    updateLeg({ strikeCriteria: criteria });
  };

  const strikeLevels: { value: string; display: string }[] = [
    { value: "ATM", display: "ATM" },
    ...[...Array(10)].map((_, i) => ({ value: `ITM${i+1}`, display: `ITM ${i+1}` })),
    ...[...Array(10)].map((_, i) => ({ value: `OTM${i+1}`, display: `OTM ${i+1}` }))
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-2">Strike Selection Criteria</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!isPremiumSelected ? "cyan" : "outline"}
            className={!isPremiumSelected ? "" : "bg-gray-700 border-gray-600 text-white"}
            onClick={() => handleStrikeCriteriaChange("strike")}
          >
            Strike Price
          </Button>
          <Button
            variant={isPremiumSelected ? "cyan" : "outline"}
            className={isPremiumSelected ? "" : "bg-gray-700 border-gray-600 text-white"}
            onClick={() => handleStrikeCriteriaChange("premium")}
          >
            Premium Amount
          </Button>
        </div>
      </div>

      {!isPremiumSelected ? (
        <div>
          <Label className="text-gray-300 block mb-2">Select Strike Level</Label>
          <div className="grid grid-cols-5 gap-2">
            {strikeLevels.slice(0, 10).map((level) => (
              <Button
                key={level.value}
                variant={leg.strikeLevel === level.value ? "cyan" : "outline"}
                className={`${
                  leg.strikeLevel === level.value 
                    ? "" 
                    : "bg-gray-700 border-gray-600 text-white"
                } text-xs h-10`}
                onClick={() => updateLeg({ strikeLevel: level.value as any })}
              >
                {level.display}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {strikeLevels.slice(10, 20).map((level) => (
              <Button
                key={level.value}
                variant={leg.strikeLevel === level.value ? "cyan" : "outline"}
                className={`${
                  leg.strikeLevel === level.value 
                    ? "" 
                    : "bg-gray-700 border-gray-600 text-white"
                } text-xs h-10`}
                onClick={() => updateLeg({ strikeLevel: level.value as any })}
              >
                {level.display}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="premiumAmount" className="text-gray-300 block mb-2">Premium Amount (₹)</Label>
          <Input
            id="premiumAmount"
            type="number"
            placeholder="Enter premium amount"
            value={leg.premiumAmount}
            onChange={(e) => updateLeg({ premiumAmount: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Option with premium closest to this amount will be selected
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entryTime" className="text-gray-300 block mb-2">Entry Time</Label>
          <Input
            id="entryTime"
            type="time"
            value={leg.entryTime}
            onChange={(e) => updateLeg({ entryTime: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="exitTime" className="text-gray-300 block mb-2">Exit Time</Label>
          <Input
            id="exitTime"
            type="time"
            value={leg.exitTime}
            onChange={(e) => updateLeg({ exitTime: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
    </div>
  );
};
