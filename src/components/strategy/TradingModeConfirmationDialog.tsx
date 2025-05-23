
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface TradingModeConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMode: "live trade" | "paper trade" | "live" | "paper";
  onConfirm: () => void;
  onCancel: () => void;
  strategyName?: string | null;
  brokerName?: string | null;
}

export const TradingModeConfirmationDialog = ({
  open,
  onOpenChange,
  targetMode,
  onConfirm,
  onCancel,
  strategyName,
  brokerName,
}: TradingModeConfirmationDialogProps) => {
  // Normalize targetMode to ensure it works with both formats
  const normalizedMode = targetMode.includes("trade") 
    ? targetMode 
    : targetMode === "live" 
      ? "live trade" 
      : "paper trade";
  
  const isLiveMode = normalizedMode === "live trade";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLiveMode
              ? "Enable Live Trading"
              : "Switch to Paper Trading"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {isLiveMode && (
            <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-900/20 border border-yellow-700/30">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium">Important</p>
                <p className="text-sm text-yellow-200/80">
                  You are about to enable live trading with real money for <span className="font-bold">{strategyName || 'this strategy'}</span>. 
                  Please ensure your broker settings are correct.
                </p>
              </div>
            </div>
          )}
          
          <DialogDescription className="text-gray-400">
            {isLiveMode
              ? `Are you sure you want to enable live trading for ${strategyName || "this strategy"}?`
              : `Switch ${strategyName || "this strategy"} back to paper trading mode?`}
              
            {brokerName && isLiveMode && (
              <p className="mt-2 text-cyan">
                Using broker: {brokerName}
              </p>
            )}
          </DialogDescription>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="secondary" 
            className="text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="cyan"
            onClick={onConfirm}
          >
            {isLiveMode ? "Enable Live Trading" : "Switch to Paper"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
