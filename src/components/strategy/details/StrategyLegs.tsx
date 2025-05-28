
import React from "react";
import { Layers } from "lucide-react";

interface StrategyLegsProps {
  strategyLegs: any[];
}

const formatLegProperty = (property: any): string => {
  if (typeof property === 'string') {
    return property;
  }
  if (typeof property === 'object' && property !== null) {
    if (property.enabled !== undefined) {
      return property.enabled ? (property.value?.toString() || 'On') : 'Off';
    }
    return JSON.stringify(property);
  }
  return 'Off';
};

export const StrategyLegs = ({ strategyLegs }: StrategyLegsProps) => {
  if (!strategyLegs || strategyLegs.length === 0) {
    return (
      <div className="text-center text-gray-400 p-6">
        <p>No leg details available for this strategy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {strategyLegs.map((leg, index) => (
        <div key={index} className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
          <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
            <Layers className="h-5 w-5 text-cyan mr-2" />
            Leg #{leg.id || index + 1}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Lots</span>
              <p className="text-white font-medium">{leg.lots}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Position</span>
              <p className="text-white font-medium">{leg.position}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Option Type</span>
              <p className="text-white font-medium">{leg.optionType}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Expiry</span>
              <p className="text-white font-medium">{leg.expiry}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Strike Criteria</span>
              <p className="text-white font-medium">{leg.strikeCriteria}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Premium</span>
              <p className="text-white font-medium">{leg.premium}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Stop Loss</span>
              <p className="text-white font-medium">{formatLegProperty(leg.stopLoss)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Trail SL</span>
              <p className="text-white font-medium">{formatLegProperty(leg.trailSL)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Target Profit</span>
              <p className="text-white font-medium">{formatLegProperty(leg.targetProfit)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Re-entry on Target</span>
              <p className="text-white font-medium">{formatLegProperty(leg.reEntryOnTarget)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Re-entry on Stop Loss</span>
              <p className="text-white font-medium">{formatLegProperty(leg.reEntryOnStopLoss)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Simple Momentum</span>
              <p className="text-white font-medium">{formatLegProperty(leg.simpleMomentum)}</p>
            </div>
            <div className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">Range Breakout</span>
              <p className="text-white font-medium">{formatLegProperty(leg.rangeBreakout)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
