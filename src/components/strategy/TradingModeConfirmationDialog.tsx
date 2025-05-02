
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

interface TradingModeConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMode: "live" | "paper";
  onConfirm: () => void;
  onCancel: () => void;
  strategyName?: string;
}

export const TradingModeConfirmationDialog = ({
  open,
  onOpenChange,
  targetMode,
  onConfirm,
  onCancel,
  strategyName = "this strategy"
}: TradingModeConfirmationDialogProps) => {
  const isLiveMode = targetMode === "live";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {isLiveMode ? "Enable Live Trading" : "Switch to Paper Trading"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            {isLiveMode 
              ? `Are you sure you want to enable live trading for ${strategyName}? This will use real money for trades.` 
              : `Are you sure you want to switch ${strategyName} to paper trading mode?`
            }
          </DialogDescription>
        </DialogHeader>
        
        {isLiveMode && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-md p-3 my-2">
            <p className="text-yellow-300 text-sm">
              Warning: Live trading uses real money. Make sure you have tested this strategy in paper trading mode first.
            </p>
          </div>
        )}
        
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="secondary" 
            className="text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant={isLiveMode ? "destructive" : "cyan"}
            onClick={onConfirm}
          >
            {isLiveMode ? "Enable Live Trading" : "Switch to Paper Trading"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
