
import React from 'react';

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ step, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 glass-card p-2 rounded-full">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full ${
              index + 1 <= step ? 'bg-gradient-to-r from-cyan to-cyan/80' : 'bg-gray-700'
            } ${index + 1 !== totalSteps ? 'flex-1 mr-1' : 'flex-1'}`}
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm text-center">Step {step} of {totalSteps}</p>
    </div>
  );
};

export default ProgressIndicator;
