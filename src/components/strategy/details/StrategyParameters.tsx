
import React from "react";
import { Settings, Clock, Zap, Filter } from "lucide-react";

interface StrategyParametersProps {
  strategyDetailsParams: {
    instrumentSettings: Array<{name: string, value: string}>;
    timeSettings: Array<{name: string, value: string}>;
    executionSettings: Array<{name: string, value: string}>;
    other: Array<{name: string, value: string}>;
  };
}

export const StrategyParameters = ({ strategyDetailsParams }: StrategyParametersProps) => {
  const renderParameterSection = (
    title: string,
    icon: React.ElementType,
    parameters: Array<{name: string, value: string}>
  ) => {
    if (parameters.length === 0) return null;

    const IconComponent = icon;

    return (
      <div className="bg-gradient-to-br from-charcoalSecondary/40 to-charcoalSecondary/20 rounded-lg p-4 border border-gray-700/30">
        <h3 className="text-lg font-semibold mb-3 text-white/90 flex items-center">
          <IconComponent className="h-5 w-5 text-cyan mr-2" />
          {title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {parameters.map((param, index) => (
            <div key={index} className="bg-charcoalSecondary/30 rounded p-3 border border-gray-700/20">
              <span className="text-gray-400 text-xs block mb-1">{param.name}</span>
              <p className="text-white font-medium">{param.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      {renderParameterSection("Instrument Settings", Settings, strategyDetailsParams.instrumentSettings)}
      {renderParameterSection("Time Settings", Clock, strategyDetailsParams.timeSettings)}
      {renderParameterSection("Execution Settings", Zap, strategyDetailsParams.executionSettings)}
      {renderParameterSection("Other Settings", Filter, strategyDetailsParams.other)}
    </div>
  );
};
