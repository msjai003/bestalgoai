
import React from 'react';
import { AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { getFirefoxInstructions } from '@/lib/supabase/browser-detection';

interface FirefoxHelpSectionProps {
  connectionError: string | null;
  showFirefoxHelp: boolean;
}

const FirefoxHelpSection: React.FC<FirefoxHelpSectionProps> = ({
  connectionError,
  showFirefoxHelp,
}) => {
  if (!connectionError || !showFirefoxHelp) return null;

  const browserInstructions = getFirefoxInstructions();
  const isChrome = navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edg") === -1;

  return (
    <div className="mb-6 space-y-4">
      <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start">
        <AlertTriangle className="text-yellow-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-yellow-200 text-sm font-medium">{connectionError}</p>
          <p className="text-yellow-200/80 text-xs mt-1">
            {isChrome 
              ? "Chrome's privacy settings may be blocking our connection. Try the troubleshooting steps below."
              : "Your browser may be blocking our connection. Try the troubleshooting steps below."}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-center mb-3">
          <Shield className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="font-medium">{browserInstructions.title}</h3>
        </div>
        
        <ul className="space-y-2 ml-2 text-sm text-gray-300">
          {browserInstructions.steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-blue-400">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        
        {isChrome && (
          <div className="mt-4 pt-3 border-t border-gray-700">
            <a 
              href="https://support.google.com/chrome/answer/95647" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Chrome cookie settings help
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
