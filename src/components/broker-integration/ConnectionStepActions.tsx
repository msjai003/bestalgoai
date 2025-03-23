
import { Button } from "@/components/ui/button";
import { ConnectionStep } from "@/types/broker";
import { Loader2 } from "lucide-react";

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
        className="w-full h-12 rounded-xl font-semibold"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          getButtonText()
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
        onClick={onBack}
        disabled={isSubmitting}
      >
        {getBackButtonText()}
      </Button>
    </div>
  );
};
