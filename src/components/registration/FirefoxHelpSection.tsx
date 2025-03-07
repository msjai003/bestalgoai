
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { getFirefoxInstructions } from '@/lib/supabase';

interface FirefoxHelpSectionProps {
  connectionError: string | null;
  showFirefoxHelp: boolean;
}

const FirefoxHelpSection: React.FC<FirefoxHelpSectionProps> = ({ connectionError, showFirefoxHelp }) => {
  if (!connectionError) {
    return null;
  }

  const openBrowserSettings = () => {
    // Safer approach than directly trying to open about:preferences
    // which can be blocked by browsers
    window.open('https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop', '_blank');
  };

  return (
    <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
      <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-red-200 text-sm">{connectionError}</p>
        {showFirefoxHelp && (
          <div className="mt-3 space-y-2">
            <p className="text-red-300 font-semibold">Browser Privacy Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-red-200 text-sm">
              {getFirefoxInstructions().steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <div className="flex space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={openBrowserSettings}
              >
                <Settings className="w-4 h-4 mr-2" />
                Open Browser Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Try Chrome Browser
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
