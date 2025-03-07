
import React from 'react';

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ step, totalSteps }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-1/3 h-1 rounded-full ${
              index + 1 <= step ? 'bg-[#FF00D4]' : 'bg-gray-700'
            } ${index + 1 !== totalSteps ? 'mr-1' : ''}`}
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm">Step {step} of {totalSteps}</p>
    </>
  );
};

export default ProgressIndicator;
