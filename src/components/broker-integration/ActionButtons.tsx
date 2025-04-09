
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
            variant="gradient"
            size="default"
            className="w-full font-semibold"
            disabled={true}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            size="default"
            className="w-full border border-gray-700 bg-transparent text-white font-semibold"
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
            variant="gradient"
            size="default"
            className="w-full font-semibold"
            onClick={handleCredentialsSubmit}
          >
            Continue to Settings
          </Button>
          <Button
            variant="outline"
            size="default"
            className="w-full border border-gray-700 bg-transparent text-white font-semibold"
            onClick={handleReset}
          >
            Cancel
          </Button>
        </>
      );
    case "settings":
      return (
        <>
          <Button
            variant="gradient"
            size="default"
            className="w-full font-semibold"
            onClick={handleSettingsSubmit}
          >
            Connect Broker
          </Button>
          <Button
            variant="outline"
            size="default"
            className="w-full border border-gray-700 bg-transparent text-white font-semibold"
            onClick={() => setConnectionStep("credentials")}
          >
            Back
          </Button>
        </>
      );
    default:
      return (
        <>
          <Button
            variant="gradient"
            size="default"
            className="w-full font-semibold"
            onClick={() => navigate("/settings")}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            size="default"
            className="w-full border border-gray-700 bg-transparent text-white font-semibold"
            onClick={() => navigate("/settings")}
          >
            Cancel
          </Button>
        </>
      );
  }
};
