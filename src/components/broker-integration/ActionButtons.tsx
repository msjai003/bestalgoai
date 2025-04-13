
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
            variant="default"
            width="full"
            className="font-semibold"
            disabled={true}
          >
            Continue
          </Button>
          <Button
            variant="secondary"
            width="full"
            className="font-semibold mt-3"
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
            variant="default"
            width="full"
            className="font-semibold"
            onClick={handleCredentialsSubmit}
          >
            Continue to Settings
          </Button>
          <Button
            variant="secondary"
            width="full"
            className="font-semibold mt-3"
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
            variant="default"
            width="full"
            className="font-semibold"
            onClick={handleSettingsSubmit}
          >
            Connect Broker
          </Button>
          <Button
            variant="secondary"
            width="full"
            className="font-semibold mt-3"
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
            variant="default"
            width="full"
            className="font-semibold"
            onClick={() => navigate("/settings")}
          >
            Continue
          </Button>
          <Button
            variant="secondary"
            width="full"
            className="font-semibold mt-3"
            onClick={() => navigate("/settings")}
          >
            Cancel
          </Button>
        </>
      );
  }
};
