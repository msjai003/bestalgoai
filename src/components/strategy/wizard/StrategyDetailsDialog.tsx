
import { StrategyLeg, WizardFormData } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  onShowDeploymentDialog,
}: StrategyDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {strategyName || "Strategy"} Details
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Summary of all configured legs and settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {formData.legs.map((leg, index) => (
              <StrategyLegSummary key={leg.id} leg={leg} index={index} />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex flex-row justify-end items-center mt-6 gap-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 rounded-xl h-11 px-5"
          >
            Back to Edit
          </Button>
          <Button 
            onClick={onShowDeploymentDialog}
            className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70 rounded-xl h-11 px-5"
          >
            Deploy Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface StrategyLegSummaryProps {
  leg: StrategyLeg;
  index: number;
}

const StrategyLegSummary = ({ leg, index }: StrategyLegSummaryProps) => {
  return (
    <div className="p-4 bg-gray-700/40 rounded-lg border border-gray-600">
      <h4 className="text-white font-medium text-lg mb-3">Leg {index + 1}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h5 className="text-gray-300 font-medium mb-2">Basic Setup</h5>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-400">Strategy Type:</span>
              <span className="text-white capitalize">{leg.strategyType}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Instrument:</span>
              <span className="text-white">{leg.instrument}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Underlying:</span>
              <span className="text-white capitalize">{leg.underlying}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Segment:</span>
              <span className="text-white capitalize">{leg.segment}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Position:</span>
              <span className="text-white capitalize">{leg.positionType}</span>
            </li>
          </ul>
        </div>
        
        {leg.segment === "options" && (
          <div>
            <h5 className="text-gray-300 font-medium mb-2">Option Details</h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-400">Option Type:</span>
                <span className="text-white">
                  {leg.optionType === "call" ? "Call (CE)" : "Put (PE)"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Expiry:</span>
                <span className="text-white capitalize">{leg.expiryType}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Strike Criteria:</span>
                <span className="text-white capitalize">{leg.strikeCriteria}</span>
              </li>
              {leg.strikeCriteria === "strike" ? (
                <li className="flex justify-between">
                  <span className="text-gray-400">Strike Level:</span>
                  <span className="text-white">{leg.strikeLevel}</span>
                </li>
              ) : (
                <li className="flex justify-between">
                  <span className="text-gray-400">Premium Amount:</span>
                  <span className="text-white">{leg.premiumAmount || "Not set"}</span>
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div>
          <h5 className="text-gray-300 font-medium mb-2">Timing & Risk</h5>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-400">Entry Time:</span>
              <span className="text-white">{leg.entryTime}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Exit Time:</span>
              <span className="text-white">{leg.exitTime}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Stop Loss:</span>
              <span className="text-white">{leg.stopLoss}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Target:</span>
              <span className="text-white">{leg.target}%</span>
            </li>
          </ul>
        </div>
        
        {(leg.reEntryOnSL || leg.reEntryOnTarget || leg.trailingEnabled) && (
          <div className="md:col-span-2 lg:col-span-3">
            <h5 className="text-gray-300 font-medium mb-2">Advanced Settings</h5>
            <ul className="space-y-2">
              {leg.reEntryOnSL && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Re-entry on SL:</span>
                  <span className="text-white">Yes, {leg.reEntryOnSLCount} times</span>
                </li>
              )}
              {leg.reEntryOnTarget && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Re-entry on Target:</span>
                  <span className="text-white">Yes, {leg.reEntryOnTargetCount} times</span>
                </li>
              )}
              {leg.trailingEnabled && (
                <>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Trailing Enabled:</span>
                    <span className="text-white">Yes</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Lock Profit At:</span>
                    <span className="text-white">{leg.trailingLockProfit}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">If Profit Reaches:</span>
                    <span className="text-white">{leg.trailingLockAt}%</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
