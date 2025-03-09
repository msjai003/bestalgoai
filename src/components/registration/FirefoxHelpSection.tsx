
import React from 'react';
import { AlertTriangle, Shield, ExternalLink, RefreshCw, Download } from 'lucide-react';
import { getFirefoxInstructions } from '@/lib/supabase/browser-detection';
import { enableProxy, isProxyEnabled } from '@/lib/supabase/client';

interface FirefoxHelpSectionProps {
  connectionError: string | null;
  showFirefoxHelp: boolean;
}

declare global {
  interface Window {
    deferredInstallPrompt: Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    } | null;
  }
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
            If browser security settings are preventing connections, you can use our CORS proxy server as a workaround.
            This requires you to start the proxy server on your local machine.
          </p>
          
          <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-xs font-mono">
            <p className="text-green-400 mb-1"># Start the proxy server:</p>
            <p className="text-gray-300">node proxy-server.js</p>
          </div>
          
          {isMobile && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-pink-300">Install as App</h4>
                <button 
                  onClick={promptInstall}
                  className="px-3 py-1 text-xs rounded flex items-center bg-pink-600/30 text-pink-300 border border-pink-600/50"
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
          
          {isChrome && (
            <div className="mt-4">
              <a 
                href="https://support.google.com/chrome/answer/95647" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Chrome cookie settings help
              </a>
              
              <p className="mt-2 text-xs text-gray-400">
                If you're on a corporate network, some network policies may block connections. 
                Try using a personal device or contact your IT department.
              </p>
              
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
                <h4 className="text-xs font-medium text-blue-300">Additional options:</h4>
                <ul className="mt-1 text-xs text-gray-300">
                  <li className="mt-1">• Try using Incognito mode with third-party cookies enabled</li>
                  <li className="mt-1">• Try a different browser like Firefox or Edge</li>
                  <li className="mt-1">• Try using a mobile device instead</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
