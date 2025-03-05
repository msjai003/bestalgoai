
import { Check, Plug, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Broker, BrokerPermissions } from "@/types/broker";

interface SuccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBroker: Broker | null;
  selectedAccount: string;
  permissions: BrokerPermissions;
  onComplete: () => void;
}

export const SuccessDialog = ({
  open,
  setOpen,
  selectedBroker,
  selectedAccount,
  permissions,
  onComplete,
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Submission Received
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Thank you for your submission. We have successfully recorded your details, and our technical team will be in touch with you shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-900 rounded-lg p-4 mt-2">
          <div className="flex items-center mb-3">
            {selectedBroker && (
              <img
                src={selectedBroker.logo}
                className="w-8 h-8 rounded-md mr-3"
                alt={selectedBroker.name}
              />
            )}
            <div>
              <h4 className="font-medium">{selectedBroker?.name}</h4>
              <p className="text-sm text-gray-400">{selectedAccount}</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="bg-green-900/50 text-green-500 text-xs px-2 py-1 rounded">
                Pending
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p className="flex items-center gap-1">
              <Plug className="w-3 h-3" /> Request submitted at {new Date().toLocaleTimeString()}
            </p>
            <p className="flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3" /> {permissions.trading
                ? "Trading access requested"
                : "Read-only access requested"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-3">
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500"
            onClick={onComplete}
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
