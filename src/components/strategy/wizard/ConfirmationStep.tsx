
import { Plus, PenSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardFormData, StrategyLeg } from "@/types/strategy-wizard";

interface ConfirmationStepProps {
  formData: WizardFormData;
  onSelectLeg: (index: number) => void;
  onAddLeg: () => void;
  strategyName: string;
}

export const ConfirmationStep = ({ 
  formData, 
  onSelectLeg, 
  onAddLeg,
  strategyName
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <h4 className="text-white font-medium mb-4">Review Strategy Configuration</h4>
      
      <div className="mb-4 p-4 rounded-lg border border-gray-700 bg-gray-800/30">
        <h5 className="text-white font-medium mb-2">Strategy Name</h5>
        <p className="text-gray-300">{strategyName || "Unnamed Strategy"}</p>
      </div>
      
      <div className="space-y-4">
        {formData.legs.map((leg, index) => (
          <StrategyLegCard 
            key={leg.id} 
            leg={leg} 
            index={index} 
            isActive={index === formData.currentLegIndex} 
            onSelect={() => onSelectLeg(index)} 
          />
        ))}
        
        <Button
          variant="outline"
          onClick={onAddLeg}
          className="w-full h-14 mt-4 bg-gray-700/50 border-dashed border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Another Leg
        </Button>
      </div>
    </div>
  );
};

interface StrategyLegCardProps {
  leg: StrategyLeg;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

const StrategyLegCard = ({ leg, index, isActive, onSelect }: StrategyLegCardProps) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        isActive 
          ? "border-[#FF00D4] bg-gray-800/70" 
          : "border-gray-700 bg-gray-800/30"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-white font-medium">Leg {index + 1}</h5>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSelect}
          className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <PenSquare className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-gray-400">Strategy Type:</span>
          <p className="text-white capitalize">{leg.strategyType}</p>
        </div>
        <div>
          <span className="text-gray-400">Instrument:</span>
          <p className="text-white">{leg.instrument}</p>
        </div>
        <div>
          <span className="text-gray-400">Segment:</span>
          <p className="text-white capitalize">{leg.segment}</p>
        </div>
        <div>
          <span className="text-gray-400">Position:</span>
          <p className="text-white capitalize">{leg.positionType}</p>
        </div>
        <div>
          <span className="text-gray-400">Underlying:</span>
          <p className="text-white capitalize">{leg.underlying}</p>
        </div>
        
        {leg.segment === "options" && (
          <>
            <div>
              <span className="text-gray-400">Option Type:</span>
              <p className="text-white capitalize">{leg.optionType === "call" ? "Call (CE)" : "Put (PE)"}</p>
            </div>
            <div>
              <span className="text-gray-400">Expiry:</span>
              <p className="text-white capitalize">{leg.expiryType}</p>
            </div>
            <div>
              <span className="text-gray-400">Strike Criteria:</span>
              <p className="text-white capitalize">{leg.strikeCriteria}</p>
            </div>
            {leg.strikeCriteria === "strike" ? (
              <div>
                <span className="text-gray-400">Strike Level:</span>
                <p className="text-white">{leg.strikeLevel}</p>
              </div>
            ) : (
              <div>
                <span className="text-gray-400">Premium Amount:</span>
                <p className="text-white">{leg.premiumAmount || "Not set"}</p>
              </div>
            )}
          </>
        )}
        
        <div>
          <span className="text-gray-400">Entry Time:</span>
          <p className="text-white">{leg.entryTime}</p>
        </div>
        <div>
          <span className="text-gray-400">Exit Time:</span>
          <p className="text-white">{leg.exitTime}</p>
        </div>
        <div>
          <span className="text-gray-400">Stop Loss:</span>
          <p className="text-white">{leg.stopLoss}%</p>
        </div>
        <div>
          <span className="text-gray-400">Target:</span>
          <p className="text-white">{leg.target}%</p>
        </div>
        
        {leg.reEntryOnSL && (
          <div>
            <span className="text-gray-400">Re-entry on SL:</span>
            <p className="text-white">Yes, {leg.reEntryOnSLCount} times</p>
          </div>
        )}
        
        {leg.reEntryOnTarget && (
          <div>
            <span className="text-gray-400">Re-entry on Target:</span>
            <p className="text-white">Yes, {leg.reEntryOnTargetCount} times</p>
          </div>
        )}
        
        {leg.trailingEnabled && (
          <>
            <div>
              <span className="text-gray-400">Trailing Lock Profit:</span>
              <p className="text-white">{leg.trailingLockProfit}%</p>
            </div>
            <div>
              <span className="text-gray-400">Lock At Profit:</span>
              <p className="text-white">{leg.trailingLockAt}%</p>
            </div>
          </>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSelect}
        className="w-full mt-3 text-gray-400 hover:text-white hover:bg-gray-700"
      >
        View Entered Leg Details <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
