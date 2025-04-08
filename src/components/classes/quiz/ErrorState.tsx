
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{error}</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
