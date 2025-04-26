
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
      <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
        <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4 mx-auto" />
        <p className="text-white text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
