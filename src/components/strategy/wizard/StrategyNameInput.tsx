
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface StrategyNameInputProps {
  strategyName: string;
  setStrategyName: (name: string) => void;
  isFirstLeg: boolean;
}

export const StrategyNameInput = ({ 
  strategyName, 
  setStrategyName, 
  isFirstLeg 
}: StrategyNameInputProps) => {
  const [nameError, setNameError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { user } = useAuth();

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
  );
};
