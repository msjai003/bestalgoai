
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
          variant="outline" 
          onClick={onPrevious}
          className="bg-charcoalSecondary border-gray-600 text-white hover:bg-charcoalSecondary/70 hover:border-cyan/30 rounded-xl px-5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      
      {currentStep < WizardStep.CONFIRMATION && (
        <Button 
          onClick={onNext}
          className="ml-auto bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl px-5 hover:shadow-cyan/30 hover:shadow-md"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {currentStep === WizardStep.CONFIRMATION && (
        <Button 
          onClick={onNext}
          className="ml-auto bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl px-5 hover:shadow-cyan/30 hover:shadow-md"
        >
          <InfoIcon className="mr-2 h-4 w-4" />
          Strategy Details
        </Button>
      )}
    </div>
  );
};
