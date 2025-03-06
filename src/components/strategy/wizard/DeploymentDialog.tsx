
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeployStrategy: (mode: "paper" | "real") => void;
}

export const DeploymentDialog = ({
  open,
  onOpenChange,
  onDeployStrategy,
}: DeploymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Select Deployment Mode</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Would you like to deploy in Paper Trade mode or Real Mode?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onDeployStrategy("paper")}
            className="h-24 w-full flex flex-col items-center justify-center bg-gray-700 border-gray-600 text-white hover:bg-gray-600 rounded-xl"
          >
            <span className="text-lg mb-1">📝</span>
            <span className="text-base font-medium">Paper Trade</span>
            <span className="text-xs text-gray-400 mt-1 text-center w-full px-3">Simulation Only</span>
          </Button>
          <Button 
            onClick={() => onDeployStrategy("real")}
            className="h-24 w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70 rounded-xl"
          >
            <span className="text-lg mb-1">💰</span>
            <span className="text-base font-medium">Real Mode</span>
            <span className="text-xs text-gray-200 mt-1 text-center w-full px-3">Live Execution</span>
          </Button>
        </div>
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-gray-300 text-sm">
          <p>Real Mode will execute actual trades based on your configured strategy. Please ensure your brokerage account is connected and properly configured.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
