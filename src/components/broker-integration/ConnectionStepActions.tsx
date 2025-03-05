
import { Button } from "@/components/ui/button";
import { ConnectionStep } from "@/types/broker";

interface ConnectionStepActionsProps {
  connectionStep: ConnectionStep;
  onSubmit: () => void;
  onBack: () => void;
}

export const ConnectionStepActions = ({ 
  connectionStep, 
  onSubmit, 
  onBack 
}: ConnectionStepActionsProps) => {
  
  const getButtonText = () => {
    switch (connectionStep) {
      case "credentials":
        return "Continue to Verification";
      case "verification":
        return "Verify & Continue";
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
        className="w-full h-12 bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        onClick={onSubmit}
      >
        {getButtonText()}
      </Button>
      <Button
        variant="outline"
        className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
        onClick={onBack}
      >
        {getBackButtonText()}
      </Button>
    </div>
  );
};
