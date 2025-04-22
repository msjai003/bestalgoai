import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useStrategyConfigOptions } from "@/hooks/strategy/useStrategyConfigOptions";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { user } = useAuth();
  
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
    const checkDuplicateAndSuggest = async () => {
      if (!strategyName.trim() || !user) {
        setNameError("");
        setSuggestions([]);
        return;
      }

      try {
        const { data: existingStrategies, error } = await supabase
          .from('custom_strategies')
          .select('name')
          .ilike('name', `%${strategyName}%`);

        if (error) throw error;

        const exactMatch = existingStrategies?.find(
          strategy => strategy.name.toLowerCase() === strategyName.toLowerCase()
        );

        if (exactMatch) {
          setNameError("This strategy name is already taken");
          
          const baseNames = ["MyStrategy", "CustomStrategy", "Strategy"];
          const newSuggestions = baseNames.map(baseName => {
            const random = Math.floor(Math.random() * 1000);
            return `${baseName}_${random}`;
          });
          
          setSuggestions(newSuggestions);
        } else {
          setNameError("");
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error checking strategy names:", error);
        setNameError("");
      }
    };

    const debounceTimer = setTimeout(() => {
      checkDuplicateAndSuggest();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [strategyName, user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrategyName(e.target.value);
    if (e.target.value.trim() === "") {
      setNameError("Strategy name is required");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStrategyName(suggestion);
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
          <div className="mt-2 space-y-2">
            <p className="text-xs text-red-500">{nameError}</p>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Suggested names:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 border-gray-600"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                variant={leg.strategyType === type.value ? "cyan" : "outline"}
                className={`${
                  leg.strategyType === type.value
                    ? ""
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
                  variant={leg.underlying === type.value ? "cyan" : "outline"}
                  className={`${
                    leg.underlying === type.value
                      ? ""
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
                variant={leg.segment === segment.value ? "cyan" : "outline"}
                className={`${
                  leg.segment === segment.value
                    ? ""
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
                  variant={leg.optionType === type.value ? "cyan" : "outline"}
                  className={`${
                    leg.optionType === type.value
                      ? ""
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
                variant={leg.positionType === type.value ? "cyan" : "outline"}
                className={`${
                  leg.positionType === type.value
                    ? ""
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
                variant={leg.expiryType === type.value ? "cyan" : "outline"}
                className={`${
                  leg.expiryType === type.value
                    ? ""
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
