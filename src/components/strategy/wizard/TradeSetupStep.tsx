
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TradeSetupStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  strategyName: string;
  setStrategyName: (name: string) => void;
  isFirstLeg: boolean;
}

export const TradeSetupStep = ({ 
  leg, 
  updateLeg, 
  strategyName, 
  setStrategyName,
  isFirstLeg 
}: TradeSetupStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="strategyName" className="text-gray-300 block mb-2">Strategy Name</Label>
        <Input
          id="strategyName"
          value={strategyName}
          onChange={(e) => setStrategyName(e.target.value)}
          placeholder="Enter strategy name"
          className="bg-gray-700 border-gray-600 text-white"
          disabled={!isFirstLeg}
        />
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Strategy name cannot be changed when adding additional legs
          </p>
        )}
      </div>

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
              disabled={!isFirstLeg}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Strategy type must be consistent across all legs
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instrument" className="text-gray-300 block mb-2">Instrument Selection</Label>
          <Select
            value={leg.instrument}
            onValueChange={(value) => updateLeg({ instrument: value })}
            disabled={!isFirstLeg}
          >
            <SelectTrigger id="instrument" className={`w-full bg-gray-700 border-gray-600 text-white ${!isFirstLeg ? "opacity-75" : ""}`}>
              <SelectValue placeholder="Select Instrument" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-gray-800 border-gray-700 text-white">
              <SelectItem value="NIFTY">NIFTY</SelectItem>
              <SelectItem value="SENSEX">SENSEX</SelectItem>
              <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
              <SelectItem value="FINNIFTY">FIN NIFTY</SelectItem>
            </SelectContent>
          </Select>
          {!isFirstLeg && (
            <p className="text-xs text-gray-400 mt-1">
              Instrument must be consistent across all legs
            </p>
          )}
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
                disabled={!isFirstLeg}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          {!isFirstLeg && (
            <p className="text-xs text-gray-400 mt-1">
              Underlying must be consistent across all legs
            </p>
          )}
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
              disabled={!isFirstLeg}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Button>
          ))}
        </div>
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Segment must be consistent across all legs
          </p>
        )}
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
