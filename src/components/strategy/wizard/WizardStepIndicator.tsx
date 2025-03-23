
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
    <div className="flex justify-between mb-8 relative">
      {/* Connection line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 -z-10"></div>
      
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep >= index;
        const isCompleted = currentStep > index;
        
        return (
          <div key={index} className="flex flex-col items-center z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isActive 
                  ? "bg-gradient-to-br from-cyan to-cyan/80 text-charcoalPrimary shadow-lg shadow-cyan/20" 
                  : "bg-gradient-to-br from-charcoalSecondary to-charcoalPrimary border border-gray-700 text-gray-400"
              }`}
            >
              <StepIcon className="h-5 w-5" />
            </div>
            <div className={`text-xs mt-2 font-medium ${isActive ? "text-cyan" : "text-gray-400"}`}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
