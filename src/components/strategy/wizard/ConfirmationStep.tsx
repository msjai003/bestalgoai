
import { useState } from "react";
import { Plus, PenSquare, ChevronRight, Save, Check, X, ArrowLeft, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardFormData, StrategyLeg, PositionType, OptionType, StrikeLevel } from "@/types/strategy-wizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationStepProps {
  formData: WizardFormData;
  onSelectLeg: (index: number) => void;
  onAddLeg: () => void;
  strategyName: string;
  updateLegByIndex: (index: number, updates: Partial<StrategyLeg>) => void;
}

export const ConfirmationStep = ({ 
  formData, 
  onSelectLeg, 
  onAddLeg,
  strategyName,
  updateLegByIndex
}: ConfirmationStepProps) => {
  const [showAddLegDialog, setShowAddLegDialog] = useState(false);
  const [selectedLegIndex, setSelectedLegIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSaveLeg = (index: number) => {
    setSelectedLegIndex(index);
    setShowAddLegDialog(true);
  };

  const handleAddAnotherLeg = () => {
    setShowAddLegDialog(false);
    onAddLeg();
  };

  const handleFinishStrategy = () => {
    setShowAddLegDialog(false);
    // Show toast notification that leg details are stored
    toast({
      title: "Leg details stored",
      description: `Selected leg details stored in strategy "${strategyName || 'Unnamed Strategy'}"`,
      duration: 3000,
    });
    // Here we would typically save the strategy and navigate to strategy details
    // This functionality would be implemented in the parent component
  };

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
            updateLeg={(updates) => updateLegByIndex(index, updates)}
            onSave={() => handleSaveLeg(index)}
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

      {/* Add Leg Confirmation Dialog */}
      <Dialog open={showAddLegDialog} onOpenChange={setShowAddLegDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Another Leg?</DialogTitle>
            <DialogDescription className="text-gray-300">
              Would you like to add another leg to your strategy?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end items-center mt-4 gap-4">
            <Button 
              onClick={handleFinishStrategy}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 rounded-xl"
            >
              <X className="mr-2 h-4 w-4" /> No
            </Button>
            <Button 
              onClick={handleAddAnotherLeg}
              className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white rounded-xl"
            >
              <Check className="mr-2 h-4 w-4" /> Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StrategyLegCardProps {
  leg: StrategyLeg;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  onSave: () => void;
}

const StrategyLegCard = ({ leg, index, isActive, onSelect, updateLeg, onSave }: StrategyLegCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div 
        className={`p-4 rounded-lg border border-[#FF00D4] bg-gray-800/70`}
      >
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-white font-medium">Editing Leg {index + 1}</h5>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSaveChanges}
              className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-gray-700"
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleEdit}
              className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="positionType" className="text-gray-300 block mb-2">Position Type</Label>
            <Select
              value={leg.positionType}
              onValueChange={(value) => updateLeg({ positionType: value as PositionType })}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="buy" className="hover:bg-gray-700">Buy</SelectItem>
                <SelectItem value="sell" className="hover:bg-gray-700">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {leg.segment === "options" && (
            <div>
              <Label htmlFor="optionType" className="text-gray-300 block mb-2">Option Type</Label>
              <Select
                value={leg.optionType}
                onValueChange={(value) => updateLeg({ optionType: value as OptionType })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select Option Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="call" className="hover:bg-gray-700">Call (CE)</SelectItem>
                  <SelectItem value="put" className="hover:bg-gray-700">Put (PE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {leg.strikeCriteria === "strike" ? (
            <div>
              <Label htmlFor="strikeLevel" className="text-gray-300 block mb-2">Strike Level</Label>
              <Select
                value={leg.strikeLevel}
                onValueChange={(value) => updateLeg({ strikeLevel: value as StrikeLevel })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select Strike Level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                  {/* ATM option */}
                  <SelectItem 
                    value="ATM" 
                    className="bg-[#FF00D4]/10 text-white font-bold border-y border-[#FF00D4]/30 my-1 py-2"
                  >
                    ATM
                  </SelectItem>
                  
                  {/* ITM options - ordered from ITM1 to ITM20 */}
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem 
                      key={`ITM${num}`} 
                      value={`ITM${num}`}
                      className="text-green-400 hover:bg-gray-700 hover:text-green-300 font-medium"
                    >
                      ITM{num}
                    </SelectItem>
                  ))}
                  
                  {/* OTM options - ordered from OTM1 to OTM20 */}
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem 
                      key={`OTM${num}`} 
                      value={`OTM${num}`}
                      className="text-red-400 hover:bg-gray-700 hover:text-red-300 font-medium"
                    >
                      OTM{num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="premiumAmount" className="text-gray-300 block mb-2">Premium Amount</Label>
              <Input
                id="premiumAmount"
                type="number"
                value={leg.premiumAmount || ""}
                onChange={(e) => updateLeg({ premiumAmount: e.target.value })}
                placeholder="Enter amount"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="entryTime" className="text-gray-300 block mb-2">Entry Time</Label>
            <Input
              id="entryTime"
              type="time"
              value={leg.entryTime}
              onChange={(e) => updateLeg({ entryTime: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="exitTime" className="text-gray-300 block mb-2">Exit Time</Label>
            <Input
              id="exitTime"
              type="time"
              value={leg.exitTime}
              onChange={(e) => updateLeg({ exitTime: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="stopLoss" className="text-gray-300 block mb-2">Stop Loss (%)</Label>
            <Input
              id="stopLoss"
              type="number"
              value={leg.stopLoss}
              onChange={(e) => updateLeg({ stopLoss: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="target" className="text-gray-300 block mb-2">Target (%)</Label>
            <Input
              id="target"
              type="number"
              value={leg.target}
              onChange={(e) => updateLeg({ target: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleEdit}
          className="w-full mt-3 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    );
  }

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
          onClick={toggleEdit}
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
        onClick={onSave}
        className="w-full mt-3 text-gray-400 hover:text-white hover:bg-gray-700"
      >
        <Save className="h-4 w-4 mr-1" /> Save Leg
      </Button>
    </div>
  );
};
