
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <Label htmlFor="strikeLevel" className="text-gray-300 block mb-2">Select Strike Level</Label>
          <Select
            value={leg.strikeLevel}
            onValueChange={(value) => updateLeg({ strikeLevel: value as any })}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white rounded-xl">
              <SelectValue placeholder="Select strike level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] rounded-xl">
              {[
                "ITM10", "ITM9", "ITM8", "ITM7", "ITM6", "ITM5", "ITM4", "ITM3", "ITM2", "ITM1", 
                "ATM", 
                "OTM1", "OTM2", "OTM3", "OTM4", "OTM5", "OTM6", "OTM7", "OTM8", "OTM9", "OTM10"
              ].map((level) => (
                <SelectItem 
                  key={level} 
                  value={level} 
                  className={`
                    ${level === "ATM" 
                      ? "bg-cyan/10 text-white font-bold border-y border-cyan/30 my-1 py-2" 
                      : level.startsWith("ITM") 
                        ? "text-green-400 hover:bg-gray-700 hover:text-white font-medium" 
                        : "text-red-400 hover:bg-gray-700 hover:text-white font-medium"}
                  `}
                >
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="relative">
            <Input
              id="entryTime"
              type="time"
              value={leg.entryTime}
              onChange={(e) => updateLeg({ entryTime: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white pr-10"
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
          </div>
        </div>
        <div>
          <Label htmlFor="exitTime" className="text-gray-300 block mb-2">Exit Time</Label>
          <div className="relative">
            <Input
              id="exitTime"
              type="time"
              value={leg.exitTime}
              onChange={(e) => updateLeg({ exitTime: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white pr-10"
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
