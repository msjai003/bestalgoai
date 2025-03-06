
// No changes needed here since the component already handles the selected segment properly.
// The UI will automatically show the selected segment based on the leg.segment value.

import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TradeSetupStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
}

export const TradeSetupStep = ({ leg, updateLeg }: TradeSetupStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Strategy Type Selection</h4>
        <div className="grid grid-cols-3 gap-2">
          {["intraday", "btst", "positional"].map((type) => (
            <Button
              key={type}
              variant={leg.strategyType === type ? "default" : "outline"}
              className={`${
                leg.strategyType === type
                  ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
              onClick={() => updateLeg({ strategyType: type as any })}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instrument" className="text-gray-300 block mb-2">Instrument Selection</Label>
          <Select
            value={leg.instrument}
            onValueChange={(value) => updateLeg({ instrument: value })}
          >
            <SelectTrigger id="instrument" className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select Instrument" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-gray-800 border-gray-700 text-white">
              <SelectItem value="NIFTY">NIFTY</SelectItem>
              <SelectItem value="SENSEX">SENSEX</SelectItem>
              <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
              <SelectItem value="FINNIFTY">FIN NIFTY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Underlying Selection</h4>
          <div className="grid grid-cols-2 gap-2">
            {["cash", "futures"].map((type) => (
              <Button
                key={type}
                variant={leg.underlying === type ? "default" : "outline"}
                className={`${
                  leg.underlying === type
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ underlying: type as any })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Select Segments</h4>
        <div className="grid grid-cols-2 gap-2">
          {["futures", "options"].map((segment) => (
            <Button
              key={segment}
              variant={leg.segment === segment ? "default" : "outline"}
              className={`${
                leg.segment === segment
                  ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
              onClick={() => updateLeg({ segment: segment as any })}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {leg.segment === "options" && (
        <div>
          <h4 className="text-white font-medium mb-2">Option Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {["call", "put"].map((type) => (
              <Button
                key={type}
                variant={leg.optionType === type ? "default" : "outline"}
                className={`${
                  leg.optionType === type
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ optionType: type as any })}
              >
                {type === "call" ? "Call (CE)" : "Put (PE)"}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-white font-medium mb-2">Position Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {["buy", "sell"].map((type) => (
            <Button
              key={type}
              variant={leg.positionType === type ? "default" : "outline"}
              className={`${
                leg.positionType === type
                  ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
              onClick={() => updateLeg({ positionType: type as any })}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Expiry Type Selection</h4>
        <div className="grid grid-cols-2 gap-2">
          {["weekly", "monthly"].map((type) => (
            <Button
              key={type}
              variant={leg.expiryType === type ? "default" : "outline"}
              className={`${
                leg.expiryType === type
                  ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
              onClick={() => updateLeg({ expiryType: type as any })}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
