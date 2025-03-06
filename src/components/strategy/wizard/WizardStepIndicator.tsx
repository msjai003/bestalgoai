
import { WizardStep } from "@/types/strategy-wizard";

interface WizardStepIndicatorProps {
  currentStep: WizardStep;
}

export const WizardStepIndicator = ({ currentStep }: WizardStepIndicatorProps) => {
  return (
    <div className="flex justify-between mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= index 
                ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {index + 1}
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {index === 0 ? "Setup" : 
             index === 1 ? "Strike" : 
             index === 2 ? "Risk" : "Review"}
          </div>
        </div>
      ))}
    </div>
  );
};
