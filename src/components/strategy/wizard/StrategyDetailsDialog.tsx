
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WizardFormData } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Rocket } from "lucide-react";

interface StrategyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: WizardFormData;
  strategyName: string;
  onShowDeploymentDialog: () => void;
}

export const StrategyDetailsDialog = ({
  open,
  onOpenChange,
  formData,
  strategyName,
  onShowDeploymentDialog
}: StrategyDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalPrimary text-white max-w-[90%] max-h-[90vh] border border-cyan/20">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Strategy Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="bg-charcoalSecondary/30 p-4 rounded-lg border border-cyan/10">
              <h3 className="text-lg font-medium text-white mb-2">{strategyName}</h3>
              <p className="text-gray-400 text-sm">
                {formData.legs[0].strategyType === "intraday" ? "Intraday" : 
                 formData.legs[0].strategyType === "positional" ? "Positional" : 
                 "BTST"} strategy with {formData.legs.length} leg{formData.legs.length > 1 ? "s" : ""}
              </p>
            </div>
            
            {formData.legs.map((leg, index) => (
              <div key={leg.id} className="bg-charcoalSecondary/30 p-4 rounded-lg border border-cyan/10">
                <h4 className="text-cyan font-medium mb-3">Leg {index + 1}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Instrument</span>
                    <p className="text-white">{leg.instrument}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Segment</span>
                    <p className="text-white capitalize">{leg.segment}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Position</span>
                    <p className="text-white capitalize">{leg.positionType}</p>
                  </div>
                  {leg.segment === "options" && (
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">Option Type</span>
                      <p className="text-white capitalize">{leg.optionType}</p>
                    </div>
                  )}
                </div>
                
                {leg.segment === "options" && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">Expiry</span>
                      <p className="text-white capitalize">{leg.expiryType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">Strike Selection</span>
                      <p className="text-white">{leg.strikeCriteria === "strike" ? leg.strikeLevel : "Premium Based"}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Entry Time</span>
                    <p className="text-white">{leg.entryTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Exit Time</span>
                    <p className="text-white">{leg.exitTime}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Stop Loss</span>
                    <p className="text-white">{leg.stopLoss}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block mb-1">Target</span>
                    <p className="text-white">{leg.target}%</p>
                  </div>
                </div>
                
                {leg.trailingEnabled && (
                  <div className="mt-3 bg-cyan/5 p-2 rounded border border-cyan/10">
                    <span className="text-gray-300 text-xs block mb-1">Trailing Settings</span>
                    <p className="text-white text-sm">
                      Lock {leg.trailingLockProfit}% profit if P&L reaches {leg.trailingLockAt}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4">
          <Button 
            onClick={onShowDeploymentDialog}
            className="w-full bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary hover:shadow-cyan/30 hover:shadow-lg"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Strategy
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
