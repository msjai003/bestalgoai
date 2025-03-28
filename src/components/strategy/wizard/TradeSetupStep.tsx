
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useStrategyConfigOptions } from "@/hooks/strategy/useStrategyConfigOptions";
import { RefreshCw } from "lucide-react";

interface TradeSetupStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  strategyName: string;
  setStrategyName: (name: string) => void;
  isFirstLeg: boolean;
  isDuplicateName?: boolean;
}

export const TradeSetupStep = ({ 
  leg, 
  updateLeg, 
  strategyName, 
  setStrategyName,
  isFirstLeg,
  isDuplicateName = false
}: TradeSetupStepProps) => {
  const [nameError, setNameError] = useState<string>("");
  
  // Fetch config options from the database
  const { 
    options, 
    isLoading,
    getOptionsByCategory 
  } = useStrategyConfigOptions();

  const instrumentOptions = getOptionsByCategory('instrument');
  const underlyingOptions = getOptionsByCategory('underlying');
  const segmentOptions = getOptionsByCategory('segment');
  const optionTypeOptions = getOptionsByCategory('optionType');
  const positionTypeOptions = getOptionsByCategory('positionType');
  const expiryTypeOptions = getOptionsByCategory('expiryType');
  const strategyTypeOptions = getOptionsByCategory('strategyType');

  useEffect(() => {
    if (isFirstLeg && strategyName.trim() === "") {
      setNameError("Strategy name is required");
    } else if (isDuplicateName) {
      setNameError("A strategy with this name already exists");
    } else {
      setNameError("");
    }
  }, [strategyName, isFirstLeg, isDuplicateName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrategyName(e.target.value);
    if (e.target.value.trim() === "") {
      setNameError("Strategy name is required");
    } else {
      // Only check for duplicate if not empty - the useEffect will handle the duplicate check
      setNameError("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="strategyName" className="text-gray-300 block mb-2">
          Strategy Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="strategyName"
          value={strategyName}
          onChange={handleNameChange}
          placeholder="Enter strategy name"
          className={`bg-gray-700 border-gray-600 text-white ${nameError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          disabled={!isFirstLeg}
          required
        />
        {nameError && (
          <p className="text-xs text-red-500 mt-1">{nameError}</p>
        )}
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Strategy name cannot be changed when adding additional legs
          </p>
        )}
      </div>

      <div>
        <h4 className="text-white font-medium mb-4">Strategy Type Selection</h4>
        {isLoading ? (
          <div className="flex justify-center my-4">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {strategyTypeOptions.map((type) => (
              <Button
                key={type.value}
                variant={leg.strategyType === type.value ? "default" : "outline"}
                className={`${
                  leg.strategyType === type.value
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ strategyType: type.value as any })}
                disabled={!isFirstLeg}
              >
                {type.display_name}
              </Button>
            ))}
          </div>
        )}
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Strategy type must be consistent across all legs
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instrument" className="text-gray-300 block mb-2">Instrument Selection</Label>
          {isLoading ? (
            <div className="flex items-center h-10 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Loading...
            </div>
          ) : (
            <Select
              value={leg.instrument}
              onValueChange={(value) => updateLeg({ instrument: value })}
              disabled={!isFirstLeg}
            >
              <SelectTrigger id="instrument" className={`w-full bg-gray-700 border-gray-600 text-white ${!isFirstLeg ? "opacity-75" : ""}`}>
                <SelectValue placeholder="Select Instrument" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-gray-800 border-gray-700 text-white">
                {instrumentOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>{opt.display_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!isFirstLeg && (
            <p className="text-xs text-gray-400 mt-1">
              Instrument must be consistent across all legs
            </p>
          )}
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Underlying Selection</h4>
          {isLoading ? (
            <div className="flex justify-center my-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {underlyingOptions.map((type) => (
                <Button
                  key={type.value}
                  variant={leg.underlying === type.value ? "default" : "outline"}
                  className={`${
                    leg.underlying === type.value
                      ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                      : "bg-gray-700 border-gray-600 text-white"
                  }`}
                  onClick={() => updateLeg({ underlying: type.value as any })}
                  disabled={!isFirstLeg}
                >
                  {type.display_name}
                </Button>
              ))}
            </div>
          )}
          {!isFirstLeg && (
            <p className="text-xs text-gray-400 mt-1">
              Underlying must be consistent across all legs
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Select Segments</h4>
        {isLoading ? (
          <div className="flex justify-center my-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {segmentOptions.map((segment) => (
              <Button
                key={segment.value}
                variant={leg.segment === segment.value ? "default" : "outline"}
                className={`${
                  leg.segment === segment.value
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ segment: segment.value as any })}
                disabled={!isFirstLeg}
              >
                {segment.display_name}
              </Button>
            ))}
          </div>
        )}
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Segment must be consistent across all legs
          </p>
        )}
      </div>

      {leg.segment === "options" && (
        <div>
          <h4 className="text-white font-medium mb-2">Option Type</h4>
          {isLoading ? (
            <div className="flex justify-center my-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {optionTypeOptions.map((type) => (
                <Button
                  key={type.value}
                  variant={leg.optionType === type.value ? "default" : "outline"}
                  className={`${
                    leg.optionType === type.value
                      ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                      : "bg-gray-700 border-gray-600 text-white"
                  }`}
                  onClick={() => updateLeg({ optionType: type.value as any })}
                >
                  {type.display_name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h4 className="text-white font-medium mb-2">Position Type</h4>
        {isLoading ? (
          <div className="flex justify-center my-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {positionTypeOptions.map((type) => (
              <Button
                key={type.value}
                variant={leg.positionType === type.value ? "default" : "outline"}
                className={`${
                  leg.positionType === type.value
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ positionType: type.value as any })}
              >
                {type.display_name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Expiry Type Selection</h4>
        {isLoading ? (
          <div className="flex justify-center my-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {expiryTypeOptions.map((type) => (
              <Button
                key={type.value}
                variant={leg.expiryType === type.value ? "default" : "outline"}
                className={`${
                  leg.expiryType === type.value
                    ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ expiryType: type.value as any })}
              >
                {type.display_name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
