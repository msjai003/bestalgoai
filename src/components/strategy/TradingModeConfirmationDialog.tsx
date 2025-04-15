
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Zap } from "lucide-react";

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
            {targetMode === "live" ? (
              <>
                <Zap className="h-5 w-5 text-yellow-500" />
                Switch to Live Trading
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-blue-400" />
                Switch to Paper Trading
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {targetMode === "live" ? (
              <>
                Are you sure you want to switch to <span className="font-semibold text-green-400">live trading</span>? 
                You'll need to set up quantity and broker details next.
              </>
            ) : (
              <>
                Are you sure you want to switch to <span className="font-semibold text-cyan">paper trading</span> mode? 
                No real funds will be used, but the strategy will continue to generate signals.
              </>
            )}
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
            variant="cyan"
            className="text-charcoalPrimary"
            onClick={onConfirm}
          >
            {targetMode === "live" ? "Continue to Setup" : "Switch to Paper Trading"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
