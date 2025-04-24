
import React from "react";
import { Button } from "@/components/ui/button";
import { WizardFormData } from "@/types/strategy-wizard";
import { Save, Plus } from "lucide-react";

interface ConfirmationStepProps {
  formData: WizardFormData;
  onSelectLeg: (index: number) => void;
  onAddLeg: () => void;
  strategyName: string;
  updateLegByIndex: (index: number, updates: any) => void;
  onShowStrategyDetails: () => void;
}

export const ConfirmationStep = ({
  formData,
  onSelectLeg,
  onAddLeg,
  strategyName,
  updateLegByIndex,
  onShowStrategyDetails
}: ConfirmationStepProps) => {
  const onSave = () => {
    // Handle the save action here
    console.log("Saving leg", formData.currentLegIndex);
    onShowStrategyDetails();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Strategy Confirmation</h3>
        <p className="text-gray-400 text-sm">
          Review your strategy details before finalizing
        </p>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
        <h4 className="text-cyan font-medium mb-3">Strategy Name</h4>
        <p className="text-white">{strategyName}</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-cyan font-medium">Strategy Legs</h4>
        
        {formData.legs.map((leg, index) => (
          <div
            key={leg.id}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 cursor-pointer hover:border-cyan/30 transition-all"
            onClick={() => onSelectLeg(index)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">
                  Leg {index + 1}: {leg.positionType} {leg.segment} {leg.instrument}
                </p>
                <p className="text-gray-400 text-sm">
                  {leg.strategyType} {leg.segment === "options" ? leg.optionType : ""}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLeg(index);
                }}
                className="bg-gray-700 border-gray-600 text-white hover:text-cyan hover:border-cyan/50"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button 
          variant="secondary" 
          size="xl" 
          onClick={onAddLeg}
          className="w-full bg-gray-800 border border-cyan/30 text-cyan hover:text-white hover:border-cyan hover:bg-gray-700/60 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Another Leg
        </Button>

        <Button 
          variant="secondary" 
          size="xl" 
          onClick={onSave}
          className="w-full mt-3 bg-gray-800 border border-cyan/30 text-cyan hover:text-white hover:border-cyan hover:bg-gray-700/60 rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          <Save className="h-5 w-5 mr-2" /> Save Leg
        </Button>
      </div>
    </div>
  );
};
