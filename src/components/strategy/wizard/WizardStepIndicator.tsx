
import { WizardStep } from "@/types/strategy-wizard";
import { FileText, SlidersHorizontal, Check, Zap } from "lucide-react";

interface WizardStepIndicatorProps {
  currentStep: WizardStep;
}

export const WizardStepIndicator = ({ currentStep }: WizardStepIndicatorProps) => {
  const steps = [
    { label: "Setup", icon: Zap },
    { label: "Strike", icon: SlidersHorizontal },
    { label: "Risk", icon: FileText },
    { label: "Review", icon: Check }
  ];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep >= index;
        
        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive 
                  ? "bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary shadow-md shadow-cyan/20" 
                  : "bg-charcoalSecondary border border-gray-700 text-gray-400"
              } transition-all duration-300`}
            >
              <StepIcon className="h-5 w-5" />
            </div>
            <div className={`text-xs mt-2 ${isActive ? "text-cyan" : "text-gray-400"}`}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
