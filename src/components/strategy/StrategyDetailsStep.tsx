import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { strategies, strategyDescriptions } from "@/constants/strategy";
import { FormData, StrategyCategory, StrategyType } from "@/types/strategy";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const renderStrategyDetails = () => (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6">
        <div>
          <h4 className="text-white font-medium mb-2">Strategy Type</h4>
          <p className="text-gray-300">{strategyType === "predefined" ? "Predefined Strategy" : "Custom Strategy"}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Strategy Name</h4>
          <p className="text-gray-300">{formData.strategy}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Description</h4>
          <p className="text-gray-300">{formData.strategyDescription}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Position</h4>
          <p className="text-gray-300">{formData.position}</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Target</h4>
          <p className="text-gray-300">{formData.target}%</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Stop Loss</h4>
          <p className="text-gray-300">{formData.stoploss}%</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Broker</h4>
          <p className="text-gray-300">{formData.broker}</p>
        </div>
      </div>
    </ScrollArea>
  );

  if (strategyType === "predefined") {
    if (!selectedCategory) {
      return (
        <div className="space-y-6">
          <h3 className="text-white font-medium">Select Strategy Category</h3>
          <div className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="h-14 w-full bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("intraday")}
            >
              Intraday
            </Button>
            <Button
              variant="outline"
              className="h-14 w-full bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("btst")}
            >
              BTST
            </Button>
            <Button
              variant="outline"
              className="h-14 w-full bg-gray-800 border-gray-700 text-white"
              onClick={() => onCategorySelect("positional")}
            >
              Positional
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-white font-medium">Select Strategy</Label>
          <Select 
            value={formData.strategy} 
            onValueChange={(value) => {
              onInputChange("strategy", value);
              onInputChange("strategyDescription", strategyDescriptions[value as keyof typeof strategyDescriptions] || "");
              // Set default values when strategy is selected
              onInputChange("position", "Buy");
              onInputChange("quantity", "75");
              onInputChange("target", "20");
              onInputChange("stoploss", "20");
              onInputChange("broker", "Aliceblue");
            }}
          >
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white mt-2">
              <SelectValue placeholder="Choose strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies[selectedCategory].map(strategy => (
                <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.strategy && renderStrategyDetails()}
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
