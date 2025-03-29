
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, GaugeCircle, Rocket } from "lucide-react";

interface DeploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeployStrategy: (mode: "paper" | "real") => void;
  strategyName: string;
}

export const DeploymentDialog = ({
  open,
  onOpenChange,
  onDeployStrategy,
  strategyName
}: DeploymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalPrimary text-white max-w-[90%] max-h-[90vh] border border-cyan/20">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Select Trading Mode
          </DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <p className="text-center text-gray-300 mb-4">
            Choose how you want to deploy <span className="font-semibold text-white">{strategyName}</span>
          </p>
        </div>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div 
              className="bg-charcoalSecondary/30 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-all cursor-pointer transform hover:translate-y-[-2px] hover:shadow-lg"
              onClick={() => onDeployStrategy("paper")}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <GaugeCircle size={36} className="text-cyan animate-pulse-slow" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Paper Trading</h4>
                  <p className="text-gray-400 text-sm">
                    Test your strategy with virtual money. No real trades will be executed.
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-charcoalSecondary/30 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-all cursor-pointer transform hover:translate-y-[-2px] hover:shadow-lg"
              onClick={() => onDeployStrategy("real")}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Rocket size={36} className="text-cyan animate-zenflow" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Live Trading</h4>
                  <p className="text-gray-400 text-sm">
                    Execute real trades with your actual funds. Requires broker integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
