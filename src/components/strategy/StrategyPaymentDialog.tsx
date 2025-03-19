
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Strategy } from "@/hooks/strategy/types";

interface StrategyPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy;
}

export const StrategyPaymentDialog: React.FC<StrategyPaymentDialogProps> = ({
  open,
  onOpenChange,
  strategy
}) => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    onOpenChange(false);
    // Pass strategy ID to subscription page to track which strategy to unlock
    navigate(`/subscription?strategyId=${strategy.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Upgrade Required</DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            This premium strategy requires a subscription to access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">{strategy.name}</h4>
            <p className="text-sm text-gray-300">
              Unlock powerful trading features with our premium subscription plan.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-700/50">
            <h4 className="font-semibold text-white flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Premium Benefits
              </span>
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Access to all premium strategies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Advanced backtesting capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Priority customer support
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border border-gray-700"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgradeClick}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
