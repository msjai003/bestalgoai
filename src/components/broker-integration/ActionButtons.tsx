
import { Button } from "@/components/ui/button";
import { ConnectionStep } from "@/types/broker";

interface ActionButtonsProps {
  connectionStep: ConnectionStep;
  handleCredentialsSubmit: () => void;
  handleSettingsSubmit: () => void;
  handleReset: () => void;
  navigate: (path: string) => void;
  setConnectionStep: (step: ConnectionStep) => void;
}

export const ActionButtons = ({
  connectionStep,
  handleCredentialsSubmit,
  handleSettingsSubmit,
  handleReset,
  navigate,
  setConnectionStep,
}: ActionButtonsProps) => {
  switch (connectionStep) {
    case "selection":
      return (
        <>
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
            disabled={true}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
            onClick={() => navigate("/settings")}
          >
            Cancel
          </Button>
        </>
      );
    case "credentials":
      return (
        <>
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
            onClick={handleCredentialsSubmit}
          >
            Continue to Verification
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
            onClick={handleReset}
          >
            Cancel
          </Button>
        </>
      );
    case "verification":
      return (
        <>
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
            onClick={handleCredentialsSubmit}
          >
            Verify & Continue
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
            onClick={() => setConnectionStep("credentials")}
          >
            Back
          </Button>
        </>
      );
    case "settings":
      return (
        <>
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
            onClick={handleSettingsSubmit}
          >
            Connect Broker
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
            onClick={() => setConnectionStep("verification")}
          >
            Back
          </Button>
        </>
      );
    default:
      return (
        <>
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
            onClick={() => navigate("/settings")}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
            onClick={() => navigate("/settings")}
          >
            Cancel
          </Button>
        </>
      );
  }
};
