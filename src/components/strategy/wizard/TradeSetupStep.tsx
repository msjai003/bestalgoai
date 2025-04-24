
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { StrategyLeg } from "@/types/strategy-wizard";
import { Button } from "@/components/ui/button";
import { useStrategyConfigOptions } from "@/hooks/strategy/useStrategyConfigOptions";
import { StrategyNameInput } from "./StrategyNameInput";
import { StrategyTypeSelector } from "./StrategyTypeSelector";
import { InstrumentSelector } from "./InstrumentSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradeSetupStepProps {
  leg: StrategyLeg;
  updateLeg: (updates: Partial<StrategyLeg>) => void;
  strategyName: string;
  setStrategyName: (name: string) => void;
  isFirstLeg: boolean;
  isDuplicateName?: boolean;
}

export const TradeSetupStep = ({
  leg,
  updateLeg,
  strategyName,
  setStrategyName,
  isFirstLeg,
  isDuplicateName = false
}: TradeSetupStepProps) => {
  const { 
    options, 
    isLoading,
    getOptionsByCategory 
  } = useStrategyConfigOptions();

  const instrumentOptions = getOptionsByCategory('instrument');
  const underlyingOptions = getOptionsByCategory('underlying');
  const segmentOptions = getOptionsByCategory('segment');
  const optionTypeOptions = getOptionsByCategory('optionType');
  const positionTypeOptions = getOptionsByCategory('positionType');
  const strategyTypeOptions = getOptionsByCategory('strategyType');

  return (
    <div className="space-y-6">
      <StrategyNameInput
        strategyName={strategyName}
        setStrategyName={setStrategyName}
        isFirstLeg={isFirstLeg}
      />

      <StrategyTypeSelector
        isLoading={isLoading}
        strategyTypeOptions={strategyTypeOptions}
        leg={leg}
        updateLeg={updateLeg}
        isFirstLeg={isFirstLeg}
      />

      {isFirstLeg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entryTime" className="text-gray-300 block mb-2">Entry Time</Label>
            <div className="relative flex items-center">
              <Input
                id="entryTime"
                type="time"
                value={leg.entryTime}
                onChange={(e) => updateLeg({ entryTime: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
              />
              <Clock className="absolute right-2 text-white" size={18} />
            </div>
          </div>
          <div>
            <Label htmlFor="exitTime" className="text-gray-300 block mb-2">Exit Time</Label>
            <div className="relative flex items-center">
              <Input
                id="exitTime"
                type="time"
                value={leg.exitTime}
                onChange={(e) => updateLeg({ exitTime: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
              />
              <Clock className="absolute right-2 text-white" size={18} />
            </div>
          </div>
        </div>
      )}
      {!isFirstLeg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entryTime" className="text-gray-300 block mb-2">Entry Time</Label>
            <div className="relative flex items-center">
              <Input
                id="entryTime"
                type="time"
                value={leg.entryTime}
                disabled
                className="bg-gray-700/50 border-gray-600 text-gray-400 pr-10 cursor-not-allowed"
              />
              <Clock className="absolute right-2 text-gray-400" size={18} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Entry time is synchronized with first leg</p>
          </div>
          <div>
            <Label htmlFor="exitTime" className="text-gray-300 block mb-2">Exit Time</Label>
            <div className="relative flex items-center">
              <Input
                id="exitTime"
                type="time"
                value={leg.exitTime}
                disabled
                className="bg-gray-700/50 border-gray-600 text-gray-400 pr-10 cursor-not-allowed"
              />
              <Clock className="absolute right-2 text-gray-400" size={18} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Exit time is synchronized with first leg</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InstrumentSelector
          isLoading={isLoading}
          instrumentOptions={instrumentOptions}
          leg={leg}
          updateLeg={updateLeg}
          isFirstLeg={isFirstLeg}
        />

        <div>
          <h4 className="text-white font-medium mb-2">Underlying Selection</h4>
          {isLoading ? (
            <div className="flex justify-center my-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {underlyingOptions.map((type) => (
                <Button
                  key={type.value}
                  variant={leg.underlying === type.value ? "cyan" : "outline"}
                  className={`${
                    leg.underlying === type.value
                      ? ""
                      : "bg-gray-700 border-gray-600 text-white"
                  }`}
                  onClick={() => updateLeg({ underlying: type.value as any })}
                  disabled={!isFirstLeg}
                >
                  {type.display_name}
                </Button>
              ))}
            </div>
          )}
          {!isFirstLeg && (
            <p className="text-xs text-gray-400 mt-1">
              Underlying must be consistent across all legs
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-2">Select Segments</h4>
        {isLoading ? (
          <div className="flex justify-center my-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {segmentOptions.map((segment) => (
              <Button
                key={segment.value}
                variant={leg.segment === segment.value ? "cyan" : "outline"}
                className={`${
                  leg.segment === segment.value
                    ? ""
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ segment: segment.value as any })}
                disabled={!isFirstLeg}
              >
                {segment.display_name}
              </Button>
            ))}
          </div>
        )}
        {!isFirstLeg && (
          <p className="text-xs text-gray-400 mt-1">
            Segment must be consistent across all legs
          </p>
        )}
      </div>

      {leg.segment === "options" && (
        <div>
          <h4 className="text-white font-medium mb-2">Option Type</h4>
          {isLoading ? (
            <div className="flex justify-center my-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {optionTypeOptions.map((type) => (
                <Button
                  key={type.value}
                  variant={leg.optionType === type.value ? "cyan" : "outline"}
                  className={`${
                    leg.optionType === type.value
                      ? ""
                      : "bg-gray-700 border-gray-600 text-white"
                  }`}
                  onClick={() => updateLeg({ optionType: type.value as any })}
                >
                  {type.display_name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h4 className="text-white font-medium mb-2">Position Type</h4>
        {isLoading ? (
          <div className="flex justify-center my-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {positionTypeOptions.map((type) => (
              <Button
                key={type.value}
                variant={leg.positionType === type.value ? "cyan" : "outline"}
                className={`${
                  leg.positionType === type.value
                    ? ""
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                onClick={() => updateLeg({ positionType: type.value as any })}
              >
                {type.display_name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
