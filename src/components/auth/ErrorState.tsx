
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string | null;
  errorDetails: string | null;
  onRetry: () => void;
  debugInfo?: any;
}

const ErrorState = ({ error, errorDetails, onRetry, debugInfo }: ErrorStateProps) => {
  return (
    <div className="w-full max-w-md bg-charcoalSecondary p-6 rounded-lg border border-red-500/30 flex flex-col items-center text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-charcoalDanger mb-2" />
      <h2 className="text-xl font-semibold text-white">{error || 'Authentication Error'}</h2>
      
      {errorDetails && (
        <p className="text-gray-300 text-sm">{errorDetails}</p>
      )}
      
      <Button
        onClick={onRetry}
        className="mt-4 bg-cyan hover:bg-cyan/80 text-white px-4 py-2 rounded-md"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      
      <div className="text-xs text-gray-400 mt-4">
        <p>If the problem persists, please contact support.</p>
      </div>
      
      {debugInfo && (
        <div className="mt-6 text-left w-full">
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-gray-300">Debug Information</summary>
            <pre className="mt-2 p-2 bg-gray-800/50 rounded text-gray-300 overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
