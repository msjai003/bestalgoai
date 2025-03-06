
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TradingModeConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMode: "live" | "paper" | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TradingModeConfirmationDialog = ({
  open,
  onOpenChange,
  targetMode,
  onConfirm,
  onCancel,
}: TradingModeConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Trading Mode Change
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {targetMode === "live" 
              ? "Are you sure you want to switch to live trading? This will use real funds for trading operations."
              : "Are you sure you want to switch to paper trading? This will use simulated funds for trading operations."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="secondary" 
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant={targetMode === "live" ? "destructive" : "default"}
            className={targetMode === "live" ? "" : "bg-blue-600 hover:bg-blue-700"}
            onClick={onConfirm}
          >
            {targetMode === "live" ? "Yes, Enable Live Trading" : "Yes, Switch to Paper Trading"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
