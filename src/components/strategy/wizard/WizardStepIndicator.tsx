
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
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= index 
                ? "bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white shadow-md shadow-[#FF00D4]/20" 
                : "bg-gray-800 border border-gray-700 text-gray-400"
            } transition-all duration-300 hover:scale-105`}
          >
            {index + 1}
          </div>
          <div className="text-xs mt-2 text-gray-400">
            {index === 0 ? "Setup" : 
             index === 1 ? "Strike" : 
             index === 2 ? "Risk" : "Review"}
          </div>
        </div>
      ))}
    </div>
  );
};
