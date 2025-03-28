
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface RiskManagementStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
}

export const RiskManagementStep = ({ 
  leg, 
  updateLeg 
}: RiskManagementStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stopLoss" className="text-gray-300 block">Stop Loss (%)</Label>
          <Input
            id="stopLoss"
            type="number"
            min="0.1"
            step="0.1"
            value={leg.stopLoss}
            onChange={(e) => updateLeg({ stopLoss: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="target" className="text-gray-300 block">Target (%)</Label>
          <Input
            id="target"
            type="number"
            min="0.1"
            step="0.1"
            value={leg.target}
            onChange={(e) => updateLeg({ target: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-4 border border-gray-700/50 rounded-lg p-4 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <Label htmlFor="reEntryOnSL" className="text-gray-300">Re-entry on Stop Loss</Label>
          <Switch
            id="reEntryOnSL"
            checked={leg.reEntryOnSL}
            onCheckedChange={(checked) => updateLeg({ reEntryOnSL: checked })}
            className="data-[state=checked]:bg-cyan"
          />
        </div>
        
        {leg.reEntryOnSL && (
          <div>
            <Label htmlFor="reEntryOnSLCount" className="text-gray-300 block mb-1">Max Re-entries</Label>
            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "4"].map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={leg.reEntryOnSLCount === count ? "cyan" : "outline"}
                  className={leg.reEntryOnSLCount !== count ? "bg-gray-700 border-gray-600 text-white" : ""}
                  onClick={() => updateLeg({ reEntryOnSLCount: count })}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border border-gray-700/50 rounded-lg p-4 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <Label htmlFor="reEntryOnTarget" className="text-gray-300">Re-entry on Target</Label>
          <Switch
            id="reEntryOnTarget"
            checked={leg.reEntryOnTarget}
            onCheckedChange={(checked) => updateLeg({ reEntryOnTarget: checked })}
            className="data-[state=checked]:bg-cyan"
          />
        </div>
        
        {leg.reEntryOnTarget && (
          <div>
            <Label htmlFor="reEntryOnTargetCount" className="text-gray-300 block mb-1">Max Re-entries</Label>
            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "4"].map((count) => (
                <Button
                  key={count}
                  type="button"
                  variant={leg.reEntryOnTargetCount === count ? "cyan" : "outline"}
                  className={leg.reEntryOnTargetCount !== count ? "bg-gray-700 border-gray-600 text-white" : ""}
                  onClick={() => updateLeg({ reEntryOnTargetCount: count })}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border border-gray-700/50 rounded-lg p-4 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <Label htmlFor="trailingEnabled" className="text-gray-300">Enable Trailing Stop Loss</Label>
          <Switch
            id="trailingEnabled"
            checked={leg.trailingEnabled}
            onCheckedChange={(checked) => updateLeg({ trailingEnabled: checked })}
            className="data-[state=checked]:bg-cyan"
          />
        </div>
        
        {leg.trailingEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <Label htmlFor="trailingLockProfit" className="text-gray-300 block mb-1">Lock Profit (%)</Label>
              <Input
                id="trailingLockProfit"
                type="number"
                min="0.1"
                step="0.1"
                value={leg.trailingLockProfit}
                onChange={(e) => updateLeg({ trailingLockProfit: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="trailingLockAt" className="text-gray-300 block mb-1">Activate at (%)</Label>
              <Input
                id="trailingLockAt"
                type="number"
                min="0.1"
                step="0.1"
                value={leg.trailingLockAt}
                onChange={(e) => updateLeg({ trailingLockAt: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
