
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface RiskManagementStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
}

export const RiskManagementStep = ({ leg, updateLeg }: RiskManagementStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Stop Loss Configuration</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stopLoss" className="text-gray-300 block mb-2">
              Stop Loss (%)
            </Label>
            <div className="relative">
              <Input
                id="stopLoss"
                type="number"
                value={leg.stopLoss}
                onChange={(e) => updateLeg({ stopLoss: e.target.value })}
                min="0"
                step="0.1"
                className="bg-gray-700 border-gray-600 text-white pr-8"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reEntryOnSL" className="text-gray-300">
                Re-entry on SL Hit
              </Label>
              <Switch
                id="reEntryOnSL"
                checked={leg.reEntryOnSL}
                onCheckedChange={(checked) => updateLeg({ reEntryOnSL: checked })}
                className="data-[state=checked]:bg-cyan"
              />
            </div>
            
            {leg.reEntryOnSL && (
              <div>
                <Label htmlFor="reEntryOnSLCount" className="text-gray-300 block mb-2">
                  Re-entry Count
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {["1", "2", "3", "4"].map((count) => (
                    <Button
                      key={count}
                      variant={leg.reEntryOnSLCount === count ? "default" : "outline"}
                      className={`${
                        leg.reEntryOnSLCount === count
                          ? "bg-gradient-to-r from-cyan to-cyan/80"
                          : "bg-gray-700 border-gray-600 text-white"
                      }`}
                      onClick={() => updateLeg({ reEntryOnSLCount: count })}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-medium mb-4">Target Configuration</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="target" className="text-gray-300 block mb-2">
              Target (%)
            </Label>
            <div className="relative">
              <Input
                id="target"
                type="number"
                value={leg.target}
                onChange={(e) => updateLeg({ target: e.target.value })}
                min="0"
                step="0.1"
                className="bg-gray-700 border-gray-600 text-white pr-8"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reEntryOnTarget" className="text-gray-300">
                Re-entry on Target Hit
              </Label>
              <Switch
                id="reEntryOnTarget"
                checked={leg.reEntryOnTarget}
                onCheckedChange={(checked) => updateLeg({ reEntryOnTarget: checked })}
                className="data-[state=checked]:bg-cyan"
              />
            </div>
            
            {leg.reEntryOnTarget && (
              <div>
                <Label htmlFor="reEntryOnTargetCount" className="text-gray-300 block mb-2">
                  Re-entry Count
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {["1", "2", "3", "4"].map((count) => (
                    <Button
                      key={count}
                      variant={leg.reEntryOnTargetCount === count ? "default" : "outline"}
                      className={`${
                        leg.reEntryOnTargetCount === count
                          ? "bg-gradient-to-r from-cyan to-cyan/80"
                          : "bg-gray-700 border-gray-600 text-white"
                      }`}
                      onClick={() => updateLeg({ reEntryOnTargetCount: count })}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="trailingEnabled" className="text-gray-300">
              Trailing Options
            </Label>
            <Switch
              id="trailingEnabled"
              checked={leg.trailingEnabled}
              onCheckedChange={(checked) => updateLeg({ trailingEnabled: checked })}
              className="data-[state=checked]:bg-cyan"
            />
          </div>
          
          {leg.trailingEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="trailingLockProfit" className="text-gray-300 block">
                  Lock Profit at (%)
                </Label>
                <div className="relative">
                  <Input
                    id="trailingLockProfit"
                    type="number"
                    value={leg.trailingLockProfit}
                    onChange={(e) => updateLeg({ trailingLockProfit: e.target.value })}
                    min="0"
                    step="0.1"
                    className="bg-gray-700 border-gray-600 text-white pr-8"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailingLockAt" className="text-gray-300 block">
                  if Profit Reaches (%)
                </Label>
                <div className="relative">
                  <Input
                    id="trailingLockAt"
                    type="number"
                    value={leg.trailingLockAt}
                    onChange={(e) => updateLeg({ trailingLockAt: e.target.value })}
                    min="0"
                    step="0.1"
                    className="bg-gray-700 border-gray-600 text-white pr-8"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
