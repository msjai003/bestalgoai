
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
            Select Trading Mode
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your preferred trading mode for this strategy
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 my-4">
          <Button 
            variant="outline" 
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 h-16 flex flex-col"
            onClick={onCancel}
          >
            <span className="text-sm font-medium">Paper Trading</span>
            <span className="text-xs text-gray-400">Uses simulated funds</span>
          </Button>
          <Button 
            variant="destructive"
            className="h-16 flex flex-col"
            onClick={onConfirm}
          >
            <span className="text-sm font-medium">Live Trading</span>
            <span className="text-xs">Uses real funds</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
