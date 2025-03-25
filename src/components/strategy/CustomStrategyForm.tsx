
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

interface CustomStrategyFormProps {
  onSubmit: () => void;
}

export const CustomStrategyForm = ({ onSubmit }: CustomStrategyFormProps) => {
  const [formData, setFormData] = useState({
    instrument: "SENSEX",
    underlyingFrom: "cash",
    segments: ["futures"],
    lotSize: "1",
    positionType: "buy",
    optionType: "call",
    expiryType: "weekly",
    strikeCriteria: "ATM",
    strategyType: "intraday",
    entryTime: "",
    exitTime: "",
    stopLoss: "0",
    reEntryOnSL: "disabled",
    target: "0",
    reEntryOnTarget: "disabled",
    trailingEnabled: false,
    trailingLockProfit: "0",
    trailingLockAt: "0",
    backtestStartDate: new Date(),
    backtestEndDate: new Date(),
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    const updatedSegments = [...formData.segments];
    
    if (updatedSegments.includes(value)) {
      const index = updatedSegments.indexOf(value);
      updatedSegments.splice(index, 1);
    } else {
      updatedSegments.push(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: updatedSegments
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-cyan/5 rounded-xl p-4 border border-cyan/20">
      <h3 className="text-lg font-medium text-white mb-4">Custom Strategy Configuration</h3>
      
      {/* Instrument & Market Settings */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Instrument & Market Settings</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="instrument" className="text-gray-300">Instrument</Label>
            <Select 
              value={formData.instrument} 
              onValueChange={(value) => handleInputChange("instrument", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Instrument" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="SENSEX">SENSEX</SelectItem>
                <SelectItem value="NIFTY">NIFTY</SelectItem>
                <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
                <SelectItem value="FINNIFTY">FIN NIFTY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-gray-300 block mb-2">Underlying From</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="cash" 
                  name="underlyingFrom"
                  checked={formData.underlyingFrom === "cash"}
                  onChange={() => handleInputChange("underlyingFrom", "cash")}
                  className="text-pink-500"
                />
                <Label htmlFor="cash" className="text-white">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="futures" 
                  name="underlyingFrom"
                  checked={formData.underlyingFrom === "futures"}
                  onChange={() => handleInputChange("underlyingFrom", "futures")}
                  className="text-pink-500"
                />
                <Label htmlFor="futures" className="text-white">Futures</Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-300 block mb-2">Select Segments</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="futures-segment" 
                  checked={formData.segments.includes("futures")}
                  onCheckedChange={() => handleCheckboxChange("segments", "futures")}
                  className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
                <Label htmlFor="futures-segment" className="text-white">Futures</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="options-segment" 
                  checked={formData.segments.includes("options")}
                  onCheckedChange={() => handleCheckboxChange("segments", "options")}
                  className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
                <Label htmlFor="options-segment" className="text-white">Options</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trade Setup */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Trade Setup</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="lotSize" className="text-gray-300">Total Lot Size</Label>
            <Input 
              id="lotSize" 
              type="number" 
              value={formData.lotSize}
              onChange={(e) => handleInputChange("lotSize", e.target.value)}
              min="1"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-gray-300 block mb-2">Position Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="buy" 
                  name="positionType"
                  checked={formData.positionType === "buy"}
                  onChange={() => handleInputChange("positionType", "buy")}
                  className="text-pink-500"
                />
                <Label htmlFor="buy" className="text-white">Buy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="sell" 
                  name="positionType"
                  checked={formData.positionType === "sell"}
                  onChange={() => handleInputChange("positionType", "sell")}
                  className="text-pink-500"
                />
                <Label htmlFor="sell" className="text-white">Sell</Label>
              </div>
            </div>
          </div>

          {formData.segments.includes("options") && (
            <>
              <div>
                <Label className="text-gray-300 block mb-2">Option Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="call" 
                      name="optionType"
                      checked={formData.optionType === "call"}
                      onChange={() => handleInputChange("optionType", "call")}
                      className="text-pink-500"
                    />
                    <Label htmlFor="call" className="text-white">Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="put" 
                      name="optionType"
                      checked={formData.optionType === "put"}
                      onChange={() => handleInputChange("optionType", "put")}
                      className="text-pink-500"
                    />
                    <Label htmlFor="put" className="text-white">Put</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="expiryType" className="text-gray-300">Expiry Type</Label>
                <Select 
                  value={formData.expiryType} 
                  onValueChange={(value) => handleInputChange("expiryType", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select Expiry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="nextWeekly">Next Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="strikeCriteria" className="text-gray-300">Strike Criteria</Label>
                <Select 
                  value={formData.strikeCriteria} 
                  onValueChange={(value) => handleInputChange("strikeCriteria", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select Strike" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="ATM">ATM</SelectItem>
                    <SelectItem value="ITM1">ITM1</SelectItem>
                    <SelectItem value="ITM2">ITM2</SelectItem>
                    <SelectItem value="OTM1">OTM1</SelectItem>
                    <SelectItem value="OTM2">OTM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="strategyType" className="text-gray-300">Strategy Type</Label>
            <Select 
              value={formData.strategyType} 
              onValueChange={(value) => handleInputChange("strategyType", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Strategy Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="intraday">Intraday</SelectItem>
                <SelectItem value="btst">BTST</SelectItem>
                <SelectItem value="positional">Positional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Entry & Exit Conditions */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Entry & Exit Conditions</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="entryTime" className="text-gray-300">Entry Time</Label>
            <Input 
              id="entryTime" 
              type="time" 
              value={formData.entryTime}
              onChange={(e) => handleInputChange("entryTime", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="exitTime" className="text-gray-300">Exit Time</Label>
            <Input 
              id="exitTime" 
              type="time" 
              value={formData.exitTime}
              onChange={(e) => handleInputChange("exitTime", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Risk Management */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Risk Management</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="stopLoss" className="text-gray-300">Overall Stop Loss (%)</Label>
            <Input 
              id="stopLoss" 
              type="number" 
              value={formData.stopLoss}
              onChange={(e) => handleInputChange("stopLoss", e.target.value)}
              min="0"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="reEntryOnSL" className="text-gray-300">Re-entry on SL Hit</Label>
            <Select 
              value={formData.reEntryOnSL} 
              onValueChange={(value) => handleInputChange("reEntryOnSL", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Re-entry Option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="reASAP">RE ASAP</SelectItem>
                <SelectItem value="wait">Wait</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="target" className="text-gray-300">Overall Target (%)</Label>
            <Input 
              id="target" 
              type="number" 
              value={formData.target}
              onChange={(e) => handleInputChange("target", e.target.value)}
              min="0"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="reEntryOnTarget" className="text-gray-300">Re-entry on Target Hit</Label>
            <Select 
              value={formData.reEntryOnTarget} 
              onValueChange={(value) => handleInputChange("reEntryOnTarget", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Re-entry Option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="trailing-enabled"
              checked={formData.trailingEnabled}
              onCheckedChange={(checked) => handleInputChange("trailingEnabled", checked)}
              className="data-[state=checked]:bg-pink-500"
            />
            <Label htmlFor="trailing-enabled" className="text-white">Enable Trailing Options</Label>
          </div>
          
          {formData.trailingEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-8 pt-2">
              <div>
                <Label htmlFor="trailingLockProfit" className="text-gray-300">Lock Profit at (%)</Label>
                <Input 
                  id="trailingLockProfit" 
                  type="number" 
                  value={formData.trailingLockProfit}
                  onChange={(e) => handleInputChange("trailingLockProfit", e.target.value)}
                  min="0"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="trailingLockAt" className="text-gray-300">if profit reaches (%)</Label>
                <Input 
                  id="trailingLockAt" 
                  type="number" 
                  value={formData.trailingLockAt}
                  onChange={(e) => handleInputChange("trailingLockAt", e.target.value)}
                  min="0"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Backtesting Settings */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Backtesting Settings</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300 block mb-2">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.backtestStartDate ? (
                    format(formData.backtestStartDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <CalendarComponent
                  mode="single"
                  selected={formData.backtestStartDate}
                  onSelect={(date) => date && handleInputChange("backtestStartDate", date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label className="text-gray-300 block mb-2">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.backtestEndDate ? (
                    format(formData.backtestEndDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <CalendarComponent
                  mode="single"
                  selected={formData.backtestEndDate}
                  onSelect={(date) => date && handleInputChange("backtestEndDate", date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-white"
        >
          Deploy Strategy
        </Button>
      </div>
    </form>
  );
};
