
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const FirefoxHelpSection = () => {
  return (
    <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-yellow-300">Firefox Connection Issue</h3>
          <p className="text-xs text-yellow-200 mt-1">
            We've detected you're using Firefox, which may have stricter security settings.
            This can sometimes affect database connections.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-yellow-800/40 text-yellow-200 border-yellow-700 hover:bg-yellow-800/60 hover:text-yellow-100"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-yellow-200 border-yellow-700 hover:bg-yellow-800/40 hover:text-yellow-100"
              >
                Firefox Settings Help
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
