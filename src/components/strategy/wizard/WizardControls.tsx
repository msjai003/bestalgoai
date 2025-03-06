
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardStep } from "@/types/strategy-wizard";

interface WizardControlsProps {
  currentStep: WizardStep;
  onPrevious: () => void;
  onNext: () => void;
}

export const WizardControls = ({ 
  currentStep,
  onPrevious,
  onNext
}: WizardControlsProps) => {
  return (
    <div className="flex justify-between pt-4">
      {currentStep > 0 && (
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      
      {currentStep < WizardStep.CONFIRMATION && (
        <Button 
          onClick={onNext}
          className="ml-auto bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {currentStep === WizardStep.CONFIRMATION && (
        <Button 
          onClick={onNext}
          className="ml-auto bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
        >
          Strategy Details
        </Button>
      )}
    </div>
  );
};
