
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Processing authentication..." }: LoadingStateProps) => {
  return (
    <div className="w-full max-w-md bg-charcoalSecondary p-6 rounded-lg border border-cyan/30 flex flex-col items-center text-center space-y-4">
      <Loader className="h-12 w-12 text-cyan animate-spin mb-2" />
      <h2 className="text-xl font-semibold text-white">Please Wait</h2>
      <p className="text-gray-300">{message}</p>
      <p className="text-sm text-gray-400 mt-2">This may take a few moments...</p>
    </div>
  );
};

export default LoadingState;
