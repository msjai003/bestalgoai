
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
import { getFirefoxInstructions } from '@/lib/supabase';

interface FirefoxHelpSectionProps {
  connectionError: string | null;
  showFirefoxHelp: boolean;
}

const FirefoxHelpSection: React.FC<FirefoxHelpSectionProps> = ({ connectionError, showFirefoxHelp }) => {
  if (!connectionError) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
      <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-red-200 text-sm">{connectionError}</p>
        {showFirefoxHelp && (
          <div className="mt-3 space-y-2">
            <p className="text-red-300 font-semibold">Firefox Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-red-200 text-sm">
              {getFirefoxInstructions().steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-red-500 text-red-400 hover:bg-red-950"
              onClick={() => window.open('about:preferences#privacy', '_blank')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Open Firefox Privacy Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
