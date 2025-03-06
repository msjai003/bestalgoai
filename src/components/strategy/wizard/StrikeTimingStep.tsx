
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
                  <SelectItem value="ITM20">ITM20</SelectItem>
                  <SelectItem value="ITM19">ITM19</SelectItem>
                  <SelectItem value="ITM18">ITM18</SelectItem>
                  <SelectItem value="ITM17">ITM17</SelectItem>
                  <SelectItem value="ITM16">ITM16</SelectItem>
                  <SelectItem value="ITM15">ITM15</SelectItem>
                  <SelectItem value="ITM14">ITM14</SelectItem>
                  <SelectItem value="ITM13">ITM13</SelectItem>
                  <SelectItem value="ITM12">ITM12</SelectItem>
                  <SelectItem value="ITM11">ITM11</SelectItem>
                  <SelectItem value="ITM10">ITM10</SelectItem>
                  <SelectItem value="ITM9">ITM9</SelectItem>
                  <SelectItem value="ITM8">ITM8</SelectItem>
                  <SelectItem value="ITM7">ITM7</SelectItem>
                  <SelectItem value="ITM6">ITM6</SelectItem>
                  <SelectItem value="ITM5">ITM5</SelectItem>
                  <SelectItem value="ITM4">ITM4</SelectItem>
                  <SelectItem value="ITM3">ITM3</SelectItem>
                  <SelectItem value="ITM2">ITM2</SelectItem>
                  <SelectItem value="ITM1">ITM1</SelectItem>
                  
                  {/* ATM option - in the center */}
                  <SelectItem value="ATM" className="bg-gray-700 font-medium">ATM</SelectItem>
                  
                  {/* OTM options - ordered from OTM1 down to OTM20 */}
                  <SelectItem value="OTM1">OTM1</SelectItem>
                  <SelectItem value="OTM2">OTM2</SelectItem>
                  <SelectItem value="OTM3">OTM3</SelectItem>
                  <SelectItem value="OTM4">OTM4</SelectItem>
                  <SelectItem value="OTM5">OTM5</SelectItem>
                  <SelectItem value="OTM6">OTM6</SelectItem>
                  <SelectItem value="OTM7">OTM7</SelectItem>
                  <SelectItem value="OTM8">OTM8</SelectItem>
                  <SelectItem value="OTM9">OTM9</SelectItem>
                  <SelectItem value="OTM10">OTM10</SelectItem>
                  <SelectItem value="OTM11">OTM11</SelectItem>
                  <SelectItem value="OTM12">OTM12</SelectItem>
                  <SelectItem value="OTM13">OTM13</SelectItem>
                  <SelectItem value="OTM14">OTM14</SelectItem>
                  <SelectItem value="OTM15">OTM15</SelectItem>
                  <SelectItem value="OTM16">OTM16</SelectItem>
                  <SelectItem value="OTM17">OTM17</SelectItem>
                  <SelectItem value="OTM18">OTM18</SelectItem>
                  <SelectItem value="OTM19">OTM19</SelectItem>
                  <SelectItem value="OTM20">OTM20</SelectItem>
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
            <p className="text-xs text-gray-400 mt-1">Default: 09:35</p>
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
