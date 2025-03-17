
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
import { Switch } from "@/components/ui/switch";

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
  const [isLiveMode, setIsLiveMode] = React.useState<boolean>(targetMode === "live");

  React.useEffect(() => {
    // Update state when targetMode changes
    setIsLiveMode(targetMode === "live");
  }, [targetMode]);

  const handleModeToggle = (checked: boolean) => {
    setIsLiveMode(checked);
  };

  const handleSubmit = () => {
    if (isLiveMode) {
      onConfirm(); // Live trading
    } else {
      onCancel(); // Paper trading
    }
  };

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
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Trading Mode</p>
              <p className="text-xs text-gray-400">
                Toggle between paper trading and live trading mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isLiveMode ? "text-blue-400 font-medium" : "text-gray-400"}`}>
                Paper
              </span>
              <Switch 
                checked={isLiveMode} 
                onCheckedChange={handleModeToggle} 
                className={`${isLiveMode ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-gray-600'}`}
              />
              <span className={`text-sm ${isLiveMode ? "text-pink-400 font-medium" : "text-gray-400"}`}>
                Live
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${isLiveMode ? 'bg-pink-950/20 border-pink-900/50' : 'bg-blue-950/20 border-blue-900/50'}`}>
            <p className={`text-sm font-medium ${isLiveMode ? 'text-pink-400' : 'text-blue-400'}`}>
              {isLiveMode ? 'Live Trading Warning' : 'Paper Trading Info'}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {isLiveMode 
                ? 'Live trading uses real funds. All trades will be executed with your actual money.'
                : 'Paper trading uses simulated funds. No real money will be used.'}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className={isLiveMode 
              ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" 
              : "bg-blue-600 hover:bg-blue-700"}
          >
            Confirm {isLiveMode ? 'Live' : 'Paper'} Trading
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
