
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
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
          variant="secondary" 
          onClick={onPrevious}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      
      {currentStep < WizardStep.CONFIRMATION && (
        <Button 
          variant="default"
          onClick={onNext}
          className="ml-auto"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {currentStep === WizardStep.CONFIRMATION && (
        <Button 
          variant="default"
          onClick={onNext}
          className="ml-auto"
        >
          <InfoIcon className="mr-2 h-4 w-4" />
          Strategy Details
        </Button>
      )}
    </div>
  );
};
