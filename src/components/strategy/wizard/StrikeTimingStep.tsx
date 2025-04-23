
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select strike level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
              {/* ATM option */}
              <SelectItem 
                value="ATM" 
                className="bg-cyan/10 text-white font-bold border-y border-cyan/30 my-1 py-2"
              >
                ATM
              </SelectItem>
              
              {/* ITM options */}
              <SelectItem value="ITM1" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 1</SelectItem>
              <SelectItem value="ITM2" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 2</SelectItem>
              <SelectItem value="ITM3" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 3</SelectItem>
              <SelectItem value="ITM4" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 4</SelectItem>
              <SelectItem value="ITM5" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 5</SelectItem>
              <SelectItem value="ITM6" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 6</SelectItem>
              <SelectItem value="ITM7" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 7</SelectItem>
              <SelectItem value="ITM8" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 8</SelectItem>
              <SelectItem value="ITM9" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 9</SelectItem>
              <SelectItem value="ITM10" className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium">ITM 10</SelectItem>
              
              {/* OTM options */}
              <SelectItem value="OTM1" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 1</SelectItem>
              <SelectItem value="OTM2" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 2</SelectItem>
              <SelectItem value="OTM3" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 3</SelectItem>
              <SelectItem value="OTM4" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 4</SelectItem>
              <SelectItem value="OTM5" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 5</SelectItem>
              <SelectItem value="OTM6" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 6</SelectItem>
              <SelectItem value="OTM7" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 7</SelectItem>
              <SelectItem value="OTM8" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 8</SelectItem>
              <SelectItem value="OTM9" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 9</SelectItem>
              <SelectItem value="OTM10" className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium">OTM 10</SelectItem>
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
