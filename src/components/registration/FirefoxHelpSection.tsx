
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const FirefoxHelpSection = () => {
  return (
    <div className="bg-charcoalDanger/10 border border-charcoalDanger/30 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-charcoalDanger mt-0.5 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-red-200">Firefox Connection Issue</h3>
          <p className="text-xs text-gray-300 mt-1">
            We've detected you're using Firefox, which may have stricter security settings.
            This can sometimes affect database connections.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-charcoalSecondary/40 text-gray-200 border-gray-700 hover:bg-charcoalSecondary/60"
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
                className="bg-transparent text-gray-200 border-gray-700 hover:bg-charcoalSecondary/40"
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
