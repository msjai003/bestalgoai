
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { StrategyLeg } from "@/types/strategy-wizard";

interface InstrumentSelectorProps {
  isLoading: boolean;
  instrumentOptions: Array<{ id: string; value: string; display_name: string }>;
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  isFirstLeg: boolean;
}

export const InstrumentSelector = ({
  isLoading,
  instrumentOptions,
  leg,
  updateLeg,
  isFirstLeg
}: InstrumentSelectorProps) => {
  return (
    <div>
      <Label htmlFor="instrument" className="text-gray-300 block mb-2">
        Instrument Selection
      </Label>
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
          <SelectTrigger
            id="instrument"
            className={`w-full bg-gray-700 border-gray-600 text-white ${
              !isFirstLeg ? "opacity-75" : ""
            }`}
          >
            <SelectValue placeholder="Select Instrument" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-gray-800 border-gray-700 text-white">
            {instrumentOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.value}>
                {opt.display_name}
              </SelectItem>
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
  );
};
