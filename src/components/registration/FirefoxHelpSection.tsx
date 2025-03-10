
import React from 'react';
import { AlertTriangle, Shield, ExternalLink, RefreshCw, Download } from 'lucide-react';
import { getFirefoxInstructions } from '@/lib/supabase/browser-detection';
import { enableProxy, isProxyEnabled } from '@/lib/supabase/client';
import { BeforeInstallPromptEvent } from '@/types/installation';

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
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const proxyEnabled = isProxyEnabled();

  const toggleProxy = () => {
    enableProxy(!proxyEnabled);
  };
  
  const promptInstall = () => {
    if (window.deferredInstallPrompt) {
      // Show the PWA install prompt
      window.deferredInstallPrompt.prompt();
      
      // Wait for user response
      window.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt
        window.deferredInstallPrompt = null;
      });
    } else {
      // If on mobile, provide installation instructions
      if (isMobile) {
        // iOS-specific instructions
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          alert("To install the app on iOS: tap the share button and select 'Add to Home Screen'");
        } 
        // Android-specific instructions
        else if (/Android/.test(navigator.userAgent)) {
          alert("To install the app on Android: tap the menu button (⋮) and select 'Add to Home screen' or 'Install app'");
        }
      }
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start">
        <AlertTriangle className="text-yellow-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-yellow-200 text-sm font-medium">{connectionError}</p>
          <p className="text-yellow-200/80 text-xs mt-1">
            {isChrome 
              ? "We're experiencing connection issues. This could be related to network conditions or server availability."
              : "We're experiencing connection issues. This could be related to network conditions or server availability."}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-center mb-3">
          <Shield className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="font-medium">Connection Troubleshooting</h3>
        </div>
        
        <ul className="space-y-2 ml-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-400">•</span>
            <span>Check your internet connection and try refreshing the page</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-400">•</span>
            <span>Make sure your network isn't blocking API connections</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-400">•</span>
            <span>Try using a different network (like mobile data instead of WiFi)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-400">•</span>
            <span>Our servers might be experiencing temporary issues</span>
          </li>
        </ul>
        
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-blue-300">CORS Proxy Server</h4>
            <button 
              onClick={toggleProxy}
              className={`px-3 py-1 text-xs rounded flex items-center ${
                proxyEnabled 
                  ? "bg-green-600/30 text-green-300 border border-green-600/50" 
                  : "bg-gray-700/50 text-gray-300 border border-gray-600"
              }`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {proxyEnabled ? "Proxy Enabled" : "Enable Proxy"}
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mb-2">
            If you're still experiencing connection issues, our CORS proxy server might help resolve them.
            This requires you to start the proxy server on your local machine.
          </p>
          
          <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-xs font-mono">
            <p className="text-green-400 mb-1"># Start the proxy server:</p>
            <p className="text-gray-300">node proxy-server.js</p>
          </div>
          
          {isMobile && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-blue-300">Install as App</h4>
                <button 
                  onClick={promptInstall}
                  className="px-3 py-1 text-xs rounded flex items-center bg-blue-600/30 text-blue-300 border border-blue-600/50"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install App
                </button>
              </div>
              
              <p className="text-xs text-gray-400 mb-2">
                Installing as an app can sometimes resolve connection issues by providing a more native experience.
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <a 
              href="https://status.bestalgotradingapp.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Check our service status
            </a>
            
            <p className="mt-2 text-xs text-gray-400">
              If you're on a corporate network, some network policies may block connections. 
              Try using a personal device or a different network.
            </p>
            
            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
              <h4 className="text-xs font-medium text-blue-300">Additional options:</h4>
              <ul className="mt-1 text-xs text-gray-300">
                <li className="mt-1">• Try opening the application in a different browser</li>
                <li className="mt-1">• Clear your browser cache and cookies</li>
                <li className="mt-1">• Try using a mobile device instead</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
