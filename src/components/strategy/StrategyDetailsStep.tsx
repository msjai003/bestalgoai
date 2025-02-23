
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { strategies, strategyDescriptions } from "@/constants/strategy";
import { FormData, StrategyCategory, StrategyType } from "@/types/strategy";

interface StrategyDetailsStepProps {
  strategyType: StrategyType;
  selectedCategory: StrategyCategory | null;
  formData: FormData;
  onCategorySelect: (category: StrategyCategory) => void;
  onInputChange: (field: string, value: string) => void;
}

export const StrategyDetailsStep = ({
  strategyType,
  selectedCategory,
  formData,
  onCategorySelect,
  onInputChange,
}: StrategyDetailsStepProps) => {
  if (strategyType === "predefined") {
    if (!selectedCategory) {
      return (
        <div className="space-y-6">
          <h3 className="text-white font-medium">Select Strategy Category</h3>
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="h-16 bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("intraday")}
            >
              Intraday
            </Button>
            <Button
              variant="outline"
              className="h-16 bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("btst")}
            >
              BTST
            </Button>
            <Button
              variant="outline"
              className="h-16 bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("positional")}
            >
              Positional
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Select Strategy</Label>
          <Select 
            value={formData.strategy} 
            onValueChange={(value) => {
              onInputChange("strategy", value);
              onInputChange("strategyDescription", strategyDescriptions[value as keyof typeof strategyDescriptions] || "");
            }}
          >
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Choose strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies[selectedCategory].map(strategy => (
                <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.strategyDescription && (
          <div className="space-y-2">
            <Label className="text-gray-300">Strategy Details</Label>
            <Textarea
              value={formData.strategyDescription}
              readOnly
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Strategy Name</Label>
        <Input
          value={formData.strategy}
          onChange={(e) => onInputChange("strategy", e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="Enter strategy name"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Strategy Description</Label>
        <Textarea
          value={formData.strategyDescription}
          onChange={(e) => onInputChange("strategyDescription", e.target.value)}
          className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
          placeholder="Describe your strategy..."
        />
      </div>
    </div>
  );
};
