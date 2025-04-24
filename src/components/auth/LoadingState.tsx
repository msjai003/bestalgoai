
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
      <h1 className="text-xl font-semibold">Authenticating...</h1>
      <p className="text-gray-400 mt-2 mb-6">Please wait while we complete your authentication</p>
      <div className="w-full bg-charcoalPrimary/50 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan to-cyan/70 h-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingState;
