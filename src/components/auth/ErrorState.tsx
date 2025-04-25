
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  errorDetails?: string | null;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, errorDetails, onRetry }) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-red-500">{error}</h2>
      {errorDetails && <p className="text-gray-400">{errorDetails}</p>}
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
