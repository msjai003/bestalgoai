
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings, ExternalLink, Wifi, Globe, RefreshCw } from 'lucide-react';
import { getFirefoxInstructions, testSupabaseConnection, testDirectConnection } from '@/lib/supabase';

interface FirefoxHelpSectionProps {
  connectionError: string | null;
  showFirefoxHelp: boolean;
}

const FirefoxHelpSection: React.FC<FirefoxHelpSectionProps> = ({ connectionError, showFirefoxHelp }) => {
  if (!connectionError) {
    return null;
  }

  const openBrowserSettings = () => {
    // Different approach based on browser
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
    
    if (isChrome) {
      window.open('chrome://settings/content', '_blank');
      // Since chrome:// URLs are restricted, show a helpful message
      alert("To open Chrome settings: \n1. Type 'chrome://settings/content' in your address bar\n2. Go to Cookies and site data\n3. Make sure 'Block third-party cookies' is off");
    } else {
      window.open('https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop', '_blank');
    }
  };

  const retryConnection = async () => {
    // First test direct connection
    const directResult = await testDirectConnection();
    
    if (directResult.success) {
      // If direct connection works, test Supabase connection
      const result = await testSupabaseConnection();
      if (result.success) {
        window.location.reload();
      } else {
        alert("Connection test failed. Please check your browser settings and try again.");
      }
    } else {
      alert("Unable to establish a connection. Please check your internet connection and try again.");
    }
  };

  // Detect browser to show appropriate guidance
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
  const isFirefox = userAgent.indexOf("Firefox") > -1;
  const isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;

  return (
    <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
      <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-red-200 text-sm">{connectionError}</p>
        {showFirefoxHelp && (
          <div className="mt-3 space-y-2">
            <p className="text-red-300 font-semibold">Connection Troubleshooting:</p>
            <ol className="list-decimal list-inside space-y-1 text-red-200 text-sm">
              {isChrome ? (
                // Chrome-specific instructions
                <>
                  <li>Check that your internet connection is stable and working</li>
                  <li>Try reloading the page</li>
                  <li>Check if you have any VPN or proxy services active that might block our service</li>
                  <li>In Chrome Settings, go to Privacy and Security → Cookies and site data → ensure "Block third-party cookies" is disabled</li>
                  <li>Try clearing your browser cache and cookies for this site</li>
                  <li>If possible, try a different network connection (like mobile data)</li>
                </>
              ) : isFirefox ? (
                // Firefox-specific instructions
                getFirefoxInstructions().steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                // Generic instructions
                <>
                  <li>Check your internet connection and make sure you're online</li>
                  <li>Try reloading the page</li>
                  <li>Check if you have any VPN or proxy services active</li>
                  <li>Try clearing your browser cache and cookies</li>
                  <li>If possible, try using Chrome or a different network connection</li>
                </>
              )}
            </ol>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={retryConnection}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={() => window.location.reload()}
              >
                <Globe className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              {(isFirefox || isChrome) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:bg-red-950"
                  onClick={openBrowserSettings}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Browser Settings
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefoxHelpSection;
