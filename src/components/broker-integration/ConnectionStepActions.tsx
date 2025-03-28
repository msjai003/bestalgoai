
import { Button } from "@/components/ui/button";
import { ConnectionStep } from "@/types/broker";
import { ArrowLeft, ArrowRight, Loader2, Link2 } from "lucide-react";

interface ConnectionStepActionsProps {
  connectionStep: ConnectionStep;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const ConnectionStepActions = ({ 
  connectionStep, 
  onSubmit, 
  onBack,
  isSubmitting = false
}: ConnectionStepActionsProps) => {
  
  const getButtonText = () => {
    switch (connectionStep) {
      case "credentials":
        return "Continue to Settings";
      case "settings":
        return "Connect Broker";
      default:
        return "Continue";
    }
  };

  const getBackButtonText = () => {
    if (connectionStep === "credentials") {
      return "Back to Broker Selection";
    }
    return "Back";
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="gradient"
        size="sm"
        className="w-full rounded-xl font-semibold bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary hover:shadow-cyan/30 hover:shadow-lg transition-all duration-300"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            {connectionStep === "settings" ? (
              <Link2 className="mr-2 h-4 w-4" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            <span>{getButtonText()}</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full border border-gray-700 bg-charcoalSecondary text-white rounded-xl font-semibold hover:border-cyan/30 transition-all duration-300"
        onClick={onBack}
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {getBackButtonText()}
      </Button>
    </div>
  );
};
