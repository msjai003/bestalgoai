
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  errorDetails: string | null;
  onRetry: () => void;
}

const ErrorState = ({ error, errorDetails, onRetry }: ErrorStateProps) => {
  return (
    <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
      <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">{error}</h1>
      {errorDetails && <p className="text-red-400 mb-6">{errorDetails}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Link to="/auth">
          <Button className="w-full">
            Return to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
