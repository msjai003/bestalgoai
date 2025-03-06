
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface StrikeTimingStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
}

export const StrikeTimingStep = ({ leg, updateLeg }: StrikeTimingStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Strike Selection</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="strikeCriteria" className="text-gray-300 block mb-2">Strike Criteria</Label>
            <div className="grid grid-cols-2 gap-2">
              {["strike", "premium"].map((criteria) => (
                <Button
                  key={criteria}
                  variant={leg.strikeCriteria === criteria ? "default" : "outline"}
                  className={`${
                    leg.strikeCriteria === criteria
                      ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                      : "bg-gray-700 border-gray-600 text-white"
                  }`}
                  onClick={() => updateLeg({ strikeCriteria: criteria as any })}
                >
                  {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {leg.strikeCriteria === "strike" && (
            <div>
              <Label htmlFor="strikeLevel" className="text-gray-300 block mb-2">Strike Level</Label>
              <Select
                value={leg.strikeLevel}
                onValueChange={(value) => updateLeg({ strikeLevel: value as any })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select Strike Level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                  {/* ITM options - ordered from ITM20 down to ITM1 */}
                  {Array.from({ length: 20 }, (_, i) => 20 - i).map((num) => (
                    <SelectItem 
                      key={`ITM${num}`} 
                      value={`ITM${num}`}
                      className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium"
                    >
                      ITM{num}
                    </SelectItem>
                  ))}
                  
                  {/* ATM option - in the center */}
                  <SelectItem 
                    value="ATM" 
                    className="bg-[#FF00D4]/10 text-white font-bold border-y border-[#FF00D4]/30 my-1 py-2"
                  >
                    ATM
                  </SelectItem>
                  
                  {/* OTM options - ordered from OTM1 down to OTM20 */}
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem 
                      key={`OTM${num}`} 
                      value={`OTM${num}`}
                      className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium"
                    >
                      OTM{num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-medium mb-4">Entry & Exit Timing</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="entryTime" className="text-gray-300 block mb-2">
              Entry Time (24-Hour Format)
            </Label>
            <div className="relative">
              <Input
                id="entryTime"
                type="time"
                value={leg.entryTime}
                onChange={(e) => updateLeg({ entryTime: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="exitTime" className="text-gray-300 block mb-2">
              Exit Time (24-Hour Format)
            </Label>
            <div className="relative">
              <Input
                id="exitTime"
                type="time"
                value={leg.exitTime}
                onChange={(e) => updateLeg({ exitTime: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
