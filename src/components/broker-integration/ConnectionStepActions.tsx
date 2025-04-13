
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
        variant="default"
        width="full"
        className="font-semibold"
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
        variant="secondary"
        width="full"
        className="font-semibold"
        onClick={onBack}
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {getBackButtonText()}
      </Button>
    </div>
  );
};
