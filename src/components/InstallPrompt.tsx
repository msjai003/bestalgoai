
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Create a global variable to store the install prompt event
declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check for various platform types
    const userAgent = navigator.userAgent || '';
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroidDevice = /Android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowPrompt(false);
      return;
    }
    
    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
      
      // Show our custom install button immediately instead of after a delay
      const installPromptDismissed = localStorage.getItem('installPromptDismissed');
      if (!installPromptDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we'll show different instructions
    if (isIOSDevice && !isStandalone) {
      const installPromptDismissed = localStorage.getItem('installPromptDismissed');
      setIsInstallable(true);
      
      // Show the iOS prompt immediately instead of after a delay
      if (!installPromptDismissed) {
        setShowPrompt(true);
      }
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setShowPrompt(false);
      setIsInstallable(false);
      // Show success message
      toast.success("App installed successfully!");
    });

    // Check if manifest exists and is correctly linked
    const linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
      console.error("No manifest link found in document head");
    }

    // Show a message to help users find the install option
    setTimeout(() => {
      if (!isStandalone && (window.deferredInstallPrompt || isIOSDevice || isAndroidDevice)) {
        toast.info("You can install this app on your device for a better experience!", {
          duration: 5000,
          position: "top-center"
        });
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!window.deferredInstallPrompt && !isIOS && !isAndroid) return;
    
    if (window.deferredInstallPrompt) {
      try {
        // Show the install prompt
        window.deferredInstallPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await window.deferredInstallPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast.success("Installation started");
        } else {
          console.log('User dismissed the install prompt');
          toast.info("Installation declined");
        }
        
        // Clear the saved prompt since it can't be used again
        window.deferredInstallPrompt = null;
        setIsInstallable(false);
      } catch (error) {
        console.error('Error during installation:', error);
        toast.error("Installation failed. Please try again.");
      }
    } else if (isIOS) {
      // For iOS, provide more visible instructions with animation
      const shareButton = document.getElementById('ios-share-button');
      if (shareButton) shareButton.classList.add('animate-pulse');
      
      toast.info("To install: tap the share button and select 'Add to Home Screen'", {
        duration: 8000
      });
    } else if (isAndroid) {
      // For Android without install prompt
      toast.info("To install: tap the menu button (⋮) and select 'Add to Home screen'", {
        duration: 8000
      });
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Save in localStorage that user has dismissed the prompt
    localStorage.setItem('installPromptDismissed', 'true');
    // Show a toast to let users know they can still install later
    toast.info("You can install the app later from the menu", {
      duration: 3000
    });
  };

  if (!showPrompt || !isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-purple-700 rounded-xl p-4 shadow-lg z-50 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Download className="h-5 w-5 mr-2 text-[#FF00D4]" />
          Install BestAlgo.ai
        </h3>
        <Button variant="ghost" size="icon" onClick={dismissPrompt} className="p-1 h-auto w-auto text-gray-400">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {isIOS ? (
        <div>
          <p className="text-gray-300 text-sm mb-3">
            Add this app to your home screen for the best experience:
          </p>
          <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
            <li>Tap the share button <span id="ios-share-button" className="inline-block animate-pulse-slow">
              <Share2 className="h-4 w-4 inline text-blue-400" />
            </span></li>
            <li>Scroll and select "Add to Home Screen"</li>
            <li>Tap "Add" in the top right corner</li>
          </ol>
          <div className="mt-2 mb-2">
            <img src="/ios-install-guide.png" alt="iOS installation guide" className="rounded-md w-full max-w-[200px] mx-auto" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          </div>
        </div>
      ) : isAndroid ? (
        <div>
          <p className="text-gray-300 text-sm mb-3">
            Add this app to your home screen for the best experience:
          </p>
          <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
            <li>Tap the menu button (⋮) in your browser</li>
            <li>Select "Add to Home screen" or "Install app"</li>
            <li>Confirm by tapping "Add" or "Install"</li>
          </ol>
        </div>
      ) : (
        <p className="text-gray-300 text-sm mb-3">
          Install our app for faster access and a better experience offline!
        </p>
      )}
      
      <Button
        onClick={handleInstallClick}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Download className="mr-2 h-4 w-4" />
        {isIOS ? "Got it" : isAndroid ? "Install App" : "Install App"}
      </Button>
    </div>
  );
};

export default InstallPrompt;
